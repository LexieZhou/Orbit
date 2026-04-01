"use client";

import { useState, useRef, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Send, X, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { getMessages } from "@/lib/mock-messages";
import type { ChatMessage } from "@/lib/mock-messages";
import { RELATIONSHIP_LABELS, RELATIONSHIP_COLORS } from "@/types";
import type { PersonWithInsight } from "@/types";

interface ChatModalProps {
  person: PersonWithInsight;
  children: React.ReactNode; // trigger element
}

export function ChatModal({ person, children }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load messages when opened
  useEffect(() => {
    if (open) setMessages(getMessages(person.id));
  }, [open, person.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      from: "me",
      text,
      time: "Just now",
    };
    setMessages((prev) => [...prev, msg]);
    setInput("");

    // Simulate a reply after a short delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          from: "them",
          text: getAutoReply(person.name),
          time: "Just now",
        },
      ]);
    }, 1200);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Panel — bottom-right corner on desktop, bottom sheet on mobile */}
        <Dialog.Content
          className="fixed z-50 flex flex-col shadow-2xl bg-white dark:bg-slate-900 rounded-2xl overflow-hidden
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4
            bottom-4 right-4 w-[360px] max-h-[560px]
            max-sm:bottom-0 max-sm:right-0 max-sm:left-0 max-sm:w-full max-sm:rounded-b-none max-sm:max-h-[80vh]"
          style={{ border: "1px solid hsl(var(--border))" }}
        >
          {/* ── Header ── */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-b shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f110, #8b5cf608)" }}
          >
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={person.avatarUrl ?? undefined} />
              <AvatarFallback className="text-xs">{getInitials(person.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-none truncate">{person.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: RELATIONSHIP_COLORS[person.relationshipType] }}
                />
                <span className="text-xs text-muted-foreground">
                  {RELATIONSHIP_LABELS[person.relationshipType]}
                </span>
                {/* Online indicator */}
                <span className="ml-1 flex items-center gap-1 text-xs text-emerald-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Active
                </span>
              </div>
            </div>
            <Dialog.Close className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {/* ── Message list ── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.from === "me" ? "flex-row-reverse" : "flex-row"}`}
              >
                {msg.from === "them" && (
                  <Avatar className="h-6 w-6 shrink-0 mt-1">
                    <AvatarImage src={person.avatarUrl ?? undefined} />
                    <AvatarFallback className="text-[9px]">{getInitials(person.name)}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex flex-col gap-0.5 max-w-[75%] ${msg.from === "me" ? "items-end" : "items-start"}`}>
                  <div
                    className="px-3.5 py-2 rounded-2xl text-sm leading-relaxed"
                    style={
                      msg.from === "me"
                        ? {
                            background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                            color: "white",
                            borderBottomRightRadius: "6px",
                          }
                        : {
                            background: "hsl(var(--muted))",
                            color: "hsl(var(--foreground))",
                            borderBottomLeftRadius: "6px",
                          }
                    }
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-muted-foreground px-1">{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* ── Input ── */}
          <div className="flex items-center gap-2 px-3 py-3 border-t shrink-0 bg-background">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={`Message ${person.name.split(" ")[0]}…`}
              className="flex-1 text-sm bg-muted rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground transition-all"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ── Auto-reply pool ────────────────────────────────────────────────────────────
function getAutoReply(name: string): string {
  const firstName = name.split(" ")[0];
  const replies = [
    `Haha yes, exactly! 😄`,
    `Good point, I hadn't thought of it that way.`,
    `Let's definitely make that happen soon!`,
    `Miss you too ${firstName}! Let's catch up properly.`,
    `100% agree. Talk soon? ☀️`,
    `That sounds perfect, I'm in!`,
    `Aw thank you, that means a lot 🙏`,
    `Ha, you always know what to say!`,
    `Can't wait! It's been too long.`,
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

// ── Standalone trigger button (used on PersonCard) ────────────────────────────
// Navigates to the full-screen chat page instead of a small floating modal
export function ChatButton({ person }: { person: PersonWithInsight }) {
  return (
    <Link
      href={`/chat/${person.id}`}
      onClick={(e) => e.stopPropagation()}
      className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all z-10"
      title={`Message ${person.name}`}
    >
      <MessageCircle className="h-4 w-4" />
    </Link>
  );
}
