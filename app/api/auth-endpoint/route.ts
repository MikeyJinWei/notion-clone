import { adminDb } from "@/firebase/firebase-admin";
import liveblocks from "@/lib/liveblocks/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  auth().protect(); // 確保使用者有經過登入驗證

  const { sessionClaims } = await auth(); // 通過驗證後取得 session 資料
  const { room } = await req.json(); // 將 req 正文轉換為 JS object

  // 從 Liveblocks 實例取得 session 紀錄的權限資料
  const session = liveblocks.prepareSession(sessionClaims?.email!, {
    userInfo: {
      name: sessionClaims?.fullName!,
      email: sessionClaims?.email!,
      avatar: sessionClaims?.image!,
    },
  });

  // 從 Firestore 的 rooms 集合群組取得存在該 room 的所有用戶 userId
  const usersInRoom = await adminDb
    .collectionGroup("rooms")
    .where("userId", "==", sessionClaims?.email)
    .get();

  // 在 Firestore 的 rooms 集合群組中查詢是否存在與當前用戶（根據 sessionClaims?.email）相關聯的房間
  const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

  // 如果用戶存在，授予用戶對該房間的完全訪問權限並給予 Res
  if (userInRoom?.exists) {
    session.allow(room, session.FULL_ACCESS);

    const { body, status } = await session.authorize();

    return new Response(body, { status }); // 創建 res Object 並 return 授權成功的回應內文及 statusCode
  } else {
    NextResponse.json({ message: "You are not in this room" }, { status: 403 });
  }
};
