"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Loader2, Bot, RefreshCw, Volume2 } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

const suggestions = [
    "मेरे गेहूं की फसल में पीले पत्ते आ रहे हैं — क्या करूं?",
    "अगले 3 महीने में कौन सी फसल लगाऊं?",
    "Tomato blight disease treatment?",
    "How much fertilizer for 5 acre wheat field?",
    "Best irrigation schedule for cotton?",
    "Organic farming tips for small farmers",
    "What is PM-KISAN scheme?",
    "My wheat has brown rust — treatment?",
];

interface Msg { role: "user" | "ai"; content: string; }

export default function AIAdvisorPage() {
    const [messages, setMessages] = useState<Msg[]>([
        { role: "ai", content: "नमस्ते! 🌾 I'm KisanAI, your personal agricultural advisor!\n\nI can help you with:\n• Crop selection & planting advice\n• Disease & pest identification\n• Fertilizer & irrigation guidance\n• Weather-based recommendations\n• Market insights & selling tips\n• Government schemes & subsidies\n\nAsk me anything in Hindi or English!" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMsg = async (text?: string) => {
        const msg = (text || input).trim();
        if (!msg || loading) return;
        setInput("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        const newMsgs: Msg[] = [...messages, { role: "user", content: msg }];
        setMessages(newMsgs);
        setLoading(true);
        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: `[You are KisanAI, an expert agricultural advisor for Indian farmers. Answer comprehensively with practical, actionable advice. Include specific quantities, timings & Indian crop variety names when relevant. Support both Hindi and English. Format with bullet points for clarity.] User question: ${msg}`,
                    history: messages.slice(-8),
                }),
            });
            const data = await res.json();
            setMessages([...newMsgs, { role: "ai", content: data.reply }]);
        } catch {
            setMessages([...newMsgs, { role: "ai", content: "Connection error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const startVoice = () => {
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) { alert("Voice input not supported in your browser. Try Chrome."); return; }
        const r = new SR();
        r.lang = "hi-IN";
        r.continuous = false;
        r.interimResults = false;
        r.onresult = (e: any) => { setInput(e.results[0][0].transcript); setListening(false); };
        r.onend = () => setListening(false);
        r.onerror = () => setListening(false);
        r.start();
        setListening(true);
    };

    const speakLast = () => {
        const last = [...messages].reverse().find(m => m.role === "ai");
        if (!last) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(last.content.replace(/[•*_#]/g, ""));
        u.lang = "hi-IN";
        u.rate = 0.9;
        u.onstart = () => setSpeaking(true);
        u.onend = () => setSpeaking(false);
        u.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(u);
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    };

    return (
        <div className="flex flex-col items-center gap-16 md:gap-24 pb-32 px-4 w-full">
            <div className="flex flex-col items-center text-center gap-10 w-full max-w-4xl">
                <div className="flex flex-col items-center gap-8">
                    <ExploreButton />
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600 to-violet-500 flex items-center justify-center shadow-2xl shadow-purple-950/40">
                        <Bot size={48} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">KisanAI Advisor</h1>
                        <p className="text-purple-400 font-black uppercase tracking-[0.5em] text-sm md:text-lg">Your Personal Farming Expert</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={speakLast}
                        disabled={speaking}
                        className={`btn-secondary text-sm flex items-center gap-2 ${speaking ? "text-purple-300" : ""}`}
                    >
                        <Volume2 size={14} className={speaking ? "animate-pulse" : ""} />
                        {speaking ? "Speaking..." : "Listen"}
                    </button>
                    <button
                        onClick={() => { window.speechSynthesis.cancel(); setSpeaking(false); setMessages([{ role: "ai", content: "नमस्ते! Fresh start. Ask me anything about farming!" }]); }}
                        className="btn-secondary text-sm flex items-center gap-2"
                    >
                        <RefreshCw size={14} /> Reset
                    </button>
                </div>
            </div>

            {/* Chat */}
            <div className="glass-card h-[680px] flex flex-col overflow-hidden border-green-900/10 shadow-2xl shadow-green-950/20">
                <div className="flex-1 overflow-y-auto p-10 space-y-8">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-4`}>
                            {msg.role === "ai" && (
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">🌾</div>
                            )}
                            <div className={`max-w-[85%] px-6 py-5 text-base md:text-lg leading-relaxed whitespace-pre-wrap rounded-xl shadow-xl
                ${msg.role === "user" ? "chat-user text-white rounded-br-sm shadow-green-900/20" : "chat-ai text-green-100 rounded-bl-sm shadow-green-950/40"}`}>
                                {msg.content}
                            </div>
                            {msg.role === "user" && (
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-700 to-teal-600 flex items-center justify-center flex-shrink-0 mt-1 text-sm shadow-lg">👤</div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center shadow-lg">🌾</div>
                            <div className="chat-ai px-6 py-5 rounded-xl flex items-center gap-3">
                                <Loader2 size={18} className="animate-spin text-green-400" />
                                <span className="text-green-400 text-base font-bold">KisanAI is thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Suggestions */}
                {messages.length <= 1 && !loading && (
                    <div className="px-5 pb-3">
                        <p className="text-xs text-green-700 mb-2 font-medium">💡 Try asking:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map(s => (
                                <button key={s} onClick={() => sendMsg(s)}
                                    className="text-xs px-3 py-1.5 rounded-full border border-green-800 text-green-400 hover:bg-green-900/30 transition">
                                    {s.length > 42 ? s.slice(0, 40) + "…" : s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="border-t border-green-900/40 p-4 flex gap-3 items-end">
                    <button
                        onClick={() => listening ? setListening(false) : startVoice()}
                        className={`p-3 rounded-xl transition flex-shrink-0 ${listening ? "bg-red-600 text-white animate-pulse" : "glass-card text-green-400 hover:text-green-200"}`}
                    >
                        {listening ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>
                    <textarea
                        ref={textareaRef}
                        className="input-field flex-1 resize-none text-sm py-3 min-h-[44px] max-h-[120px] overflow-y-auto"
                        rows={1}
                        placeholder={listening ? "🎤 Listening... speak now" : "Ask about crops, weather, disease, schemes... (Hindi or English)"}
                        value={input}
                        onChange={handleTextareaChange}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                    />
                    <button
                        onClick={() => sendMsg()}
                        disabled={loading || !input.trim()}
                        className="btn-primary px-4 py-3 disabled:opacity-40 flex-shrink-0"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-green-800 text-center">
                🤖 AI responses are for guidance only. For critical decisions, consult a local agricultural expert (KVK) or call Kisan Call Centre: <strong className="text-green-600">1800-180-1551</strong>
            </p>
        </div>
    );
}
