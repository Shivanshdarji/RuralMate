"use client";
import { useState } from "react";
import { FlaskConical, Calculator } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

const cropDefaults: Record<string, { N: number; P: number; K: number }> = {
    "Wheat": { N: 120, P: 60, K: 40 },
    "Rice": { N: 100, P: 50, K: 50 },
    "Maize": { N: 150, P: 75, K: 40 },
    "Soybean": { N: 30, P: 80, K: 40 },
    "Cotton": { N: 120, P: 60, K: 60 },
    "Sugarcane": { N: 250, P: 85, K: 112 },
    "Tomato": { N: 180, P: 60, K: 80 },
    "Potato": { N: 150, P: 100, K: 100 },
    "Onion": { N: 100, P: 50, K: 50 },
    "Mustard": { N: 80, P: 40, K: 40 },
};

const fertilizers = [
    { name: "Urea", nutrient: "N", content: 46 },
    { name: "DAP", nutrient: "P", content: 46 },
    { name: "MOP", nutrient: "K", content: 60 },
    { name: "SSP", nutrient: "P", content: 16 },
    { name: "Ammonium Sulphate", nutrient: "N", content: 21 },
];

export default function FertilizerPage() {
    const [crop, setCrop] = useState("Wheat");
    const [area, setArea] = useState(1);
    const [soilN, setSoilN] = useState(50);
    const [soilP, setSoilP] = useState(40);
    const [soilK, setSoilK] = useState(60);
    const [showResult, setShowResult] = useState(false);

    const req = cropDefaults[crop] || { N: 100, P: 50, K: 50 };
    const needN = Math.max(0, req.N - soilN) * area;
    const needP = Math.max(0, req.P - soilP) * area;
    const needK = Math.max(0, req.K - soilK) * area;

    const ureaKg = ((needN / 46) * 100).toFixed(1);
    const dapKg = ((needP / 46) * 100).toFixed(1);
    const mopKg = ((needK / 60) * 100).toFixed(1);

    return (
        <div className="flex flex-col items-center gap-24 md:gap-32 pb-32 px-4 w-full">
            <div className="flex flex-col items-center text-center gap-10 w-full max-w-4xl">
                <div className="flex flex-col items-center gap-8">
                    <ExploreButton />
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-teal-950/40">
                        <FlaskConical size={40} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">Fertilizer Guide</h1>
                        <p className="text-teal-400 font-black uppercase tracking-[0.5em] text-sm md:text-lg">Precise Dosage Calculator</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Form */}
                <div className="glass-card p-6 space-y-5">
                    <h2 className="text-white font-bold">Field Information</h2>
                    <div>
                        <label className="text-green-600 text-sm block mb-1">Crop Type</label>
                        <select className="input-field" value={crop} onChange={e => setCrop(e.target.value)}>
                            {Object.keys(cropDefaults).map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-green-600 text-sm block mb-1">Field Area (in acres)</label>
                        <input type="number" className="input-field" value={area} min={0.5} step={0.5} onChange={e => setArea(+e.target.value)} />
                    </div>
                    <h3 className="text-green-400 font-medium text-sm">Existing Soil Nutrient Status (kg/ha)</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs text-green-700 block mb-1">Nitrogen (N)</label>
                            <input type="number" className="input-field text-sm" value={soilN} onChange={e => setSoilN(+e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs text-green-700 block mb-1">Phosphorus (P)</label>
                            <input type="number" className="input-field text-sm" value={soilP} onChange={e => setSoilP(+e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs text-green-700 block mb-1">Potassium (K)</label>
                            <input type="number" className="input-field text-sm" value={soilK} onChange={e => setSoilK(+e.target.value)} />
                        </div>
                    </div>
                    <button onClick={() => setShowResult(true)} className="btn-primary w-full flex items-center justify-center gap-2">
                        <Calculator size={16} /> Calculate Fertilizer Need
                    </button>
                </div>

                {/* Results */}
                <div className="glass-card p-6 space-y-4">
                    <h2 className="text-white font-bold">Recommended Fertilizers</h2>
                    {!showResult ? (
                        <div className="h-48 flex items-center justify-center text-green-800 text-center">
                            Fill the form and click Calculate to see recommendations
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                <div className="bg-green-900/20 rounded-xl p-4">
                                    <p className="text-xs text-green-600 mb-1">Additional Nutrients Needed for {area} acre {crop}</p>
                                    <div className="flex gap-4">
                                        <div className="text-center"><p className="text-blue-400 font-bold">{needN.toFixed(0)} kg</p><p className="text-xs text-green-700">N</p></div>
                                        <div className="text-center"><p className="text-orange-400 font-bold">{needP.toFixed(0)} kg</p><p className="text-xs text-green-700">P₂O₅</p></div>
                                        <div className="text-center"><p className="text-purple-400 font-bold">{needK.toFixed(0)} kg</p><p className="text-xs text-green-700">K₂O</p></div>
                                    </div>
                                </div>

                                {[
                                    { name: "Urea (46% N)", qty: ureaKg, purpose: "Nitrogen source", apply: "Split in 2-3 doses", icon: "🟦" },
                                    { name: "DAP (46% P)", qty: dapKg, purpose: "Phosphorus + Nitrogen", apply: "At sowing (basal)", icon: "🟧" },
                                    { name: "MOP / Potash (60% K)", qty: mopKg, purpose: "Potassium source", apply: "At sowing (basal)", icon: "🟪" },
                                ].map(f => (
                                    <div key={f.name} className="p-3 border border-green-900/40 rounded-xl">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-white font-medium text-sm">{f.icon} {f.name}</span>
                                            <span className="text-green-400 font-bold">{f.qty} kg</span>
                                        </div>
                                        <p className="text-green-700 text-xs">{f.purpose} · {f.apply}</p>
                                    </div>
                                ))}

                                <div className="p-3 bg-yellow-900/20 border border-yellow-800/30 rounded-xl">
                                    <p className="text-yellow-400 text-xs font-semibold mb-1">💡 Organic Alternative</p>
                                    <p className="text-yellow-600 text-xs">Compost/Vermicompost: 4-6 tonnes/acre · FYM: 10-15 cart-loads/acre</p>
                                </div>
                            </div>
                            <button className="btn-secondary w-full text-sm" onClick={() => { const u = new SpeechSynthesisUtterance(`Apply ${ureaKg} kg Urea, ${dapKg} kg DAP, and ${mopKg} kg MOP for your ${area} acre ${crop} field.`); u.lang = "hi-IN"; window.speechSynthesis.speak(u); }}>
                                🔊 Listen in Hindi
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="glass-card p-4">
                <p className="text-xs text-green-700">⚠️ These recommendations are based on general crop requirements and your soil input. For precise recommendations, get a Soil Health Card from your nearest KVK or agriculture department.</p>
            </div>
        </div>
    );
}
