"use client";

import * as Y from "yjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { FormEvent, useState, useTransition } from "react";
import { BotIcon, LanguagesIcon } from "lucide-react";
import { toast } from "sonner";
import Markdown from "react-markdown";

// 枚舉語言
enum Language {
  English = "english",
  Spanish = "spanish",
  Portuguese = "portuguese",
  French = "french",
  German = "german",
  Chinese = "chinese",
  Arabic = "arabic",
  Hindi = "hindi",
  Russian = "russian",
  Japanese = "japanese",
}
const languages: Language[] = [
  Language.English,
  Language.Spanish,
  Language.Portuguese,
  Language.French,
  Language.German,
  Language.Chinese,
  Language.Arabic,
  Language.Hindi,
  Language.Russian,
  Language.Japanese,
];

const TranslateDocument = ({ doc }: { doc: Y.Doc }) => {
  // 開關 Dialog
  const [isOpen, setIsOpen] = useState(false);

  // 處理翻譯提交
  const [language, setLanguage] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [summary, setSummary] = useState("");
  const [isPending, startTransition] = useTransition();

  console.log("doc", doc.get("document-store").toJSON());

  const handleAskQuestion = (e: FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentData,
            targetLang: language,
          }),
        }
      );

      if (res.ok) {
        const { translated_text } = await res.json();
        setSummary(translated_text);
        toast.success("Translated summary success!");
      } else {
        toast.error("Failed to get an answer. Please try again.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <LanguagesIcon />
          Translate
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translate the Document</DialogTitle>
          <DialogDescription>
            Select a Language and AI will translate a summary of the document in
            the selected langauge.
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
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Language" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="light">Light</SelectItem> */}
              {languages.map((language) => (
                <SelectItem value={language} key={language}>
                  {/* charAt(0) 將首字符轉換為大寫 */}
                  {/* slice(1) 提取除了第一個字符以外的所有字符 */}
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={!language || isPending}>
            {isPending ? "Translating..." : "Translate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default TranslateDocument;
