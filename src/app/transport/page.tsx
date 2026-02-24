"use client";
import { useState } from "react";
import { Truck, Search, MapPin, Phone, Star, CheckCircle2, X, Clock, AlertCircle, Package, ArrowRight } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

const TRANSPORT_TYPES = ["All", "Truck", "Mini Truck", "Tempo", "Tractor Trolley", "Cold Chain", "Ambulance Van"];

interface TransportListing {
    id: number; vehicleType: string; icon: string; category: string;
    owner: string; location: string; phone: string;
    capacity: string; ratePerKm: string; rateMin?: string;
    rating: number; reviews: number; available: boolean;
    desc: string; routes: string[]; features: string[];
    verified: boolean; vehicle?: string;
}

const TRANSPORT_LIST: TransportListing[] = [
    {
        id: 1, vehicleType: "Eicher 10.16 Truck (8-tonne)", icon: "🚛", category: "Truck",
        owner: "Rajesh Transport", location: "Indore, MP", phone: "+91 94250 71001",
        capacity: "8 tonne", ratePerKm: "₹25–30/km", rateMin: "₹2,000 min",
        rating: 4.7, reviews: 42, available: true,
        desc: "For bulk grains, fertilizers, vegetables. Available for intra and inter-state routes.",
        routes: ["Indore → Nagpur", "Indore → Bhopal", "Indore → Delhi"],
        features: ["GPS tracked", "Tarpaulin cover", "Loading/unloading help", "Night driving"],
        verified: true, vehicle: "Eicher 10.16",
    },
    {
        id: 2, vehicleType: "Tata 407 Mini Truck (2-tonne)", icon: "🚚", category: "Mini Truck",
        owner: "Shyam Carriers", location: "Jaipur, RJ", phone: "+91 98141 71002",
        capacity: "2 tonne", ratePerKm: "₹14–18/km", rateMin: "₹800 min",
        rating: 4.5, reviews: 29, available: true,
        desc: "Ideal for 1–2 tonne loads. Quick delivery to local mandis and cold stores.",
        routes: ["Jaipur local", "Jaipur → Ajmer", "Jaipur → Kota"],
        features: ["Open/closed body", "Local mandi pickup", "Quick turnaround"],
        verified: true, vehicle: "Tata 407",
    },
    {
        id: 3, vehicleType: "Mahindra Bolero Pickup (1 tonne)", icon: "🚙", category: "Tempo",
        owner: "Ganesh Transport", location: "Nashik, MH", phone: "+91 78910 71003",
        capacity: "1 tonne", ratePerKm: "₹10–13/km", rateMin: "₹500 min",
        rating: 4.4, reviews: 18, available: true,
        desc: "For small quantities — perfect for getting produce from farm to mandi.",
        routes: ["Nashik local", "Farm to mandi"],
        features: ["Short notice pickup", "Half-load accepted", "Very affordable"],
        verified: false, vehicle: "Bolero Pickup",
    },
    {
        id: 4, vehicleType: "Tractor Trolley (4 tonne)", icon: "🚜", category: "Tractor Trolley",
        owner: "Ramesh Agri Transport", location: "Ujjain, MP", phone: "+91 94250 71004",
        capacity: "4–5 tonne", ratePerKm: "₹12/km", rateMin: "₹600 min",
        rating: 4.3, reviews: 11, available: true,
        desc: "Tractor-trolley for farm-to-farm or farm-to-mandi. Best for grains, sugarcane.",
        routes: ["Farm to mandi (within 50 km)"],
        features: ["No road tax issues", "Navigate village roads", "Cheap for short haul"],
        verified: false, vehicle: "Tractor + Trolley",
    },
    {
        id: 5, vehicleType: "Refrigerated Truck (Cold Chain, 3 tonne)", icon: "🧊", category: "Cold Chain",
        owner: "CoolMove Logistics", location: "Pune, MH", phone: "+91 98222 71005",
        capacity: "3 tonne", ratePerKm: "₹40–50/km", rateMin: "₹4,000 min",
        rating: 4.9, reviews: 61, available: true,
        desc: "Temperature-controlled (2°C–8°C) for vegetables, fruits, dairy, flowers.",
        routes: ["Pune → Mumbai", "Pune → Bangalore", "Pan Maharashtra"],
        features: ["Temp monitoring", "GPS real-time", "Pre-cooling available", "Certificate provided"],
        verified: true, vehicle: "Tata Ultra Cold",
    },
    {
        id: 6, vehicleType: "Cold Chain Mini Van (800 kg)", icon: "🚐", category: "Cold Chain",
        owner: "FreshMove Agri", location: "Hyderabad, TS", phone: "+91 94000 71006",
        capacity: "800 kg", ratePerKm: "₹25/km", rateMin: "₹1,500 min",
        rating: 4.6, reviews: 27, available: true,
        desc: "Mini refrigerated van for vegetables, dairy, flowers to local markets.",
        routes: ["Hyderabad local delivery", "Hyderabad → Warangal"],
        features: ["Daily local runs", "0–10°C range", "Fast loading"],
        verified: true, vehicle: "Mahindra Supro",
    },
    {
        id: 7, vehicleType: "Bulker Truck (Grain, 15 tonne)", icon: "🚛", category: "Truck",
        owner: "AgriBulk Transport", location: "Patiala, PB", phone: "+91 98140 71007",
        capacity: "15 tonne", ratePerKm: "₹55/km", rateMin: "₹8,000 min",
        rating: 4.8, reviews: 34, available: true,
        desc: "Large-scale grain transport. Pneumatic unloading. FCI/APMC grain movement.",
        routes: ["Punjab → Delhi", "Punjab → Haryana", "Punjab → UP Mandis"],
        features: ["Pneumatic unloading", "Stainless steel body", "GPS", "FCI empaneled"],
        verified: true, vehicle: "Ashok Leyland 2518",
    },
    {
        id: 8, vehicleType: "Ambulance-style Van (Perishables)", icon: "🌿", category: "Ambulance Van",
        owner: "FastFresh Logistics", location: "Bengaluru, KA", phone: "+91 80000 71008",
        capacity: "500 kg", ratePerKm: "₹20/km", rateMin: "₹1,200 min",
        rating: 4.7, reviews: 19, available: true,
        desc: "Ultra-fast delivery for high-value, short shelf-life produce: flowers, herbs, leafy greens.",
        routes: ["Bangalore to city markets", "Farm → Hotels & restaurants"],
        features: ["2-hour delivery SLA", "Track & trace", "Door-to-door"],
        verified: false, vehicle: "Force Traveller",
    },
];

const RATES_GUIDE = [
    { from: "Farm → Local mandi (within 20 km)", vehicle: "Tractor trolley / Bolero", est: "₹400–800 one-way" },
    { from: "Farm → District mandi (50–100 km)", vehicle: "Mini truck (Tata 407)", est: "₹1,000–1,800" },
    { from: "State highway (100–300 km)", vehicle: "Full truck (Eicher/Tata)", est: "₹3,000–8,000" },
    { from: "Inter-state (300–800 km)", vehicle: "Full truck / Bulker", est: "₹8,000–22,000" },
    { from: "Perishable (cold chain, 50+ km)", vehicle: "Refrigerated truck", est: "₹2,500–6,000" },
];

export default function TransportPage() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [contact, setContact] = useState<TransportListing | null>(null);

    const filtered = TRANSPORT_LIST.filter(t =>
        (category === "All" || t.category === category) &&
        (t.vehicleType.toLowerCase().includes(query.toLowerCase()) ||
            t.location.toLowerCase().includes(query.toLowerCase()) ||
            t.owner.toLowerCase().includes(query.toLowerCase()) ||
            t.routes.some(r => r.toLowerCase().includes(query.toLowerCase())))
    );

    return (
        <div className="flex flex-col items-center gap-14 pb-20 px-4 w-full">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-8 w-full max-w-4xl pt-2">
                <ExploreButton />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-600 to-red-600 flex items-center justify-center shadow-2xl shadow-rose-950/40">
                    <Truck size={40} className="text-white" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-3">Farm Transport</h1>
                    <p className="text-rose-400 font-black uppercase tracking-[0.4em] text-sm">Trucks · Cold Chain · Mandi Delivery</p>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full">
                    {[
                        { label: "Available Vehicles", value: TRANSPORT_LIST.filter(t => t.available).length.toString(), icon: "🚛" },
                        { label: "Vehicle Types", value: (TRANSPORT_TYPES.length - 1).toString(), icon: "🔧" },
                        { label: "Starting Rate", value: "₹10/km", icon: "💰" },
                    ].map(s => (
                        <div key={s.label} className="glass-card p-4 text-center">
                            <p className="text-2xl mb-1">{s.icon}</p>
                            <p className="text-white font-black">{s.value}</p>
                            <p className="text-green-800 text-[10px] font-bold uppercase tracking-widest mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rate Guide */}
            <div className="w-full max-w-6xl">
                <h2 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                    <Package size={18} className="text-rose-400" /> Typical Transport Rates
                </h2>
                <div className="glass-card overflow-hidden border-rose-900/20">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-green-900/20">
                                <th className="text-green-700 text-left px-5 py-3 font-bold text-xs uppercase tracking-widest">Route</th>
                                <th className="text-green-700 text-left px-5 py-3 font-bold text-xs uppercase tracking-widest">Suggested Vehicle</th>
                                <th className="text-green-700 text-right px-5 py-3 font-bold text-xs uppercase tracking-widest">Est. Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RATES_GUIDE.map((r, i) => (
                                <tr key={i} className="border-b border-green-900/10 hover:bg-green-900/5 transition">
                                    <td className="px-5 py-3 text-white text-xs">{r.from}</td>
                                    <td className="px-5 py-3 text-rose-400 text-xs font-bold">{r.vehicle}</td>
                                    <td className="px-5 py-3 text-right text-green-400 font-black text-xs">{r.est}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-green-900 text-xs mt-2">* Rates are approximate. Negotiate directly with transporter. Prices vary by route, season & load.</p>
            </div>

            {/* Search & Filter */}
            <div className="w-full max-w-6xl space-y-4">
                <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-700" />
                    <input className="input-field pl-9 w-full text-sm" placeholder="Search by location, vehicle type, or route..." value={query} onChange={e => setQuery(e.target.value)} />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {TRANSPORT_TYPES.map(c => (
                        <button key={c} onClick={() => setCategory(c)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${category === c ? "bg-rose-700/40 border-rose-600 text-rose-200" : "glass-card border-transparent text-green-600 hover:text-green-300"}`}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Vehicle Listing */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map(t => (
                    <div key={t.id} className="glass-card flex flex-col hover:border-rose-800/30 border border-transparent transition-all">
                        <div className="p-5 flex-1">
                            <div className="flex items-start gap-4 mb-3">
                                <span className="text-4xl">{t.icon}</span>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-white font-black text-sm leading-snug">{t.vehicleType}</h3>
                                        {t.verified && <CheckCircle2 size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />}
                                    </div>
                                    <p className="text-rose-400 text-xs mt-0.5 flex items-center gap-1"><MapPin size={10} /> {t.location}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-3">
                                <div>
                                    <span className="text-white font-black text-lg">{t.ratePerKm}</span>
                                </div>
                                {t.rateMin && (
                                    <span className="text-green-700 text-xs border border-green-900/30 rounded-full px-2 py-0.5">{t.rateMin}</span>
                                )}
                                <span className="text-rose-500 text-xs border border-rose-900/30 rounded-full px-2 py-0.5">📦 {t.capacity}</span>
                            </div>

                            <p className="text-green-600 text-xs mb-3 leading-relaxed">{t.desc}</p>

                            {/* Routes */}
                            <div className="mb-3">
                                <p className="text-green-800 text-[10px] font-bold uppercase tracking-widest mb-1.5">Common Routes</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {t.routes.map(r => (
                                        <span key={r} className="text-rose-300 text-[10px] bg-rose-900/10 border border-rose-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <ArrowRight size={8} /> {r}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Features */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {t.features.map(f => (
                                    <span key={f} className="text-slate-400 text-[10px] bg-slate-900/30 border border-slate-800/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <CheckCircle2 size={7} className="text-green-600" /> {f}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={10} className={s <= Math.round(t.rating) ? "text-yellow-400 fill-yellow-400" : "text-green-900"} />
                                    ))}
                                </div>
                                <span className="text-green-600 text-xs">{t.rating} ({t.reviews} trips)</span>
                            </div>
                        </div>

                        <div className="border-t border-green-900/20 p-4 flex gap-2">
                            <button onClick={() => setContact(t)} className="btn-primary flex-1 text-sm py-2.5 flex items-center justify-center gap-2 rounded-xl">
                                <Phone size={14} /> Book Truck
                            </button>
                            <div className="glass-card px-3 flex items-center text-green-600 text-sm rounded-xl">
                                {t.owner.split(" ")[0]}
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-2 glass-card p-16 text-center text-green-800">
                        <Truck size={32} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No vehicles found. Try searching by location or route.</p>
                    </div>
                )}
            </div>

            {/* Contact Modal */}
            {contact && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center p-4" onClick={() => setContact(null)}>
                    <div className="glass-card p-7 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between">
                            <div>
                                <h3 className="text-white font-black">{contact.owner}</h3>
                                <p className="text-rose-400 text-xs">{contact.vehicleType}</p>
                                <p className="text-green-600 text-xs flex items-center gap-1 mt-0.5"><MapPin size={10} /> {contact.location}</p>
                            </div>
                            <button onClick={() => setContact(null)} className="text-green-700 hover:text-red-400"><X size={20} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="glass-card p-3 text-center rounded-xl">
                                <p className="text-green-700 text-xs font-bold">Rate</p>
                                <p className="text-white font-black text-sm">{contact.ratePerKm}</p>
                            </div>
                            <div className="glass-card p-3 text-center rounded-xl">
                                <p className="text-green-700 text-xs font-bold">Capacity</p>
                                <p className="text-white font-black text-sm">{contact.capacity}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            {contact.routes.map(r => (
                                <div key={r} className="text-rose-300 text-xs flex items-center gap-2 p-2 rounded-lg bg-rose-900/10">
                                    <ArrowRight size={10} /> {r}
                                </div>
                            ))}
                        </div>
                        <a href={`tel:${contact.phone}`} className="btn-primary w-full py-4 text-center flex items-center justify-center gap-3 text-xl font-black rounded-xl">
                            <Phone size={22} /> {contact.phone}
                        </a>
                        <div className="text-yellow-600 text-xs flex items-start gap-2">
                            <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
                            Confirm load size, route and advance before booking. Always get a receipt.
                        </div>
                    </div>
                </div>
            )}

            {/* Tip banner */}
            <div className="glass-card p-5 max-w-6xl w-full bg-rose-900/10 border-rose-900/20 flex items-start gap-4">
                <AlertCircle size={20} className="text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-rose-300 font-bold text-sm mb-1">Tips for safe transport</p>
                    <p className="text-rose-600 text-xs">Weigh produce before loading · Book in advance during harvest season · Prefer GPS-tracked vehicles for long routes · Insure high-value produce during transport</p>
                </div>
            </div>
        </div>
    );
}
