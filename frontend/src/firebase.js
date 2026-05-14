import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB2zxfri20wN-F60D-j3pKT7Qlo6mkF-Zc",
  authDomain: "krishi-cart.firebaseapp.com",
  projectId: "krishi-cart",
  storageBucket: "krishi-cart.firebasestorage.app",
  messagingSenderId: "991976989970",
  appId: "1:991976989970:web:0f5e3c781257e92f907fcb",
  measurementId: "G-XNTGNY3NR8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
