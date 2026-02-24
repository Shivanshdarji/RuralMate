"use client";
import { useState } from "react";
import { Shield, Search, ChevronDown, ChevronUp, CheckCircle2, X, Phone, ExternalLink, AlertCircle, FileText, Clock, IndianRupee, Calculator } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

const TABS = ["Crop Insurance", "Livestock Insurance", "Equipment Insurance", "Health Insurance", "Life Insurance"];

const CROP_SCHEMES = [
    {
        id: "pmfby", name: "PM Fasal Bima Yojana (PMFBY)", icon: "🌾",
        color: "from-green-600 to-emerald-600",
        premium: { kharif: "2%", rabi: "1.5%", commercial: "5%" },
        coverage: "Full sum insured (Scale of Finance × Area)",
        covers: ["Natural calamity (flood, drought, storm, hailstorm)", "Pest & disease attacks", "Post-harvest losses (within 14 days on field)", "Prevented sowing / mid-season adversity"],
        doesNotCover: ["War, nuclear risks", "Willful destruction", "Theft"],
        cutoff: { kharif: "July 31", rabi: "December 31" },
        howToApply: "Apply through your bank (auto for KCC holders), PMFBY app, CSC center, or pmfby.gov.in",
        applyUrl: "https://pmfby.gov.in", helpline: "14447",
        benefit: "Govt pays 95%+ of actual premium. Farmer pays only 1.5–5%.",
        who: "All farmers in notified crop+area. Auto-enrolled if KCC holder.",
        documents: ["Aadhaar", "Land Khasra/Panji", "Bank passbook", "Sowing declaration (from Patwari)"],
    },
    {
        id: "rwbcis", name: "Restructured Weather Based Crop Insurance (RWBCIS)", icon: "🌧️",
        color: "from-blue-600 to-cyan-600",
        premium: { kharif: "2%", rabi: "1.5%", commercial: "5%" },
        coverage: "Payout linked to weather parameters (rainfall, temperature, humidity)",
        covers: ["Adverse rainfall (deficient or excess)", "High/low temperature", "High humidity (disease risk)", "Frost, heat stress"],
        doesNotCover: ["Flood without weather trigger", "Pest damage alone"],
        cutoff: { kharif: "July 31", rabi: "December 31" },
        howToApply: "Same as PMFBY — through bank or pmfby.gov.in",
        applyUrl: "https://pmfby.gov.in", helpline: "14447",
        benefit: "Fast payout — no crop cutting experiments needed. Based on weather station data.",
        who: "Notified crops in notified areas — same as PMFBY.",
        documents: ["Aadhaar", "Land records", "Bank passbook"],
    },
];

const LIVESTOCK_SCHEMES = [
    {
        name: "National Livestock Mission – Insurance", icon: "🐄",
        description: "Insurance for cattle, buffalo, sheep, goat, pigs, and poultry",
        premium: "3–4% of animal value per year. 50% subsidy for BPL/SC/ST farmers.",
        sum: "Up to ₹50,000 per animal (cattle/buffalo). Up to ₹5,000 per goat/sheep.",
        covers: ["Death due to accident, disease or natural calamity", "Permanent total disability", "Theft (covered by some companies)"],
        howToApply: "Apply through nearest bank branch or animal husbandry department",
        documents: ["Ear-tagged animal", "Vet certificate of health", "Photo of animal", "Bank passbook", "Aadhaar"],
        helpline: "1800-180-0101",
    },
];

const EQUIPMENT_SCHEMES = [
    {
        name: "Farm Equipment Insurance", icon: "🚜",
        description: "Insurance for tractors, power tillers, harvesters and other farm machinery",
        premium: "1–2% of equipment value per year (lower for new equipment)",
        sum: "IDV = Market value of equipment",
        covers: ["Accidental damage", "Theft", "Flood/fire damage", "Third-party liability (if tractor hits someone)"],
        howToApply: "Apply through United India Insurance, New India Assurance, Oriental Insurance or any bank",
        documents: ["RC Book", "Bank loan documents (if financed)", "Equipment photos", "Aadhaar"],
        helpline: "1800-22-4242",
    },
];

const HEALTH_SCHEMES = [
    {
        name: "Pradhan Mantri Jan Arogya Yojana (PM-JAY / Ayushman Bharat)", icon: "🏥",
        premium: "FREE — Govt pays 100% of premium",
        sum: "₹5 lakh per family per year (secondary + tertiary hospitalization)",
        covers: ["5 lakh+ medical procedures", "Pre-existing diseases covered from Day 1", "Cashless treatment at 26,000+ empaneled hospitals", "Medicine, diagnostic tests, pre/post-hospitalization"],
        howToApply: "Check eligibility at beneficiary.nha.gov.in or call helpline. Get card from CSC center.",
        documents: ["Aadhaar", "Family ration card"],
        helpline: "14555",
        applyUrl: "https://beneficiary.nha.gov.in",
        eligibility: "Families listed in SECC 2011 data (poor/deprived households). Most rural farming families qualify.",
    },
];

interface PremiumCalcResult {
    farmerPremium: number;
    govtSubsidy: number;
    sumInsured: number;
}

export default function InsurancePage() {
    const [tab, setTab] = useState("Crop Insurance");
    const [expandedCrop, setExpandedCrop] = useState<string | null>("pmfby");
    const [area, setArea] = useState(2);
    const [crop, setCrop] = useState("Wheat (Rabi)");
    const [finPerAcre, setFinPerAcre] = useState(25000);
    const [showCalc, setShowCalc] = useState(false);

    const premiumRate = crop.includes("Rabi") ? 0.015 : crop.includes("commercial") ? 0.05 : 0.02;
    const sumInsured = area * finPerAcre;
    const actualPremium = sumInsured * 0.12; // ~12% actual
    const farmerPremium = Math.round(sumInsured * premiumRate);
    const govtSubsidy = Math.round(actualPremium - farmerPremium);

    const TAB_ICONS: Record<string, string> = {
        "Crop Insurance": "🌾", "Livestock Insurance": "🐄",
        "Equipment Insurance": "🚜", "Health Insurance": "🏥", "Life Insurance": "🙏",
    };

    return (
        <div className="flex flex-col items-center gap-14 pb-20 px-4 w-full">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-8 w-full max-w-4xl pt-2">
                <ExploreButton />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-950/40">
                    <Shield size={40} className="text-white" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-3">Farm Insurance</h1>
                    <p className="text-blue-400 font-black uppercase tracking-[0.4em] text-sm">Crops · Livestock · Health · Equipment</p>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full">
                    {[
                        { label: "Crop Insurance", value: "1.5–2%", icon: "🌾", sub: "premium only" },
                        { label: "Health Cover", value: "₹5 Lakh", icon: "🏥", sub: "Ayushman Bharat" },
                        { label: "Govt Subsidy", value: "95%+", icon: "💰", sub: "on crop premium" },
                    ].map(s => (
                        <div key={s.label} className="glass-card p-4 text-center">
                            <p className="text-2xl mb-1">{s.icon}</p>
                            <p className="text-white font-black">{s.value}</p>
                            <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Premium Calculator */}
            <div className="w-full max-w-6xl">
                <button onClick={() => setShowCalc(c => !c)} className="glass-card w-full p-5 flex items-center justify-between hover:border-blue-800/30 border border-transparent transition">
                    <div className="flex items-center gap-3">
                        <Calculator size={20} className="text-blue-400" />
                        <div className="text-left">
                            <p className="text-white font-black">PMFBY Premium Calculator</p>
                            <p className="text-blue-600 text-xs">Estimate your crop insurance premium vs Govt subsidy</p>
                        </div>
                    </div>
                    {showCalc ? <ChevronUp size={18} className="text-blue-500" /> : <ChevronDown size={18} className="text-blue-500" />}
                </button>
                {showCalc && (
                    <div className="glass-card p-6 mt-2 border-blue-900/20 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2 block">Crop Season</label>
                                <select className="input-field w-full" value={crop} onChange={e => setCrop(e.target.value)}>
                                    <option>Wheat (Rabi)</option>
                                    <option>Paddy (Kharif)</option>
                                    <option>Mustard (Rabi)</option>
                                    <option>Cotton (Kharif)</option>
                                    <option>Sugarcane (commercial)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2 block">Area (Acres): {area}</label>
                                <input type="range" min="0.5" max="20" step="0.5" value={area} onChange={e => setArea(+e.target.value)} className="w-full accent-blue-500" />
                            </div>
                            <div>
                                <label className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2 block">Finance/Acre (₹): {finPerAcre.toLocaleString("en-IN")}</label>
                                <input type="range" min="10000" max="100000" step="1000" value={finPerAcre} onChange={e => setFinPerAcre(+e.target.value)} className="w-full accent-blue-500" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="glass-card p-4 text-center bg-blue-900/10">
                                <p className="text-blue-700 text-xs font-bold uppercase tracking-widest mb-1">Sum Insured</p>
                                <p className="text-white font-black text-xl">₹{sumInsured.toLocaleString("en-IN")}</p>
                            </div>
                            <div className="glass-card p-4 text-center bg-green-900/10">
                                <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-1">Your Premium ({(premiumRate * 100).toFixed(1)}%)</p>
                                <p className="text-green-400 font-black text-xl">₹{farmerPremium.toLocaleString("en-IN")}</p>
                            </div>
                            <div className="glass-card p-4 text-center bg-yellow-900/10">
                                <p className="text-yellow-700 text-xs font-bold uppercase tracking-widest mb-1">Govt Pays</p>
                                <p className="text-yellow-400 font-black text-xl">~₹{govtSubsidy.toLocaleString("en-IN")}</p>
                            </div>
                        </div>
                        <div className="text-xs text-blue-700">* Approximate calculation. Actual premium depends on district-level actuarial rates.</div>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="w-full max-w-6xl">
                <div className="flex gap-2 flex-wrap mb-8">
                    {TABS.map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`px-5 py-3 rounded-xl font-bold text-sm transition border ${tab === t ? "bg-blue-700/40 border-blue-600 text-blue-200" : "glass-card border-transparent text-green-600 hover:text-green-300"}`}>
                            {TAB_ICONS[t]} {t}
                        </button>
                    ))}
                </div>

                {/* Crop Insurance */}
                {tab === "Crop Insurance" && (
                    <div className="space-y-4">
                        <div className="glass-card p-4 bg-blue-900/10 border-blue-900/20 flex items-start gap-3">
                            <AlertCircle size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                            <p className="text-blue-300 text-sm">Apply before <strong>July 31 (Kharif)</strong> or <strong>December 31 (Rabi)</strong>. Loanee farmers are auto-enrolled. Non-loanee farmers must apply separately.</p>
                        </div>
                        {CROP_SCHEMES.map(s => (
                            <div key={s.id} className={`glass-card border transition-all ${expandedCrop === s.id ? "border-blue-700/40" : "border-transparent hover:border-blue-900/20"}`}>
                                <div className="flex items-start gap-4 p-5 cursor-pointer" onClick={() => setExpandedCrop(p => p === s.id ? null : s.id)}>
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl flex-shrink-0`}>{s.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-white font-black">{s.name}</h3>
                                            {expandedCrop === s.id ? <ChevronUp size={18} className="text-blue-600" /> : <ChevronDown size={18} className="text-blue-600" />}
                                        </div>
                                        <p className="text-green-400 font-bold text-sm mt-1">{s.benefit}</p>
                                        <div className="flex gap-3 mt-2 flex-wrap">
                                            <span className="text-blue-300 text-xs border border-blue-800/30 rounded-full px-3 py-0.5">Kharif: {s.premium.kharif}</span>
                                            <span className="text-blue-300 text-xs border border-blue-800/30 rounded-full px-3 py-0.5">Rabi: {s.premium.rabi}</span>
                                            <span className="text-yellow-400 text-xs border border-yellow-800/30 rounded-full px-3 py-0.5">📅 Kharif cutoff: {s.cutoff.kharif}</span>
                                        </div>
                                    </div>
                                </div>
                                {expandedCrop === s.id && (
                                    <div className="border-t border-blue-900/30 p-5 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-green-900/10 rounded-xl p-4 border border-green-900/20">
                                                <h4 className="text-green-400 font-black text-xs uppercase tracking-widest mb-2">✅ What&apos;s Covered</h4>
                                                <ul className="space-y-1">
                                                    {s.covers.map(c => <li key={c} className="text-green-200 text-xs flex items-start gap-2"><CheckCircle2 size={10} className="text-green-500 mt-0.5 flex-shrink-0" />{c}</li>)}
                                                </ul>
                                            </div>
                                            <div className="bg-red-900/10 rounded-xl p-4 border border-red-900/20">
                                                <h4 className="text-red-400 font-black text-xs uppercase tracking-widest mb-2">❌ Not Covered</h4>
                                                <ul className="space-y-1">
                                                    {s.doesNotCover.map(c => <li key={c} className="text-red-200 text-xs flex items-start gap-2"><X size={10} className="text-red-500 mt-0.5 flex-shrink-0" />{c}</li>)}
                                                </ul>
                                            </div>
                                            <div className="bg-yellow-900/10 rounded-xl p-4 border border-yellow-900/20">
                                                <h4 className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-2">📋 Documents</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {s.documents.map(d => <span key={d} className="text-yellow-300 text-xs bg-yellow-900/20 px-2 py-1 rounded-lg border border-yellow-800/30">{d}</span>)}
                                                </div>
                                            </div>
                                            <div className="bg-purple-900/10 rounded-xl p-4 border border-purple-900/20">
                                                <h4 className="text-purple-400 font-black text-xs uppercase tracking-widest mb-2">👥 Who Can Apply</h4>
                                                <p className="text-purple-200 text-sm">{s.who}</p>
                                            </div>
                                        </div>
                                        <p className="text-green-300 text-sm">{s.howToApply}</p>
                                        <div className="flex gap-3 flex-wrap">
                                            <a href={s.applyUrl} target="_blank" rel="noreferrer" className="btn-primary px-5 py-3 flex items-center gap-2 text-sm rounded-xl">Apply Online <ExternalLink size={13} /></a>
                                            <a href={`tel:${s.helpline}`} className="btn-secondary px-5 py-3 flex items-center gap-2 text-sm rounded-xl"><Phone size={13} /> {s.helpline}</a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Livestock */}
                {tab === "Livestock Insurance" && (
                    <div className="space-y-4">
                        {LIVESTOCK_SCHEMES.map(s => (
                            <div key={s.name} className="glass-card p-6 space-y-4">
                                <div className="flex items-start gap-4">
                                    <span className="text-3xl">{s.icon}</span>
                                    <div>
                                        <h3 className="text-white font-black text-lg">{s.name}</h3>
                                        <p className="text-green-400 text-sm">{s.description}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="glass-card p-4 bg-green-900/10 border-green-900/20">
                                        <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-2">Premium</p>
                                        <p className="text-green-200 text-sm">{s.premium}</p>
                                    </div>
                                    <div className="glass-card p-4 bg-blue-900/10 border-blue-900/20">
                                        <p className="text-blue-700 text-xs font-bold uppercase tracking-widest mb-2">Sum Insured</p>
                                        <p className="text-blue-200 text-sm">{s.sum}</p>
                                    </div>
                                    <div className="glass-card p-4 bg-yellow-900/10 border-yellow-900/20">
                                        <p className="text-yellow-700 text-xs font-bold uppercase tracking-widest mb-2">What&apos;s Covered</p>
                                        <ul className="space-y-1">{s.covers.map(c => <li key={c} className="text-yellow-200 text-xs flex items-start gap-1"><CheckCircle2 size={9} className="mt-0.5 flex-shrink-0 text-green-500" />{c}</li>)}</ul>
                                    </div>
                                    <div className="glass-card p-4 bg-purple-900/10 border-purple-900/20">
                                        <p className="text-purple-700 text-xs font-bold uppercase tracking-widest mb-2">Documents</p>
                                        <div className="flex flex-wrap gap-2">{s.documents.map(d => <span key={d} className="text-purple-200 text-xs bg-purple-900/20 px-2 py-1 rounded-lg border border-purple-800/30">{d}</span>)}</div>
                                    </div>
                                </div>
                                <p className="text-green-300 text-sm">{s.howToApply}</p>
                                <a href={`tel:${s.helpline}`} className="btn-secondary px-5 py-3 inline-flex items-center gap-2 text-sm rounded-xl"><Phone size={13} /> {s.helpline}</a>
                            </div>
                        ))}
                    </div>
                )}

                {/* Equipment */}
                {tab === "Equipment Insurance" && (
                    <div className="space-y-4">
                        {EQUIPMENT_SCHEMES.map(s => (
                            <div key={s.name} className="glass-card p-6 space-y-4">
                                <div className="flex items-start gap-4">
                                    <span className="text-3xl">{s.icon}</span>
                                    <div>
                                        <h3 className="text-white font-black text-lg">{s.name}</h3>
                                        <p className="text-green-400 text-sm">{s.description}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="glass-card p-4 bg-green-900/10 border-green-900/20">
                                        <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-1">Premium Rate</p>
                                        <p className="text-green-200 text-sm">{s.premium}</p>
                                    </div>
                                    <div className="glass-card p-4 bg-blue-900/10 border-blue-900/20">
                                        <p className="text-blue-700 text-xs font-bold uppercase tracking-widest mb-1">Coverage</p>
                                        <p className="text-blue-200 text-sm">{s.sum}</p>
                                    </div>
                                </div>
                                <div className="glass-card p-4 bg-yellow-900/10 border-yellow-900/20">
                                    <p className="text-yellow-700 text-xs font-bold uppercase tracking-widest mb-2">Covered Events</p>
                                    <ul className="space-y-1 grid grid-cols-1 md:grid-cols-2">
                                        {s.covers.map(c => <li key={c} className="text-yellow-200 text-xs flex items-start gap-1"><CheckCircle2 size={9} className="mt-0.5 flex-shrink-0 text-green-500" />{c}</li>)}
                                    </ul>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {s.documents.map(d => <span key={d} className="text-slate-300 text-xs bg-slate-900/20 px-2 py-1 rounded-lg border border-slate-700/30">{d}</span>)}
                                </div>
                                <a href={`tel:${s.helpline}`} className="btn-secondary px-5 py-3 inline-flex items-center gap-2 text-sm rounded-xl"><Phone size={13} /> {s.helpline}</a>
                            </div>
                        ))}
                        <div className="glass-card p-5 border-blue-900/20 bg-blue-900/10">
                            <p className="text-blue-300 font-bold text-sm mb-2">Where to apply for equipment insurance?</p>
                            <ul className="text-blue-400 text-sm space-y-1">
                                <li>• United India Insurance — 1800-22-4242</li>
                                <li>• New India Assurance — 1800-209-1415</li>
                                <li>• Your bank (if tractor is financed)</li>
                                <li>• Any insurance agent (IRDA registered)</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Health */}
                {tab === "Health Insurance" && (
                    <div className="space-y-4">
                        {HEALTH_SCHEMES.map(s => (
                            <div key={s.name} className="glass-card p-6 border-blue-900/20 space-y-5">
                                <div className="flex items-start gap-4">
                                    <span className="text-4xl">{s.icon}</span>
                                    <div>
                                        <h3 className="text-white font-black text-xl">{s.name}</h3>
                                        <span className="text-green-400 font-black text-2xl">₹5 Lakh</span><span className="text-green-700 ml-2 text-sm">cover per family/year</span>
                                    </div>
                                </div>
                                <div className="bg-green-900/10 rounded-xl p-4 border border-green-900/20">
                                    <p className="text-green-300 font-bold text-sm mb-1">Premium: <span className="text-green-400">{s.premium}</span></p>
                                    <p className="text-green-600 text-xs">{s.eligibility}</p>
                                </div>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {s.covers.map(c => <li key={c} className="text-blue-200 text-xs flex items-start gap-2 glass-card p-3 rounded-xl"><CheckCircle2 size={10} className="text-green-400 mt-0.5 flex-shrink-0" />{c}</li>)}
                                </ul>
                                <div className="flex gap-3">
                                    <a href={s.applyUrl} target="_blank" rel="noreferrer" className="btn-primary px-5 py-3 flex items-center gap-2 text-sm rounded-xl">Check Eligibility <ExternalLink size={13} /></a>
                                    <a href={`tel:${s.helpline}`} className="btn-secondary px-5 py-3 flex items-center gap-2 text-sm rounded-xl"><Phone size={13} /> {s.helpline}</a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Life */}
                {tab === "Life Insurance" && (
                    <div className="space-y-4">
                        {[
                            { name: "PM Jeevan Jyoti Bima Yojana (PMJJBY)", icon: "🙏", premium: "₹436/year", sum: "₹2 lakh on death (any reason)", age: "18–50 years", howTo: "Enroll through any bank branch or net banking", helpline: "1800-180-1111", desc: "Life insurance at just ₹436/year. Death claim of ₹2 lakh to nominee in case of death due to any reason." },
                            { name: "PM Suraksha Bima Yojana (PMSBY)", icon: "🛡️", premium: "₹20/year", sum: "₹2 lakh (accidental death) / ₹1 lakh (partial disability)", age: "18–70 years", howTo: "Enroll through bank. Auto-renews annually.", helpline: "1800-180-1111", desc: "Accident insurance at just ₹20/year. Best value insurance available to any Indian farmer." },
                            { name: "Pradhan Mantri Vaya Vandana Yojana (PMVVY)", icon: "👴", premium: "Lump sum: ₹5.62 lakh – ₹15 lakh", sum: "Monthly pension: ₹1,000–₹10,000 for 10 years", age: "60+ years (senior farmers)", howTo: "Buy through LIC offices or licindia.in", helpline: "022-68276827", desc: "Pension scheme for senior farmers. Guaranteed 7.4% returns. Ideal for retiring farmers." },
                        ].map(s => (
                            <div key={s.name} className="glass-card p-5 border-purple-900/20 hover:border-purple-700/30 transition">
                                <div className="flex items-start gap-4">
                                    <span className="text-3xl">{s.icon}</span>
                                    <div className="flex-1">
                                        <h3 className="text-white font-black">{s.name}</h3>
                                        <p className="text-green-400 text-sm mt-1">{s.desc}</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                                            <div className="glass-card p-3 rounded-xl text-center">
                                                <p className="text-green-700 text-[10px] font-bold uppercase tracking-widest">Premium</p>
                                                <p className="text-white font-black text-sm">{s.premium}</p>
                                            </div>
                                            <div className="glass-card p-3 rounded-xl text-center">
                                                <p className="text-blue-700 text-[10px] font-bold uppercase tracking-widest">Coverage</p>
                                                <p className="text-white font-black text-xs">{s.sum}</p>
                                            </div>
                                            <div className="glass-card p-3 rounded-xl text-center">
                                                <p className="text-purple-700 text-[10px] font-bold uppercase tracking-widest">Age</p>
                                                <p className="text-white font-black text-sm">{s.age}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-4">
                                            <p className="text-green-500 text-xs flex-1">{s.howTo}</p>
                                            <a href={`tel:${s.helpline}`} className="btn-secondary px-3 py-2 text-xs flex items-center gap-1 rounded-xl"><Phone size={11} />{s.helpline}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tip */}
            <div className="glass-card p-5 max-w-6xl w-full bg-indigo-900/10 border-indigo-900/20 flex items-start gap-4">
                <AlertCircle size={20} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-indigo-300 font-bold text-sm mb-1">Always buy insurance BEFORE disaster strikes</p>
                    <p className="text-indigo-600 text-xs">Claims cannot be made if you didn&apos;t insure before the event. File claims within 72 hours to avoid rejection. Keep all documents safe.</p>
                </div>
            </div>
        </div>
    );
}
