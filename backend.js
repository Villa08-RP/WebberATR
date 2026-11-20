// Connects Webber ATR to Firebase (Firestore for data, Authentication for the trainer login).
// You shouldn't need to edit this file. Settings live in config.js.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  initializeFirestore, persistentLocalCache, persistentMultipleTabManager,
  doc, collection, query, where, getDoc, getDocs, setDoc, deleteDoc, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const cfg = window.ATR_CONFIG || {};

try {
  const fb = cfg.firebase || {};
  if (!fb.apiKey || String(fb.apiKey).startsWith("PASTE")) throw new Error("not-configured");

  const app = initializeApp(fb);
  let fs;
  try {
    // Keeps a copy on the phone so the app still opens on bad training-room Wi-Fi.
    fs = initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });
  } catch (_) {
    fs = initializeFirestore(app, {});
  }
  const auth = getAuth(app);

  const CODES = {
    "permission-denied": "invalid_argument", "invalid-argument": "invalid_argument", "not-found": "invalid_argument",
    "failed-precondition": "invalid_argument", "resource-exhausted": "quota_exceeded", "unavailable": "unavailable"
  };
  const wrapErr = e => ({ code: CODES[e && e.code] || "unavailable", message: (e && e.message) || "" });
  const meta = m => ({ fromCache: !!m.fromCache, hasPendingWrites: !!m.hasPendingWrites });
  const wrapDoc = s => ({ id: s.id, exists: s.exists(), data: () => (s.exists() ? s.data() : undefined), metadata: meta(s.metadata) });
  const wrapQuery = q => ({ docs: q.docs.map(wrapDoc), size: q.size, empty: q.empty, docChanges: () => [], metadata: meta(q.metadata) });

  const docRef = path => {
    const r = doc(fs, path);
    return {
      id: r.id, path,
      get: () => getDoc(r).then(wrapDoc, e => { throw wrapErr(e); }),
      set: d => setDoc(r, d).catch(e => { throw wrapErr(e); }),
      delete: () => deleteDoc(r).catch(e => { throw wrapErr(e); }),
      onSnapshot: (next, err) => onSnapshot(r, { includeMetadataChanges: true }, s => next(wrapDoc(s)), e => err && err(wrapErr(e)))
    };
  };
  const makeQuery = (path, filters) => {
    const build = () => filters.length ? query(collection(fs, path), ...filters.map(f => where(f[0], f[1], f[2]))) : collection(fs, path);
    return {
      where: (f, op, v) => makeQuery(path, [...filters, [f, op, v]]),
      get: () => getDocs(build()).then(wrapQuery, e => { throw wrapErr(e); }),
      onSnapshot: (next, err) => onSnapshot(build(), { includeMetadataChanges: true }, s => next(wrapQuery(s)), e => err && err(wrapErr(e))),
      doc: id => docRef(path + "/" + id)
    };
  };

  const trainers = (cfg.trainerEmails || []).map(e => String(e).trim().toLowerCase()).filter(Boolean);

  window.ATR = {
    db: { doc: docRef, collection: p => makeQuery(p, []) },
    onAuth: cb => onAuthStateChanged(auth, u => cb(u ? { email: (u.email || "").toLowerCase() } : null)),
    isTrainer: email => !!email && trainers.includes(String(email).trim().toLowerCase()),
    signIn: (email, pass) => signInWithEmailAndPassword(auth, String(email).trim(), pass),
    signOut: () => signOut(auth)
  };
} catch (e) {
  window.ATR = { error: e && e.message === "not-configured" ? "not-configured" : "load-failed" };
}
window.dispatchEvent(new Event("atr-ready"));
