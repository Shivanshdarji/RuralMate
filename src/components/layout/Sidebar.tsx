"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
    Home, Cloud, Brain, TrendingUp, Leaf, Calendar, Bug, Droplets,
    FlaskConical, BookOpen, DollarSign, MessageSquare, ShoppingBag,
    Newspaper, PawPrint, Wrench, Shield, BarChart2, Video, AlertTriangle,
    TestTube, Map, Repeat, Warehouse, Truck, Bell, TreePine,
    FileText, User, Settings, HeartPulse, HelpCircle, ChevronLeft, Menu, X, Sprout, ChevronDown,
    Search, Globe, LogOut
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useUser } from "@/context/UserContext";

const languages = [
    { code: "en", label: "English", short: "EN" },
    { code: "hi", label: "हिंदी", short: "HI" },
    { code: "mr", label: "मराठी", short: "MR" },
    { code: "pa", label: "ਪੰਜਾਬੀ", short: "PA" },
    { code: "te", label: "తెలుగు", short: "TE" },
];

const categories = [
    {
        title: "Agriculture & Crops",
        items: [
            { href: "/dashboard", label: "Dashboard", icon: BarChart2, color: "text-emerald-400" },
            { href: "/ai-advisor", label: "AI Crop Advisor", icon: Brain, color: "text-purple-400" },
            { href: "/soil-health", label: "Soil Health", icon: Leaf, color: "text-lime-400" },
            { href: "/pest-detector", label: "Pest Detector", icon: Bug, color: "text-red-400" },
            { href: "/irrigation", label: "Irrigation", icon: Droplets, color: "text-blue-400" },
            { href: "/fertilizer", label: "Fertilizer Calc", icon: FlaskConical, color: "text-teal-400" },
            { href: "/field-map", label: "Field Map", icon: Map, color: "text-green-500" },
            { href: "/crop-rotation", label: "Crop Rotation", icon: Repeat, color: "text-lime-500" },
        ]
    },
    {
        title: "Market & Economy",
        items: [
            { href: "/market-prices", label: "Market Prices", icon: TrendingUp, color: "text-yellow-400" },
            { href: "/schemes", label: "Gov. Schemes", icon: BookOpen, color: "text-indigo-400" },
            { href: "/finance", label: "Finance & Loans", icon: DollarSign, color: "text-green-300" },
            { href: "/marketplace", label: "Marketplace", icon: ShoppingBag, color: "text-amber-400" },
            { href: "/equipment-rental", label: "Equipment Rental", icon: Wrench, color: "text-gray-400" },
            { href: "/insurance", label: "Crop Insurance", icon: Shield, color: "text-blue-300" },
            { href: "/transport", label: "Transport", icon: Truck, color: "text-orange-300" },
        ]
    },
    {
        title: "Rural Living",
        items: [
            { href: "/weather", label: "Weather", icon: Cloud, color: "text-sky-400" },
            { href: "/health", label: "Health & Doctor", icon: HeartPulse, color: "text-red-400" },
            { href: "/community", label: "Community", icon: MessageSquare, color: "text-pink-400" },
            { href: "/learn", label: "E-Learning", icon: Video, color: "text-rose-400" },
            { href: "/news", label: "Agri News", icon: Newspaper, color: "text-cyan-400" },
            { href: "/livestock", label: "Livestock", icon: PawPrint, color: "text-brown-400" },
            { href: "/emergency", label: "Emergency / SOS", icon: AlertTriangle, color: "text-red-500" },
        ]
    },
    {
        title: "Account",
        items: [
            { href: "/profile", label: "Profile", icon: User, color: "text-green-300" },
            { href: "/settings", label: "Settings", icon: Settings, color: "text-gray-300" },
        ]
    }
];

export function Sidebar() {
    const pathname = usePathname();
    const { isOpen, setIsOpen } = useSidebar();
    const { data: session } = useSession();
    const [expandedCat, setExpandedCat] = useState<string | null>("Agriculture & Crops");
    const [lang, setLang] = useState("en");
    const [showLang, setShowLang] = useState(false);
    const [query, setQuery] = useState("");
    const { profile } = useUser();

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] transition-opacity duration-300 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? "open" : ""} flex flex-col h-full bg-[#0a1a0d]/95 backdrop-blur-2xl border-r border-green-900/30 shadow-2xl`}>
                {/* Logo & Close Button */}
                <div className="p-6 border-b border-green-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-green-900/40">
                            <Sprout size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tight">RuralMate</h1>
                            <p className="text-[10px] text-green-700 font-bold uppercase tracking-widest">Village Edition</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-xl text-green-700 hover:text-green-400 hover:bg-green-900/30"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 py-4 space-y-4 border-b border-green-900/40 bg-green-950/20">
                    {/* Search */}
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-700" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="w-full bg-green-950/20 border border-green-900/30 rounded-xl pl-9 pr-4 py-2 text-xs text-green-100 focus:border-green-600/50 outline-none transition"
                        />
                    </div>

                    {/* Language Switcher */}
                    <div className="relative">
                        <button
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-green-950/30 border border-green-900/30 text-xs text-green-400 hover:bg-green-900/30 transition"
                            onClick={() => setShowLang(!showLang)}
                        >
                            <div className="flex items-center gap-2">
                                <Globe size={14} />
                                <span className="font-bold">{languages.find(l => l.code === lang)?.label}</span>
                            </div>
                            <ChevronDown size={12} className={`transition-transform ${showLang ? "rotate-180" : ""}`} />
                        </button>
                        {showLang && (
                            <div className="absolute left-0 right-0 top-full mt-2 glass-card shadow-2xl rounded-xl overflow-hidden z-[60] p-1 bg-[#0a1a0d] border border-green-900/30">
                                {languages.map(l => (
                                    <button
                                        key={l.code}
                                        className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition ${lang === l.code ? "text-green-400 bg-green-900/30" : "text-green-200/70 hover:bg-green-900/10 hover:text-green-100"}`}
                                        onClick={() => { setLang(l.code); setShowLang(false); }}
                                    >
                                        <span className="font-semibold">{l.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                    {categories.map((cat) => (
                        <div key={cat.title}>
                            <button
                                onClick={() => setExpandedCat(expandedCat === cat.title ? null : cat.title)}
                                className="flex items-center justify-between w-full text-left px-2 mb-2 group"
                            >
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-800 group-hover:text-green-600 transition">
                                    {cat.title}
                                </span>
                                <ChevronDown
                                    size={12}
                                    className={`text-green-800 transition-transform ${expandedCat === cat.title ? "rotate-180" : ""}`}
                                />
                            </button>

                            <div className={`space-y-1 overflow-hidden transition-all duration-300 ${expandedCat === cat.title ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                                {cat.items.map(({ href, label, icon: Icon, color }) => {
                                    const isActive = pathname === href;
                                    return (
                                        <Link
                                            key={href}
                                            href={href}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-4 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group
                                                ${isActive ? "nav-active" : "text-green-200/50 hover:bg-green-900/30 hover:text-green-400"}`}
                                        >
                                            <Icon size={18} className={isActive ? "text-green-400" : color + " opacity-60 group-hover:opacity-100"} />
                                            <span>{label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom user card */}
                <div className="p-4 border-t border-green-900/40 bg-green-950/20">
                    <div className="flex items-center gap-3 glass-card p-3 bg-green-900/10 border-transparent">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-lime-400 flex items-center justify-center text-xs font-black text-black shrink-0">
                            {(profile?.name || session?.user?.name || "KJ").split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-green-200 truncate">{profile?.name || session?.user?.name || "Kisan Ji"}</p>
                            <p className="text-[9px] text-green-700 font-bold truncate">{profile?.village && profile?.state ? `${profile.village}, ${profile.state}` : "RuralMate Member"}</p>
                        </div>
                        {session?.user && (
                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="p-2 rounded-lg text-green-700 hover:text-red-400 hover:bg-red-900/10 transition"
                                title="Sign Out"
                            >
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
