"use client";
import { useState } from "react";
import { Users, MessageSquare, Heart, Share2, Plus, Search, ThumbsUp, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Post {
    id: number; author: string; avatar: string; location: string; time: string;
    category: string; title: string; body: string; likes: number; comments: number;
    tags: string[]; likedByMe?: boolean; image?: string;
}
interface Comment { author: string; avatar: string; time: string; text: string; }

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Question", "Crop Tips", "Weather", "Market", "Equipment", "Schemes", "Success Story", "Alert"];

const CAT_COLORS: Record<string, string> = {
    "Question": "text-blue-400 bg-blue-900/20 border-blue-800/30",
    "Crop Tips": "text-green-400 bg-green-900/20 border-green-800/30",
    "Weather": "text-sky-400 bg-sky-900/20 border-sky-800/30",
    "Market": "text-yellow-400 bg-yellow-900/20 border-yellow-800/30",
    "Equipment": "text-orange-400 bg-orange-900/20 border-orange-800/30",
    "Schemes": "text-purple-400 bg-purple-900/20 border-purple-800/30",
    "Success Story": "text-emerald-400 bg-emerald-900/20 border-emerald-800/30",
    "Alert": "text-red-400 bg-red-900/20 border-red-800/30",
};

// ─── Mock Posts ───────────────────────────────────────────────────────────────
const INITIAL_POSTS: Post[] = [
    {
        id: 1, author: "Ramesh Yadav", avatar: "👨‍🌾", location: "Indore, MP", time: "2h ago",
        category: "Crop Tips", title: "गेहूं में येलो रस्ट रोग का उपचार",
        body: "मेरी गेहूं की फसल में येलो रस्ट (पीला रतुआ) आ गया है। मैंने Propiconazole 25EC @ 0.1% का छिड़काव किया — 5 दिन में पूरी तरह ठीक हो गई। November–December में सबसे ज्यादा खतरा रहता है। सुबह ओस के समय छिड़काव न करें।",
        likes: 47, comments: 12, tags: ["wheat", "disease", "fungicide"],
    },
    {
        id: 2, author: "Anjali Patel", avatar: "👩‍🌾", location: "Nashik, MH", time: "5h ago",
        category: "Success Story", title: "Drip irrigation से प्याज में 40% पानी की बचत",
        body: "2 एकड़ में ड्रिप सिस्टम लगाया। पहले 22 बार सिंचाई करनी पड़ती थी, अब सिर्फ 13। बिजली का बिल भी आधा हो गया। PM-KUSUM के तहत solar pump + drip scheme का फायदा मिला। कोई भी पूछे — पूरी जानकारी दे सकती हूँ।",
        likes: 83, comments: 21, tags: ["irrigation", "onion", "PMKUSUM"],
    },
    {
        id: 3, author: "Suresh Kumawat", avatar: "👨‍🌾", location: "Jaipur, RJ", time: "1d ago",
        category: "Market", title: "सरसों का भाव — अभी बेचें या रोकें?",
        body: "आज जयपुर मंडी में सरसों ₹5,650/quintal पर है। MSP ₹5,650 ही है। NAFED अभी खरीद नहीं कर रही। उत्तर प्रदेश में दाम ₹5,800 तक चल रहे हैं। मेरी राय — 2–3 हफ्ते और रोककर Agra/Mathura मंडी में बेचें।",
        likes: 64, comments: 38, tags: ["mustard", "market", "MSP"],
    },
    {
        id: 4, author: "Kiran Devi", avatar: "👩‍🌾", location: "Amravati, MH", time: "2d ago",
        category: "Question", title: "सोयाबीन में येलो मोजेक वायरस — क्या करें?",
        body: "मेरी 3 एकड़ सोयाबीन में पत्तियाँ पीली पड़ रही हैं और growth रुक गई है। कृषि विभाग ने Yellow Mosaic Virus बताया। कोई बताए — क्या यह पूरी फसल को नष्ट कर देगा? कोई इलाज है?",
        likes: 29, comments: 45, tags: ["soybean", "virus", "disease"],
    },
    {
        id: 5, author: "Bharat Singh", avatar: "👨‍🌾", location: "Ludhiana, PB", time: "3d ago",
        category: "Alert", title: "⚠️ Punjab में Whitefly का बड़ा attack — सतर्क रहें",
        body: "मालवा belt में cotton में whitefly का बड़ा हमला देखा जा रहा है। Imidacloprid का उपयोग बंद करें — resistance आ गया है। इसके बजाय Spiromesifen या Diafenthiuron का उपयोग करें। समय पर action लेने से बच सकते हैं।",
        likes: 112, comments: 67, tags: ["cotton", "pest", "alert"],
    },
    {
        id: 6, author: "Savita Ahir", avatar: "👩‍🌾", location: "Bhopal, MP", time: "4d ago",
        category: "Schemes", title: "PM-KISAN की 15वीं किस्त — यह लोग मिस कर सकते हैं",
        body: "जिन किसानों ने Land Seeding (भूमि सत्यापन) नहीं कराया या Aadhaar-bank link नहीं है — उन्हें किस्त नहीं मिलेगी। अभी pmkisan.gov.in पर status check करें। कोई problem हो तो Kisan Helpline 155261 पर call करें।",
        likes: 96, comments: 31, tags: ["PMKISAN", "scheme", "subsidy"],
    },
];

const MOCK_COMMENTS: Record<number, Comment[]> = {
    4: [
        { author: "Dr. Manoj Gupta", avatar: "👨‍⚕️", time: "1d ago", text: "Yellow Mosaic Virus का कोई chemical इलाज नहीं है। Infected plants को उखाड़कर जलाएं, whitefly को control करें (जो virus फैलाती है), और अगले साल YMV-resistant variety लगाएं — JS 9560 या NRC 86।" },
        { author: "Ramesh Yadav", avatar: "👨‍🌾", time: "23h ago", text: "मुझे भी ऐसा हुआ था। Infected plants हटाकर और Thiamethoxam spray से whitefly control की — 40% फसल बच गई। KVK में जरूर जाएं।" },
    ],
    3: [
        { author: "Mukesh Trader", avatar: "👨‍💼", time: "20h ago", text: "Agra mandi में इस हफ्ते ₹5,780–5,820 तक rate हैं। अगले month export demand increase होने की उम्मीद है। थोड़ा रुकना सही रहेगा।" },
    ],
};

type SortKey = "newest" | "trending";

export default function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
    const [category, setCategory] = useState("All");
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortKey>("newest");
    const [expandedPost, setExpandedPost] = useState<number | null>(null);
    const [showCompose, setShowCompose] = useState(false);
    const [draft, setDraft] = useState({ title: "", body: "", category: "Question", location: "" });

    const filtered = posts
        .filter(p => (category === "All" || p.category === category) &&
            (p.title.toLowerCase().includes(query.toLowerCase()) || p.body.toLowerCase().includes(query.toLowerCase())))
        .sort((a, b) => sortBy === "trending" ? (b.likes + b.comments) - (a.likes + a.comments) : b.id - a.id);

    function toggleLike(id: number) {
        setPosts(prev => prev.map(p => p.id === id
            ? { ...p, likes: p.likedByMe ? p.likes - 1 : p.likes + 1, likedByMe: !p.likedByMe }
            : p));
    }

    function submitPost() {
        if (!draft.title || !draft.body) return;
        const newPost: Post = {
            id: Date.now(), author: "You", avatar: "👤",
            location: draft.location || "Your Village",
            time: "Just now", category: draft.category,
            title: draft.title, body: draft.body,
            likes: 0, comments: 0, tags: [],
        };
        setPosts(prev => [newPost, ...prev]);
        setDraft({ title: "", body: "", category: "Question", location: "" });
        setShowCompose(false);
    }

    return (
        <div className="flex flex-col items-center gap-12 pb-20 px-4 w-full">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-8 w-full max-w-4xl pt-2">
                <ExploreButton />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-950/40">
                    <Users size={40} className="text-white" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-3">Kisan Forum</h1>
                    <p className="text-violet-400 font-black uppercase tracking-[0.4em] text-sm">Ask · Share · Learn · Alert</p>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full">
                    {[
                        { label: "Active Farmers", value: "4,200+", icon: "👨‍🌾" },
                        { label: "Questions Solved", value: "18,000+", icon: "✅" },
                        { label: "Regions Covered", value: "180+", icon: "📍" },
                    ].map(s => (
                        <div key={s.label} className="glass-card p-4 text-center">
                            <p className="text-2xl mb-1">{s.icon}</p>
                            <p className="text-white font-black">{s.value}</p>
                            <p className="text-violet-700 text-[10px] font-bold uppercase tracking-widest mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Compose */}
            <div className="w-full max-w-4xl">
                {!showCompose ? (
                    <button onClick={() => setShowCompose(true)} className="glass-card w-full p-4 flex items-center gap-4 hover:border-violet-700/40 border border-transparent transition">
                        <span className="text-2xl">👤</span>
                        <span className="text-green-700 text-sm">अपना सवाल, जानकारी या अनुभव share करें...</span>
                        <Plus size={20} className="text-violet-500 ml-auto" />
                    </button>
                ) : (
                    <div className="glass-card p-6 space-y-4 border-violet-800/30">
                        <h3 className="text-white font-black flex items-center gap-2"><Plus size={18} className="text-violet-400" /> नई पोस्ट लिखें</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <select className="input-field text-sm" value={draft.category} onChange={e => setDraft(p => ({ ...p, category: e.target.value }))}>
                                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                            </select>
                            <input className="input-field text-sm" placeholder="Your location (village/district)" value={draft.location} onChange={e => setDraft(p => ({ ...p, location: e.target.value }))} />
                        </div>
                        <input className="input-field w-full text-sm" placeholder="शीर्षक (Title)" value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))} />
                        <textarea className="input-field w-full text-sm h-28 resize-none" placeholder="विस्तार से लिखें — फसल, समस्या, तरीका, अनुभव..." value={draft.body} onChange={e => setDraft(p => ({ ...p, body: e.target.value }))} />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowCompose(false)} className="btn-secondary px-4 py-2 text-sm rounded-xl">Cancel</button>
                            <button onClick={submitPost} className="btn-primary px-6 py-2 text-sm rounded-xl">Post करें</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Search + Filter */}
            <div className="w-full max-w-4xl space-y-4">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-700" />
                        <input className="input-field pl-9 w-full text-sm" placeholder="Search posts..." value={query} onChange={e => setQuery(e.target.value)} />
                    </div>
                    <select className="input-field text-sm px-3" value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}>
                        <option value="newest">Newest</option>
                        <option value="trending">Trending</option>
                    </select>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setCategory(c)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${category === c ? "bg-violet-700/40 border-violet-600 text-violet-200" : "glass-card border-transparent text-green-600 hover:text-green-300"}`}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Posts */}
            <div className="w-full max-w-4xl space-y-4">
                {filtered.map(p => (
                    <div key={p.id} className="glass-card border border-transparent hover:border-violet-900/20 transition-all">
                        <div className="p-5">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-2xl">{p.avatar}</span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-white font-black text-sm">{p.author}</span>
                                        <span className="text-green-800 text-xs flex items-center gap-1"><MapPin size={9} /> {p.location}</span>
                                        <span className="text-green-900 text-xs flex items-center gap-1"><Clock size={9} /> {p.time}</span>
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${CAT_COLORS[p.category] || "text-green-600 bg-green-900/20 border-green-800/30"}`}>{p.category}</span>
                                </div>
                            </div>
                            <h3 className="text-white font-black mb-2">{p.title}</h3>
                            <p className={`text-green-400 text-sm leading-relaxed ${expandedPost === p.id ? "" : "line-clamp-3"}`}>{p.body}</p>
                            {p.body.length > 200 && (
                                <button onClick={() => setExpandedPost(n => n === p.id ? null : p.id)} className="text-violet-500 text-xs mt-1 font-bold">
                                    {expandedPost === p.id ? "▲ Less" : "▼ Read more"}
                                </button>
                            )}
                            {p.tags.length > 0 && (
                                <div className="flex gap-1.5 flex-wrap mt-3">
                                    {p.tags.map(t => <span key={t} className="text-violet-600 text-[10px] bg-violet-900/10 border border-violet-900/20 px-2 py-0.5 rounded-full">#{t}</span>)}
                                </div>
                            )}
                        </div>
                        <div className="border-t border-violet-900/10 px-5 py-3 flex items-center gap-4">
                            <button onClick={() => toggleLike(p.id)} className={`flex items-center gap-1.5 text-sm font-bold transition ${p.likedByMe ? "text-rose-400" : "text-green-700 hover:text-rose-400"}`}>
                                <Heart size={14} className={p.likedByMe ? "fill-rose-400" : ""} /> {p.likes}
                            </button>
                            <button onClick={() => setExpandedPost(n => n === p.id ? null : p.id)} className="flex items-center gap-1.5 text-sm font-bold text-green-700 hover:text-violet-400 transition">
                                <MessageSquare size={14} /> {p.comments}
                            </button>
                            <button className="flex items-center gap-1.5 text-sm font-bold text-green-700 hover:text-green-400 transition ml-auto">
                                <Share2 size={14} /> Share
                            </button>
                        </div>
                        {/* Comments */}
                        {expandedPost === p.id && MOCK_COMMENTS[p.id] && (
                            <div className="border-t border-violet-900/10 p-5 space-y-3">
                                {MOCK_COMMENTS[p.id].map((c, i) => (
                                    <div key={i} className="glass-card p-4 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span>{c.avatar}</span>
                                            <span className="text-white font-black text-sm">{c.author}</span>
                                            <span className="text-green-900 text-xs"><Clock size={9} className="inline mr-1" />{c.time}</span>
                                        </div>
                                        <p className="text-green-400 text-sm">{c.text}</p>
                                    </div>
                                ))}
                                <div className="flex gap-2">
                                    <input className="input-field flex-1 text-sm" placeholder="जवाब दें (Reply)..." />
                                    <button className="btn-secondary px-4 py-2 text-sm rounded-xl">Post</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
