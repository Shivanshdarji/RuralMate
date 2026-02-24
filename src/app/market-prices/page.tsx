"use client";
import { useState, useEffect, useCallback } from "react";
import {
    TrendingUp, TrendingDown, RefreshCw, Search, MapPin, Star,
    Bell, BarChart3, AlertCircle, CheckCircle2, Minus, Filter
} from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

const CATEGORIES = ["All", "Cereals", "Pulses", "Oilseeds", "Vegetables", "Fruits", "Spices", "Fibres"];

interface PriceItem {
    commodity: string;
    category: string;
    price: number;
    priceFormatted: string;
    msp: number | null;
    mspFormatted: string | null;
    aboveMSP: boolean | null;
    change: number;
    changeFormatted: string;
    changePct: string;
    positive: boolean;
    unit: string;
    mandi: string;
    state: string;
    icon: string;
    sparkline: number[];
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const w = 60, h = 24;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
    return (
        <svg width={w} height={h} className="opacity-70">
            <polyline points={points} fill="none" stroke={positive ? "#22c55e" : "#ef4444"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function MarketPricesPage() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [prices, setPrices] = useState<PriceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatedAt, setUpdatedAt] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [watchlist, setWatchlist] = useState<string[]>(["Wheat", "Onion", "Mustard (Rapeseed)"]);
    const [showWatchlist, setShowWatchlist] = useState(false);
    const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc" | "change">("default");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchPrices = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/market-prices");
            const data = await res.json();
            setPrices(data.prices || []);
            setUpdatedAt(new Date(data.updatedAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }));
            setCountdown(data.nextUpdateIn || 300);
        } catch {
            console.error("Failed to fetch prices");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPrices(); }, [fetchPrices]);

    useEffect(() => {
        const t = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 0), 1000);
        return () => clearInterval(t);
    }, []);

    const toggleWatchlist = (name: string) => {
        setWatchlist(w => w.includes(name) ? w.filter(x => x !== name) : [...w, name]);
    };

    let filtered = prices.filter(p =>
        (category === "All" || p.category === category) &&
        (!showWatchlist || watchlist.includes(p.commodity)) &&
        p.commodity.toLowerCase().includes(query.toLowerCase())
    );

    if (sortBy === "price_asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
    else if (sortBy === "change") filtered = [...filtered].sort((a, b) => b.change - a.change);

    const topGainers = [...prices].sort((a, b) => b.change - a.change).slice(0, 3);
    const topLosers = [...prices].sort((a, b) => a.change - b.change).slice(0, 3);

    return (
        <div className="flex flex-col items-center gap-14 pb-20 px-4 w-full">

            {/* Header */}
            <div className="flex flex-col items-center text-center gap-8 w-full max-w-4xl pt-2">
                <ExploreButton />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-950/40">
                    <BarChart3 size={40} className="text-white" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-3">Mandi Prices</h1>
                    <p className="text-blue-400 font-black uppercase tracking-[0.4em] text-sm">Live APMC · MSP Tracking · 30+ Commodities</p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                    <div className="glass-card px-4 py-2 text-green-400 text-xs font-bold flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${loading ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`} />
                        {loading ? "Updating..." : `Updated ${updatedAt}`}
                    </div>
                    <div className="glass-card px-4 py-2 text-blue-400 text-xs font-bold flex items-center gap-2">
                        🔄 Next update in {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}
                    </div>
                    <button onClick={fetchPrices} disabled={loading} className="btn-secondary px-4 py-2 text-xs flex items-center gap-2 rounded-xl disabled:opacity-50">
                        <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>
            </div>

            {/* Market Movers */}
            {prices.length > 0 && (
                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="glass-card p-5 border-green-900/20">
                        <h3 className="text-green-400 font-black text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                            <TrendingUp size={14} /> Top Gainers Today
                        </h3>
                        <div className="space-y-2">
                            {topGainers.map(p => (
                                <div key={p.commodity} className="flex items-center justify-between">
                                    <span className="text-white text-sm font-medium">{p.icon} {p.commodity}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-green-300 text-sm font-black">{p.priceFormatted}</span>
                                        <span className="text-green-500 text-xs bg-green-900/20 px-2 py-0.5 rounded-full font-bold">{p.changePct}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="glass-card p-5 border-red-900/20">
                        <h3 className="text-red-400 font-black text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                            <TrendingDown size={14} /> Top Losers Today
                        </h3>
                        <div className="space-y-2">
                            {topLosers.map(p => (
                                <div key={p.commodity} className="flex items-center justify-between">
                                    <span className="text-white text-sm font-medium">{p.icon} {p.commodity}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-red-300 text-sm font-black">{p.priceFormatted}</span>
                                        <span className="text-red-500 text-xs bg-red-900/20 px-2 py-0.5 rounded-full font-bold">{p.changePct}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="w-full max-w-6xl space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-700" />
                        <input className="input-field pl-9 w-full text-sm" placeholder="Search commodity..." value={query} onChange={e => setQuery(e.target.value)} />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowWatchlist(w => !w)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition border ${showWatchlist ? "bg-yellow-700/30 border-yellow-600 text-yellow-300" : "glass-card text-green-500 hover:text-green-300"}`}
                        >
                            <Star size={14} className={showWatchlist ? "fill-yellow-400 text-yellow-400" : ""} />
                            Watchlist ({watchlist.length})
                        </button>
                        <select className="input-field text-sm px-3 rounded-xl" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
                            <option value="default">Default order</option>
                            <option value="price_desc">Price: High → Low</option>
                            <option value="price_asc">Price: Low → High</option>
                            <option value="change">Biggest Change</option>
                        </select>
                    </div>
                </div>

                {/* Category tabs */}
                <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setCategory(c)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition border ${category === c ? "bg-blue-700/50 border-blue-600 text-blue-200" : "glass-card border-transparent text-green-600 hover:text-green-300"}`}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Table */}
            <div className="w-full max-w-6xl">
                {loading && prices.length === 0 ? (
                    <div className="glass-card p-16 flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-green-900/30 border-t-green-500 rounded-full animate-spin" />
                        <p className="text-green-600 font-medium">Fetching live mandi prices…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="glass-card p-12 text-center text-green-800">No commodities found for the selected filter.</div>
                ) : (
                    <div className="space-y-2">
                        {/* Header row */}
                        <div className="hidden md:grid grid-cols-[1fr_120px_100px_100px_80px_90px_80px] gap-3 px-4 py-2 text-green-800 text-xs font-bold uppercase tracking-widest">
                            <span>Commodity</span>
                            <span className="text-right">Price</span>
                            <span className="text-right">Change</span>
                            <span className="text-right">MSP</span>
                            <span className="text-center">Status</span>
                            <span className="text-center">7-Day</span>
                            <span className="text-center">Watch</span>
                        </div>

                        {filtered.map(p => (
                            <div key={p.commodity} className="glass-card hover:border-green-800/40 transition-all duration-200">
                                {/* Main row */}
                                <div
                                    className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_120px_100px_100px_80px_90px_80px] gap-3 px-4 py-4 cursor-pointer items-center"
                                    onClick={() => setExpandedId(expandedId === p.commodity ? null : p.commodity)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{p.icon}</span>
                                        <div>
                                            <p className="text-white font-bold text-sm">{p.commodity}</p>
                                            <p className="text-green-800 text-xs flex items-center gap-1">
                                                <MapPin size={9} /> {p.mandi} · {p.category}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-black text-sm">{p.priceFormatted}</p>
                                        <p className="text-green-700 text-[10px]">{p.unit}</p>
                                    </div>
                                    <div className={`text-right hidden md:block ${p.positive ? "text-green-400" : "text-red-400"}`}>
                                        <p className="font-bold text-sm flex items-center justify-end gap-1">
                                            {p.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                            {p.changeFormatted}
                                        </p>
                                        <p className="text-xs opacity-80">{p.changePct}</p>
                                    </div>
                                    <div className="text-right hidden md:block">
                                        <p className="text-green-600 text-sm">{p.mspFormatted || <span className="text-green-900">—</span>}</p>
                                        <p className="text-green-900 text-[10px]">MSP</p>
                                    </div>
                                    <div className="hidden md:flex justify-center">
                                        {p.aboveMSP === true && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-900/20 px-2 py-0.5 rounded-full border border-green-800/30">
                                                <CheckCircle2 size={9} /> Above
                                            </span>
                                        )}
                                        {p.aboveMSP === false && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-900/20 px-2 py-0.5 rounded-full border border-red-800/30">
                                                <AlertCircle size={9} /> Below
                                            </span>
                                        )}
                                        {p.aboveMSP === null && (
                                            <span className="text-green-900 text-[10px]"><Minus size={11} /></span>
                                        )}
                                    </div>
                                    <div className="hidden md:flex justify-center">
                                        <Sparkline data={p.sparkline} positive={p.positive} />
                                    </div>
                                    <div className="hidden md:flex justify-center">
                                        <button
                                            onClick={e => { e.stopPropagation(); toggleWatchlist(p.commodity); }}
                                            className={`p-1.5 rounded-lg transition ${watchlist.includes(p.commodity) ? "text-yellow-400" : "text-green-900 hover:text-yellow-500"}`}
                                        >
                                            <Star size={14} className={watchlist.includes(p.commodity) ? "fill-yellow-400" : ""} />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded detail */}
                                {expandedId === p.commodity && (
                                    <div className="border-t border-green-900/30 px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-green-800 text-xs font-bold uppercase tracking-widest mb-1">Mandi</p>
                                            <p className="text-green-300 text-sm flex items-center gap-1"><MapPin size={11} /> {p.mandi}</p>
                                        </div>
                                        <div>
                                            <p className="text-green-800 text-xs font-bold uppercase tracking-widest mb-1">Today's Change</p>
                                            <p className={`text-sm font-black ${p.positive ? "text-green-400" : "text-red-400"}`}>{p.changeFormatted} ({p.changePct})</p>
                                        </div>
                                        {p.msp && (
                                            <div>
                                                <p className="text-green-800 text-xs font-bold uppercase tracking-widest mb-1">MSP vs Market</p>
                                                <p className={`text-sm font-black ${p.aboveMSP ? "text-green-400" : "text-red-400"}`}>
                                                    {p.aboveMSP ? `+₹${(p.price - p.msp).toLocaleString("en-IN")} above MSP` : `₹${(p.msp - p.price).toLocaleString("en-IN")} below MSP`}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-green-800 text-xs font-bold uppercase tracking-widest mb-1">Best Time to Sell</p>
                                            <p className="text-yellow-400 text-sm font-bold">
                                                {p.positive ? "📈 Price Rising — Consider selling" : "📉 Price Falling — Wait for recovery"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <p className="text-green-900 text-xs text-center mt-4">
                    Prices are indicative mandi averages. Verify at agmarknet.gov.in before selling.
                </p>
            </div>
        </div>
    );
}
