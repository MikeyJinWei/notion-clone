"use client";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";

const Document = ({ id }: { id: string }) => {
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
    <div>
      <div className="mx-auto pb-5 max-w-6xl flex justify-between ">
        <form onSubmit={updateTitle} className="space-x-2 flex-1 flex">
          {/* update title... */}
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <Button disabled={isUpdating} type="submit">
            {isUpdating ? "Updating..." : "Update"}
          </Button>
          {/* If */}
          {/* isOwner && inviteUser, deleteDocument */}
        </form>
      </div>

      <div>
        {/* ManageUsers */}
        {/* Avatar */}
      </div>

      {/* Collaborative Editor */}
    </div>
  );
};
export default Document;
