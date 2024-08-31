"use client";

import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import stringToColor from "@/lib/stringToColor";
import TranslateDocument from "./TranslateDocument";

const Editor = () => {
  const room = useRoom(); // 存取協作環境的狀態、資料

  // 亮暗模式
  const [darkMode, setDarkMode] = useState(false);
  const style = `hover:text-white ${
    darkMode
      ? "text-gray-300 hover:text-gray-700 bg-gray-700 hover:bg-gray-100"
      : "text-gray-700 hover:text-gray-200 bg-gray-200 hover:bg-gray-300"
  }`;

  // 管理文件（各欄位）狀態
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();

  // 初始化文件（各欄位）狀態
  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    // room 變化時，會先執行一次 cleanup function 才再次執行 callback
    // room 卸載時會執行一次 cleanup function 釋放記憶體
    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  // BlockNote 元件
  type EditorProps = {
    doc: Y.Doc;
    provider: any;
    darkMode: boolean;
  };

  const BlockNote = ({ doc, provider, darkMode }: EditorProps) => {
    const userInfo = useSelf((me) => me.info); // 取得當前自身用戶的資訊

    // 創建編輯器實例
    const editor: BlockNoteEditor = useCreateBlockNote({
      // 配置多用戶協作功能
      collaboration: {
        provider, // 管理和同步多用戶之間的協作狀態
        fragment: doc.getXmlFragment("document-store"), // 儲存編輯器（修改的）狀態
        // 配置編輯文件的用戶資訊
        user: {
          name: userInfo?.name,
          color: stringToColor(userInfo?.email),
        },
      },
    });

    return (
      <div className="relative mx-auto max-w-6xl">
        <BlockNoteView
          editor={editor}
          theme={darkMode ? "dark" : "light"}
          className="min-h-screen"
        />
      </div>
    );
  };

  if (!doc || !provider) return null;

  return (
    <div className="mx-auto max-w-6xl ">
      <div className="mb-10 flex items-center justify-end gap-2">
        <TranslateDocument doc={doc} />

        {/* ChatToDocument AI */}

        {/* Light/Dark mode toggle */}
        <Button onClick={() => setDarkMode((prev) => !prev)} className={style}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

      {/* BlockNote */}
      <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
    </div>
  );
};
export default Editor;
