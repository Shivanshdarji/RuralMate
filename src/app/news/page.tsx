"use client";
import { useState } from "react";
import { Newspaper, Search, ExternalLink, RefreshCw, Clock, Tag, TrendingUp, AlertTriangle, Megaphone } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

// ─── Real Farming News (curated evergreen + current) ────────────────────────
const NEWS_ITEMS = [
    {
        id: 1, category: "MSP & Market", icon: "📊", tag: "LATEST",
        title: "Rabi MSP 2024-25: Wheat at ₹2,275/quintal — 5.1% hike",
        summary: "Cabinet approves ₹2,275/qtl for wheat, ₹2,320 for paddy (Grade A), ₹5,650 for mustard. Farmers with KCC can get 4% interest loan to hold stock and sell when prices rise.",
        source: "Ministry of Agriculture", date: "Feb 2025", link: "https://agricoop.nic.in",
        impact: "high", color: "from-green-700 to-emerald-600",
    },
    {
        id: 2, category: "Scheme", icon: "🏛️", tag: "ACTION NEEDED",
        title: "PM-KISAN 17th Installment: Verify Land Seeding before March 31",
        summary: "Crores of farmers may miss the 17th installment if land seeding (भूमि सत्यापन) is incomplete. Check pmkisan.gov.in → Beneficiary Status now. Call 155261 for help.",
        source: "PM-KISAN Portal", date: "Feb 2025", link: "https://pmkisan.gov.in",
        impact: "high", color: "from-purple-700 to-violet-600",
    },
    {
        id: 3, category: "Weather", icon: "🌦️", tag: "ALERT",
        title: "IMD: Above-normal temperatures likely in Feb–March across Central India",
        summary: "IMD forecasts above-normal max temperatures in MP, Maharashtra, Rajasthan. wheat farmers should plan 5th irrigation (grain filling) early. Monitor for heat stress signs — leaf rolling, early maturity.",
        source: "IMD / Skymet", date: "Feb 2025", link: "https://imd.gov.in",
        impact: "high", color: "from-red-700 to-orange-600",
    },
    {
        id: 4, category: "Pest Alert", icon: "🐛", tag: "WARNING",
        title: "Fall Army Worm spreading in Rabi maize — Karnataka, AP, Telangana",
        summary: "FAW (Spodoptera frugiperda) detected in southern maize belts. Watch for circular feeding holes in whorls. Spray Spinetoram 11.7 SC @ 100 ml/acre in morning. Pheromone traps at 5/acre.",
        source: "ICAR-NBPGR", date: "Feb 2025", link: "https://icar.org.in",
        impact: "high", color: "from-red-800 to-rose-700",
    },
    {
        id: 5, category: "Export Opportunity", icon: "✈️", tag: "OPPORTUNITY",
        title: "India's basmati rice exports touch $6.3 billion — highest ever",
        summary: "Basmati exports hit record high. Saudi Arabia, Iran, Iraq top buyers. Farmers in Punjab, Haryana, UP with Pusa 1121 or 1509 variety can register on APEDA portal for premium export prices.",
        source: "APEDA", date: "Jan 2025", link: "https://apeda.gov.in",
        impact: "medium", color: "from-blue-700 to-cyan-600",
    },
    {
        id: 6, category: "Technology", icon: "🚁", tag: "NEW",
        title: "Drone spraying subsidy: 40–50% for farmers under SMAM scheme",
        summary: "Government offering 40–50% subsidy on agricultural drones under SMAM. States like MP, UP already distributing drones to FPOs. Apply through state agriculture dept. Reduces labour cost 60%.",
        source: "DAC&FW", date: "Jan 2025", link: "https://agrimachinery.nic.in",
        impact: "medium", color: "from-teal-700 to-cyan-600",
    },
    {
        id: 7, category: "Finance", icon: "🏦", tag: "IMPORTANT",
        title: "KCC limit enhanced: Banks can now offer up to ₹3 lakh at 4% interest",
        summary: "RBI & NABARD circular: KCC (Kisan Credit Card) limit for crop loans now up to ₹3 lakh at 4% effective interest (7% minus 3% govt subvention). Milch animals also included under KCC now.",
        source: "RBI / NABARD", date: "Jan 2025", link: "https://nabard.org",
        impact: "medium", color: "from-yellow-700 to-amber-600",
    },
    {
        id: 8, category: "Market", icon: "📈", tag: "MARKET",
        title: "Onion prices stabilise at ₹1,800–2,200/quintal after govt intervention",
        summary: "After touching ₹4,000+/qtl in Nov, onion prices have stabilised. NAFED buffer stock being released. Farmers should sell immediately — monsoon imports will further reduce prices by April.",
        source: "NAFED / NHB", date: "Feb 2025", link: "https://nafed-india.com",
        impact: "medium", color: "from-rose-700 to-pink-600",
    },
    {
        id: 9, category: "Organic", icon: "🌿", tag: "SCHEME",
        title: "PKVY Scheme: ₹50,000/hectare support for organic farming certification",
        summary: "Paramparagat Krishi Vikas Yojana offers ₹50,000/ha over 3 years for organic farming. Includes input support, certification cost, and market linkage. Apply through state dept or PGS-India portal.",
        source: "MoA&FW", date: "Dec 2024", link: "https://pgsindia-ncof.gov.in",
        impact: "medium", color: "from-lime-700 to-green-600",
    },
    {
        id: 10, category: "Livestock", icon: "🐄", tag: "SCHEME",
        title: "NABARD Dairy Entrepreneurship Scheme: Up to ₹7 lakh loan at 33% subsidy",
        summary: "NABARD's DEDS scheme offers ₹7 lakh for 2 cross-bred cows with 33.33% (25% for others) back-end subsidy. For SC/ST farmers: 40% subsidy. Apply through nearest bank/NABARD district office.",
        source: "NABARD", date: "Dec 2024", link: "https://nabard.org",
        impact: "medium", color: "from-amber-700 to-orange-600",
    },
    {
        id: 11, category: "Water", icon: "💧", tag: "SCHEME",
        title: "PM Krishi Sinchayee Yojana: 90% subsidy on micro-irrigation in Maharashtra",
        summary: "Maharashtra offering 90% subsidy on drip/sprinkler for marginal farmers (< 1 ha). 55% for others. Apply through MahaDBT: mahadbt.maharashtra.gov.in. Limited slots — apply before June.",
        source: "State Agri Dept, MH", date: "Jan 2025", link: "https://mahadbt.maharashtra.gov.in",
        impact: "medium", color: "from-blue-700 to-sky-600",
    },
    {
        id: 12, category: "Research", icon: "🔬", tag: "NEW VARIETY",
        title: "ICAR releases HD-3388 wheat: Heat-tolerant, 20% higher yield than HD-2967",
        summary: "New wheat variety HD-3388 shows 20% higher yield under heat stress. Suited for late sowing (Dec) in UP, MP, Rajasthan. Seed being distributed through IARI and state seed corps.",
        source: "ICAR-IARI", date: "Nov 2024", link: "https://iari.res.in",
        impact: "medium", color: "from-indigo-700 to-purple-600",
    },
];

const CATEGORIES = ["All", "MSP & Market", "Scheme", "Weather", "Pest Alert", "Finance", "Technology", "Organic", "Livestock", "Market", "Research", "Water", "Export Opportunity"];
const IMPACT_COLORS = { high: "text-red-400 bg-red-900/20 border-red-800/30", medium: "text-yellow-400 bg-yellow-900/20 border-yellow-800/30", low: "text-green-400 bg-green-900/20 border-green-800/30" };
const TAG_COLORS: Record<string, string> = {
    "LATEST": "text-green-300 bg-green-900/30 border-green-700/40",
    "ACTION NEEDED": "text-red-300 bg-red-900/30 border-red-700/40",
    "ALERT": "text-orange-300 bg-orange-900/30 border-orange-700/40",
    "WARNING": "text-red-300 bg-red-900/30 border-red-700/40",
    "OPPORTUNITY": "text-blue-300 bg-blue-900/30 border-blue-700/40",
    "NEW": "text-purple-300 bg-purple-900/30 border-purple-700/40",
    "IMPORTANT": "text-yellow-300 bg-yellow-900/30 border-yellow-700/40",
    "MARKET": "text-teal-300 bg-teal-900/30 border-teal-700/40",
    "SCHEME": "text-violet-300 bg-violet-900/30 border-violet-700/40",
    "NEW VARIETY": "text-lime-300 bg-lime-900/30 border-lime-700/40",
};

export default function NewsPage() {
    const [category, setCategory] = useState("All");
    const [query, setQuery] = useState("");
    const [expanded, setExpanded] = useState<number | null>(null);

    const filtered = NEWS_ITEMS.filter(n =>
        (category === "All" || n.category === category) &&
        (n.title.toLowerCase().includes(query.toLowerCase()) || n.summary.toLowerCase().includes(query.toLowerCase()))
    );
    const highPriority = NEWS_ITEMS.filter(n => n.impact === "high");

    return (
        <div className="flex flex-col items-center gap-12 pb-20 px-4 w-full">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-8 w-full max-w-4xl pt-2">
                <ExploreButton />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-600 to-zinc-600 flex items-center justify-center shadow-2xl shadow-slate-950/40">
                    <Newspaper size={40} className="text-white" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-3">Kisan Samachar</h1>
                    <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-sm">MSP · Schemes · Weather · Market · Tech</p>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full">
                    {[
                        { label: "High Priority", value: highPriority.length.toString(), icon: "🔴" },
                        { label: "Total Stories", value: NEWS_ITEMS.length.toString(), icon: "📰" },
                        { label: "Topics", value: (CATEGORIES.length - 1).toString(), icon: "🏷️" },
                    ].map(s => (
                        <div key={s.label} className="glass-card p-4 text-center">
                            <p className="text-2xl mb-1">{s.icon}</p>
                            <p className="text-white font-black">{s.value}</p>
                            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action alerts */}
            <div className="w-full max-w-6xl space-y-3">
                <h2 className="text-white font-black text-base flex items-center gap-2"><AlertTriangle size={18} className="text-red-400" /> Action Required — High Priority</h2>
                {highPriority.map(n => (
                    <div key={n.id} className={`glass-card p-4 bg-gradient-to-r ${n.color}/10 border border-red-900/20 flex items-start gap-4`}>
                        <span className="text-2xl flex-shrink-0">{n.icon}</span>
                        <div className="flex-1">
                            <p className="text-white font-black text-sm">{n.title}</p>
                            <p className="text-green-500 text-xs mt-1 line-clamp-2">{n.summary}</p>
                        </div>
                        <a href={n.link} target="_blank" rel="noreferrer" className="text-green-600 hover:text-green-400 flex-shrink-0">
                            <ExternalLink size={16} />
                        </a>
                    </div>
                ))}
            </div>

            {/* Search + Filter */}
            <div className="w-full max-w-6xl space-y-4">
                <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input className="input-field pl-9 w-full text-sm" placeholder="Search news..." value={query} onChange={e => setQuery(e.target.value)} />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["All", "MSP & Market", "Scheme", "Weather", "Pest Alert", "Finance", "Technology", "Livestock", "Organic", "Research"].map(c => (
                        <button key={c} onClick={() => setCategory(c)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${category === c ? "bg-slate-700/40 border-slate-500 text-slate-200" : "glass-card border-transparent text-green-600 hover:text-green-300"}`}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* News grid */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map(n => (
                    <div key={n.id} className="glass-card flex flex-col hover:border-slate-700/30 border border-transparent transition-all">
                        <div className={`h-1 rounded-t-xl bg-gradient-to-r ${n.color}`} />
                        <div className="p-5 flex-1">
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${TAG_COLORS[n.tag] || "text-slate-400 bg-slate-900/30 border-slate-700/40"}`}>{n.tag}</span>
                                <span className="text-[10px] text-green-800 font-bold flex items-center gap-1"><Tag size={8} /> {n.category}</span>
                                <span className="text-[10px] text-green-900 flex items-center gap-1 ml-auto"><Clock size={8} /> {n.date}</span>
                            </div>
                            <h3 className="text-white font-black text-sm mb-2 leading-snug">{n.title}</h3>
                            <p className={`text-green-500 text-xs leading-relaxed ${expanded === n.id ? "" : "line-clamp-3"}`}>{n.summary}</p>
                            {n.summary.length > 150 && (
                                <button onClick={() => setExpanded(p => p === n.id ? null : n.id)} className="text-slate-500 text-xs mt-1 hover:text-slate-300 transition">
                                    {expanded === n.id ? "▲ Less" : "▼ Read more"}
                                </button>
                            )}
                        </div>
                        <div className="border-t border-slate-900/20 p-4 flex items-center justify-between">
                            <span className="text-green-800 text-xs">{n.source}</span>
                            <a href={n.link} target="_blank" rel="noreferrer"
                                className="btn-secondary px-3 py-2 text-xs rounded-xl flex items-center gap-1.5">
                                <ExternalLink size={11} /> Visit Source
                            </a>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-2 glass-card p-12 text-center text-green-800">
                        <Newspaper size={32} className="mx-auto mb-3 opacity-30" />
                        <p>No news found for this filter.</p>
                    </div>
                )}
            </div>

            <div className="glass-card p-4 max-w-6xl w-full bg-slate-900/20 border-slate-800/20 flex items-center gap-3 text-xs text-slate-600">
                <Megaphone size={14} className="flex-shrink-0" />
                News is curated from official government portals (ICAR, NABARD, IMD, MoA&FW). For real-time updates, subscribe to Kisan Suvidha app or call Kisan Call Centre: 1800-180-1551.
            </div>
        </div>
    );
}
