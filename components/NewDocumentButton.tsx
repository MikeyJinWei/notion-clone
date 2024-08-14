"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { createNewDocument } from "@/actions/actions";

const NewDocumentButton = () => {
  // useTransition 解構的第一個 variable 為 boolean，表示當前是否有一個 transition 正在進行
  // 解構的第二個 variable 為函數，用來開始 transition
  const [isPending, startTransition] = useTransition();

  const handleCreateNewDocument = () => {
    // 開始 transition
    startTransition(async () => {
      // 開始創建 Document
      const { docId } = await createNewDocument();
      const router = useRouter();

      router.push(`/doc/${docId}`);
      // transition 完成之前，isPending 會為 true
    });
    // transition 結束
  };

  return (
    <Button onClick={handleCreateNewDocument} disabled={isPending}>
      {isPending ? "Creating..." : "New Document"}
    </Button>
  );
};
export default NewDocumentButton;
