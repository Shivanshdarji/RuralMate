"use client";
import { useState } from "react";
import { Leaf, TestTube, ChevronRight, Info } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

const soilNutrients = [
    { name: "Nitrogen (N)", range: "High: >280 | Medium: 140-280 | Low: <140 kg/ha", icon: "🔵", unit: "kg/ha" },
    { name: "Phosphorus (P)", range: "High: >25 | Medium: 11-25 | Low: <11 kg/ha", icon: "🟠", unit: "kg/ha" },
    { name: "Potassium (K)", range: "High: >280 | Medium: 110-280 | Low: <110 kg/ha", icon: "🟣", unit: "kg/ha" },
    { name: "pH Level", range: "Optimal: 6.0-7.5 | Acidic: <6 | Alkaline: >7.5", icon: "⚗️", unit: "" },
    { name: "Organic Carbon (%)", range: "High: >0.75% | Medium: 0.5-0.75% | Low: <0.5%", icon: "🟤", unit: "%" },
];

export default function SoilHealthPage() {
    const [values, setValues] = useState({ N: 180, P: 18, K: 200, pH: 6.8, OC: 0.6 });
    const [showResult, setShowResult] = useState(false);

    const getLevel = (nutrient: string, val: number) => {
        if (nutrient === "N") return val > 280 ? "High" : val > 140 ? "Medium" : "Low";
        if (nutrient === "P") return val > 25 ? "High" : val > 11 ? "Medium" : "Low";
        if (nutrient === "K") return val > 280 ? "High" : val > 110 ? "Medium" : "Low";
        if (nutrient === "pH") return val >= 6 && val <= 7.5 ? "Optimal" : val < 6 ? "Acidic" : "Alkaline";
        if (nutrient === "OC") return val > 0.75 ? "High" : val > 0.5 ? "Medium" : "Low";
        return "Unknown";
    };

    return (
        <div className="flex flex-col items-center gap-16 md:gap-24 pb-32 px-4 w-full">
            <div className="flex flex-col items-center text-center gap-10 w-full max-w-4xl">
                <div className="flex flex-col items-center gap-8">
                    <ExploreButton />
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-lime-600 to-green-500 flex items-center justify-center shadow-2xl shadow-green-950/40">
                        <Leaf size={40} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-4">Soil Health Hub</h1>
                        <p className="text-green-500 font-black uppercase tracking-[0.5em] text-sm italic">Analyze & Optimize Your Land</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 space-y-4">
                    <h2 className="text-white font-bold">Enter Soil Test Values</h2>
                    <p className="text-green-700 text-xs">Get your soil tested at nearest Krishi Vigyan Kendra (KVK) or soil health card center, then enter the values below.</p>
                    {[
                        { key: "N", label: "Nitrogen (N)", placeholder: "kg/ha", step: 10 },
                        { key: "P", label: "Phosphorus (P)", placeholder: "kg/ha", step: 1 },
                        { key: "K", label: "Potassium (K)", placeholder: "kg/ha", step: 10 },
                        { key: "pH", label: "pH Level", placeholder: "e.g. 6.8", step: 0.1 },
                        { key: "OC", label: "Organic Carbon (%)", placeholder: "e.g. 0.6", step: 0.05 },
                    ].map(f => (
                        <div key={f.key}>
                            <label className="text-green-600 text-sm block mb-1">{f.label}</label>
                            <input type="number" className="input-field" placeholder={f.placeholder} step={f.step}
                                value={(values as any)[f.key]}
                                onChange={e => setValues(v => ({ ...v, [f.key]: +e.target.value }))} />
                        </div>
                    ))}
                    <button onClick={() => setShowResult(true)} className="btn-primary w-full">🔬 Analyze Soil</button>
                </div>

                <div className="glass-card p-6 space-y-4">
                    <h2 className="text-white font-bold">Soil Analysis Report</h2>
                    {!showResult ? (
                        <div className="h-64 flex items-center justify-center text-green-800 text-sm text-center">Enter values and click Analyze Soil</div>
                    ) : (
                        <div className="space-y-3">
                            {[
                                { label: "Nitrogen", val: values.N, key: "N", max: 400 },
                                { label: "Phosphorus", val: values.P, key: "P", max: 50 },
                                { label: "Potassium", val: values.K, key: "K", max: 400 },
                            ].map(n => {
                                const level = getLevel(n.key, n.val);
                                return (
                                    <div key={n.label}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-green-300">{n.label}</span>
                                            <span className={`font-semibold ${level === "High" ? "text-orange-400" : level === "Medium" ? "text-yellow-400" : "text-red-400"}`}>{level} ({n.val})</span>
                                        </div>
                                        <div className="w-full bg-green-950 rounded-full h-3">
                                            <div className={`h-3 rounded-full ${level === "High" ? "bg-orange-500" : level === "Medium" ? "bg-yellow-500" : "bg-red-500"}`}
                                                style={{ width: `${Math.min(100, (n.val / n.max) * 100)}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="flex justify-between items-center py-2 border-t border-green-900/30 mt-2">
                                <span className="text-green-300 text-sm">Soil pH</span>
                                <span className={`font-bold text-sm ${getLevel("pH", values.pH) === "Optimal" ? "text-green-400" : "text-red-400"}`}>{values.pH} — {getLevel("pH", values.pH)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-t border-green-900/30">
                                <span className="text-green-300 text-sm">Organic Carbon</span>
                                <span className={`font-bold text-sm ${getLevel("OC", values.OC) !== "Low" ? "text-green-400" : "text-red-400"}`}>{values.OC}% — {getLevel("OC", values.OC)}</span>
                            </div>
                            {values.N < 140 || values.P < 11 || values.K < 110 || values.OC < 0.5 ? (
                                <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-xl p-4">
                                    <p className="text-yellow-300 font-semibold text-sm mb-2">⚠️ Deficiencies Detected</p>
                                    <ul className="text-yellow-500 text-xs space-y-1">
                                        {values.N < 140 && <li>• Low Nitrogen — Apply Urea at 60 kg/acre</li>}
                                        {values.P < 11 && <li>• Low Phosphorus — Apply DAP at 40 kg/acre</li>}
                                        {values.K < 110 && <li>• Low Potassium — Apply MOP at 25 kg/acre</li>}
                                        {values.OC < 0.5 && <li>• Low Organic Carbon — Add 5 tonnes compost/acre</li>}
                                    </ul>
                                </div>
                            ) : (
                                <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-4">
                                    <p className="text-green-300 font-semibold text-sm">✅ Soil is in good health!</p>
                                    <p className="text-green-600 text-xs">Continue with maintenance doses of fertilizers</p>
                                </div>
                            )}
                            <button className="btn-secondary w-full text-sm" onClick={() => { const u = new SpeechSynthesisUtterance("Your soil analysis is complete. " + (values.N < 140 ? "Nitrogen is low. Apply urea." : "Nitrogen is adequate.") + " Consult your local KVK for detailed guidance."); u.lang = "hi-IN"; window.speechSynthesis.speak(u); }}>🔊 Listen Report in Hindi</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
