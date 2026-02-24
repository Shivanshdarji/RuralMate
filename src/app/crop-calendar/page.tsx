"use client";
import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Info, Plus, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface CropData {
    sow: number[];
    harvest: number[];
    color: string;
    icon: string;
    zone: string;
    season: "Rabi" | "Kharif" | "Zaid" | "Perennial";
    description: string;
}

const crops: Record<string, CropData> = {
    "Wheat": { sow: [10, 11], harvest: [3, 4], color: "bg-amber-600", icon: "🌾", zone: "North, Central India", season: "Rabi", description: "Main winter staple. Requires cool climate and periodic irrigation." },
    "Rice (Paddy)": { sow: [5, 6, 7], harvest: [10, 11, 12], color: "bg-green-600", icon: "🍚", zone: "All India", season: "Kharif", description: "Water-intensive summer crop. Sown with monsoon arrival." },
    "Mustard": { sow: [9, 10], harvest: [2, 3], color: "bg-yellow-500", icon: "🌻", zone: "North, Rajasthan", season: "Rabi", description: "Oilseed crop. Thrives in dry, cool weather during maturity." },
    "Chickpea": { sow: [10, 11], harvest: [2, 3], color: "bg-orange-500", icon: "🫘", zone: "Central, South India", season: "Rabi", description: "High protein pulse. Needs minimal water once established." },
    "Soybean": { sow: [6, 7], harvest: [10, 11], color: "bg-lime-600", icon: "🫘", zone: "MP, Maharashtra", season: "Kharif", description: "Major oilseed. Sensitive to water logging during early stages." },
    "Cotton": { sow: [4, 5, 6], harvest: [10, 11, 12], color: "bg-sky-500", icon: "🌿", zone: "Gujarat, Maharashtra", season: "Kharif", description: "Fiber crop. Requires long frost-free periods and moderate rain." },
    "Sugarcane": { sow: [1, 2, 3], harvest: [11, 12, 1], color: "bg-emerald-600", icon: "🎋", zone: "UP, Maharashtra", season: "Perennial", description: "Long-duration crop (10-12 months). High water and fertilizer demand." },
    "Maize": { sow: [6, 7], harvest: [9, 10], color: "bg-yellow-600", icon: "🌽", zone: "All India", season: "Kharif", description: "Versatile grain. Can be grown in all three seasons in South India." },
    "Moong (Green Gram)": { sow: [3, 4], harvest: [5, 6], color: "bg-green-500", icon: "🫛", zone: "Rajasthan, AP", season: "Zaid", description: "Short duration crop. Improves soil fertility through nitrogen fixation." },
    "Watermelon": { sow: [2, 3], harvest: [4, 5], color: "bg-red-600", icon: "🍉", zone: "Riverside plains", season: "Zaid", description: "Hot weather crop. Requires sandy soil and intensive irrigation." },
    "Tomato": { sow: [6, 7, 11, 12], harvest: [9, 10, 2, 3], color: "bg-red-500", icon: "🍅", zone: "All India", season: "Perennial", description: "Grown year-round with protected cultivation or specific hybrids." },
    "Onion": { sow: [10, 11], harvest: [2, 3, 4], color: "bg-purple-500", icon: "🧅", zone: "Maharashtra, MP", season: "Rabi", description: "Requires well-drained loamy soil and precise irrigation cycles." },
};

export default function CropCalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [userCrops, setUserCrops] = useState<string[]>([]);
    const [filterSeason, setFilterSeason] = useState<string>("All");

    useEffect(() => {
        const saved = localStorage.getItem("ruralmate_my_crops");
        if (saved) setUserCrops(JSON.parse(saved));
    }, []);

    const toggleCrop = (name: string) => {
        const updated = userCrops.includes(name)
            ? userCrops.filter(c => c !== name)
            : [...userCrops, name];
        setUserCrops(updated);
        localStorage.setItem("ruralmate_my_crops", JSON.stringify(updated));
    };

    const prev = () => setCurrentMonth(m => m === 0 ? 11 : m - 1);
    const next = () => setCurrentMonth(m => m === 11 ? 0 : m + 1);

    const currentMonthNum = currentMonth + 1;
    const filteredCrops = Object.entries(crops).filter(([, v]) => filterSeason === "All" || v.season === filterSeason);
    const sowingThisMonth = filteredCrops.filter(([, v]) => v.sow.includes(currentMonthNum));
    const harvestingThisMonth = filteredCrops.filter(([, v]) => v.harvest.includes(currentMonthNum));

    return (
        <div className="flex flex-col items-center gap-16 md:gap-24 pb-32 px-4 w-full">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-12 w-full max-w-4xl">
                <div className="flex flex-col items-center gap-8">
                    <ExploreButton />
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-4">📅 Regional Crop Calendar</h1>
                        <p className="text-green-500 font-black uppercase tracking-[0.5em] text-sm italic">Optimized for Indian Seasons</p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 p-2 bg-green-950/40 rounded-2xl border border-green-800/30">
                    {["All", "Rabi", "Kharif", "Zaid"].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterSeason(s)}
                            className={`px-8 py-3 rounded-xl text-sm font-black transition-all tracking-widest ${filterSeason === s ? "bg-green-600 text-white shadow-xl scale-110" : "text-green-700 hover:text-green-400"}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* My Active Crops Tracker */}
            {userCrops.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h2 className="text-white font-bold flex items-center gap-2 px-2">
                        <CheckCircle2 size={18} className="text-green-500" />
                        My Active Crops Tracker
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {userCrops.map(name => {
                            const data = crops[name];
                            const isSowing = data.sow.includes(currentMonthNum);
                            const isHarvesting = data.harvest.includes(currentMonthNum);
                            return (
                                <div key={name} className="glass-card p-5 group relative overflow-hidden rounded-lg">
                                    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 rotate-12 transition-transform group-hover:scale-110`}>
                                        <span className="text-7xl">{data.icon}</span>
                                    </div>
                                    <div className="flex justify-between items-start relative z-10">
                                        <span className="text-3xl">{data.icon}</span>
                                        <button onClick={() => toggleCrop(name)} className="p-2 text-red-500/40 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="mt-4 relative z-10">
                                        <h3 className="text-white font-bold">{name}</h3>
                                        <p className="text-green-700 text-[10px] font-bold uppercase tracking-wider">{data.season} Season</p>

                                        <div className="mt-4 space-y-2">
                                            {isSowing && <div className="flex items-center gap-2 text-xs text-green-400 font-bold bg-green-950/50 p-2 rounded-lg"><AlertTriangle size={12} /> Sowing Phase Now!</div>}
                                            {isHarvesting && <div className="flex items-center gap-2 text-xs text-yellow-400 font-bold bg-yellow-950/50 p-2 rounded-lg"><CheckCircle2 size={12} /> Ready to Harvest!</div>}
                                            {!isSowing && !isHarvesting && <div className="text-xs text-green-800 font-medium">Growth Phase...</div>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Calendar View */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Month Navigator */}
                    <div className="glass-card p-8">
                        <div className="flex items-center justify-between mb-8">
                            <button onClick={prev} className="p-3 glass-card rounded-lg text-green-400 hover:text-green-200 transition-all hover:scale-110 active:scale-95"><ChevronLeft size={24} /></button>
                            <div className="text-center">
                                <h2 className="text-4xl font-black text-white tracking-tight">{months[currentMonth]}</h2>
                                <p className="text-green-700 font-bold text-xs uppercase tracking-[0.4em] mt-1">Sowing & Harvest Tasks</p>
                            </div>
                            <button onClick={next} className="p-3 glass-card rounded-lg text-green-400 hover:text-green-200 transition-all hover:scale-110 active:scale-95"><ChevronRight size={24} /></button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <h3 className="text-green-400 font-black text-sm uppercase tracking-widest flex items-center gap-2 border-b border-green-900/40 pb-2">🌱 Sowing Period</h3>
                                {sowingThisMonth.length === 0 ? <p className="text-green-900 text-sm italic py-4">No major crops to sow this month</p> : (
                                    <div className="space-y-3">
                                        {sowingThisMonth.map(([name, data]) => (
                                            <div key={name} className="flex items-center gap-4 p-4 bg-green-900/10 rounded-lg border border-green-800/10 hover:border-green-600/30 transition-all group">
                                                <span className="text-2xl group-hover:scale-125 transition-transform">{data.icon}</span>
                                                <div className="flex-1">
                                                    <p className="text-white font-bold">{name}</p>
                                                    <p className="text-green-700 text-xs font-semibold">{data.zone}</p>
                                                </div>
                                                <button
                                                    onClick={() => toggleCrop(name)}
                                                    className={`p-2 rounded-xl border transition-all ${userCrops.includes(name) ? "bg-green-600 border-green-500 text-white" : "border-green-800/50 text-green-500 hover:bg-green-600/20"}`}
                                                >
                                                    {userCrops.includes(name) ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-yellow-400 font-black text-sm uppercase tracking-widest flex items-center gap-2 border-b border-yellow-900/40 pb-2">🌾 Harvest Period</h3>
                                {harvestingThisMonth.length === 0 ? <p className="text-green-900 text-sm italic py-4">No major crops to harvest this month</p> : (
                                    <div className="space-y-3">
                                        {harvestingThisMonth.map(([name, data]) => (
                                            <div key={name} className="flex items-center gap-4 p-4 bg-yellow-900/10 rounded-lg border border-yellow-800/10 hover:border-yellow-600/30 transition-all group">
                                                <span className="text-2xl group-hover:scale-125 transition-transform">{data.icon}</span>
                                                <div className="flex-1">
                                                    <p className="text-white font-bold">{name}</p>
                                                    <p className="text-yellow-700 text-xs font-semibold">{data.zone}</p>
                                                </div>
                                                <button
                                                    onClick={() => toggleCrop(name)}
                                                    className={`p-2 rounded-xl border transition-all ${userCrops.includes(name) ? "bg-green-600 border-green-500 text-white" : "border-yellow-800/50 text-yellow-500 hover:bg-yellow-600/20"}`}
                                                >
                                                    {userCrops.includes(name) ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Annual Visualizer Table */}
                    <div className="glass-card p-8 overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-white font-black text-xl">Full Annual Cycle</h2>
                            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-600 rounded-sm" /><span className="text-green-500">Sowing</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-sm" /><span className="text-yellow-500">Harvest</span></div>
                            </div>
                        </div>
                        <div className="overflow-x-auto pb-4">
                            <table className="w-full text-xs min-w-[700px]">
                                <thead>
                                    <tr>
                                        <th className="text-left text-green-500 py-4 pr-6 font-black uppercase tracking-widest">Crop</th>
                                        {months.map((m, i) => (
                                            <th key={m} className={`px-2 py-4 font-bold text-center ${i === currentMonth ? "text-green-400" : "text-green-800"}`}>
                                                {m.slice(0, 3)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(crops).map(([name, data]) => (
                                        <tr key={name} className="border-t border-green-900/20 hover:bg-green-900/5 transition-colors">
                                            <td className="py-4 pr-6 text-green-100 font-bold whitespace-nowrap">
                                                <span className="mr-3 filter drop-shadow-md">{data.icon}</span>{name}
                                            </td>
                                            {Array.from({ length: 12 }, (_, i) => {
                                                const m = i + 1;
                                                const isSow = data.sow.includes(m);
                                                const isHarvest = data.harvest.includes(m);
                                                return (
                                                    <td key={i} className={`px-1 py-4 text-center ${i === currentMonth ? "bg-green-400/5" : ""}`}>
                                                        <div className="h-4 w-full flex items-center justify-center">
                                                            {isSow && <div className="w-full h-full bg-green-600/80 rounded-sm border border-green-500 shadow-sm" />}
                                                            {isHarvest && <div className="w-full h-full bg-yellow-500/80 rounded-sm border border-yellow-400 shadow-sm" />}
                                                            {!isSow && !isHarvest && <div className="w-[2px] h-[2px] bg-green-900/40 rounded-full mx-auto" />}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Seasonal Insights Sidebar */}
                <div className="space-y-8">
                    <div className="glass-card p-6 border-l-4 border-green-600">
                        <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                            <Info size={18} className="text-green-500" />
                            Seasonal Guide
                        </h3>
                        <div className="space-y-6">
                            <div className="p-4 bg-green-900/20 rounded-lg border border-green-800/40">
                                <h4 className="text-green-500 font-bold text-sm mb-1">Rabi (Winter)</h4>
                                <p className="text-green-900 text-xs leading-relaxed">Sown Oct-Nov, Harvested Mar-Apr. wheat, barley, peas, gram and mustard.</p>
                            </div>
                            <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-800/40">
                                <h4 className="text-yellow-500 font-bold text-sm mb-1">Kharif (Monsoon)</h4>
                                <p className="text-yellow-900 text-xs leading-relaxed">Sown Jun-Jul, Harvested Sep-Oct. Rice, maize, jowar, bajra, pulses and cotton.</p>
                            </div>
                            <div className="p-4 bg-orange-900/20 rounded-lg border border-orange-800/40">
                                <h4 className="text-orange-500 font-bold text-sm mb-1">Zaid (Summer)</h4>
                                <p className="text-orange-900 text-xs leading-relaxed">Sown Mar-Apr, Harvested May-Jun. Watermelon, cucumber, vegetables and fodder.</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 bg-gradient-to-br from-green-950/40 to-[#0a1a0d]">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Calendar size={18} className="text-green-500" />
                            Indian Farm Tip
                        </h3>
                        <p className="text-green-600 text-sm leading-relaxed italic">
                            &quot;The window for Sowing Rabi crops in North India is closing by late November. Ensure soil moisture is optimal before the first frost.&quot;
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
