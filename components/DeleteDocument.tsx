"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { deleteDocument } from "@/actions/actions";
import { toast } from "sonner";

const DeleteDocument = () => {
  // 開關 Dialog
  const [isOpen, setIsOpen] = useState(false);

  // 刪除文件
  const pathname = usePathname(); // 從路徑存取當前文件 id => /doc/roomId
  const [isPending, startTransition] = useTransition(); // 追蹤刪除文件進度
  const router = useRouter(); // 存取路由
  const handleDelete = async () => {
    const roomId = pathname.split("/").pop(); // ['', 'doc', 'roomId'] -> 'roomId
    if (!roomId) return;

    startTransition(async () => {
      const { success } = await deleteDocument(roomId);

      if (success) {
        setIsOpen(false); // 關閉 Dialog
        router.replace("/"); // 重新導向至首頁
        toast.success("Room deleted successfully!"); // toast 通知刪除成功
      } else {
        toast.error("Failed to delete room"); // toast 通知刪除失敗
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* asChild：以 DialogTrigger 的標籤渲染 Button */}
      <Button asChild variant="destructive">
        <DialogTrigger>Delete</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to Delete?</DialogTitle>
          <DialogDescription>
            This will delete the document and all its contents, removing all
            users from the document.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteDocument;
