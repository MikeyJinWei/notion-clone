"use server";

import { adminDb } from "@/firebase/firebase-admin";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
  // 客戶端尚未登入時令其無法創建新文件
  auth().protect();

  // 解構先前對 session token 的設定
  const { sessionClaims } = await auth();

  // 引用文件集合
  const docCollectionRef = adminDb.collection("documents");

  // 創建單個文件
  const docRef = await docCollectionRef.add({
    title: "New Doc",
  });

  // 將文件與當前用戶關聯
  // 取得 users 集合中以用戶電子郵件為 ID 的文件
  await adminDb
    .collection("users")
    .doc(sessionClaims?.email!)
    // 在該用戶的 rooms 子集合中，創建一個新文件
    .collection("rooms")
    .doc(docRef.id)
    // 設置該文件的資料
    .set({
      userId: sessionClaims?.email,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

  return { docId: docRef.id }; // 導出包含新創建文件 ID 的物件
}
