import stringToColor from "@/lib/stringToColor";
import { motion } from "framer-motion";

const FollowPointer = ({
  info,
  x,
  y,
}: {
  x: number;
  y: number;
  info: {
    name: string;
    email: string;
    avatar: string;
  };
}) => {
  const color = stringToColor(info.email || "1");

  return (
    <motion.div
      style={{
        top: y,
        left: x,
        pointerEvents: "none",
      }}
      initial={{
        scale: 1,
        opacity: 1,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0,
        opacity: 0,
      }}
      className="absolute z-50 h-4 w-4 rounded-full"
    >
      <svg
        stroke={color}
        fill={color}
        strokeWidth="1"
        viewBox="0 0 16 16"
        className="h-6 w-6 text-[$color] transform -rotate-[70deg] -translate-x-[12px] -translate-y-[10px] stroke-[$color]"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14.082 2.182a5.5 5.5 0 0 1-10.103.5875.528 15.467a.5 0 0 1-.917-.007L5.576 7.5a.5 0 1 0-.006-.916L12.728 6.575a.5 0 1 0 .556.103z" />
      </svg>

      <motion.div
        style={{
          backgroundColor: color,
        }}
        initial={{
          scale: 0.5,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.5,
          opacity: 0,
        }}
        className="px-2 py-2 bg-neutral-200 text-black font-bold whitespace-nowrap min-w-max text-xs rounded-full"
      >
        {info.name || info.email}
      </motion.div>
    </motion.div>
  );
};
export default FollowPointer;
