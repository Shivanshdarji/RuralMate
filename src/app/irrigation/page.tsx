"use client";
import { useState } from "react";
import { Droplets, Calculator } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

const cropWater: Record<string, { daily: number; interval: string; method: string; season: string }> = {
    "Wheat": { daily: 40, interval: "Every 10-12 days", method: "Flood / Sprinkler", season: "Rabi (Nov-Mar)" },
    "Rice": { daily: 100, interval: "Maintain 5cm standing water", method: "Flood", season: "Kharif (Jun-Sep)" },
    "Cotton": { daily: 60, interval: "Every 10-15 days", method: "Furrow / Drip", season: "Kharif" },
    "Sugarcane": { daily: 80, interval: "Every 7-10 days", method: "Furrow / Drip", season: "Year round" },
    "Tomato": { daily: 45, interval: "Every 3-4 days", method: "Drip / Sprinkler", season: "All seasons" },
    "Potato": { daily: 50, interval: "Every 5-7 days", method: "Sprinkler / Drip", season: "Rabi" },
    "Maize": { daily: 55, interval: "Every 8-10 days", method: "Furrow / Drip", season: "Kharif" },
    "Soybean": { daily: 40, interval: "Every 7-10 days", method: "Sprinkler", season: "Kharif" },
};

export default function IrrigationPage() {
    const [crop, setCrop] = useState("Wheat");
    const [area, setArea] = useState(2);
    const [method, setMethod] = useState("Flood");
    const [showPlan, setShowPlan] = useState(false);

    const info = cropWater[crop];
    const dailyReq = info.daily * area * 40.47; // acre to m² × liters/m²/day (simplified)
    const efficiency = method === "Drip" ? 0.9 : method === "Sprinkler" ? 0.75 : 0.55;
    const actualWater = (dailyReq / efficiency).toFixed(0);

    return (
        <div className="flex flex-col items-center gap-16 md:gap-24 pb-32 px-4 w-full">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-10 w-full max-w-4xl">
                <div className="flex flex-col items-center gap-8">
                    <ExploreButton />
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-950/40">
                        <Droplets size={48} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">Smart Irrigation</h1>
                        <p className="text-blue-400 font-black uppercase tracking-[0.5em] text-sm md:text-lg">Water Requirement Calculator</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 space-y-4">
                    <h2 className="text-white font-bold">Plan My Irrigation</h2>
                    <div>
                        <label className="text-green-600 text-sm block mb-1">Crop</label>
                        <select className="input-field" value={crop} onChange={e => setCrop(e.target.value)}>
                            {Object.keys(cropWater).map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-green-600 text-sm block mb-1">Area (acres)</label>
                        <input type="number" className="input-field" value={area} min={0.5} step={0.5} onChange={e => setArea(+e.target.value)} />
                    </div>
                    <div>
                        <label className="text-green-600 text-sm block mb-1">Irrigation Method</label>
                        <select className="input-field" value={method} onChange={e => setMethod(e.target.value)}>
                            <option>Flood</option>
                            <option>Furrow</option>
                            <option>Sprinkler</option>
                            <option>Drip</option>
                        </select>
                    </div>
                    <button onClick={() => setShowPlan(true)} className="btn-primary w-full flex items-center justify-center gap-2">
                        <Calculator size={16} /> Generate Schedule
                    </button>
                </div>

                <div className="glass-card p-6 space-y-4">
                    <h2 className="text-white font-bold">Irrigation Recommendation</h2>
                    <div className="space-y-3">
                        {Object.entries({
                            "Crop Season": info.season,
                            "Irrigation Interval": info.interval,
                            "Recommended Method": info.method,
                            "Efficiency": `${(efficiency * 100).toFixed(0)}% (${method})`,
                        }).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between py-2 border-b border-green-900/30 last:border-0">
                                <span className="text-green-600 text-sm">{key}</span>
                                <span className="text-white text-sm font-medium">{value}</span>
                            </div>
                        ))}
                    </div>
                    {showPlan && (
                        <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4 space-y-2">
                            <p className="text-blue-300 font-semibold text-sm">💧 Daily Water Requirement</p>
                            <p className="text-3xl font-black text-white">{Number(actualWater).toLocaleString()} L</p>
                            <p className="text-blue-400 text-xs">for {area} acre {crop} using {method} irrigation</p>
                            <p className="text-green-400 text-xs mt-2">💡 Save {((1 - efficiency) * 100 * 0.5).toFixed(0)}% water by switching to Drip Irrigation</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Water saving tips */}
            <div className="glass-card p-6">
                <h2 className="text-white font-bold mb-4">💡 Water Conservation Tips</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { tip: "Use drip irrigation — saves 50-70% water vs flood", icon: "💧" },
                        { tip: "Irrigate in evening or early morning to reduce evaporation", icon: "🌅" },
                        { tip: "Mulching reduces soil evaporation by 30-40%", icon: "🍂" },
                        { tip: "Check soil moisture before irrigation — use finger test", icon: "👆" },
                        { tip: "Align irrigation with weather forecast — skip before rain", icon: "🌧️" },
                        { tip: "PM Kusum Yojana: 90% subsidy on solar irrigation pumps", icon: "☀️" },
                    ].map(({ tip, icon }) => (
                        <div key={tip} className="flex gap-3 p-3 bg-blue-900/10 rounded-xl border border-blue-900/20">
                            <span className="text-2xl">{icon}</span>
                            <p className="text-blue-200 text-xs leading-relaxed">{tip}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
