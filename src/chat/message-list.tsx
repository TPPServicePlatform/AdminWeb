import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Message } from "./message";


interface MessageListProps {
  messages: Message[]; // Accept messages as a prop
}

export const MessageList = ({ messages, username, color }: MessageListProps & { username: string; color: string }) => {
  const [scrollRef, inView, entry] = useInView({
    trackVisibility: true,
    delay: 1000,
  });

  useEffect(() => {
    if (entry?.target) {
      entry.target.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length, entry?.target]); // Trigger scroll when messages change

  if (!messages.length)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white">No messages to display.</p>
      </div>
    );

  return (
    <div className="flex flex-col w-full space-y-3 overflow-y-scroll no-scrollbar">
      {!inView && messages.length > 0 && (
        <div className="py-1.5 w-full px-3 z-10 text-xs absolute flex justify-center bottom-0 mb-[120px] inset-x-0">
          <button
            className="py-1.5 px-3 text-xs bg-[#1c1c1f] border border-[#363739] rounded-full text-white font-medium"
            onClick={() => {
              entry?.target.scrollIntoView({ behavior: "smooth", block: "end" });
            }}
          >
            Scroll to see latest messages
          </button>
        </div>
      )}
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-3 rounded-md text-white ${
            message.sender === "USER" ? color : "bg-gray-800"
          }`}
        >
          <div className="text-sm font-semibold">
            {message.sender === "USER" ? username : "Support Agent (you)"}
          </div>
          <div className="text-sm mt-1">{message.message}</div>
          <div className="text-xs text-gray-400 mt-1">
            {new Date(message.sent_at).toLocaleString()}
          </div>
        </div>
      ))}
      <div ref={scrollRef} />
    </div>
  );
};

function toTitleCase(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
