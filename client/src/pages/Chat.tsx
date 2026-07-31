import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router-dom";
import { aiChat, ApiError, type ChatContext } from "../lib/api";
import { getSign } from "../lib/signAssets";
import { getChatHistory, saveChatHistory, type ChatMessage } from "../lib/storage";

const CHIPS = [
  "Aylanma harakat qoidasi qanday?",
  "Qoldiq spirt normasi qancha?",
  "Imtihonda nechta xato mumkin?",
  "Piyodalar o'tish joyida kim ustun?",
];

interface LocationState {
  context?: ChatContext;
}

export default function Chat() {
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>(getChatHistory);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const autoSentRef = useRef(false);

  useEffect(() => {
    saveChatHistory(messages);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const state = location.state as LocationState | null;
    if (state?.context && !autoSentRef.current) {
      autoSentRef.current = true;
      const ctx = state.context;
      const sign = ctx.belgi_id ? getSign(ctx.belgi_id) : undefined;
      const text = ctx.belgi_id
        ? `${sign?.nom ?? ctx.belgi_nom ?? ctx.belgi_id} belgisi haqida batafsil tushuntiring.`
        : `"${ctx.mavzu}" mavzusi bo'yicha qo'shimcha tushuntirib bering.`;
      send(text, { ...ctx, belgi_nom: sign?.nom ?? ctx.belgi_nom });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  async function send(text: string, context?: ChatContext) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const reply = await aiChat(trimmed, nextMessages.slice(0, -1), context);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "AI hozircha javob bera olmadi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-96px)] flex-col">
      <div className="border-b p-4" style={{ borderColor: "var(--card-border)" }}>
        <h1 className="font-heading text-lg font-bold">🤖 AI O'qituvchi</h1>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center gap-4 pt-8 text-center">
            <p className="text-4xl">💬</p>
            <p className="text-sm text-[var(--fg)]/70">
              YHQ va MJtK bo'yicha xohlagan savolingizni bering!
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => send(chip)}
                  className="focus-ring rounded-full border border-sign-blue px-3 py-1.5 text-xs font-medium text-sign-blue dark:border-marking dark:text-marking"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-btn px-3 py-2 text-sm ${
                m.role === "user" ? "bg-sign-blue text-white" : "card markdown-body"
              }`}
            >
              {m.role === "user" ? m.content : <ReactMarkdown>{m.content}</ReactMarkdown>}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="card px-3 py-2 text-sm text-gray-400">AI yozmoqda...</div>
          </div>
        )}
        {error && (
          <div className="rounded-btn bg-danger/10 p-3 text-sm text-danger">
            {error}{" "}
            <button onClick={() => send(messages.at(-1)?.content ?? "")} className="underline">
              Qayta urinish
            </button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2 border-t p-3"
        style={{ borderColor: "var(--card-border)" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Savolingizni yozing..."
          className="focus-ring flex-1 rounded-full border border-gray-300 bg-transparent px-4 py-2 text-sm dark:border-gray-600"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-sign-blue text-white disabled:opacity-40"
          aria-label="Yuborish"
        >
          ➤
        </button>
      </form>
    </div>
  );
}
