"use client";
import { useState } from "react";
import { BarChart2, TrendingUp, Loader2 } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

export default function YieldPredictorPage() {
    const [crop, setCrop] = useState("Wheat");
    const [area, setArea] = useState(2);
    const [soil, setSoil] = useState("Medium");
    const [irrigation, setIrrigation] = useState("Canal");
    const [variety, setVariety] = useState("HD-2967 (Improved)");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const predict = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        const baseYield = crop === "Wheat" ? 3.5 : crop === "Rice" ? 4.2 : crop === "Maize" ? 5.0 : 3.0;
        const soilMulti = soil === "High" ? 1.2 : soil === "Medium" ? 1.0 : 0.8;
        const irrMulti = irrigation === "Drip" ? 1.15 : irrigation === "Canal" ? 1.0 : 0.85;
        const varMulti = variety.includes("Improved") ? 1.1 : 1.0;
        const yieldPerHa = baseYield * soilMulti * irrMulti * varMulti;
        const totalYield = yieldPerHa * area * 0.405;
        setResult({
            estimatedYield: totalYield.toFixed(1),
            yieldPerAcre: (yieldPerHa * 0.405).toFixed(2),
            revenue: Math.round(totalYield * 2200),
            confidence: "78%",
        });
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center gap-16 md:gap-24 pb-32 px-4 w-full">
            <div className="flex flex-col items-center text-center gap-10 w-full max-w-4xl">
                <div className="flex flex-col items-center gap-8">
                    <ExploreButton />
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-2xl shadow-violet-950/40">
                        <BarChart2 size={48} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">Yield Predictor</h1>
                        <p className="text-violet-400 font-black uppercase tracking-[0.5em] text-sm md:text-lg">AI-Powered Production Estimates</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="glass-card p-10 space-y-8">
                    <h2 className="text-xl text-white font-black tracking-tight">Farm Details</h2>
                    <div>
                        <label className="text-green-600 text-sm block mb-1">Crop</label>
                        <select className="input-field" value={crop} onChange={e => setCrop(e.target.value)}>
                            {["Wheat", "Rice", "Maize", "Soybean", "Cotton", "Mustard", "Chickpea"].map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-green-600 text-sm block mb-1">Area (acres)</label>
                        <input type="number" className="input-field" value={area} min={0.5} step={0.5} onChange={e => setArea(+e.target.value)} />
                    </div>
                    <div>
                        <label className="text-green-600 text-sm block mb-1">Soil Fertility</label>
                        <select className="input-field" value={soil} onChange={e => setSoil(e.target.value)}>
                            <option>High</option><option>Medium</option><option>Low</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-green-600 text-sm block mb-1">Irrigation Type</label>
                        <select className="input-field" value={irrigation} onChange={e => setIrrigation(e.target.value)}>
                            <option>Drip</option><option>Canal</option><option>Rainfed</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-green-600 text-sm block mb-1">Crop Variety</label>
                        <select className="input-field" value={variety} onChange={e => setVariety(e.target.value)}>
                            <option>HD-2967 (Improved)</option><option>Local Variety</option><option>Hybrid</option>
                        </select>
                    </div>
                    <button onClick={predict} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                        {loading ? <><Loader2 size={16} className="animate-spin" />Predicting...</> : "🤖 Predict Yield"}
                    </button>
                </div>

                <div className="glass-card p-10 space-y-8">
                    <h2 className="text-xl text-white font-black tracking-tight">Yield Prediction Result</h2>
                    {!result ? <div className="h-64 flex items-center justify-center text-green-800 text-sm">Fill form and click Predict Yield</div> : (
                        <div className="space-y-4">
                            <div className="bg-violet-900/10 rounded-xl p-10 border border-violet-800/20 text-center">
                                <p className="text-violet-400 text-sm font-bold uppercase tracking-widest mb-2">Expected Yield</p>
                                <p className="text-5xl font-black text-white">{result.estimatedYield} <span className="text-2xl text-violet-400">quintal</span></p>
                                <p className="text-violet-600 text-xs font-bold mt-2">{result.yieldPerAcre} quintal/acre</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="stat-card text-center">
                                    <p className="text-xs text-green-600 mb-1">Est. Revenue</p>
                                    <p className="text-green-400 font-black text-lg">₹{result.revenue.toLocaleString()}</p>
                                </div>
                                <div className="stat-card text-center">
                                    <p className="text-xs text-green-600 mb-1">Confidence</p>
                                    <p className="text-blue-400 font-black text-lg">{result.confidence}</p>
                                </div>
                            </div>
                            <div className="bg-green-900/20 rounded-xl p-4">
                                <p className="text-green-400 text-xs font-semibold mb-2">💡 Tips to Increase Yield</p>
                                <ul className="text-green-600 text-xs space-y-1">
                                    <li>• Switch to drip irrigation for +15% yield</li>
                                    <li>• Apply recommended fertilizer doses on time</li>
                                    <li>• Scout for pests weekly during critical growth stages</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
