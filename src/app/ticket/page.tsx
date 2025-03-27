"use client";

import { useEffect, useState } from "react";
import { MessageList } from "../../chat/message-list";
import { NewMessageForm } from "../../chat/new-message-form";
import { Button } from "@heroui/button";
import { Message } from "@/chat/message";



interface Chat {
  uuid: string;
  title: string;
  updated_at: string;
  type: "help_tk" | "report_tk";
}

interface FetchChatsResponse {
  tks: Chat[];
}

function type(tk_type: Chat["type"]): { color: string; label: string, hover: string, selected: string, text: string, msg: string } {
  const labels = {
    "help_tk": "Help",
    "report_tk": "Report",
  };
  const colors = {
    "help_tk": "blue",
    "report_tk": "purple",
  };
  const hover = {
    "help_tk": "hover:bg-blue-300",
    "report_tk": "hover:bg-purple-300",
  };
  const selected = {
    "help_tk": "to-blue-400",
    "report_tk": "to-purple-400",
  }
  return {
    color: "bg-" + colors[tk_type] + "-600",
    label: labels[tk_type],
    hover: hover[tk_type],
    selected: selected[tk_type],
    text: "font-bold text-" + colors[tk_type] + "-600",
    msg: "bg-" + colors[tk_type] + "-800",
  };
}

export default function TicketPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [ticketInfo, setTicketInfo] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]); // New state for messages
  const [username, setUsername] = useState("current_user"); // Hardcoded session data for now
  const [color, setColor] = useState("bg-gray-800");

  const handleButtonClick = async (chat: Chat) => {
    const newTicketInfo = await fetchTicketInfo(chat.uuid, chat.type);
    setTicketInfo(newTicketInfo);

    // Fetch messages for the selected ticket
    const newMessages = await fetchMessages(chat.uuid);
    setMessages(newMessages);

    setColor(type(chat.type).msg);

    if (newTicketInfo.type === "help_tk") {
      setUsername((newTicketInfo as HelpTK).requester_username);
    } else {
      setUsername((newTicketInfo as ReportTK).complainant_username);
    }
  };

  useEffect(() => {
    fetchChats(setChats);
  }, []);

  return (
    <div className="flex">
      {/* Sidebar for all chats */}
      {addButton(chats, ticketInfo, handleButtonClick)}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 bg-gray-700 text-white">
          <h2 className="text-xl font-bold">{ticketInfo ? (ticketInfo.type === "report_tk" ? "Report " : "Help ") : ""}Ticket Details ⇣</h2>
          {ticketInfo ? (addTicketInfo(ticketInfo)) : (<p>Select a chat to view its details here.</p>)}
        </div>
        <div className="max-w-4xl flex-1 flex">
          <div style={{ marginLeft: "2.5vw", marginTop: "2.5vh" }} className="flex-1">
            <MessageList messages={messages} username={username} color={color} /> {/* Pass messages to MessageList */}
          </div>
        </div>

        <div className="p-6 bg-white/5 border-t border-[#363739]">
          <div className="max-w-4xl mx-auto">
            <NewMessageForm tkId={ticketInfo?.uuid || ""} type={ticketInfo?.type || "help_tk"} />
          </div>
        </div>
      </div>
    </div>
  );
}

function addTicketInfo(ticketInfo: Ticket) {
  return <div>
    <h3 className="text-lg font-semibold">Title: {ticketInfo.title}</h3>
    <p className="mt-2">Description: {ticketInfo.description}</p>
    <p className="mt-2 text-sm text-gray-400">
      Created on: {new Date(ticketInfo.created_at).toLocaleDateString()}
    </p>
    <p className="mt-1 text-sm text-gray-400">
      Last updated on: {new Date(ticketInfo.updated_at).toLocaleDateString()}
    </p>
    {ticketInfo.type === "help_tk" && (
      <p className="mt-2 text-sm text-gray-400">
        Requester user: {(ticketInfo as HelpTK).requester_username}
      </p>
    )}
    {ticketInfo.type === "report_tk" && (
      <>
        <p className="mt-2 text-sm text-gray-400">
          The user <strong>{(ticketInfo as ReportTK).complainant_username}</strong> is reporting a{(ticketInfo as ReportTK).report_type == "ACCOUNT" ? "n" : ""} {(ticketInfo as ReportTK).report_type.toLowerCase()}
        </p>
        <p className="mt-1 text-sm text-gray-400">
          {toTitleCase((ticketInfo as ReportTK).report_type)} reported: {(ticketInfo as ReportTK).target_name}
        </p>
      </>
    )}
  </div>;
}

function addButton(chats: Chat[], ticketInfo: Ticket | null, handleButtonClick: (chat: Chat) => Promise<void>) {
  return <div className="w-1/4 bg-gray-800 p-4 h-screen">
    <div className="text-white">All Chats</div>
    <ul className="mt-4 space-y-2">
      {chats.map((chat) => (
        <li key={chat.uuid} className="text-left">
          <Button
            color="default"
            className={`w-full justify-start rounded-md p-3 shadow-md hover:shadow-lg transition-shadow duration-200 ${ticketInfo?.uuid === chat.uuid
              ? "bg-gradient-to-tr from-white " + type(chat.type).selected + " text-white shadow-lg"
              : type(chat.type).color} ${type(chat.type).hover}`}
            onPress={() => handleButtonClick(chat)}>
            <div className="flex flex-col items-start">
              <div className={`text-sm ${ticketInfo?.uuid === chat.uuid ? type(chat.type).text : "text-white"}`}>{type(chat.type).label} - {chat.title}</div>
              <div className="text-sm text-gray-400">{chat.updated_at}</div>
            </div>
          </Button>
        </li>
      ))}
    </ul>
  </div>;
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

function toTitleCase(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

interface Ticket {
  uuid: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  type: "help_tk" | "report_tk"; // Added the 'type' property
}

interface HelpTK extends Ticket {
  requester_id: string;
  requester_username: string;
}

interface ReportTK extends Ticket {
  report_type: "ACCOUNT" | "SERVICE";
  target_id: string;
  target_name: string;
  complainant_username: string;
}

async function fetchUserName(user_id: string): Promise<string> {
  const response = await fetch(`http://localhost/api/accounts/getuid/${user_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors", // Ensure this is set to "cors" for proper CORS handling
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user details");
  }
  const data = await response.json();
  return data.username;
}

async function fetchServiceName(service_id: string): Promise<string> {
  const response = await fetch(`http://localhost/api/services/basic/info/${service_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors", // Ensure this is set to "cors" for proper CORS handling
  });
  if (!response.ok) {
    throw new Error("Failed to fetch service details");
  }
  const data = await response.json();
  const service_name = data.data.service_name;
  const provider_id = data.data.provider_id;
  const provider_name = await fetchUserName(provider_id);
  return `${service_name} (provided by ${provider_name})`;
}

async function fetchTicketInfo(tk_uuid: string, type: Chat["type"]): Promise<Ticket> {
  const type_url = type === "help_tk" ? "help" : "report";
  const response = await fetch(`http://localhost/api/support/${type_url}/${tk_uuid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors", // Ensure this is set to "cors" for proper CORS handling
  });
  if (!response.ok) {
    throw new Error("Failed to fetch ticket details");
  }
  const data_dict = await response.json();
  if (type === "help_tk") {
    return {
      uuid: data_dict.uuid,
      title: data_dict.title,
      description: data_dict.description,
      created_at: data_dict.created_at,
      updated_at: data_dict.updated_at,
      type: "help_tk",
      requester_id: data_dict.requester,
      requester_username: await fetchUserName(data_dict.requester),
    } as HelpTK;
  } else {
    return {
      uuid: data_dict.uuid,
      title: data_dict.title,
      description: data_dict.description,
      created_at: data_dict.created_at,
      updated_at: data_dict.updated_at,
      type: "report_tk",
      report_type: data_dict.type,
      target_id: data_dict.target_identifier,
      target_name: data_dict.type === "ACCOUNT" ? data_dict.target_identifier : await fetchServiceName(data_dict.target_identifier),
      complainant_username: data_dict.complainant,
    } as ReportTK;
  }
}

// New function to fetch messages for a ticket
async function fetchMessages(ticketId: string): Promise<Message[]> {
  try {
    const response = await fetch(`http://localhost/api/support/chats/all/${ticketId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors", // Ensure this is set to "cors" for proper CORS handling
    }); 
    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }
    const data = await response.json();
    const messages = data["messages"]
    // messages is an array of messages, can be empty
    if (!Array.isArray(messages)) {
      throw new Error("Failed to fetch messages: Unexpected response");
    }
    if (messages.length === 0) {
      return [];
    }
    return messages;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error fetching messages: " + error.message);
    } else {
      throw new Error("Error fetching messages: Unknown error");
    }
  }
}
