import { Liveblocks } from "@liveblocks/node";

// 嘗試存取金鑰
const key = process.env.LIVEBLOCKS_PRIVATE_KEY;
if (!key) throw new Error("LIVEBLOCKS_PRIVATE_KEY is not set");

// 使用金鑰實例化 liveblocks
const liveblocks = new Liveblocks({
  secret: key,
});

export default liveblocks;
