"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Avatars = () => {
  const others = useOthers(); // 其他用戶資料
  const self = useSelf(); // 目前登錄的用戶資料
  const all = [self, ...others]; // 將所有用戶資料整合在一起

  return (
    <div className="flex gap-2 items-center">
      <p>Users currently editing this page</p>
      {/* 使用負值的 margin 使每個 avatar 交疊  */}
      <div className="flex -space-x-5">
        {all.map((other, i) => (
          <TooltipProvider key={other?.id + i}>
            <Tooltip>
              <TooltipTrigger>
                {/* hover 時提高 z-index 使 avatar 浮起不被遮住  */}
                <Avatar className="hover:z-50 border-2">
                  <AvatarImage src={other?.info.avatar} />
                  <AvatarFallback>{other?.info.name}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {self?.info.email === other?.info.email
                    ? "You"
                    : other?.info.name}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};
export default Avatars;
