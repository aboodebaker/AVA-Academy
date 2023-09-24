import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import React from "react";
import './page.css'

type Props = {
  isLoading: boolean;
  messages: Message[];
};

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (!messages) return <></>;
  return (
    <div className="message-container"> {/* Update to match your CSS */}
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className={cn("message", { // Update to match your CSS
              "user": message.role === "user", // Update to match your CSS
              "system": message.role === "system", // Update to match your CSS
            })}
          >
            <div
              className={cn("message-content", { // Update to match your CSS
                "": message.role === "user",
                "system": message.role === "system", // Update to match your CSS
              })}
            >
              <p>{message.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};


export default MessageList;
