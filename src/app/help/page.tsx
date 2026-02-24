"use client";
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";
import { useState } from "react";

const faqs = [
    { q: "मैं KisanAI से कैसे बात करूं?", a: "स्क्रीन के नीचे दाईं तरफ हरे रंग का बटन दबाएं। आप हिंदी या इंग्लिश में लिख या बोल सकते हैं।" },
    { q: "मौसम की जानकारी कहां से आती है?", a: "Weather data IMD (India Meteorological Department) और OpenWeatherMap से real-time में आता है।" },
    { q: "क्या RuralMate बिना internet के काम करता है?", a: "हां — RuralMate एक PWA है। एक बार load होने के बाद basic features offline भी काम करती हैं।" },
    { q: "How do I file a crop insurance claim?", a: "Go to Insurance page → Find your active policy → Click 'Claim Now'. Follow the 5-step guide provided. Call 1800-889-6860 for immediate help." },
    { q: "PM-KISAN status कैसे check करें?", a: "Schemes page पर जाएं → PM-KISAN tab → अपना Aadhaar या Account number डालें → Status देखें।" },
    { q: "AI Doctor से कैसे बात करें?", a: "Health page पर जाएं → 'AI Doctor से बात करें' पर click करें → अपनी समस्या हिंदी या English में describe करें।" },
];

export default function HelpPage() {
    const [open, setOpen] = useState<number | null>(null);
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <ExploreButton />
                    <h1 className="text-2xl font-bold text-white">❓ Help & Support</h1>
                </div>
            </div>
            <div className="glass-card p-5 flex items-center gap-4 bg-green-900/10">
                <div className="text-4xl">🤖</div>
                <div className="flex-1">
                    <p className="text-white font-bold">Didn&apos;t find your answer?</p>
                    <p className="text-green-400 text-sm">Ask KisanAI — it knows everything about RuralMate and farming!</p>
                </div>
                <button className="btn-primary text-sm flex items-center gap-2"><MessageSquare size={14} />Ask KisanAI</button>
            </div>
            <h2 className="text-white font-bold">Frequently Asked Questions</h2>
            <div className="space-y-2">
                {faqs.map((faq, i) => (
                    <div key={i} className="glass-card overflow-hidden">
                        <button className="w-full flex items-center justify-between p-5 text-left"
                            onClick={() => setOpen(open === i ? null : i)}>
                            <span className="text-white font-medium text-sm pr-4">{faq.q}</span>
                            {open === i ? <ChevronUp size={16} className="text-green-500 flex-shrink-0" /> : <ChevronDown size={16} className="text-green-600 flex-shrink-0" />}
                        </button>
                        {open === i && (
                            <div className="px-5 pb-5 text-green-300 text-sm leading-relaxed border-t border-green-900/30 pt-3">{faq.a}</div>
                        )}
                    </div>
                ))}
            </div>
            <div className="glass-card p-5">
                <h3 className="text-white font-bold mb-3">📞 Contact Support</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a href="tel:18001801551" className="p-3 bg-green-900/20 rounded-xl text-center hover:bg-green-900/30 transition">
                        <p className="text-2xl mb-1">📞</p>
                        <p className="text-white text-sm font-bold">1800-180-1551</p>
                        <p className="text-green-700 text-xs">Kisan Call Centre</p>
                    </a>
                    <div className="p-3 bg-blue-900/20 rounded-xl text-center">
                        <p className="text-2xl mb-1">💬</p>
                        <p className="text-white text-sm font-bold">WhatsApp</p>
                        <p className="text-blue-400 text-xs">+91 98765 00001</p>
                    </div>
                    <div className="p-3 bg-purple-900/20 rounded-xl text-center">
                        <p className="text-2xl mb-1">✉️</p>
                        <p className="text-white text-sm font-bold">Email</p>
                        <p className="text-purple-400 text-xs">help@ruralmate.in</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
