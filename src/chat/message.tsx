import { formatRelative, formatDistance, differenceInHours } from "date-fns";
import Image from "next/image";

export type Message = {
  id?: string;
  sender: string;
  avatar?: string;
  message: string;
  sent_at: string;
};

interface Props {
  message: Message;
}

export const Message = ({ message }: Props) => {
  const session = { username: "current_user" }; // Hardcoded session data for now

  return (
    <div
      className={`flex flex-col relative space-x-1 space-y-1 ${
        message.sender === session?.username ? "text-right" : "text-left"
      }`}
    >
      <div
        className={`flex relative space-x-1 ${
          message.sender === session?.username
            ? "flex-row-reverse space-x-reverse"
            : "flex-row"
        }`}
      >
        {message?.avatar && (
          <div className="w-12 h-12 overflow-hidden flex-shrink-0 rounded">
            <a
              href={`https://github.com/${message.sender}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                width={50}
                height={50}
                src={message.avatar}
                alt={message.sender}
                title={message.sender}
              />
            </a>
          </div>
        )}
        <span
          className={`inline-flex rounded space-x-2 items-start p-3 text-white ${
            message.sender === session?.username
              ? "bg-[#4a9c6d]"
              : "bg-[#363739]"
          } `}
        >
          {message.sender !== session?.username && (
            <span className="font-bold">{message.sender}:&nbsp;</span>
          )}
          <span className="max-w-sm">{message.sender}</span>
        </span>
      </div>
      <p className="text-xs text-white/50">
        {differenceInHours(new Date(), new Date(message.sent_at)) >= 1
          ? formatRelative(new Date(message.sent_at), new Date())
          : formatDistance(new Date(message.sent_at), new Date(), {
              addSuffix: true,
            })}
      </p>
    </div>
  );
};
