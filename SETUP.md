# Webber ATR: setup guide

This puts Webber ATR on its own web address so it installs on a phone like a normal app.
Athletes don't need any account. The trainer signs in with an email and password.

Everything below is free (Firebase "Spark" plan + GitHub Pages), and no credit card is needed.
It takes about 20 minutes and is easiest on a laptop.

---

## Part 1: Firebase (stores the data and the trainer login)

1. Go to **console.firebase.google.com** and sign in with a Google account.
2. Click **Create a project** → name it `webber-atr` → you can turn Google Analytics **off** → Create.
3. **Trainer login:** left menu → **Build → Authentication** → Get started → **Email/Password** → turn on **Enable** → Save.
   Then open the **Users** tab → **Add user** → enter the trainer's email and a password → Add user.
   (Add yourself the same way if you want to test as the trainer.)
4. **Database:** left menu → **Build → Firestore Database** → Create database → pick a location (e.g. `us-east1`) → **Start in production mode** → Create.
5. **Security rules:** in Firestore, open the **Rules** tab. Delete what's there, paste everything from `firestore.rules`,
   change `trainer@webber.edu` to the trainer's real email (lowercase), and click **Publish**.
6. **App settings:** click the ⚙ gear → **Project settings** → scroll to **Your apps** → click the **</>** (Web) icon →
   name it `Webber ATR` → Register app (leave "Firebase Hosting" unchecked). You'll see a `firebaseConfig` block.
7. Open `config.js` in any text editor and paste each value (apiKey, authDomain, projectId, storageBucket,
   messagingSenderId, appId) between the quotes. Put the trainer's email in `trainerEmails`. Save.

## Part 2: GitHub Pages (gives the app its web address)

8. Go to **github.com** and create a free account.
9. Click **+ → New repository** → name it `webber-atr` → **Public** → Create repository.
10. On the new repo page, click **uploading an existing file**. Drag in **all the files from this folder**
    (the files themselves, not the folder) → **Commit changes**.
11. Open the repo's **Settings → Pages** → under "Branch" choose **main** and **/ (root)** → Save.
    After about a minute the page shows your link: `https://YOUR-USERNAME.github.io/webber-atr/`
12. Back in Firebase: **Authentication → Settings → Authorized domains → Add domain** → enter `YOUR-USERNAME.github.io`.

## Part 3: Put it on the phone

13. Open your link in **Safari** (iPhone) or **Chrome** (Android).
14. iPhone: Share → **Add to Home Screen** → keep **Open as Web App** on → Add.
    Android: ⋮ menu → **Install app** / Add to Home screen.
15. Open it from the home screen → **Trainer sign in** → use the email and password from step 3.

Athletes: the trainer opens an athlete → **Code** → the athlete scans the QR code with their phone camera.

---

## Changing things later

- **Update the app:** upload the changed files to GitHub again (same names replace the old ones).
  Also open `sw.js` and change `webber-atr-v1` to `webber-atr-v2` (and so on) so phones pick up the update.
- **Add another trainer:** add them in Firebase → Authentication → Users, and add their email to both
  `config.js` (`trainerEmails`) and `firestore.rules` (then Publish).
- **Use a different icon:** replace `icon-192.png`, `icon-512.png` and `apple-touch-icon.png` with square PNGs
  of the same sizes (192×192, 512×512, 180×180). Get the athletics department's OK before using the Warriors logo.

## Good to know

- Before using real athlete names and injuries, ask the trainer or the school whether this is an approved place
  to keep that information.
- Anyone with an athlete's exact code can see that athlete's first name and today's exercise list, and nothing else.
  If a code gets shared around, open the athlete → Edit → **New athlete code**.
- The values in `config.js` are designed to be public. What protects the data is the rules from step 5.
