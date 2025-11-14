import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4a54Fj-DM21w23zE2_09TbsLM7O3gK6E",
  authDomain: "threads-app-80870.firebaseapp.com",
  projectId: "threads-app-80870",
  storageBucket: "threads-app-80870.firebasestorage.app",
  messagingSenderId: "161542943220",
  appId: "1:161542943220:web:3af65d2b14d9cbb21349a1"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };
export default app;
