"use client";
import { useState } from "react";
import { Search, ExternalLink, ChevronDown, ChevronUp, IndianRupee, CheckCircle2, Clock, Phone, FileText, Star, AlertCircle, BookOpen, Landmark } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

const CATEGORIES = ["All", "Cash Transfer", "Insurance", "Loans & Credit", "Equipment & Tech", "Organic & Soil", "Market & Price", "State Schemes"];

const SCHEMES = [
    {
        id: "pm-kisan", name: "PM-KISAN Samman Nidhi", category: "Cash Transfer",
        icon: "💰", color: "from-yellow-600 to-amber-500",
        brief: "₹6,000/year in 3 installments directly into bank account",
        benefit: "₹2,000 × 3 installments = ₹6,000 per year via DBT. No middle-man.",
        eligibility: ["Small & marginal farmers with landholding ≤ 2 hectares", "Aadhaar linked to bank account required", "Excludes income taxpayers and govt employees"],
        documents: ["Aadhaar Card", "Land Records (Khasra)", "Bank Passbook", "Mobile Number"],
        howToApply: "Register at pmkisan.gov.in or visit nearest CSC center / Patwari office",
        applyUrl: "https://pmkisan.gov.in", deadline: "Ongoing", helpline: "155261",
        status: "Active", popular: true, beneficiaries: "11 crore+ farmers", nextInstallment: "March 2026 (19th installment)",
    },
    {
        id: "fasal-bima", name: "PM Fasal Bima Yojana (PMFBY)", category: "Insurance",
        icon: "🛡️", color: "from-blue-600 to-indigo-600",
        brief: "Crop insurance at just 1.5–2% premium — Govt pays 95%+ of actual premium",
        benefit: "Full crop loss coverage. Covers natural calamities, pest attacks, unseasonal rain, post-harvest losses within 14 days. Govt pays 95%+ of premium.",
        eligibility: ["All farmers growing notified crops in notified areas", "Loanee farmers auto-covered; non-loanee apply voluntarily"],
        documents: ["Aadhaar", "Land Khasra", "Bank account", "Sowing certificate from Patwari"],
        howToApply: "Apply through your bank (KCC holders), pmfby.gov.in portal, CSC center, or Crop Insurance app",
        applyUrl: "https://pmfby.gov.in", deadline: "Kharif: Jul 31 | Rabi: Dec 31", helpline: "14447",
        status: "Active", popular: true, beneficiaries: "5.5 crore farmers/season", nextInstallment: null,
    },
    {
        id: "kcc", name: "Kisan Credit Card (KCC)", category: "Loans & Credit",
        icon: "💳", color: "from-green-600 to-emerald-600",
        brief: "Credit up to ₹3 lakh at 4% interest — revolving credit for seeds, inputs & more",
        benefit: "Up to ₹3 lakh at 4% interest (2% subvention by Govt). Revolving credit — repay and reuse. Covers seeds, fertilizers, pesticides, irrigation, short-term needs.",
        eligibility: ["All farmers — individual/joint, SHGs, tenant farmers, oral lessees"],
        documents: ["Aadhaar", "Land Khasra / Lease agreement", "Passport Photo", "Bank Account"],
        howToApply: "Apply at any nationalized bank, cooperative bank, or RRB branch with land records",
        applyUrl: "https://agricoop.gov.in", deadline: "Ongoing", helpline: "1800-180-1551",
        status: "Active", popular: true, beneficiaries: "7 crore+ card holders", nextInstallment: null,
    },
    {
        id: "soil-health-card", name: "Soil Health Card Scheme", category: "Organic & Soil",
        icon: "🌱", color: "from-lime-600 to-green-600",
        brief: "Free soil testing + customized fertilizer recommendations every 2 years",
        benefit: "Free soil test covering 12 parameters (NPK, pH, micro-nutrients). Saves 10–15% on fertilizer cost. Increases yield 5–6%.",
        eligibility: ["All farmers across India — no landholding restriction"],
        documents: ["Aadhaar", "Mobile Number"],
        howToApply: "Contact nearest KVK or Agriculture Dept. Register at soilhealth.dac.gov.in",
        applyUrl: "https://soilhealth.dac.gov.in", deadline: "Ongoing", helpline: "1800-180-1551",
        status: "Active", popular: false, beneficiaries: "22 crore+ soil health cards issued", nextInstallment: null,
    },
    {
        id: "pm-kusum", name: "PM-KUSUM Yojana", category: "Equipment & Tech",
        icon: "☀️", color: "from-orange-500 to-amber-500",
        brief: "90% subsidy on solar-powered irrigation pumps (0.5–7.5 HP)",
        benefit: "90% subsidy (60% Govt + 30% bank loan). Farmer pays only 10%. Also earn income by selling surplus solar power to grid.",
        eligibility: ["Farmers with irrigated land", "Diesel pump users converting to solar", "Farmer groups and water user associations"],
        documents: ["Aadhaar", "Land Khasra", "Bank Account", "Electricity bill", "Diesel pump details"],
        howToApply: "Apply through State DISCOM portal or Agriculture Department. Apply at mnre.gov.in",
        applyUrl: "https://mnre.gov.in", deadline: "State-wise targets — apply before quota fills", helpline: "011-24300312",
        status: "Active", popular: false, beneficiaries: "2.5 lakh pumps targetted", nextInstallment: null,
    },
    {
        id: "agri-infra", name: "Agriculture Infrastructure Fund (AIF)", category: "Loans & Credit",
        icon: "🏗️", color: "from-purple-600 to-violet-600",
        brief: "Loans with 3% interest subvention for warehouses, cold chains, processing units",
        benefit: "Loan up to ₹2 crore per project, 3% interest subvention for 7 years. For warehouses, cold storage, sorting/grading units, custom hiring centers.",
        eligibility: ["Farmers, FPOs, PACS, Agri-entrepreneurs", "Self-help groups, agri-startups"],
        documents: ["Aadhaar", "PAN", "Business plan", "Land proof", "Bank statements (3 yrs)", "GST (if applicable)"],
        howToApply: "Apply online at agriinfra.dac.gov.in with project report",
        applyUrl: "https://agriinfra.dac.gov.in", deadline: "Till 2025–26", helpline: "1800-572-4200",
        status: "Active", popular: false, beneficiaries: "₹8,000 crore+ sanctioned", nextInstallment: null,
    },
    {
        id: "enam", name: "e-NAM (National Agriculture Market)", category: "Market & Price",
        icon: "📊", color: "from-teal-600 to-cyan-600",
        brief: "Sell produce online to buyers across 1,361 mandis — better prices, less middlemen",
        benefit: "Online transparent auction. Get competitive prices from buyers nationwide. Real-time market price info. Reduced mandi fees and transportation cost.",
        eligibility: ["Any farmer registered with local APMC mandi", "Produce quality graded accepted"],
        documents: ["Aadhaar", "Bank Account", "APMC mandi registration", "Mobile Number"],
        howToApply: "Register at enam.gov.in or at local APMC mandi office",
        applyUrl: "https://enam.gov.in", deadline: "Ongoing", helpline: "1800-270-0224",
        status: "Active", popular: false, beneficiaries: "1.75 crore+ farmers", nextInstallment: null,
    },
    {
        id: "pkvy", name: "Paramparagat Krishi Vikas Yojana (PKVY)", category: "Organic & Soil",
        icon: "🌿", color: "from-emerald-600 to-green-600",
        brief: "₹50,000/ha to switch to organic farming — inputs, certification & marketing support",
        benefit: "₹50,000/ha over 3 years. Free PGS organic certification. Market linkage support. ₹31,000 for inputs, ₹8,800 cert, ₹6,000 marketing.",
        eligibility: ["Cluster of 20+ farmers (≥ 20 hectares)", "Commit to organic farming for 3 years"],
        documents: ["Aadhaar", "Land Khasra", "Group formation certificate", "Bank account"],
        howToApply: "Form a cluster group → apply through District Agriculture Office or KVK",
        applyUrl: "https://pgsindia-ncof.gov.in", deadline: "Apply before March each year", helpline: "1800-180-1551",
        status: "Active", popular: false, beneficiaries: "10,000+ clusters nationwide", nextInstallment: null,
    },
    {
        id: "mp-yantra", name: "MP Krishi Yantra Anudan (State)", category: "State Schemes",
        icon: "🚜", color: "from-red-600 to-rose-600",
        brief: "MP only: 50–80% subsidy on tractors, threshers, sprayers & other farm equipment",
        benefit: "50% subsidy for general farmers, 80% for SC/ST/women/small farmers. Covers: Tractor, rotavator, power tiller, sprayer, seed drill, thresher.",
        eligibility: ["Madhya Pradesh farmers only", "Age 18–60 years", "No subsidy for same equipment in last 7 years"],
        documents: ["Aadhaar", "Land Khasra", "Bank passbook", "Caste certificate (SC/ST)", "Passport photo"],
        howToApply: "Apply online at dbt.mpdage.org (MP Kisan App or portal)",
        applyUrl: "https://dbt.mpdage.org", deadline: "April–June annually", helpline: "0755-2558823",
        status: "Active", popular: false, beneficiaries: "MP farmers only", nextInstallment: null,
    },
];

const statusColors: Record<string, string> = {
    Active: "text-green-400 bg-green-900/20 border-green-800/30",
    "Coming Soon": "text-yellow-400 bg-yellow-900/20 border-yellow-800/30",
    Closed: "text-red-400 bg-red-900/20 border-red-800/30",
};

export default function SchemesPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [expanded, setExpanded] = useState<string | null>(null);
    const [bookmarked, setBookmarked] = useState<string[]>(["pm-kisan", "fasal-bima", "kcc"]);
    const [showBookmarks, setShowBookmarks] = useState(false);

    const toggleBookmark = (id: string) =>
        setBookmarked(b => b.includes(id) ? b.filter(x => x !== id) : [...b, id]);

    const filtered = SCHEMES.filter(s =>
        (category === "All" || s.category === category) &&
        (!showBookmarks || bookmarked.includes(s.id)) &&
        (s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.brief.toLowerCase().includes(search.toLowerCase()))
    );

    const popularSchemes = SCHEMES.filter(s => s.popular);

    return (
        <div className="flex flex-col items-center gap-14 pb-20 px-4 w-full">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-8 w-full max-w-4xl pt-2">
                <ExploreButton />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-950/40">
                    <Landmark size={40} className="text-white" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-3">Govt Schemes</h1>
                    <p className="text-indigo-400 font-black uppercase tracking-[0.4em] text-sm">All Farmer Benefits · One Place</p>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full">
                    {[
                        { label: "Active Schemes", value: SCHEMES.length.toString(), icon: "✅" },
                        { label: "Potential Benefit", value: "₹50,000+/yr", icon: "💰" },
                        { label: "Saved", value: bookmarked.length.toString(), icon: "🔖" },
                    ].map(s => (
                        <div key={s.label} className="glass-card p-4 text-center">
                            <p className="text-2xl mb-1">{s.icon}</p>
                            <p className="text-white font-black">{s.value}</p>
                            <p className="text-green-800 text-[10px] font-bold uppercase tracking-widest mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Apply Cards */}
            <div className="w-full max-w-6xl">
                <h2 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                    <Star size={18} className="text-yellow-400 fill-yellow-400" /> Most Important for You
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {popularSchemes.map(s => (
                        <div key={s.id} className="glass-card p-5 border-green-900/20 hover:border-green-700/40 transition-all">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl mb-3`}>{s.icon}</div>
                            <h3 className="text-white font-black text-sm mb-1">{s.name}</h3>
                            <p className="text-green-600 text-xs mb-3">{s.brief}</p>
                            <div className="flex gap-2">
                                <a href={s.applyUrl} target="_blank" rel="noreferrer"
                                    className="btn-primary text-xs px-3 py-2 flex items-center gap-1 flex-1 justify-center rounded-lg">
                                    Apply Now <ExternalLink size={10} />
                                </a>
                                <a href={`tel:${s.helpline}`} className="btn-secondary text-xs px-3 py-2 flex items-center gap-1 rounded-lg">
                                    <Phone size={11} /> {s.helpline}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search + Filter */}
            <div className="w-full max-w-6xl space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-700" />
                        <input className="input-field pl-9 w-full text-sm" placeholder="Search schemes..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <button
                        onClick={() => setShowBookmarks(b => !b)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition border ${showBookmarks ? "bg-yellow-700/30 border-yellow-600 text-yellow-300" : "glass-card text-green-500 hover:text-green-300"}`}
                    >
                        <Star size={14} className={showBookmarks ? "fill-yellow-400 text-yellow-400" : ""} />
                        Saved ({bookmarked.length})
                    </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setCategory(c)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition border ${category === c ? "bg-indigo-700/50 border-indigo-600 text-indigo-200" : "glass-card border-transparent text-green-600 hover:text-green-300"}`}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Schemes List */}
            <div className="w-full max-w-6xl space-y-4">
                {filtered.length === 0 ? (
                    <div className="glass-card p-12 text-center text-green-800">No schemes match your search.</div>
                ) : filtered.map(s => (
                    <div key={s.id} className={`glass-card border transition-all ${expanded === s.id ? "border-indigo-700/40" : "border-transparent hover:border-indigo-900/30"}`}>
                        <div className="flex items-start gap-4 p-5 cursor-pointer" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl flex-shrink-0`}>{s.icon}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="text-white font-black">{s.name}</h3>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[s.status]}`}>{s.status}</span>
                                            <span className="text-green-900 text-[10px] border border-green-900/30 rounded-full px-2 py-0.5">{s.category}</span>
                                        </div>
                                        <p className="text-green-400 text-sm font-bold">{s.brief}</p>
                                        <p className="text-green-800 text-xs mt-1">👥 {s.beneficiaries}</p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button onClick={e => { e.stopPropagation(); toggleBookmark(s.id); }}
                                            className={`p-1.5 rounded-lg transition ${bookmarked.includes(s.id) ? "text-yellow-400" : "text-green-900 hover:text-yellow-500"}`}>
                                            <Star size={15} className={bookmarked.includes(s.id) ? "fill-yellow-400" : ""} />
                                        </button>
                                        <span className="text-green-700 mt-1">{expanded === s.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {expanded === s.id && (
                            <div className="border-t border-indigo-900/30 p-5 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-green-900/10 rounded-xl p-4 border border-green-900/20">
                                        <h4 className="text-green-400 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><IndianRupee size={11} /> What You Get</h4>
                                        <p className="text-green-200 text-sm leading-relaxed">{s.benefit}</p>
                                    </div>
                                    <div className="bg-blue-900/10 rounded-xl p-4 border border-blue-900/20">
                                        <h4 className="text-blue-400 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><CheckCircle2 size={11} /> Eligibility</h4>
                                        <ul className="space-y-1">
                                            {s.eligibility.map((e, i) => (
                                                <li key={i} className="text-blue-200 text-xs flex items-start gap-2">
                                                    <CheckCircle2 size={9} className="text-blue-500 mt-0.5 flex-shrink-0" /> {e}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-yellow-900/10 rounded-xl p-4 border border-yellow-900/20">
                                        <h4 className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><FileText size={11} /> Documents Needed</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {s.documents.map(d => (
                                                <span key={d} className="text-yellow-300 text-xs bg-yellow-900/20 px-2 py-1 rounded-lg border border-yellow-800/30">{d}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-purple-900/10 rounded-xl p-4 border border-purple-900/20">
                                        <h4 className="text-purple-400 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><BookOpen size={11} /> How to Apply</h4>
                                        <p className="text-purple-200 text-sm">{s.howToApply}</p>
                                        {s.nextInstallment && (
                                            <p className="mt-2 text-yellow-400 text-xs flex items-center gap-1"><Clock size={10} /> Next: {s.nextInstallment}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <a href={s.applyUrl} target="_blank" rel="noreferrer" className="btn-primary px-6 py-3 flex items-center gap-2 text-sm rounded-xl">
                                        Apply Online <ExternalLink size={13} />
                                    </a>
                                    <a href={`tel:${s.helpline}`} className="btn-secondary px-6 py-3 flex items-center gap-2 text-sm rounded-xl">
                                        <Phone size={13} /> {s.helpline}
                                    </a>
                                    <div className="glass-card px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                        <Clock size={13} className="text-yellow-500" />
                                        <span className="text-yellow-400 font-bold">Deadline:</span>
                                        <span className="text-white">{s.deadline}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="glass-card p-5 max-w-6xl w-full bg-indigo-900/10 border-indigo-900/20 flex items-start gap-4">
                <AlertCircle size={20} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-indigo-300 font-bold text-sm mb-1">Need help applying?</p>
                    <p className="text-indigo-600 text-xs">Visit nearest <strong className="text-indigo-400">CSC Center</strong> or <strong className="text-indigo-400">KVK</strong> · Call <strong className="text-indigo-400">Kisan Call Center: 1800-180-1551</strong> (Free · Mon–Sat)</p>
                </div>
            </div>
        </div>
    );
}
