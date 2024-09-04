import { db } from "@/firebase/firebase";
import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import { collectionGroup, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

const useOwner = () => {
  const { user } = useUser(); // 存取當前登錄的用戶資訊
  const room = useRoom(); // 從 Liveblocks 存取協作空間狀態及資訊

  const [isOwner, setIsOwner] = useState(false); // 追蹤是否為協作空間擁有者狀態

  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  useEffect(() => {
    // 檢查 usersInRoom.docs 的 truthy, falsy
    if (usersInRoom?.docs && usersInRoom.docs.length > 0) {
      // 從 usersInRoom.docs 中篩選出 role 為 "owner" 的使用者資料，並將結果存儲在 owners
      const owners = usersInRoom.docs.filter(
        (doc) => doc.data().role === "owner"
      );
      // 檢查 owners 中是否有使用者的 userId 與當前登錄的使用者相符
      if (
        owners.some(
          (owner) => owner.data().userId === user?.emailAddresses[0].toString()
        )
      )
        setIsOwner(true);
    }
  }, [user, usersInRoom]);

  return isOwner;
};

export default useOwner;
