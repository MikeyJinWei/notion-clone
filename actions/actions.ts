"use server";

import { adminDb } from "@/firebase/firebase-admin";
import liveblocks from "@/lib/liveblocks/liveblocks";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
  // 客戶端尚未登入時令其無法創建新文件
  auth().protect();

  console.log("createNewDocument");

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

export async function deleteDocument(roomId: string) {
  auth().protect(); // 確保使用者已登入

  console.log("deleteDocument", roomId);

  try {
    // 刪除位於 documents 集合中的文件本身
    await adminDb.collection("documents").doc(roomId).delete();

    // 刪除位於 user 集合中的 rooms 集合（曾引用文件 id 創建資料）
    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const batch = adminDb.batch();

    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // 刪除 liveblocks 所建立的協作空間
    await liveblocks.deleteRoom(roomId);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function inviteUserToDocument(roomId: string, email: string) {
  auth().protect(); // 確保用戶已登入

  console.log("inviteUserToDocument", roomId, email);

  try {
    // 從 users 集合中尋找與邀請的用戶相符的 email
    await adminDb
      .collection("users")
      .doc(email)
      // 在該用戶的 rooms 子集合以 roomId 創建協作權限資訊
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        roomId,
      });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
