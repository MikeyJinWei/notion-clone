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
import { deleteDocument, inviteUserToDocument } from "@/actions/actions";
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
  // 刪除使用者
  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
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

        <div>{/* UsersInRoom  */}</div>
      </DialogContent>
    </Dialog>
  );
};
export default ManageUsers;
