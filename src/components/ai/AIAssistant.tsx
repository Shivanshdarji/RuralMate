"use client";
import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Mic, MicOff, Volume2, Loader2, Minimize2 } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const WELCOME = `नमस्ते! 🌾 I'm **KisanAI** — your smart farming assistant!

I can help you with:
• 🌱 Crop advice & disease diagnosis
• 💊 Health questions & doctor connect
• 🌤️ Weather-based farming tips
• 📊 Market prices & best selling times
• 🏛️ Government schemes & subsidies
• 💧 Irrigation & fertilizer guidance
• 🆘 Emergency advice

**What would you like to know today?**`;

export function AIAssistant() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: WELCOME, timestamp: new Date() },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (text?: string) => {
        const msg = (text || input).trim();
        if (!msg || loading) return;
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: msg, timestamp: new Date() }]);
        setLoading(true);
        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: msg, history: messages.slice(-8) }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.reply || "Sorry, I couldn't get a response. Please try again.", timestamp: new Date() }]);
            // TTS
            if (data.reply && "speechSynthesis" in window) {
                const utter = new SpeechSynthesisUtterance(data.reply.replace(/\*\*/g, ""));
                utter.lang = "hi-IN";
                utter.rate = 0.9;
                window.speechSynthesis.speak(utter);
            }
        } catch {
            setMessages(prev => [...prev, { role: "assistant", content: "Network error. Please check your connection.", timestamp: new Date() }]);
        } finally {
            setLoading(false);
        }
    };

    const toggleVoice = () => {
        if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
            alert("Voice input not supported in this browser.");
            return;
        }
        if (listening) {
            recognitionRef.current?.stop();
            setListening(false);
            return;
        }
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const rec = new SR();
        rec.lang = "hi-IN";
        rec.interimResults = false;
        rec.onresult = (e: any) => {
            const transcript = e.results[0][0].transcript;
            setInput(transcript);
            sendMessage(transcript);
        };
        rec.onend = () => setListening(false);
        rec.start();
        recognitionRef.current = rec;
        setListening(true);
    };

    const quickActions = [
        "What crop should I plant this season?",
        "How to treat yellow leaves on wheat?",
        "Show me government schemes for farmers",
        "I need to talk to a doctor",
        "What is today's onion price?",
    ];

    const formatMsg = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n/g, "<br/>")
            .replace(/•/g, "• ");
    };

    return (
        <>
            {/* FAB */}
            {!open && (
                <button className="ai-fab" onClick={() => setOpen(true)} title="KisanAI Assistant">
                    <Bot size={28} className="text-white" />
                </button>
            )}

            {/* Chat Window */}
            {open && (
                <div className={`fixed right-4 bottom-4 z-[1000] flex flex-col transition-all duration-300 rounded-2xl shadow-2xl border border-green-700/40 bg-[#0a1a0d]
          ${minimized ? "w-80 h-14 overflow-hidden" : "w-[360px] sm:w-[420px] h-[600px]"}`}
                    style={{ boxShadow: "0 0 40px rgba(34,197,94,0.2)" }}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-green-900/50 bg-gradient-to-r from-green-900/60 to-emerald-900/40 rounded-t-2xl flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                            <Bot size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-green-300 text-sm">KisanAI Assistant</p>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <p className="text-xs text-green-600">Online — Hindi & English</p>
                            </div>
                        </div>
                        <button onClick={() => setMinimized(!minimized)} className="text-green-600 hover:text-green-400 transition p-1">
                            <Minimize2 size={15} />
                        </button>
                        <button onClick={() => setOpen(false)} className="text-green-600 hover:text-red-400 transition p-1">
                            <X size={15} />
                        </button>
                    </div>

                    {!minimized && (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                        {msg.role === "assistant" && (
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                                                🌾
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "chat-user text-white" : "chat-ai text-green-100"}`}
                                            dangerouslySetInnerHTML={{ __html: formatMsg(msg.content) }}
                                        />
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center">🌾</div>
                                        <div className="chat-ai px-4 py-3 flex items-center gap-2">
                                            <Loader2 size={14} className="animate-spin text-green-400" />
                                            <span className="text-green-400 text-sm">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={bottomRef} />
                            </div>

                            {/* Quick Actions */}
                            {messages.length <= 1 && (
                                <div className="px-4 pb-2">
                                    <p className="text-xs text-green-700 mb-2">Quick questions:</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {quickActions.map(action => (
                                            <button
                                                key={action}
                                                onClick={() => sendMessage(action)}
                                                className="text-xs px-2.5 py-1 rounded-full border border-green-800 text-green-400 hover:bg-green-900/30 transition"
                                            >
                                                {action}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Input */}
                            <div className="flex gap-2 p-4 border-t border-green-900/40 flex-shrink-0">
                                <button onClick={toggleVoice} className={`p-2 rounded-lg transition ${listening ? "bg-red-600 text-white" : "glass-card text-green-400 hover:text-green-200"}`}>
                                    {listening ? <MicOff size={18} /> : <Mic size={18} />}
                                </button>
                                <input
                                    className="input-field flex-1 text-sm"
                                    placeholder="Ask anything... (Hindi or English)"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={loading || !input.trim()}
                                    className="btn-primary px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
