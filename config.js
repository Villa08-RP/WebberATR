// ===== Webber ATR settings =====
// Step 1: paste your Firebase web app settings below.
//   Firebase console → ⚙ Project settings → General → "Your apps" → Web app → SDK setup and configuration → Config
//   (These values are meant to be public. Your data is protected by the rules in firestore.rules.)
// Step 2: put each trainer's email in trainerEmails. Use the SAME email(s) in firestore.rules.
//   Each trainer gets their own private workspace automatically. They never see each other's athletes.

window.ATR_CONFIG = {
  firebase: {
    apiKey: "AIzaSyA7V0HxBLUbtiGpy9jP9hPlyomxWB6QdDg",
    authDomain: "webber-atr-app.firebaseapp.com",
    projectId: "webber-atr-app",
    storageBucket: "webber-atr-app.firebasestorage.app",
    messagingSenderId: "248912568178",
    appId: "1:248912568178:web:a963565c3e459ddc30c7eb"
  },

  // Who can sign in on the trainer side (lowercase). Add more with commas.
  trainerEmails: [
    "johnsondm2@webber.edu",     // Drew
    "felipepinto@gmail.com",     // test trainer
    "felipevillar02@gmail.com"   // Felipe (admin/testing)
  ]
};
