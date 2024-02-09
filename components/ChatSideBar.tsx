"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";


type Chat = {
  id: string;
  pdfName: string;
  // Add other properties as needed
};

type Props = {
  chats: Chat[]; // Define the correct type for chats
  chatId: string;
  isPro: boolean;
  show: any;
  setter: any;
};


const ChatSideBar = ({ chats, chatId, isPro, show, setter  }: Props) => {
  const [loading, setLoading] = React.useState(false);
  
  return (
    <div className="w-full h-screen overflow-hidden soff p-4 text-gray-200 bg-gray-900">
      <Link href="/chat">
        <Button className="w-full border-dashed border-white border">
          
          Normal Chat
        </Button>
      </Link>

      <div className="flex max-h-screen overflow-hidden pb-20 flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-white flex items-center", {
                "bg-blue-600 text-white": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-white text-ellipsis">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>

   
    </div>
  );
};

export default ChatSideBar;
