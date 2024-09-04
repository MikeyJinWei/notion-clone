"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { FormEvent, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  deleteDocument,
  inviteUserToDocument,
  removeUserFromDocument,
} from "@/actions/actions";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { useUser } from "@clerk/nextjs";
import useOwner from "@/lib/useOwner";
import { useRoom } from "@liveblocks/react/suspense";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "@/firebase/firebase";
import { collectionGroup, query, where } from "firebase/firestore";

const ManageUsers = () => {
  const { user } = useUser(); // 存取當前登錄用戶資訊
  const isOwner = useOwner(); // 辨識權限是否為文件擁有者
  const room = useRoom(); // 存取協作空間狀態/資訊
  const pathname = usePathname(); // 從路徑存取當前文件 id => /doc/roomId
  const [isPending, startTransition] = useTransition(); // 追蹤刪除文件進度
  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id)) // 查詢 firestore rooms 集合群組中與 roomId 相符項
  );
  // 移除指定用戶對當前文件（協作空間）的訪問權限
  const handleDelete = async (userId: string) => {
    // 開始移除的過渡
    startTransition(async () => {
      if (!user) return; // 確保用戶已登錄

      const { success } = await removeUserFromDocument(room.id, userId);

      if (success) {
        toast.success("User removed from room successfully!");
      } else {
        toast.success("Failed to remove user from room!");
      }
    });
  };

  // 開關 Dialog
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>Users ({usersInRoom?.docs.length})</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Users with Access</DialogTitle>
          <DialogDescription>
            Below is a list of users who have access to this document.
          </DialogDescription>
        </DialogHeader>

        <hr />

        <div className="flex flex-col space-y-2">
          {usersInRoom?.docs.map((doc) => (
            <div
              key={doc.data().userId}
              className="flex items-center justify-between"
            >
              <p className="font-light">
                {/* userId 與當前登錄用戶的電子郵件相符項多顯示 'You' 字串 */}
                {doc.data().userId === user?.emailAddresses.toString()
                  ? `You (${doc.data().userId})`
                  : // 非登錄用戶直接顯示 userId
                    doc.data().userId}
              </p>

              <div className="flex items-center gap-2">
                <Button variant="outline">{doc.data().role}</Button>

                {/* 確認是否屬文件擁有者 */}
                {isOwner &&
                  // 只有當前用戶不是 DB 中的用戶才顯示刪除按鈕，i.e. 不移除自身權限
                  doc.data().userId !== user?.emailAddresses.toString() && (
                    <Button
                      onClick={() => handleDelete(doc.data().userId)}
                      disabled={isPending}
                      variant="destructive"
                      size="sm"
                    >
                      {isPending ? "Removing" : "X"}
                    </Button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ManageUsers;
