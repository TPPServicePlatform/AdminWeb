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

function type(tk_type: Chat["type"]): { color: string; label: string, hover: string } {
  const labels = {
    "help_tk": "Help",
    "report_tk": "Report",
  };
  const colors = {
    "help_tk": "bg-blue-600",
    "report_tk": "bg-purple-600",
  };
  const hover = {
    "help_tk": "hover:bg-blue-300",
    "report_tk": "hover:bg-purple-300",
  };
  return {
    color: colors[tk_type],
    label: labels[tk_type],
    hover: hover[tk_type],
  };
}

export default function TicketPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [ticketInfo, setTicketInfo] = useState<Ticket | null>(null);

  const handleButtonClick = async (chat: Chat) => {
      const newTicketInfo = await fetchTicketInfo(chat.uuid, chat.type);
      setTicketInfo(newTicketInfo);

      // You can update the state or perform other actions with ticketInfo here
  };

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
                className={`w-full justify-start rounded-md p-3 shadow-md hover:shadow-lg transition-shadow duration-200 ${type(chat.type).color} ${type(chat.type).hover}`}
                onPress={() => handleButtonClick(chat)}
              >
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
        <div className="p-6 bg-gray-700 text-white">
          <h2 className="text-xl font-bold">Chat Details</h2>
            {ticketInfo ? (
            <div>
              <h3 className="text-lg font-semibold">{ticketInfo.title}</h3>
              <p className="mt-2">{ticketInfo.description}</p>
              <p className="mt-2 text-sm text-gray-400">
              Created At: {ticketInfo.created_at}
              </p>
              <p className="mt-1 text-sm text-gray-400">
              Updated At: {ticketInfo.updated_at}
              </p>
              {ticketInfo.type === "help_tk" && (
              <p className="mt-2 text-sm text-gray-400">
                Requester: {(ticketInfo as HelpTK).requester_username} (ID: {(ticketInfo as HelpTK).requester_id})
              </p>
              )}
              {ticketInfo.type === "report_tk" && (
              <>
                <p className="mt-2 text-sm text-gray-400">
                Report Type: {(ticketInfo as ReportTK).report_type}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                Target: {(ticketInfo as ReportTK).target_name} (ID: {(ticketInfo as ReportTK).target_id})
                </p>
                <p className="mt-1 text-sm text-gray-400">
                Complainant: {(ticketInfo as ReportTK).complainant_username} (ID: {(ticketInfo as ReportTK).complainant_id})
                </p>
              </>
              )}
            </div>
            ) : (
            <p>Select a chat to view its details here.</p>
            )}
        </div>
        <div className="max-w-4xl flex-1 flex">
            <div style={{ marginLeft: "2.5vw", marginTop: "2.5vh" }} className="flex-1">
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
  complainant_id: string;
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
  const service_name = data.data.name;
  const provider_id = data.data.provider_id;
  const provider_name = await fetchUserName(provider_id);
  return `${service_name} (by ${provider_name} [ID ${provider_id}])`;
}

async function fetchTicketInfo(tk_uuid: string, type: Chat["type"]): Promise<Ticket> {
  const type_url = type==="help_tk" ? "help" : "report";
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
      target_name: data_dict.type === "ACCOUNT" ? await fetchUserName(data_dict.target_identifier) : await fetchServiceName(data_dict.target_identifier),
      complainant_id: data_dict.complainant,
      complainant_username: await fetchUserName(data_dict.complainant),
    } as ReportTK;
  }
}
