"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Sparkles,
  Bot,
  AlertCircle,
  ArrowUpRight,
  HeartHandshake,
  ShieldCheck,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    api: "/api/chat",
    onError: (err) => {
      console.error("Chatbot error:", err);
      const message = err.message?.trim();

      if (message) {
        setError(message.replace(/^Error:\s*/i, ""));
        return;
      }

      setError("Something went wrong. Please try again.");
    },
  });

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const suggestions = [
    "Show me electronics",
    "Best selling products",
    "Help me find a gift",
    "What's on sale?",
  ];

  const highlights = useMemo(
    () => [
      { icon: Truck, label: "Fast shipping" },
      { icon: ShieldCheck, label: "Secure checkout" },
      { icon: HeartHandshake, label: "Easy returns" },
      { icon: ShoppingBag, label: "Premium picks" },
    ],
    []
  );

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    handleInputChange(event);
  };

  const handleOpenChat = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    setIsRendered(true);
    setIsOpen(true);
    window.requestAnimationFrame(() => {
      panelRef.current?.focus();
    });
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setIsRendered(false);
    }, 220);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const messagesList = useMemo(
    () => (
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "flex max-w-[86%] items-end gap-2",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              {message.role === "assistant" && (
                <div className="mb-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-lg shadow-fuchsia-500/20">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={cn(
                  "whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm",
                  message.role === "user"
                    ? "rounded-br-md bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-[0_14px_35px_rgba(236,72,153,0.24)]"
                    : "rounded-bl-md border border-slate-200/80 bg-white/95 text-slate-900 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
                )}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2">
              <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-lg">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-3xl rounded-bl-md border border-slate-200/80 bg-white/95 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-fuchsia-400 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-pink-400 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:300ms]" />
                  </div>
                  <button
                    type="button"
                    onClick={stop}
                    className="ml-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    Stop
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    ),
    [isLoading, messages, stop]
  );

  if (!isMounted) return null;

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-[0_18px_50px_rgba(236,72,153,0.35)] transition-all duration-300 hover:scale-110 hover:shadow-[0_24px_60px_rgba(236,72,153,0.42)]"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {isRendered && (
        <div
          ref={panelRef}
          tabIndex={-1}
          className={cn(
            "fixed bottom-6 right-6 z-50 w-[min(27rem,calc(100vw-1rem))] overflow-hidden rounded-[2rem] border border-white/20 shadow-[0_30px_90px_rgba(15,23,42,0.22)] backdrop-blur-2xl transition-all duration-300 outline-none",
            isOpen
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-4 scale-[0.96] opacity-0"
          )}
          style={{ height: "min(38rem, calc(100vh - 3rem))" }}
        >
          <div className="flex h-full flex-col bg-white/90 dark:bg-slate-950/92">
            <div className="relative overflow-hidden border-b border-white/15 bg-gradient-to-r from-[#4c1d95] via-[#be185d] to-[#2563eb] px-4 py-4 text-white">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute -left-12 top-0 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
                <div className="absolute -right-8 top-4 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl" />
              </div>
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-md">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">TrendyCart AI Assistant</h3>
                    <p className="text-xs text-white/80">Style, search, and support in one place</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseChat}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all duration-300 hover:scale-105 hover:bg-white/20"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.08),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.95),rgba(243,244,246,0.9))] p-4 dark:bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_36%),linear-gradient(180deg,rgba(2,6,23,0.96),rgba(15,23,42,0.92))]">
              {error && (
                <div className="mb-4 flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50/90 p-3 text-sm text-amber-900 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{error}</p>
                    <p className="mt-1 text-xs opacity-80">
                      This usually means the chatbot key is missing or the network request failed.
                    </p>
                  </div>
                </div>
              )}

              {messages.length === 0 && !error ? (
                <div className="flex h-full flex-col justify-between gap-6">
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-[0_20px_50px_rgba(236,72,153,0.25)]">
                      <Sparkles className="h-8 w-8" />
                    </div>
                    <h3 className="mt-5 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                      Welcome to TrendyCart AI
                    </h3>
                    <p className="mt-2 max-w-[250px] text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Ask for product recommendations, shopping help, order guidance, or what&apos;s trending right now.
                    </p>
                    <div className="mt-5 grid w-full grid-cols-2 gap-2">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            setInput(suggestion);
                            requestAnimationFrame(() => {
                              formRef.current?.requestSubmit();
                            });
                          }}
                          className="rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-3 text-left text-xs font-medium text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-fuchsia-200 hover:bg-gradient-to-r hover:from-fuchsia-50 hover:to-cyan-50 hover:text-purple-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-fuchsia-500/30 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {highlights.map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/80 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm dark:bg-white/5 dark:text-slate-300"
                      >
                        <Icon className="h-3.5 w-3.5 text-purple-500" />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                messagesList
              )}
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="border-t border-slate-200/80 bg-white/95 p-3 dark:border-white/10 dark:bg-slate-950/92"
            >
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={handlePromptChange}
                  placeholder="Ask about products, recommendations..."
                  className="h-12 rounded-2xl border-slate-200/80 bg-white/90 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-fuchsia-400 focus-visible:ring-fuchsia-300 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="h-12 w-12 flex-shrink-0 rounded-2xl border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-[0_16px_35px_rgba(236,72,153,0.24)] transition-all duration-300 hover:scale-105"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Need quick help?</span>
                <span className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-300">
                  <ArrowUpRight className="h-3 w-3" />
                  Ask anything
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
