"use client";
import { TreePine, Leaf } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

export default function CarbonTrackerPage() {
    const ecoScore = 72;
    const practices = [
        { name: "Organic fertilizers used", points: 20, done: false },
        { name: "Crop residue composting", points: 15, done: true },
        { name: "Drip irrigation installed", points: 25, done: false },
        { name: "Zero tillage practice", points: 15, done: false },
        { name: "Cover crops grown", points: 10, done: true },
        { name: "No stubble burning", points: 15, done: true },
    ];
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <ExploreButton />
                    <div>
                        <h1 className="text-2xl font-bold text-white">🌳 Carbon Footprint Tracker</h1>
                        <p className="text-green-600 text-sm">Measure and reduce your farm&apos;s environmental impact · Earn eco-credits</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 text-center">
                    <p className="text-green-600 text-sm mb-2">Your Eco Score</p>
                    <div className="relative w-32 h-32 mx-auto mb-3">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(34,197,94,0.1)" strokeWidth="10" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="10"
                                strokeDasharray={`${ecoScore * 2.51} 251`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div><p className="text-3xl font-black text-white">{ecoScore}</p><p className="text-xs text-green-600">/ 100</p></div>
                        </div>
                    </div>
                    <p className="text-green-400 font-semibold">🌿 Good — Keep improving!</p>
                    <p className="text-green-700 text-xs mt-2">Complete more eco-practices to increase your score</p>
                </div>
                <div className="glass-card p-6 space-y-3">
                    <h2 className="text-white font-bold">Eco Practices Checklist</h2>
                    {practices.map(p => (
                        <div key={p.name} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${p.done ? "bg-green-500 border-green-500" : "border-green-800"}`}>
                                {p.done && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span className={`text-sm flex-1 ${p.done ? "line-through text-green-700" : "text-green-200"}`}>{p.name}</span>
                            <span className={`text-xs font-bold ${p.done ? "text-green-500" : "text-green-800"}`}>+{p.points}pts</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="glass-card p-5 bg-green-900/10">
                <h3 className="text-white font-bold mb-3">💡 Quick Wins to Reduce Carbon</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    {["Stop stubble burning — use as mulch instead", "Plant 10 trees on field boundaries", "Switch to organic compost — reduces N₂O emissions"].map(tip => (
                        <div key={tip} className="flex gap-2 p-3 bg-green-900/20 rounded-xl"><span>🌱</span><p className="text-green-400 text-xs">{tip}</p></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
