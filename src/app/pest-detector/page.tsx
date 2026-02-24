"use client";
import { useState, useRef } from "react";
import { Upload, Bug, Loader2, Camera, AlertTriangle, CheckCircle, Zap, Leaf, FlaskConical, ShieldCheck, PhoneCall } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

const commonPests = [
    { name: "Aphids", crop: "Multiple", icon: "🐛", severity: "Medium" },
    { name: "Brown Planthopper", crop: "Rice", icon: "🦗", severity: "High" },
    { name: "Whitefly", crop: "Cotton, Tomato", icon: "🦋", severity: "High" },
    { name: "Stem Borer", crop: "Paddy, Sugarcane", icon: "🐝", severity: "High" },
    { name: "Leaf Miner", crop: "Vegetables", icon: "🌿", severity: "Medium" },
    { name: "Bollworm", crop: "Cotton", icon: "🐛", severity: "High" },
];

interface PestResult {
    pest: string;
    confidence: string;
    severity: string;
    affectedCrop: string;
    symptoms: string;
    cause: string;
    treatment: {
        chemical: string;
        organic: string;
        preventive: string;
    };
    urgency: string;
    helpline: string;
    note?: string;
}

const severityColor: Record<string, string> = {
    Low: "text-green-400 bg-green-900/20 border-green-800/30",
    Medium: "text-yellow-400 bg-yellow-900/20 border-yellow-800/30",
    High: "text-orange-400 bg-orange-900/20 border-orange-800/30",
    Critical: "text-red-400 bg-red-900/20 border-red-800/30",
    Unknown: "text-gray-400 bg-gray-900/20 border-gray-800/30",
};

export default function PestDetectorPage() {
    const [image, setImage] = useState<string | null>(null);
    const [imageMime, setImageMime] = useState("image/jpeg");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PestResult | null>(null);
    const [isMock, setIsMock] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        setImageMime(file.type || "image/jpeg");
        const reader = new FileReader();
        reader.onload = e => setImage(e.target?.result as string);
        reader.readAsDataURL(file);
        setResult(null);
    };

    const analyzeImage = async () => {
        if (!image) return;
        setLoading(true);
        setResult(null);
        try {
            // Extract pure base64 from data URL
            const base64 = image.split(",")[1];

            const res = await fetch("/api/ai/vision", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageBase64: base64, mimeType: imageMime }),
            });
            const data = await res.json();
            setResult(data.result);
            setIsMock(data.usedMock || false);
        } catch {
            setResult({
                pest: "Network Error",
                confidence: "—",
                severity: "Unknown",
                affectedCrop: "—",
                symptoms: "Could not connect to the AI server. Please check your internet connection and try again.",
                cause: "Network failure",
                treatment: {
                    chemical: "Unable to retrieve — please try again",
                    organic: "Call Kisan Call Center: 1800-180-1551",
                    preventive: "Maintain crop hygiene and inspect regularly"
                },
                urgency: "Try again or describe symptoms to KisanAI Chat.",
                helpline: "Kisan Call Center: 1800-180-1551"
            });
        } finally {
            setLoading(false);
        }
    };

    const severityClass = result ? (severityColor[result.severity] || severityColor.Unknown) : "";

    return (
        <div className="flex flex-col items-center gap-16 md:gap-20 pb-32 px-4 w-full">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-10 w-full max-w-4xl">
                <div className="flex flex-col items-center gap-8">
                    <ExploreButton />
                    <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-700 to-orange-600 flex items-center justify-center shadow-2xl shadow-red-950/40 animate-pulse">
                            <Bug size={48} className="text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-[#0a1a0d] flex items-center justify-center">
                            <Zap size={14} className="text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">Pest Detector</h1>
                        <p className="text-red-500 font-black uppercase tracking-[0.5em] text-sm md:text-base">AI Vision · Real-Time Analysis</p>
                    </div>
                </div>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
                {/* Upload Panel */}
                <div className="glass-card p-8 space-y-6 border-red-900/20">
                    <h2 className="text-white font-black text-xl flex items-center gap-3">
                        <Camera size={22} className="text-red-400" /> Upload Crop Photo
                    </h2>

                    <div
                        onClick={() => fileRef.current?.click()}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                        className="border-2 border-dashed border-red-900/50 hover:border-red-600/70 rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center gap-4 bg-red-950/5 hover:bg-red-950/10 group"
                    >
                        {image ? (
                            <div className="relative">
                                <img src={image} alt="Crop" className="max-h-56 rounded-xl object-contain shadow-lg" />
                                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <p className="text-white font-bold text-sm">Click to change image</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-2xl bg-red-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Upload size={28} className="text-red-500" />
                                </div>
                                <div>
                                    <p className="text-green-300 font-bold">Drag & drop or click to upload</p>
                                    <p className="text-green-800 text-sm mt-1">JPG, PNG, WebP · Max 10MB</p>
                                </div>
                            </>
                        )}
                    </div>
                    <input type="file" ref={fileRef} hidden accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

                    <div className="flex gap-3">
                        {image && (
                            <button
                                onClick={analyzeImage}
                                disabled={loading}
                                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 py-4 text-base font-bold rounded-xl"
                            >
                                {loading
                                    ? <><Loader2 size={18} className="animate-spin" /> Analyzing Image...</>
                                    : <><Bug size={18} /> Detect Problem</>
                                }
                            </button>
                        )}
                        <button onClick={() => fileRef.current?.click()} className="btn-secondary flex items-center gap-2 px-5 rounded-xl">
                            <Camera size={16} /> {image ? "Change" : "Choose Photo"}
                        </button>
                    </div>

                    <div className="glass-card p-4 bg-yellow-900/10 border-yellow-800/20 rounded-xl">
                        <p className="text-yellow-400 text-xs font-bold flex items-center gap-2 mb-2">
                            <AlertTriangle size={13} /> Tips for Best Results
                        </p>
                        <ul className="text-yellow-600/80 text-xs space-y-1 list-disc list-inside">
                            <li>Take a close-up photo of the affected leaves or stem</li>
                            <li>Use outdoor daylight for best clarity</li>
                            <li>Include both healthy and affected parts in the same frame</li>
                            <li>Avoid blurry or very dark images</li>
                        </ul>
                    </div>
                </div>

                {/* Result Panel */}
                <div className="glass-card p-8 space-y-5 border-orange-900/20 min-h-[400px]">
                    <h2 className="text-white font-black text-xl flex items-center gap-3">
                        <Bug size={22} className="text-orange-400" /> AI Analysis Result
                    </h2>

                    {!result && !loading && (
                        <div className="h-64 flex flex-col items-center justify-center text-center gap-4">
                            <span className="text-6xl opacity-20">🔬</span>
                            <p className="text-green-800 font-medium">Upload a crop photo and click<br /><span className="text-green-600">"Detect Problem"</span> to get AI analysis</p>
                        </div>
                    )}

                    {loading && (
                        <div className="h-64 flex flex-col items-center justify-center gap-5">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-4 border-green-900/30 border-t-green-500 animate-spin" />
                                <Bug size={22} className="absolute inset-0 m-auto text-green-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-green-400 font-bold">Gemini Vision AI is analyzing your crop...</p>
                                <p className="text-green-800 text-sm mt-1">Identifying pests, diseases & deficiencies</p>
                            </div>
                        </div>
                    )}

                    {result && !loading && (
                        <div className="space-y-4">

                            {/* Key stats */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-orange-900/20 rounded-xl p-3 text-center border border-orange-800/30">
                                    <p className="text-xs text-orange-600 mb-1">Detected</p>
                                    <p className="text-orange-300 font-black text-sm leading-tight">{result.pest}</p>
                                </div>
                                <div className={`rounded-xl p-3 text-center border ${severityClass}`}>
                                    <p className="text-xs opacity-70 mb-1">Severity</p>
                                    <p className="font-black text-sm">{result.severity}</p>
                                </div>
                                <div className="bg-blue-900/20 rounded-xl p-3 text-center border border-blue-800/30">
                                    <p className="text-xs text-blue-600 mb-1">Confidence</p>
                                    <p className="text-blue-300 font-black text-sm">{result.confidence}</p>
                                </div>
                            </div>

                            {/* Crop & symptoms */}
                            <div className="bg-green-900/10 rounded-xl p-4 border border-green-900/20 space-y-2">
                                <p className="text-xs text-green-700 font-bold uppercase tracking-widest">Crop & Symptoms Observed</p>
                                <p className="text-green-300 text-sm"><span className="text-green-600 font-bold">Crop:</span> {result.affectedCrop}</p>
                                <p className="text-green-300 text-sm">{result.symptoms}</p>
                            </div>

                            {/* Treatment */}
                            <div className="space-y-2">
                                <p className="text-xs text-green-700 font-bold uppercase tracking-widest flex items-center gap-2"><FlaskConical size={12} /> Treatment Options</p>
                                <div className="bg-red-900/10 rounded-xl p-3 border border-red-900/20">
                                    <p className="text-xs text-red-500 font-bold mb-1 flex items-center gap-1"><Zap size={11} /> Chemical</p>
                                    <p className="text-red-200 text-xs">{result.treatment.chemical}</p>
                                </div>
                                <div className="bg-green-900/10 rounded-xl p-3 border border-green-900/20">
                                    <p className="text-xs text-green-500 font-bold mb-1 flex items-center gap-1"><Leaf size={11} /> Organic</p>
                                    <p className="text-green-200 text-xs">{result.treatment.organic}</p>
                                </div>
                                <div className="bg-blue-900/10 rounded-xl p-3 border border-blue-900/20">
                                    <p className="text-xs text-blue-500 font-bold mb-1 flex items-center gap-1"><ShieldCheck size={11} /> Preventive</p>
                                    <p className="text-blue-200 text-xs">{result.treatment.preventive}</p>
                                </div>
                            </div>

                            {/* Urgency + Helpline */}
                            <div className="bg-yellow-900/10 rounded-xl p-3 border border-yellow-800/30">
                                <p className="text-yellow-400 text-xs font-bold flex items-center gap-1 mb-1"><AlertTriangle size={12} /> Action Required</p>
                                <p className="text-yellow-200 text-xs">{result.urgency}</p>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button className="btn-primary text-sm flex-1 py-3 rounded-xl font-bold">🛒 Buy Treatment Online</button>
                                <button
                                    className="btn-secondary text-sm px-4 rounded-xl flex items-center gap-2 font-bold"
                                    onClick={() => { const u = new SpeechSynthesisUtterance(`${result.pest}. Severity: ${result.severity}. ${result.treatment.organic}`); u.lang = "hi-IN"; window.speechSynthesis.speak(u); }}
                                >
                                    🔊
                                </button>
                                <a href="tel:18001801551" className="btn-secondary text-sm px-4 rounded-xl flex items-center gap-2 font-bold">
                                    <PhoneCall size={14} />
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Common Pests Reference */}
            <div className="w-full max-w-6xl">
                <h2 className="text-white font-black text-xl mb-6 flex items-center gap-3">
                    <Bug size={20} className="text-orange-500" /> Common Pests This Season
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {commonPests.map(p => (
                        <div key={p.name} className="glass-card p-5 text-center hover:border-orange-600/40 hover:scale-105 transition-all duration-300 cursor-pointer group">
                            <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-300">{p.icon}</div>
                            <p className="text-white text-xs font-black mb-1">{p.name}</p>
                            <p className="text-green-700 text-xs mb-2">{p.crop}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.severity === "High" ? "bg-red-900/30 text-red-400 border border-red-800/30" : "bg-yellow-900/30 text-yellow-500 border border-yellow-800/30"}`}>
                                {p.severity}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
