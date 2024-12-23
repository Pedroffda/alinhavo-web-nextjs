"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  sender_id: string;
  content: string;
  created_at: string;
};

type ChatProps = {
  messages: Message[];
  clientId: string;
  clientName: string;
  clientAvatar: string;
  tailorId: string;
  tailorName: string;
  tailorAvatar: string;
  onSendMessage: (message: string) => void;
};

export function JobChat({
  messages,
  clientId,
  // clientName,
  // clientAvatar,
  // tailorName,
  // tailorAvatar,
  onSendMessage,
}: Readonly<ChatProps>) {
  const [message, setMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <ScrollArea className="flex-grow mb-4 pr-4" ref={scrollAreaRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex mb-4 ${
                msg.sender_id === clientId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex ${
                  msg.sender_id === clientId ? "flex-row-reverse" : "flex-row"
                } items-end space-x-2`}
              >
                {/* <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      msg.sender_id === clientId ? clientAvatar : tailorAvatar
                    }
                  />
                  <AvatarFallback>
                    {msg.sender_id === clientId ? clientName[0] : tailorName[0]}
                  </AvatarFallback>
                </Avatar> */}
                <div
                  className={`max-w-[90%] p-3 rounded-lg ${
                    msg.sender_id === clientId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="flex space-x-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
