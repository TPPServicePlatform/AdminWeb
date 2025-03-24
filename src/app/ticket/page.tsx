"use client";

import { useEffect, useState } from "react";
import { MessageList } from "../../chat/message-list";
import { NewMessageForm } from "../../chat/new-message-form";
import { Button } from "@heroui/button";

interface Chat {
  uuid: string;
  title: string;
  updated_at: string;
  type: "help_tk" | "report_tk";
}

interface FetchChatsResponse {
  tks: Chat[];
}

function type(tk_type: Chat["type"]): { color: string; label: string } {
  const labels = {
    "help_tk": "Help",
    "report_tk": "Report",
  };
  const colors = {
    "help_tk": "bg-blue-600",
    "report_tk": "bg-purple-600",
  };
  return {
    color: colors[tk_type],
    label: labels[tk_type],
  };
}

export default function TicketPage() {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    fetchChats(setChats);
  }, []);

  return (
    <div className="flex">
      {/* Sidebar for all chats */}
      <div className="w-1/4 bg-gray-800 p-4 h-screen">
        <div className="text-white">All Chats</div>
        <ul className="mt-4 space-y-2">
          {chats.map((chat) => (
            <li key={chat.uuid} className="text-left">
              <Button
              color="default"
              variant="solid"
              className={`w-full justify-start rounded-md p-3 shadow-md hover:shadow-lg transition-shadow duration-200 ${type(chat.type).color} hover:bg-yellow-500`}>
              <div className="flex flex-col items-start">
              <div className="font-semibold">{type(chat.type).label} - {chat.title}</div>
              <div className="text-sm text-gray-400">{chat.updated_at}</div>
              </div>
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="max-w-4xl mx-auto flex-1">
          <div className="flex justify-between items-center">
            <MessageList />
          </div>
        </div>

        <div className="p-6 bg-white/5 border-t border-[#363739]">
          <div className="max-w-4xl mx-auto">
            <NewMessageForm />
          </div>
        </div>
      </div>
    </div>
  );
}

async function fetchChats(setChats: React.Dispatch<React.SetStateAction<Chat[]>>): Promise<void> {
  try {
    const response = await fetch("http://localhost/api/support/tks/unresolved", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors", // Ensure this is set to "cors" for proper CORS handling
    });
    if (!response.ok) {
      throw new Error("Failed to fetch chats");
    }
    const data: FetchChatsResponse = await response.json();
    if ("tks" in data) {
      setChats(data.tks);
    } else {
      throw new Error("Failed to fetch chats: Unexpected response");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error fetching chats: " + error.message);
    } else {
      throw new Error("Error fetching chats: Unknown error");
    }
  }
}
