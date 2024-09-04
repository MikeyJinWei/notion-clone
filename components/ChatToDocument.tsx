"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as Y from "yjs";
import { Button } from "./ui/button";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { BotIcon, MessageCircleCode } from "lucide-react";
import Markdown from "react-markdown";

const ChatToDocument = ({ doc }: { doc: Y.Doc }) => {
  // 處理對話提交
  const [question, setQuestion] = useState("");
  const [summary, setSummary] = useState("");
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition(); // 追蹤刪除文件進度

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();

    setQuestion(input);

    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentData,
            question: input,
          }),
        }
      );

      if (res.ok) {
        const { message } = await res.json();

        setInput("");
        setSummary(message);

        toast.success("Question asked successfully");
      } else {
        toast.error("Failed to get an answer. Please try again.");
      }
    });
  };

  // 開關 Dialog
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setInput("");
  }, [!isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <MessageCircleCode className="mr-2" />
          Chat to Document
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat to the Document!</DialogTitle>
          <DialogDescription>
            Ask a question and chat to the document with AI.
          </DialogDescription>

          <hr className="mt-5" />

          {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
        </DialogHeader>

        {summary && (
          <div className="max-h-96 p-5 flex flex-col items-start gap-2 overflow-y-scroll bg-gray-100">
            <div className="flex">
              <BotIcon className="w-10 flex-shrink-0" />
              <p className="font-bold">
                GPT {isPending ? "is thinking..." : "Says"}
              </p>
            </div>
            <p>{isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}</p>
          </div>
        )}

        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="i.e. what is this document about?"
            className="w-full"
          />
          <Button type="submit" disabled={!input || isPending}>
            {isPending ? "Asking..." : "Ask"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default ChatToDocument;
