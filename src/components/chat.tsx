import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { useTransition, animated } from "@react-spring/web";
import { Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Content, UUID } from "@elizaos/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { cn, moment } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useToast } from "@/hooks/use-toast";
import AIWriter from "react-aiwriter";
import { IAttachment } from "@/types";
import { Badge } from "./ui/badge";
import ConnectionStatus from "./connection-status";
import Wallet from "./wallet";

interface ExtraContentFields {
  user: string;
  createdAt: number;
  isLoading?: boolean;
}

type ContentWithUser = Content & ExtraContentFields;

export default function Page({ agentId }: { agentId: UUID }) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const queryClient = useQueryClient();

  const getMessageVariant = (role: string) =>
    role !== "user" ? "received" : "sent";

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [queryClient.getQueryData(["messages", agentId])]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;

    const attachments: IAttachment[] | undefined = selectedFile
      ? [
          {
            url: URL.createObjectURL(selectedFile),
            contentType: selectedFile.type,
            title: selectedFile.name,
          },
        ]
      : undefined;

    const newMessages = [
      {
        text: input,
        user: "user",
        createdAt: Date.now(),
        attachments,
      },
      {
        text: input,
        user: "system",
        isLoading: true,
        createdAt: Date.now(),
      },
    ];

    queryClient.setQueryData(
      ["messages", agentId],
      (old: ContentWithUser[] = []) => [...old, ...newMessages]
    );

    sendMessageMutation.mutate({
      message: input,
      selectedFile: selectedFile ? selectedFile : null,
    });

    setSelectedFile(null);
    setInput("");
    formRef.current?.reset();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const sendMessageMutation = useMutation({
    mutationKey: ["send_message", agentId],
    mutationFn: ({
      message,
      selectedFile,
    }: {
      message: string;
      selectedFile?: File | null;
    }) => apiClient.sendMessage(agentId, message, selectedFile),
    onSuccess: (newMessages: ContentWithUser[]) => {
      queryClient.setQueryData(
        ["messages", agentId],
        (old: ContentWithUser[] = []) => [
          ...old.filter((msg) => !msg.isLoading),
          ...newMessages.map((msg) => ({
            ...msg,
            createdAt: Date.now(),
          })),
        ]
      );
    },
    onError: (e) => {
      toast({
        variant: "destructive",
        title: "Unable to send message",
        description: e.message,
      });
    },
  });

  const messages =
    queryClient.getQueryData<ContentWithUser[]>(["messages", agentId]) || [];

  const transitions = useTransition(messages, {
    keys: (message) => `${message.createdAt}-${message.user}-${message.text}`,
    from: { opacity: 0, transform: "translateY(50px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(10px)" },
  });

  return (
    <div className="flex flex-col w-full h-[calc(100dvh)] sm:p-4">
      <div className="flex-1 overflow-y-auto">
        <ChatMessageList ref={messagesContainerRef}>
          {transitions((style, message) => (
            // @ts-ignore
            <animated.div
              style={style}
              className="flex flex-col gap-1 p-2 sm:gap-2 sm:p-4"
            >
              <ChatBubble
                variant={getMessageVariant(message?.user)}
                className={cn(
                  "flex flex-row items-center gap-1 sm:gap-2",
                  message?.user === "user"
                    ? "ml-auto max-w-[85%] sm:max-w-[75%] [&>div]:rounded-tl-lg [&>div]:rounded-tr-lg [&>div]:rounded-bl-lg [&>div]:rounded-br-none"
                    : "mr-auto max-w-[85%] sm:max-w-[75%] [&>div]:rounded-tl-lg [&>div]:rounded-tr-lg [&>div]:rounded-bl-none [&>div]:rounded-br-lg"
                )}
              >
                {message?.user !== "user" ? (
                  <Avatar className="size-6 sm:size-8 border rounded-full select-none">
                    <AvatarImage src="/unicorn.svg" />
                  </Avatar>
                ) : null}
                <div className="flex flex-col w-full">
                  <ChatBubbleMessage
                    isLoading={message?.isLoading}
                    className={cn(
                      "text-sm sm:text-base",
                      message?.user === "user"
                        ? "rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-none"
                        : "rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-lg"
                    )}
                  >
                    {message?.user !== "user" ? (
                      <AIWriter>{message?.text}</AIWriter>
                    ) : (
                      message?.text
                    )}
                  </ChatBubbleMessage>
                  <div
                    className={cn(
                      "flex items-center gap-4 w-full mt-1",
                      message?.user === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn([
                        message?.isLoading ? "mt-2" : "",
                        "flex items-center gap-2 sm:gap-4 select-none",
                        message?.user === "user"
                          ? "flex-row-reverse"
                          : "flex-row",
                      ])}
                    >
                      {message?.source ? (
                        <Badge variant="outline" className="text-xs">
                          {message.source}
                        </Badge>
                      ) : null}
                      {message?.createdAt ? (
                        <ChatBubbleTimestamp
                          timestamp={moment(message?.createdAt).format("LT")}
                          className="text-xs"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </ChatBubble>
            </animated.div>
          ))}
        </ChatMessageList>
      </div>
      <div className="px-4 pb-4">
        <form
          ref={formRef}
          onSubmit={handleSendMessage}
          className="relative rounded-md border bg-card"
        >
          {selectedFile ? (
            <div className="p-3 flex">
              <div className="relative rounded-md border p-2">
                <Button
                  onClick={() => setSelectedFile(null)}
                  className="absolute -right-2 -top-2 size-[22px] ring-2 ring-background"
                  variant="outline"
                  size="icon"
                >
                  <X />
                </Button>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  height="100%"
                  width="100%"
                  className="aspect-square object-contain w-16"
                />
              </div>
            </div>
          ) : null}
          <ChatInput
            ref={inputRef}
            onKeyDown={handleKeyDown}
            value={input}
            onChange={({ target }) => setInput(target.value)}
            placeholder="Type your message here..."
            className="min-h-12 resize-none rounded-md bg-card border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center justify-between p-3 pt-0">
            <div className="pl-2">
              <ConnectionStatus />
            </div>

            <div>
              <Wallet />
            </div>

            <div>
              <Button
                disabled={!input || sendMessageMutation?.isPending}
                type="submit"
                size="sm"
                className="ml-auto gap-1.5 h-[30px]"
              >
                {sendMessageMutation?.isPending ? "..." : "Send Message"}
                <Send className="size-3.5" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
