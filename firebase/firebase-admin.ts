import { initializeApp, App, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceKey = require("@/firebase/service_key.json");

let app: App;

// 初始化 firebase-admin
// if...else 防止重複初始化 for 需多次載入 或 SSR 的應用程式
if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceKey),
  });
} else {
  app = getApp();
}

const adminDb = getFirestore(app);

export { app as adminApp, adminDb };
