// @ts-nocheck
import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import React from "react";
import './page.css';

const MessageList = ( messages, isLoading ) => {
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
      {messages.map((message, index) => {
        return (
          <div className={`message ${message.role === "user" ? "user" : "system"}`} key={index}>
<<<<<<< HEAD:components/MessageList.tsx
            <div className={`message-content ${message.role === "system" ? "system" : ""}`}>
              <p>{message.content}</p>
            </div>
          </div>
=======
      <div className={`message-content ${message.role === "system" ? "system" : ""}`}>
        <p dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') } />
      </div>
    </div>
>>>>>>> bc64203d09fdf3d2dfc722a995fd6345e9a3e435:components/MessageList.jsx
        );
      })}
    </div>
  );
};


export default MessageList;
