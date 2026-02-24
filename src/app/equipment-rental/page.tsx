"use client";
import { useState } from "react";
import { Wrench, Search, Star, MapPin, Phone, Plus, X, Clock, CheckCircle2, Calendar, AlertCircle } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

const CATEGORIES = ["All", "Tractors", "Harvesters", "Tillers", "Sprayers", "Irrigation", "Threshers", "Seed Drills", "Other"];

interface Equipment {
    id: number; name: string; category: string; icon: string;
    ratePerDay: string; ratePerAcre?: string;
    owner: string; location: string; state: string; phone: string;
    rating: number; reviews: number; available: boolean;
    hp?: number; year?: number; desc: string; features: string[];
    verified: boolean; bookedDates?: string[];
}

const EQUIPMENT_LIST: Equipment[] = [
    {
        id: 1, name: "Mahindra 585 DI Tractor (85 HP)", category: "Tractors", icon: "🚜",
        ratePerDay: "₹2,500", ratePerAcre: "₹600",
        owner: "Suresh Kumar", location: "Ujjain, MP", state: "MP", phone: "+91 94250 12345",
        rating: 4.8, reviews: 34, available: true, hp: 85, year: 2022,
        desc: "Heavy-duty tractor for all field ops — ploughing, tilling, sowing. Comes with driver.",
        features: ["Includes driver", "Disc harrow attachment", "Rotavator attached", "Fuel at owner cost"],
        verified: true, bookedDates: ["Mar 5", "Mar 6"],
    },
    {
        id: 2, name: "John Deere 5050D (50 HP)", category: "Tractors", icon: "🚜",
        ratePerDay: "₹1,800", ratePerAcre: "₹450",
        owner: "Ramesh Patel", location: "Indore, MP", state: "MP", phone: "+91 98765 00001",
        rating: 4.6, reviews: 21, available: true, hp: 50, year: 2020,
        desc: "Versatile mid-size tractor. Good for 1–5 acres. Multiple attachments available.",
        features: ["Self-drive or with driver", "Cultivator & seed drill", "GPS tracking"],
        verified: true, bookedDates: ["Mar 8"],
    },
    {
        id: 3, name: "Combine Harvester (Swaraj 8100)", category: "Harvesters", icon: "🌾",
        ratePerDay: "₹8,000", ratePerAcre: "₹2,200",
        owner: "Cooperative Society", location: "Patiala, PB", state: "PB", phone: "+91 98154 00001",
        rating: 4.9, reviews: 67, available: true,
        desc: "Full-size combine harvester for wheat, paddy & mustard. High-speed, GPS-fitted.",
        features: ["Cuts + threshes", "3 acres/hour", "GPS mapping", "Wide header (17 ft)"],
        verified: true, bookedDates: ["Mar 10", "Mar 11", "Mar 12"],
    },
    {
        id: 4, name: "Mini Rice Harvester (Self-propelled)", category: "Harvesters", icon: "🌾",
        ratePerDay: "₹2,200",
        owner: "Govind Agri", location: "Patna, BR", state: "BR", phone: "+91 91111 00001",
        rating: 4.4, reviews: 13, available: true,
        desc: "Compact harvester for small plots ≤2 acres. Can navigate narrow farms.",
        features: ["Works in waterlogged fields", "Cuts paddy & wheat", "No trampling losses"],
        verified: false, bookedDates: [],
    },
    {
        id: 5, name: "Rotavator with Tractor (24 Blades)", category: "Tillers", icon: "⚙️",
        ratePerDay: "₹1,500", ratePerAcre: "₹400",
        owner: "Kailash Singh", location: "Jodhpur, RJ", state: "RJ", phone: "+91 94141 00001",
        rating: 4.7, reviews: 28, available: true,
        desc: "Rotavator attached to 50HP tractor. Ideal for seedbed preparation and residue mixing.",
        features: ["Tractor + rotavator combo", "2.5 acres/hour", "Adjustable depth 15–20 cm"],
        verified: true, bookedDates: ["Mar 7"],
    },
    {
        id: 6, name: "Power Tiller (7.5 HP, Walk-behind)", category: "Tillers", icon: "🔧",
        ratePerDay: "₹800",
        owner: "Rajesh Mishra", location: "Varanasi, UP", state: "UP", phone: "+91 99000 00001",
        rating: 4.2, reviews: 9, available: true,
        desc: "Compact power tiller for small plots, garden beds, hilly terrain.",
        features: ["Easy to operate", "Fits small plots", "Fuel efficient"],
        verified: false, bookedDates: [],
    },
    {
        id: 7, name: "Tractor-mounted Boom Sprayer (400L)", category: "Sprayers", icon: "💦",
        ratePerDay: "₹1,200", ratePerAcre: "₹200",
        owner: "Agri Services MP", location: "Bhopal, MP", state: "MP", phone: "+91 77600 00001",
        rating: 4.6, reviews: 19, available: true,
        desc: "600-litre boom sprayer for pesticide/herbicide/fungicide application. 12-metre boom.",
        features: ["12-metre boom", "GPS auto-section control", "Reduced chemical use by 20%"],
        verified: true, bookedDates: [],
    },
    {
        id: 8, name: "Drone Sprayer (5-litre capacity)", category: "Sprayers", icon: "🚁",
        ratePerDay: "₹4,500", ratePerAcre: "₹350",
        owner: "FlyAg Drone Services", location: "Nagpur, MH", state: "MH", phone: "+91 96500 00001",
        rating: 4.9, reviews: 42, available: true,
        desc: "Agricultural drone for precision pesticide/fertilizer spray. GPS auto-path planning.",
        features: ["1 acre in 8 min", "GPS precision spray", "Nano-particle dispersion", "Govt approved"],
        verified: true, bookedDates: ["Mar 5", "Mar 6", "Mar 7"],
    },
    {
        id: 9, name: "Drip Irrigation Setup Service", category: "Irrigation", icon: "💧",
        ratePerDay: "₹2,000",
        owner: "AquaFarm Infra", location: "Nashik, MH", state: "MH", phone: "+91 98222 00001",
        rating: 4.8, reviews: 31, available: true,
        desc: "Complete drip irrigation installation for vegetable/fruit crops. 1-year support.",
        features: ["Layout design", "Installation in 1–2 days", "1-year maintenance", "Subsidy help"],
        verified: true, bookedDates: [],
    },
    {
        id: 10, name: "Multi-crop Thresher (Electric)", category: "Threshers", icon: "⚙️",
        ratePerDay: "₹900",
        owner: "Yadav Farm Equipment", location: "Lucknow, UP", state: "UP", phone: "+91 84400 00001",
        rating: 4.5, reviews: 16, available: true,
        desc: "Threshing machine for wheat, paddy, chickpea, soybean. Daily rental at farm.",
        features: ["Works for 6 crops", "1.5 tonne/hour", "Easy transport"],
        verified: false, bookedDates: [],
    },
    {
        id: 11, name: "Seed Drill (9-row, Tractor-mounted)", category: "Seed Drills", icon: "🌱",
        ratePerDay: "₹1,400", ratePerAcre: "₹300",
        owner: "Modern Agri Tools", location: "Jaipur, RJ", state: "RJ", phone: "+91 94130 00001",
        rating: 4.7, reviews: 23, available: true,
        desc: "9-row seed drill for uniform sowing of wheat, mustard, pulses. Precise seed rate control.",
        features: ["Adjustable seed rate", "Furrow opener", "9 rows simultaneously", "2 acres/hour"],
        verified: true, bookedDates: [],
    },
    {
        id: 12, name: "Cold Storage Unit (Portable, 5 Tonne)", category: "Other", icon: "🧊",
        ratePerDay: "₹1,800",
        owner: "CoolAgri Services", location: "Ahmedabad, GJ", state: "GJ", phone: "+91 98790 00001",
        rating: 4.6, reviews: 8, available: true,
        desc: "Portable cold storage container for 5 tonne capacity. Ideal for onion, potato, veggies.",
        features: ["2°C–10°C temp range", "Moves to farm", "Electricity included", "Daily rental"],
        verified: true, bookedDates: [],
    },
];

export default function EquipmentRentalPage() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [contact, setContact] = useState<Equipment | null>(null);
    const [selectedDate, setSelectedDate] = useState("");

    const filtered = EQUIPMENT_LIST.filter(e =>
        (category === "All" || e.category === category) &&
        (e.name.toLowerCase().includes(query.toLowerCase()) ||
            e.location.toLowerCase().includes(query.toLowerCase()) ||
            e.owner.toLowerCase().includes(query.toLowerCase()))
    );

    return (
        <div className="flex flex-col items-center gap-14 pb-20 px-4 w-full">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-8 w-full max-w-4xl pt-2">
                <ExploreButton />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-600 to-zinc-600 flex items-center justify-center shadow-2xl shadow-slate-950/40">
                    <Wrench size={40} className="text-white" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-3">Equipment Rental</h1>
                    <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-sm">Tractors · Drones · Harvesters · Near You</p>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full">
                    {[
                        { label: "Available Now", value: EQUIPMENT_LIST.filter(e => e.available).length.toString(), icon: "✅" },
                        { label: "Equipment Types", value: (CATEGORIES.length - 1).toString(), icon: "🔧" },
                        { label: "Avg Daily Rate", value: "₹1,800", icon: "💰" },
                    ].map(s => (
                        <div key={s.label} className="glass-card p-4 text-center">
                            <p className="text-2xl mb-1">{s.icon}</p>
                            <p className="text-white font-black">{s.value}</p>
                            <p className="text-green-800 text-[10px] font-bold uppercase tracking-widest mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* How it works */}
            <div className="w-full max-w-6xl glass-card p-6 border-slate-900/20 bg-slate-900/10">
                <h3 className="text-white font-black mb-4 flex items-center gap-2">⚡ How Rental Works</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { step: "1", label: "Browse", desc: "Find equipment near you" },
                        { step: "2", label: "Book Date", desc: "Select your date & contact owner" },
                        { step: "3", label: "Confirm", desc: "Agree on rate & advance" },
                        { step: "4", label: "Use & Pay", desc: "Equipment arrives at farm" },
                    ].map(s => (
                        <div key={s.step} className="text-center">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-black text-lg mx-auto mb-2">{s.step}</div>
                            <p className="text-white font-bold text-sm">{s.label}</p>
                            <p className="text-slate-500 text-xs">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="w-full max-w-6xl space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-700" />
                        <input className="input-field pl-9 w-full text-sm" placeholder="Search equipment, location, owner..." value={query} onChange={e => setQuery(e.target.value)} />
                    </div>
                    <input type="date" className="input-field text-sm px-3 rounded-xl" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} placeholder="Filter by date" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setCategory(c)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${category === c ? "bg-slate-700/50 border-slate-500 text-slate-200" : "glass-card border-transparent text-green-600 hover:text-green-300"}`}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Equipment Grid */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map(e => (
                    <div key={e.id} className="glass-card flex flex-col hover:border-slate-700/40 border border-transparent transition-all">
                        <div className="p-5">
                            <div className="flex items-start gap-4 mb-3">
                                <span className="text-4xl flex-shrink-0">{e.icon}</span>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-white font-black">{e.name}</h3>
                                        {e.verified && <CheckCircle2 size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />}
                                    </div>
                                    <p className="text-slate-400 text-xs flex items-center gap-1 mt-1"><MapPin size={10} /> {e.location}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-3">
                                <div>
                                    <span className="text-white font-black text-xl">{e.ratePerDay}</span>
                                    <span className="text-green-700 text-xs ml-1">/day</span>
                                </div>
                                {e.ratePerAcre && (
                                    <div className="glass-card px-3 py-1 rounded-lg">
                                        <span className="text-green-400 font-bold text-sm">{e.ratePerAcre}</span>
                                        <span className="text-green-700 text-xs ml-1">/acre</span>
                                    </div>
                                )}
                                {e.hp && <span className="text-slate-500 text-xs border border-slate-800 rounded-full px-2 py-0.5">{e.hp} HP</span>}
                                {e.year && <span className="text-slate-500 text-xs border border-slate-800 rounded-full px-2 py-0.5">{e.year}</span>}
                            </div>

                            <p className="text-green-600 text-xs mb-3 leading-relaxed">{e.desc}</p>

                            <div className="flex flex-wrap gap-2 mb-3">
                                {e.features.map(f => (
                                    <span key={f} className="text-slate-400 text-[10px] bg-slate-900/30 border border-slate-800/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <CheckCircle2 size={8} className="text-green-600" /> {f}
                                    </span>
                                ))}
                            </div>

                            {e.bookedDates && e.bookedDates.length > 0 && (
                                <div className="text-xs text-yellow-600 flex items-center gap-1 mb-3">
                                    <Clock size={10} /> Booked: {e.bookedDates.join(", ")}
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={10} className={s <= Math.round(e.rating) ? "text-yellow-400 fill-yellow-400" : "text-green-900"} />
                                    ))}
                                </div>
                                <span className="text-green-600 text-xs">{e.rating} ({e.reviews} bookings)</span>
                            </div>
                        </div>

                        <div className="border-t border-green-900/20 p-4 flex gap-2">
                            <button onClick={() => setContact(e)}
                                className="btn-primary flex-1 text-sm py-2.5 flex items-center justify-center gap-2 rounded-xl">
                                <Phone size={14} /> Book Now
                            </button>
                            <div className="glass-card px-3 flex items-center text-green-600 text-sm rounded-xl">
                                {e.owner.split(" ")[0]}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Contact Modal */}
            {contact && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center p-4" onClick={() => setContact(null)}>
                    <div className="glass-card p-7 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between">
                            <div>
                                <h3 className="text-white font-black">{contact.name}</h3>
                                <p className="text-slate-500 text-xs">{contact.owner} · {contact.location}</p>
                            </div>
                            <button onClick={() => setContact(null)} className="text-green-700 hover:text-red-400"><X size={20} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="glass-card p-3 text-center rounded-xl">
                                <p className="text-white font-black">{contact.ratePerDay}</p>
                                <p className="text-green-700 text-xs">/day</p>
                            </div>
                            {contact.ratePerAcre && (
                                <div className="glass-card p-3 text-center rounded-xl">
                                    <p className="text-white font-black">{contact.ratePerAcre}</p>
                                    <p className="text-green-700 text-xs">/acre</p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2 text-xs">
                            <div className="flex flex-wrap gap-2">
                                {contact.features.map(f => (
                                    <span key={f} className="text-green-300 text-[10px] bg-green-900/20 px-2 py-1 rounded">{f}</span>
                                ))}
                            </div>
                        </div>
                        <a href={`tel:${contact.phone}`} className="btn-primary w-full py-4 text-center flex items-center justify-center gap-3 text-xl font-black rounded-xl">
                            <Phone size={22} /> {contact.phone}
                        </a>
                        <div className="text-yellow-600 text-xs flex items-start gap-2">
                            <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
                            Always agree on rate, advance and damage terms before booking.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
