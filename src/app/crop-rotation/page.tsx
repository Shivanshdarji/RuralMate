"use client";
import { useState } from "react";
import { RotateCcw, Loader2, Sprout, ChevronDown, ChevronUp } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

const rotationPlans = [
    {
        id: "classic",
        title: "Classic 3-Year Rotation",
        suitedFor: "General purpose — works for most North Indian farms",
        crops: [
            { year: "Year 1", kharif: "Rice", rabi: "Wheat", benefit: "Staple grain revenue" },
            { year: "Year 2", kharif: "Maize", rabi: "Mustard", benefit: "Breaks rice pest cycle" },
            { year: "Year 3", kharif: "Soybean (legume)", rabi: "Chickpea (legume)", benefit: "Fixes 80 kg N/ha — cuts fertilizer cost" },
        ],
        benefit: "Breaks pest cycles, improves soil N through legumes",
        icon: "🔄",
        savings: "₹4,500/acre/yr",
    },
    {
        id: "legume",
        title: "Legume-Forward Rotation",
        suitedFor: "Best for depleted or low-N soils",
        crops: [
            { year: "Season 1", kharif: "Cotton / Maize", rabi: "Chickpea / Lentil", benefit: "Cash crop + legume combo" },
            { year: "Season 2", kharif: "Rice", rabi: "Wheat", benefit: "Soil N utilized by cereals" },
            { year: "Season 3", kharif: "Groundnut", rabi: "Mustard", benefit: "Oilseed diversity + N fix" },
        ],
        benefit: "Legumes fix 50–80 kg N/ha — reduces fertilizer cost by 30%",
        icon: "🫘",
        savings: "₹6,200/acre/yr",
    },
    {
        id: "market",
        title: "High-Value Market Rotation",
        suitedFor: "Farmers near mandis seeking maximum profit",
        crops: [
            { year: "Season 1", kharif: "Vegetables (Tomato/Onion)", rabi: "Potato", benefit: "High mandi value crops" },
            { year: "Season 2", kharif: "Maize / Sorghum", rabi: "Wheat", benefit: "Field rest + cereal base" },
            { year: "Season 3", kharif: "Groundnut / Sesame", rabi: "Coriander / Fenugreek", benefit: "Spice & oilseed premium" },
        ],
        benefit: "Potential 2–3x higher income vs single-crop farming",
        icon: "💰",
        savings: "₹12,000/acre/yr",
    },
];

interface AIPlan {
    rotation: string[];
    reason: string;
    estimatedSavings: string;
    tips: string[];
}

export default function CropRotationPage() {
    const [expandedPlan, setExpandedPlan] = useState<string | null>("classic");
    const [currentCrop, setCurrentCrop] = useState("");
    const [soilType, setSoilType] = useState("");
    const [region, setRegion] = useState("");
    const [aiPlan, setAIPlan] = useState<AIPlan | null>(null);
    const [loading, setLoading] = useState(false);

    const getAIPlan = async () => {
        if (!currentCrop || !soilType) return;
        setLoading(true);
        setAIPlan(null);
        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: `You are an expert Indian agricultural advisor. Given: Current crop: "${currentCrop}", Soil type: "${soilType}", Region: "${region || "North India"}". 
Recommend a 3-year crop rotation plan. Respond ONLY with valid JSON in this format:
{"rotation":["Year 1 Kharif: X, Rabi: Y","Year 2 Kharif: A, Rabi: B","Year 3 Kharif: C, Rabi: D"],"reason":"2-sentence explanation","estimatedSavings":"₹X,XXX/acre/year","tips":["tip1","tip2","tip3"]}`,
                    history: [],
                }),
            });
            const data = await res.json();
            try {
                const jsonMatch = data.reply.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    setAIPlan(parsed);
                } else {
                    setAIPlan({
                        rotation: [
                            `Year 1: ${currentCrop} (Kharif) → Wheat/Mustard (Rabi)`,
                            "Year 2: Legume like Soybean/Chickpea to fix nitrogen",
                            "Year 3: Maize/Jowar for pest cycle break",
                        ],
                        reason: `For ${soilType} soils with ${currentCrop}, this rotation maximizes nitrogen fixation through legumes while breaking pest cycles. The 3-year cycle reduces input costs by 25–30%.`,
                        estimatedSavings: "₹4,000–6,000/acre/year",
                        tips: [
                            "Incorporate 5 tons/acre of FYM before each kharif season",
                            "Leave field fallow for 3–4 weeks between cycles",
                            "Test soil pH before next planting",
                        ],
                    });
                }
            } catch {
                setAIPlan(null);
            }
        } catch {
            setAIPlan(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-24 md:gap-32 pb-32 px-4 w-full">
            <div className="flex flex-col items-center text-center gap-10 w-full max-w-4xl">
                <div className="flex flex-col items-center gap-8">
                    <ExploreButton />
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-700 to-lime-500 flex items-center justify-center shadow-2xl shadow-green-950/40">
                        <RotateCcw size={40} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">Crop Rotation</h1>
                        <p className="text-green-500 font-black uppercase tracking-[0.5em] text-sm md:text-lg">Sustainable Yield Planning</p>
                    </div>
                </div>
            </div>

            {/* Why Rotate Banner */}
            <div className="glass-card p-5 bg-blue-900/10 border-blue-800/20">
                <h3 className="text-white font-semibold mb-3">Why Crop Rotation?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                    {[
                        { label: "Breaks pest & disease cycles", icon: "🐛" },
                        { label: "Improves soil organic matter", icon: "🌱" },
                        { label: "Reduces fertilizer costs 25–30%", icon: "💸" },
                        { label: "Higher overall yield per acre", icon: "📈" },
                    ].map(b => (
                        <div key={b.label} className="p-3 bg-blue-900/20 rounded-xl text-blue-300">
                            <p className="text-2xl mb-1">{b.icon}</p>
                            <p>{b.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rotation Plans */}
            <div className="space-y-4">
                <h2 className="text-white font-bold text-lg">📋 Recommended Rotation Plans</h2>
                {rotationPlans.map(plan => (
                    <div key={plan.id} className="glass-card overflow-hidden">
                        <button
                            className="w-full p-5 text-left flex items-center justify-between"
                            onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{plan.icon}</span>
                                <div>
                                    <p className="text-white font-bold">{plan.title}</p>
                                    <p className="text-green-600 text-xs">{plan.suitedFor}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-green-400 text-sm font-bold hidden sm:block">Saves {plan.savings}</span>
                                {expandedPlan === plan.id
                                    ? <ChevronUp size={16} className="text-green-500" />
                                    : <ChevronDown size={16} className="text-green-500" />}
                            </div>
                        </button>

                        {expandedPlan === plan.id && (
                            <div className="px-5 pb-5 space-y-4">
                                <p className="text-green-500 text-sm">💡 {plan.benefit}</p>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr>
                                                <th className="text-left text-green-600 pb-2 pr-4 text-xs">Period</th>
                                                <th className="text-left text-green-600 pb-2 pr-4 text-xs">Kharif (Jun–Oct)</th>
                                                <th className="text-left text-green-600 pb-2 pr-4 text-xs">Rabi (Nov–Mar)</th>
                                                <th className="text-left text-green-600 pb-2 text-xs">Key Benefit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {plan.crops.map(row => (
                                                <tr key={row.year} className="border-t border-green-900/30">
                                                    <td className="py-2.5 pr-4 text-green-400 font-medium text-xs">{row.year}</td>
                                                    <td className="py-2.5 pr-4 text-white text-xs">{row.kharif}</td>
                                                    <td className="py-2.5 pr-4 text-white text-xs">{row.rabi}</td>
                                                    <td className="py-2.5 text-green-600 text-xs">{row.benefit}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex gap-3">
                                    <button className="btn-primary text-sm flex-1">✅ Apply This Plan</button>
                                    <button className="btn-secondary text-sm px-4">📥 Download PDF</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* AI Recommendation */}
            <div className="glass-card p-6">
                <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                    <Sprout size={18} className="text-green-400" /> 🤖 Get Personalized AI Plan
                </h3>
                <p className="text-green-700 text-xs mb-4">Tell us about your farm and get a custom crop rotation plan powered by AI</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div>
                        <label className="text-green-600 text-xs block mb-1">Current / Last Crop *</label>
                        <select className="input-field text-sm w-full" value={currentCrop} onChange={e => setCurrentCrop(e.target.value)}>
                            <option value="">Select crop</option>
                            {["Wheat", "Rice", "Cotton", "Maize", "Soybean", "Sugarcane", "Groundnut", "Chickpea", "Onion", "Tomato"].map(c => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-green-600 text-xs block mb-1">Soil Type *</label>
                        <select className="input-field text-sm w-full" value={soilType} onChange={e => setSoilType(e.target.value)}>
                            <option value="">Select soil</option>
                            {["Sandy Loam", "Clay", "Black Cotton Soil", "Red Laterite", "Alluvial", "Sandy"].map(s => (
                                <option key={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-green-600 text-xs block mb-1">Your State</label>
                        <select className="input-field text-sm w-full" value={region} onChange={e => setRegion(e.target.value)}>
                            <option value="">Any / North India</option>
                            {["Madhya Pradesh", "Uttar Pradesh", "Rajasthan", "Punjab", "Haryana", "Maharashtra", "Gujarat", "Karnataka"].map(r => (
                                <option key={r}>{r}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={getAIPlan}
                    disabled={loading || !currentCrop || !soilType}
                    className="btn-primary text-sm w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Generating AI Plan...</> : "🌱 Get My Custom Rotation Plan"}
                </button>

                {aiPlan && (
                    <div className="mt-5 p-5 bg-green-900/20 border border-green-700/30 rounded-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-green-300 font-bold">✨ Your AI-Generated Plan</p>
                            <span className="badge-success">Estimated savings: {aiPlan.estimatedSavings}</span>
                        </div>
                        <div className="space-y-2">
                            {aiPlan.rotation.map((r, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-green-900/20 rounded-lg">
                                    <span className="w-6 h-6 rounded-full bg-green-700 text-white text-xs flex items-center justify-center flex-shrink-0">{i + 1}</span>
                                    <p className="text-green-200 text-sm">{r}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 bg-blue-900/20 rounded-lg">
                            <p className="text-blue-300 text-sm">📝 {aiPlan.reason}</p>
                        </div>
                        <div>
                            <p className="text-green-500 text-xs font-bold mb-2">PRO TIPS:</p>
                            <ul className="space-y-1">
                                {aiPlan.tips.map((tip, i) => (
                                    <li key={i} className="text-green-400 text-xs flex items-start gap-2">
                                        <span className="text-green-600">→</span> {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button className="btn-secondary text-sm w-full">📥 Save & Download This Plan</button>
                    </div>
                )}
            </div>
        </div>
    );
}
