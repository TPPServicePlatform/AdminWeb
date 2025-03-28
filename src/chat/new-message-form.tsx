import { useState } from "react";

export const NewMessageForm = ({ tkId, type }: { tkId: string; type: "help_tk" | "report_tk" }) => {
  const { data: session } = { data: { username: "current_user" } }; // Hardcoded session data for now
  const [body, setBody] = useState("");

  const sendMessage = async () => {
    const response = await fetch(`http://localhost/api/support/chats/newmsg/${tkId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        support_agent: true,
        message: body,
        tk_type: type === "help_tk" ? "HELP" : "REPORT",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    setBody("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (body) {
          sendMessage();
        }
      }}
      className="flex items-center space-x-3"
    >
      <input
        autoFocus
        id="message"
        name="message"
        placeholder="Write a message..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="flex-1 h-12 px-3 rounded bg-[#222226] border border-[#222226] focus:border-[#222226] focus:outline-none text-white placeholder-white"
      />
      <button
        type="submit"
        className="bg-[#222226] rounded h-12 font-medium text-white w-24 text-lg border border-transparent hover:bg-[#363739] transition"
        disabled={!body || !session}
      >
        Send
      </button>
    </form>
  );
};
