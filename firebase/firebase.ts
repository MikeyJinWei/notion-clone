// Import 需要的 SDKs fn
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 此 firebase 專案的設定檔
const firebaseConfig = {
  apiKey: "AIzaSyDl-tOWwbnihxKtJc3WOJEMK4W_gEGPXoI",
  authDomain: "notion-clone-bef70.firebaseapp.com",
  projectId: "notion-clone-bef70",
  storageBucket: "notion-clone-bef70.appspot.com",
  messagingSenderId: "1157954236",
  appId: "1:1157954236:web:d252c7ad813e12434a6eb9",
};

// 初始化 Firebase
// ternary 防止重複初始化 for 需多次載入 或 SSR 的應用程式
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// 連接 db
const db = getFirestore(app);

export { db };
