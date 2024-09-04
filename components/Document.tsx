"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";
import useOwner from "@/lib/useOwner";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import Avatars from "./Avatars";

const Document = ({ id }: { id: string }) => {
  // auth
  const isOwner = useOwner(); // 判斷當前登錄用戶是否為此文件的擁有者

  // init data
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  // title input
  const [input, setInput] = useState("");
  const [isUpdating, startTransition] = useTransition();

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, "documents", id), {
          title: input,
        });
      });
    }
  };

  return (
    <div className="p-5 h-full flex-1 bg-white">
      <div className="mx-auto pb-5 max-w-6xl flex justify-between ">
        <form onSubmit={updateTitle} className="space-x-2 flex-1 flex">
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <Button disabled={isUpdating} type="submit">
            {isUpdating ? "Updating..." : "Update"}
          </Button>

          {isOwner && (
            <>
              <InviteUser />
              <DeleteDocument />
            </>
          )}
        </form>
      </div>

      <div className="mb-5 mx-auto max-w-6xl flex items-center justify-between">
        <ManageUsers />
        <Avatars />
      </div>

      {/* Collaborative Editor */}
      <Editor />
    </div>
  );
};
export default Document;
