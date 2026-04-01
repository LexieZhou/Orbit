"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Phone, Video, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { getMessages } from "@/lib/mock-messages";
import type { ChatMessage } from "@/lib/mock-messages";
import { RELATIONSHIP_LABELS, RELATIONSHIP_COLORS } from "@/types";
import type { PersonWithInsight } from "@/types";

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

export default function ChatPage() {
  const params = useParams();
  const id = params.id as string;

  const [person, setPerson] = useState<PersonWithInsight | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/people/${id}`)
      .then((r) => r.json())
      .then((data) => setPerson(data))
      .catch(() => {});
    setMessages(getMessages(id));
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    const text = input.trim();
    if (!text || !person) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      from: "me",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, msg]);
    setInput("");
    inputRef.current?.focus();

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          from: "them",
          text: getAutoReply(person.name),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1400);
  };

  if (!person) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  const relColor = RELATIONSHIP_COLORS[person.relationshipType];

  return (
    /* Fill the main content area edge-to-edge, overriding the parent padding */
    <div className="flex flex-col -mx-4 sm:-mx-6 -my-6 sm:-my-8" style={{ height: "calc(100vh - 56px)" }}>

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card/80 backdrop-blur shrink-0">
        <Link
          href="/people"
          className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={person.avatarUrl ?? undefined} />
          <AvatarFallback className="text-xs">{getInitials(person.name)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-none truncate">{person.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: relColor }}
            />
            <span className="text-xs text-muted-foreground">
              {RELATIONSHIP_LABELS[person.relationshipType]}
            </span>
            <span className="text-muted-foreground/40 mx-0.5">·</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs text-emerald-500">Active now</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="Voice call">
            <Phone className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="Video call">
            <Video className="h-4 w-4" />
          </button>
          <Link
            href={`/people/${person.id}`}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="View profile"
          >
            <Info className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ── Message list ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-1 min-h-0 bg-background/50">
        {/* Divider */}
        <div className="flex items-center gap-3 pb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] text-muted-foreground px-2 font-medium">Recent</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {messages.map((msg, idx) => {
          const isMe = msg.from === "me";
          const prevMsg = messages[idx - 1];
          const showAvatar = !isMe && (idx === 0 || prevMsg?.from !== "them");

          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"} ${
                idx > 0 && messages[idx - 1].from === msg.from ? "mt-0.5" : "mt-3"
              }`}
            >
              {/* Avatar placeholder for alignment */}
              {!isMe && (
                <div className="w-7 shrink-0 flex items-end">
                  {showAvatar && (
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={person.avatarUrl ?? undefined} />
                      <AvatarFallback className="text-[9px]">{getInitials(person.name)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )}

              <div
                className={`flex flex-col gap-0.5 max-w-[72%] ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className="px-4 py-2.5 text-sm leading-relaxed"
                  style={{
                    borderRadius: isMe
                      ? "18px 18px 5px 18px"
                      : "18px 18px 18px 5px",
                    ...(isMe
                      ? {
                          background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
                          color: "white",
                        }
                      : {
                          background: "hsl(var(--muted))",
                          color: "hsl(var(--foreground))",
                        }),
                  }}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">{msg.time}</span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typing && (
          <div className="flex gap-2 flex-row mt-3">
            <div className="w-7 shrink-0 flex items-end">
              <Avatar className="h-7 w-7">
                <AvatarImage src={person.avatarUrl ?? undefined} />
                <AvatarFallback className="text-[9px]">{getInitials(person.name)}</AvatarFallback>
              </Avatar>
            </div>
            <div
              className="flex items-center gap-1 px-4 py-3"
              style={{
                background: "hsl(var(--muted))",
                borderRadius: "18px 18px 18px 5px",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"
                  style={{
                    animation: "typing-bounce 1.2s ease-in-out infinite",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <div className="flex items-center gap-2 px-4 py-3 border-t bg-card shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={`Message ${person.name.split(" ")[0]}…`}
          className="flex-1 text-sm bg-muted rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground transition-all"
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 shrink-0"
          style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {/* Typing bounce keyframes */}
      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
