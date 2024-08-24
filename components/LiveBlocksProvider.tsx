"use client";

import { LiveblocksProvider } from "@liveblocks/react/suspense";

const LiveBlocksProvider = ({ children }: { children: React.ReactNode }) => {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
  }
  return (
    <LiveblocksProvider throttle={16} authEndpoint={"/api/auth-endpoint"}>
      {children}
    </LiveblocksProvider>
  );
};
export default LiveBlocksProvider;
