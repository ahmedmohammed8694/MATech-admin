import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// ── Firebase App Check ─────────────────────────────────────────────────────────
// Only initialize App Check in the browser (not during SSR)
if (typeof window !== "undefined") {
  // Enable debug mode for local development so App Check enforcement is bypassed
  const debugToken = process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN;
  if (debugToken) {
    // This must be set BEFORE initializeAppCheck is called
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
  }

  // Dynamically import to avoid SSR issues
  import("firebase/app-check").then(({ initializeAppCheck, ReCaptchaV3Provider }) => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (siteKey) {
      try {
        initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(siteKey),
          isTokenAutoRefreshEnabled: true,
        });
      } catch {
        // App Check already initialized (e.g. hot reload) — safe to ignore
      }
    }
  }).catch(() => {
    // App Check unavailable — auth will still work if enforcement is off
  });
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
