"use client";

import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-3xl px-4 py-3 shadow-sm",
          isUser
            ? "rounded-br-md bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-[0_14px_35px_rgba(236,72,153,0.24)]"
            : "rounded-bl-md border border-slate-200/80 bg-white/95 text-slate-900 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
        )}
      >
        <p className="whitespace-pre-wrap text-sm leading-6">{content}</p>
      </div>
    </div>
  );
}
