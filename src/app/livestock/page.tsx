"use client";
import { useState } from "react";
import { Heart, Search, Phone, ExternalLink, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, IndianRupee, Calculator } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

const TABS = ["Cattle & Buffalo", "Goat & Sheep", "Poultry", "Pig Farming", "Feed & Health", "Schemes & Finance"];

// ─── Cattle data ─────────────────────────────────────────────────────────────
const CATTLE_BREEDS = [
    { name: "Sahiwal (साहीवाल)", type: "Desi Cow", origin: "Punjab/Rajasthan", milk: "8–12 L/day", fat: "4.5%", best_for: "Hot dry areas, low-input farming", traits: ["Disease resistant", "Good for crossbreeding", "Born calvers", "Long productive life"], color: "from-amber-600 to-yellow-600" },
    { name: "Gir (गिर)", type: "Desi Cow", origin: "Gujarat", milk: "6–10 L/day", fat: "4.5%", best_for: "Gujarat, Rajasthan, MP — heat-tolerant", traits: ["A2 milk (premium price)", "Heat & tick resistant", "Excellent with crossbreeds", "High demand from dairies"], color: "from-orange-600 to-amber-600" },
    { name: "Murrah Buffalo (मुर्रा भैंस)", type: "Buffalo", origin: "Haryana/Delhi", milk: "10–16 L/day", fat: "7–8%", best_for: "North India dairy farmers — highest fat milk", traits: ["Highest milk fat among buffaloes", "Fetch premium at dairy", "Subsidised purchase under DEDS", "Excellent for ghee production"], color: "from-slate-700 to-zinc-600" },
    { name: "HF Cross (Holstein Friesian)", type: "Cross-bred Cow", origin: "Netherlands × Desi", milk: "15–25 L/day", fat: "3.5%", best_for: "Good water/feed availability, cooler areas", traits: ["Highest milk volume", "Requires good management", "Not heat tolerant", "Best for organised dairy farms"], color: "from-blue-600 to-sky-600" },
    { name: "Jersey Cross", type: "Cross-bred Cow", origin: "Jersey × Desi", milk: "10–15 L/day", fat: "4.5%", best_for: "Small farmers — good balance of yield & hardiness", traits: ["Milk fat better than HF", "More heat tolerant than HF", "Economical to maintain", "Popular in South India"], color: "from-teal-600 to-cyan-600" },
];

const CATTLE_CARE = [
    { title: "दूध बढ़ाने के तरीके", icon: "🥛", tips: ["दिन में 3 बार दुहाई → 10–15% ज्यादा दूध", "हरा चारा: नेपियर/मक्का/बाजरा = 25–30 kg/day", "Mineral mixture: 50g/day अनिवार्य", "ताजा पानी: gाय = 50–60 L/day, भैंस = 60–80 L", "Stress से बचाएं — 2–3 L/day कम होता है दूध"] },
    { title: "Common बीमारियाँ और बचाव", icon: "💉", tips: ["FMD (खुरपका-मुंहपका): साल में 2 बार vaccine (FREE at govt vet)", "BQ (Black Quarter): जुलाई से पहले vaccine", "HS (Hemorrhagic Septicemia): April में vaccine", "Mastitis: दुहाई के बाद teat dip जरूरी", "कृमिनाशक: हर 6 महीने — Albendazole 600mg"] },
    { title: "गाय/भैंस का आहार chart", icon: "🌿", tips: ["हरा चारा: 25–30 kg", "सूखा भूसा: 5–7 kg", "Concentrate feed (गाभन पशु): 2–3 kg", "Mineral mixture: 50g", "नमक: 30g", "पीने का पानी: 50+ litre"] },
];

// ─── Goat data ────────────────────────────────────────────────────────────────
const GOAT_BREEDS = [
    { name: "Sirohi (सिरोही)", milk: "0.5–1 L/day", weight: "35–45 kg", best: "Rajasthan, MP — drought-tolerant", features: ["Dual purpose—milk + meat", "Disease resistant", "Browses dry shrubs", "Popular in NW India"] },
    { name: "Black Bengal", milk: "0.3–0.6 L/day", weight: "15–25 kg", best: "WB, Bihar, Jharkhand", features: ["High prolificacy (twins/triplets)", "Excellent meat quality", "Low maintenance cost", "High market demand"] },
    { name: "Barbari (बारबरी)", milk: "1–2 L/day", weight: "25–35 kg", best: "North India urban areas", features: ["High milk for goats", "Early maturity (weaned 3 month)", "Good for peri-urban dairy", "Agra, Mathura popular breed"] },
    { name: "Boer Cross (Meat)", milk: "Low", weight: "50–80 kg", best: "Commercial meat farms", features: ["Fastest growth rate", "60% dressing %", "Premium price at Eid", "Requires concentrate feeding"] },
];

// ─── Poultry ──────────────────────────────────────────────────────────────────
const POULTRY_INFO = [
    { type: "Layer Farming (अंडे)", icon: "🥚", income: "₹3–4/egg, 250–300 eggs/hen/year", cost: "₹150–180/bird/year (feed + meds)", start: "300 birds = ₹1.5 lakh investment. ROI: 12–15 months.", breeds: ["BV-300", "Lohmann", "HH-260 (for heat)"], tips: ["Deep litter or cage system", "Lighting: 16hrs/day = more eggs", "Vaccination: Ranikhet, Marek, IBD", "Deworming every 3 months"] },
    { type: "Broiler Farming (मांस)", icon: "🍗", income: "42-day cycle, 2 kg bird @ ₹90–110/kg live", cost: "₹80–90 cost per bird", start: "1000 birds/batch × 6 batches/year = ₹60,000–80,000 profit", breeds: ["Cobb-500", "Ross-308", "Vencobb"], tips: ["Maintain 32°C at arrival, reduce to 24°C", "2.5–3 litres water per kg feed", "3 broods need 1 sq ft space", "Contract farming with Venky's/IB Group reduces risk"] },
    { type: "Desi Murgi (Country Chicken)", icon: "🐓", income: "₹300–500/bird. Eggs @ ₹8–12 each", cost: "Very low — scavenging + minimal supplement", start: "50 birds backyard farming — perfect for women", breeds: ["Kadaknath (premium ₹500+/kg)", "Aseel", "Vanaraja (ICAR)"], tips: ["Vanaraja = best for rural backyard", "Night housing essential vs predators", "ICAR project: Gramapriya bird — free distribution", "Kadaknath: Low fat, high protein — premium market"] },
];

// ─── Feed calculator ──────────────────────────────────────────────────────────
function CowFeedCalc() {
    const [animals, setAnimals] = useState(2);
    const [milk, setMilk] = useState(10);
    const greenFeed = animals * 28;
    const dry = animals * 6;
    const concentrate = animals * (milk / 2.5);
    const cost = Math.round(dry * 8 + concentrate * 22 + animals * 1.5);
    return (
        <div className="glass-card p-6 space-y-4 border-amber-800/20">
            <h3 className="text-white font-black flex items-center gap-2"><Calculator size={18} className="text-amber-400" /> Daily Feed Cost Calculator</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2 block">Animals: {animals}</label>
                    <input type="range" min="1" max="20" value={animals} onChange={e => setAnimals(+e.target.value)} className="w-full accent-amber-500" />
                </div>
                <div>
                    <label className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2 block">Milk/animal/day: {milk} L</label>
                    <input type="range" min="3" max="30" value={milk} onChange={e => setMilk(+e.target.value)} className="w-full accent-amber-500" />
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "Green Fodder", value: `${greenFeed} kg`, color: "text-green-400" },
                    { label: "Dry Bhusa", value: `${dry} kg`, color: "text-yellow-400" },
                    { label: "Concentrate", value: `${Math.round(concentrate)} kg`, color: "text-orange-400" },
                    { label: "Est. Daily Cost", value: `₹${cost}`, color: "text-red-400" },
                ].map(x => (
                    <div key={x.label} className="glass-card p-3 text-center rounded-xl">
                        <p className={`font-black text-lg ${x.color}`}>{x.value}</p>
                        <p className="text-green-800 text-[10px] font-bold uppercase tracking-widest">{x.label}</p>
                    </div>
                ))}
            </div>
            <p className="text-amber-700 text-xs">* Approx costs: Green fodder ₹0 (own farm), Bhusa ₹8/kg, Concentrate ₹22/kg</p>
        </div>
    );
}

// ─── Schemes ──────────────────────────────────────────────────────────────────
const LIVESTOCK_SCHEMES = [
    { name: "NABARD Dairy Entrepreneurship Dev Scheme (DEDS)", icon: "🏦", cover: "Up to ₹7 lakh loan for 2 cross-bred cows", subsidy: "33.33% subsidy (SC/ST: 40%)", who: "Individual farmers/SHG/FPO", how: "Apply through nearest bank or NABARD district office", helpline: "1800-200-0888", url: "https://nabard.org" },
    { name: "National Livestock Mission (NLM)", icon: "🐐", cover: "Subsidy for goat/sheep/pig/poultry units", subsidy: "50% subsidy on project cost (max ₹50 lakh)", who: "Individual, SHG, cooperative, FPO", how: "Apply at state Animal Husbandry Dept or nlm.udyamimitra.in", helpline: "1800-180-0101", url: "https://nlm.udyamimitra.in" },
    { name: "Livestock Insurance (NDDB / State)", icon: "🛡️", cover: "Death/disability of cattle, buffalo, goat, sheep, pigs", subsidy: "50% premium subsidy for BPL/SC/ST farmers", who: "Ear-tagged animals, vet-inspected", how: "Apply at nearest AH department or through bank", helpline: "1800-180-0101", url: "" },
    { name: "Kisan Credit Card (KCC) — Animal Husbandry", icon: "💳", cover: "KCC now covers dairy, poultry, fisheries", subsidy: "4% effective interest (7% - 3% subvention)", who: "Any farmer/livestock holder with land or lease", how: "Apply at any bank with Aadhaar + land/animal records", helpline: "1800-11-0001", url: "https://farmer.gov.in" },
];

export default function LivestockPage() {
    const [tab, setTab] = useState("Cattle & Buffalo");
    const [expandedBreed, setExpandedBreed] = useState<string | null>("Sahiwal (साहीवाल)");
    const [expandedCare, setExpandedCare] = useState<string | null>(null);
    const [expandedScheme, setExpandedScheme] = useState<string | null>(null);

    const TAB_ICONS: Record<string, string> = { "Cattle & Buffalo": "🐄", "Goat & Sheep": "🐐", "Poultry": "🐓", "Pig Farming": "🐖", "Feed & Health": "🌿", "Schemes & Finance": "📋" };

    return (
        <div className="flex flex-col items-center gap-14 pb-20 px-4 w-full">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-8 w-full max-w-4xl pt-2">
                <ExploreButton />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-950/40">
                    <Heart size={40} className="text-white" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-3">Pashupalan</h1>
                    <p className="text-amber-400 font-black uppercase tracking-[0.4em] text-sm">Cattle · Goat · Poultry · Schemes</p>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full">
                    {[{ label: "Cattle Breeds", value: CATTLE_BREEDS.length.toString(), icon: "🐄" }, { label: "Govt Schemes", value: LIVESTOCK_SCHEMES.length.toString(), icon: "🏛️" }, { label: "Min. Income", value: "₹15K/mo", icon: "💰" }].map(s => (
                        <div key={s.label} className="glass-card p-4 text-center">
                            <p className="text-2xl mb-1">{s.icon}</p>
                            <p className="text-white font-black">{s.value}</p>
                            <p className="text-amber-700 text-[10px] font-bold uppercase tracking-widest mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="w-full max-w-6xl">
                <div className="flex gap-2 flex-wrap mb-8">
                    {TABS.map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`px-4 py-3 rounded-xl font-bold text-sm transition border ${tab === t ? "bg-amber-700/40 border-amber-600 text-amber-200" : "glass-card border-transparent text-green-600 hover:text-green-300"}`}>
                            {TAB_ICONS[t]} {t}
                        </button>
                    ))}
                </div>

                {/* CATTLE */}
                {tab === "Cattle & Buffalo" && (
                    <div className="space-y-5">
                        <CowFeedCalc />
                        <h3 className="text-white font-black text-lg">Top Breeds — दूध और मुनाफा</h3>
                        {CATTLE_BREEDS.map(b => (
                            <div key={b.name} className={`glass-card border transition-all ${expandedBreed === b.name ? "border-amber-700/40" : "border-transparent hover:border-amber-900/20"}`}>
                                <div className="flex items-start gap-4 p-5 cursor-pointer" onClick={() => setExpandedBreed(p => p === b.name ? null : b.name)}>
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center text-3xl flex-shrink-0`}>🐄</div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <h3 className="text-white font-black">{b.name}</h3>
                                            {expandedBreed === b.name ? <ChevronUp size={16} className="text-amber-600" /> : <ChevronDown size={16} className="text-amber-600" />}
                                        </div>
                                        <p className="text-amber-400 text-xs font-bold">{b.type} · {b.origin}</p>
                                        <div className="flex gap-3 mt-2 flex-wrap">
                                            <span className="text-green-300 text-xs border border-green-900/30 rounded-full px-3 py-0.5">🥛 {b.milk}</span>
                                            <span className="text-yellow-300 text-xs border border-yellow-900/30 rounded-full px-3 py-0.5">🧈 Fat: {b.fat}</span>
                                        </div>
                                    </div>
                                </div>
                                {expandedBreed === b.name && (
                                    <div className="border-t border-amber-900/30 p-5 space-y-3">
                                        <div className="bg-amber-900/10 rounded-xl p-4 border border-amber-900/20">
                                            <p className="text-amber-400 font-black text-xs uppercase tracking-widest mb-2">Best Suited For</p>
                                            <p className="text-amber-200 text-sm">{b.best_for}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {b.traits.map(t => (
                                                <div key={t} className="flex items-start gap-2 text-xs text-green-200">
                                                    <CheckCircle2 size={10} className="text-green-500 mt-0.5 flex-shrink-0" />{t}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <h3 className="text-white font-black text-lg pt-2">पशु देखभाल गाइड</h3>
                        {CATTLE_CARE.map(c => (
                            <div key={c.title} className="glass-card border border-transparent hover:border-amber-900/20 transition">
                                <div className="flex items-center gap-4 p-5 cursor-pointer" onClick={() => setExpandedCare(p => p === c.title ? null : c.title)}>
                                    <span className="text-2xl">{c.icon}</span>
                                    <p className="text-white font-black flex-1">{c.title}</p>
                                    {expandedCare === c.title ? <ChevronUp size={16} className="text-amber-600" /> : <ChevronDown size={16} className="text-amber-600" />}
                                </div>
                                {expandedCare === c.title && (
                                    <div className="border-t border-amber-900/20 p-5">
                                        <ul className="space-y-2">{c.tips.map(t => <li key={t} className="text-green-300 text-sm flex items-start gap-2"><CheckCircle2 size={10} className="text-green-500 mt-0.5 flex-shrink-0" />{t}</li>)}</ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* GOAT */}
                {tab === "Goat & Sheep" && (
                    <div className="space-y-4">
                        <div className="glass-card p-5 bg-green-900/10 border-green-900/20">
                            <p className="text-white font-black mb-2">🐐 बकरी पालन क्यों?</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-300">
                                {["कम लागत, जल्दी return (18-month cycle)", "मांस, दूध, खाद — तीनों फायदे", "KCC से loan + NLM से 50% subsidy", "महिलाओं के लिए ideal — घर से manage करें", "100 बकरी unit से ₹2–3 lakh/year income", "Small land needed — browsing animals"].map(x => (
                                    <div key={x} className="flex items-start gap-2"><CheckCircle2 size={10} className="text-green-500 mt-0.5 flex-shrink-0" /><span className="text-xs">{x}</span></div>
                                ))}
                            </div>
                        </div>
                        <h3 className="text-white font-black text-lg">Top Breeds</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {GOAT_BREEDS.map(g => (
                                <div key={g.name} className="glass-card p-5 hover:border-amber-800/30 border border-transparent transition space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">🐐</span>
                                        <div><h4 className="text-white font-black">{g.name}</h4><p className="text-amber-500 text-xs">{g.best}</p></div>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="text-green-300 text-xs border border-green-900/30 rounded-full px-3 py-0.5">🥛 {g.milk}</span>
                                        <span className="text-yellow-300 text-xs border border-yellow-900/30 rounded-full px-3 py-0.5">⚖️ {g.weight}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1">
                                        {g.features.map(f => <div key={f} className="text-green-400 text-xs flex items-start gap-1"><CheckCircle2 size={8} className="mt-0.5 flex-shrink-0 text-green-600" />{f}</div>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="glass-card p-5 bg-yellow-900/10 border-yellow-900/20">
                            <p className="text-yellow-300 font-black mb-3">💰 100-Goat Unit — Income Projection</p>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                {[["Kids sold/year (2 per doe)", "100 kids × ₹3,000 = ₹3 lakh"], ["Milk income (Barbari)", "50 L/day × ₹40 = ₹2,000/day"], ["Breeding bucks", "₹8,000–15,000 each"], ["Total annual income", "~₹2.5–4 lakh"]].map(([l, v]) => (
                                    <div key={l} className="glass-card p-3 rounded-xl"><p className="text-yellow-700">{l}</p><p className="text-yellow-300 font-bold">{v}</p></div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* POULTRY */}
                {tab === "Poultry" && (
                    <div className="space-y-5">
                        {POULTRY_INFO.map(p => (
                            <div key={p.type} className="glass-card p-6 space-y-4">
                                <div className="flex items-start gap-4">
                                    <span className="text-4xl">{p.icon}</span>
                                    <div>
                                        <h3 className="text-white font-black text-lg">{p.type}</h3>
                                        <p className="text-green-400 font-bold text-sm">{p.income}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="glass-card p-3 rounded-xl bg-blue-900/10 border-blue-900/20">
                                        <p className="text-blue-700 text-xs font-bold uppercase tracking-widest mb-1">Starting Info</p>
                                        <p className="text-blue-200 text-xs">{p.start}</p>
                                    </div>
                                    <div className="glass-card p-3 rounded-xl bg-green-900/10 border-green-900/20">
                                        <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-1">Cost</p>
                                        <p className="text-green-200 text-xs">{p.cost}</p>
                                    </div>
                                    <div className="glass-card p-3 rounded-xl bg-amber-900/10 border-amber-900/20">
                                        <p className="text-amber-700 text-xs font-bold uppercase tracking-widest mb-1">Breeds</p>
                                        <div className="flex flex-wrap gap-1">{p.breeds.map(b => <span key={b} className="text-amber-300 text-[10px] border border-amber-800/30 rounded-full px-2 py-0.5">{b}</span>)}</div>
                                    </div>
                                </div>
                                <div className="glass-card p-4 bg-green-900/10 border-green-900/20 rounded-xl">
                                    <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2">Key Tips</p>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">{p.tips.map(t => <li key={t} className="text-green-200 text-xs flex items-start gap-1"><CheckCircle2 size={8} className="text-green-500 mt-0.5 flex-shrink-0" />{t}</li>)}</ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PIG */}
                {tab === "Pig Farming" && (
                    <div className="space-y-5">
                        <div className="glass-card p-6 space-y-4">
                            <div className="flex items-start gap-4">
                                <span className="text-4xl">🐖</span>
                                <div>
                                    <h3 className="text-white font-black text-lg">Pig Farming — सूअर पालन</h3>
                                    <p className="text-green-400 text-sm">Fastest growing livestock sector — 8–10 month cycle</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {[
                                    { title: "क्यों करें?", icon: "💰", items: ["मांस yield: 70–75% (बकरी से ज्यादा)", "8–10 months में ready to sell", "Price: ₹100–130/kg live weight", "20 sowings से 400+ piglets/year", "SC/ST farmers के लिए special subsidy (50%)", "NLM scheme: 100-pig unit पर ₹5 lakh subsidy"] },
                                    { title: "बेहतरीन Breeds", icon: "🏆", items: ["Large White Yorkshire — popular in India", "Landrace — good litter size (10–12 piglets)", "Duroc Cross — fast growth, disease resistant", "Ghungroo (Desi/WB) — hardy, local breed", "ICAR: Improved Tanki breed for NE India"] },
                                    { title: "आहार प्रबंधन", icon: "🌽", items: ["Kitchen waste + crop residue: 40% diet", "Maize/sorghum: 65% of concentrate", "Crude protein: 16–18% in feed", "Water: 10–15 L/pig/day", "Cost per kg gain: ₹60–80"] },
                                    { title: "स्वास्थ्य सावधानियाँ", icon: "💉", items: ["FMD vaccine: twice a year (same as cattle)", "Swine Fever vaccine (CSF): essential", "Deworming: Albendazole every 3 months", "Clean pens essential — disease prevention", "Vet visit: monthly for large units"] },
                                ].map(x => (
                                    <div key={x.title} className="glass-card p-4 rounded-xl">
                                        <p className="text-white font-black mb-2 flex items-center gap-2"><span>{x.icon}</span>{x.title}</p>
                                        <ul className="space-y-1">{x.items.map(i => <li key={i} className="text-green-300 text-xs flex items-start gap-1"><CheckCircle2 size={8} className="text-green-500 mt-0.5 flex-shrink-0" />{i}</li>)}</ul>
                                    </div>
                                ))}
                            </div>
                            <div className="glass-card p-4 bg-purple-900/10 border-purple-900/20 rounded-xl">
                                <p className="text-purple-300 font-black mb-2">📞 Contact for Pig Farming</p>
                                <p className="text-purple-200 text-sm">ICAR-NRCP (National Research Centre on Pig): Guwahati — <span className="font-black text-white">+91 361-2638706</span></p>
                                <p className="text-purple-600 text-xs mt-1">State Animal Husbandry Department also provides training and subsidised piglets in many states.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* FEED & HEALTH */}
                {tab === "Feed & Health" && (
                    <div className="space-y-5">
                        <CowFeedCalc />
                        <div className="glass-card p-6 space-y-4">
                            <h3 className="text-white font-black text-lg">🌿 Fodder Crops — चारा उगाएं, खर्च बचाएं</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { name: "Napier Grass (नेपियर)", yield: "40–60 tonne/acre/year", tip: "एक बार लगाओ, 5 साल चलाओ। सबसे ज्यादा yield।" },
                                    { name: "Maize (मक्का)", yield: "10–15 tonne/acre (fresh)", tip: "45–55 days में ready। Silage के लिए ideal।" },
                                    { name: "Lucerne (रिजका)", yield: "5–6 cuts/year, 2 tonne/cut", tip: "Protein से भरपूर — दूध बढ़ाती है।" },
                                    { name: "Sorghum (ज्वार)", yield: "8–12 tonne/acre", tip: "सूखे में भी होती है। North India में popular।" },
                                ].map(f => (
                                    <div key={f.name} className="glass-card p-4 rounded-xl bg-green-900/10 border-green-900/20">
                                        <p className="text-white font-black">{f.name}</p>
                                        <p className="text-green-400 text-xs font-bold">Yield: {f.yield}</p>
                                        <p className="text-green-600 text-xs mt-1">💡 {f.tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="glass-card p-6 space-y-4">
                            <h3 className="text-white font-black text-lg">💉 Vaccination Schedule</h3>
                            <div className="glass-card overflow-hidden border-amber-900/20">
                                <table className="w-full text-xs">
                                    <thead><tr className="border-b border-amber-900/20"><th className="text-amber-700 text-left px-5 py-3 font-bold uppercase tracking-widest">Animal</th><th className="text-amber-700 text-left px-5 py-3 font-bold uppercase tracking-widest">Disease</th><th className="text-amber-700 text-left px-5 py-3 font-bold uppercase tracking-widest">When</th><th className="text-amber-700 text-left px-5 py-3 font-bold uppercase tracking-widest">Free?</th></tr></thead>
                                    <tbody>
                                        {[["Cattle/Buffalo", "FMD (खुरपका)", "Jan & July", "✅ Free at Govt vet"], ["Cattle/Buffalo", "HS (घोटूवा)", "March", "✅ Free"], ["Cattle/Buffalo", "BQ", "June", "✅ Free"], ["Goat/Sheep", "PPR (Ghora Roog)", "Once in life", "✅ Free"], ["Poultry", "Ranikhet (ND)", "Day 1, 14, 28", "✅ Free (govt programme)"], ["Poultry", "IBD (Gumboro)", "Day 14 & 28", "✅ Free"], ["Pig", "CSF (Swine Fever)", "6-monthly", "✅ Free"], ["All animals", "Deworming", "Every 6 months", "Albendazole ₹5/tablet"]].map(([a, d, w, f]) => (
                                            <tr key={`${a}${d}`} className="border-b border-amber-900/10 hover:bg-amber-900/5">
                                                <td className="px-5 py-3 text-white font-bold">{a}</td>
                                                <td className="px-5 py-3 text-amber-200">{d}</td>
                                                <td className="px-5 py-3 text-green-400">{w}</td>
                                                <td className="px-5 py-3 text-blue-300">{f}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-amber-700 text-xs">📞 Nearest Veterinary helpline: <span className="text-white font-black">1962</span> (National Animal Disease Reporting System)</p>
                        </div>
                    </div>
                )}

                {/* SCHEMES */}
                {tab === "Schemes & Finance" && (
                    <div className="space-y-4">
                        <div className="glass-card p-4 bg-green-900/10 border-green-900/20 flex items-center gap-3">
                            <AlertCircle size={18} className="text-green-400 flex-shrink-0" />
                            <p className="text-green-300 text-sm">These schemes can give you ₹50,000 to ₹7 lakh in subsidies. Don't miss them!</p>
                        </div>
                        {LIVESTOCK_SCHEMES.map(s => (
                            <div key={s.name} className="glass-card p-5 space-y-3 hover:border-amber-800/20 border border-transparent transition">
                                <div className="flex items-start gap-4">
                                    <span className="text-3xl">{s.icon}</span>
                                    <div>
                                        <h3 className="text-white font-black">{s.name}</h3>
                                        <p className="text-green-400 text-sm font-bold">{s.cover}</p>
                                        <span className="text-xs font-black text-yellow-400 bg-yellow-900/20 border border-yellow-800/30 px-2 py-0.5 rounded-full">{s.subsidy}</span>
                                    </div>
                                </div>
                                <p className="text-green-600 text-sm">{s.how}</p>
                                <div className="flex gap-3">
                                    {s.url && <a href={s.url} target="_blank" rel="noreferrer" className="btn-primary text-sm px-4 py-2 flex items-center gap-2 rounded-xl"><ExternalLink size={13} /> Apply</a>}
                                    <a href={`tel:${s.helpline}`} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2 rounded-xl"><Phone size={13} /> {s.helpline}</a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
