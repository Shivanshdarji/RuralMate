"use client";
import { useState } from "react";
import { ShoppingBag, Search, Star, MapPin, Phone, Heart, Plus, X, Tag, Filter, CheckCircle2, Clock } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

const CATEGORIES = ["All", "Produce", "Equipment", "Seeds & Inputs", "Livestock", "Fertilizers", "Services"];

interface Listing {
    id: number; title: string; price: string; unit: string;
    seller: string; location: string; state: string;
    rating: number; reviews: number; category: string;
    icon: string; available: boolean; posted: string;
    phone: string; desc: string; verified: boolean; badge?: string;
    minQty?: string; quality?: string;
}

const LISTINGS: Listing[] = [
    { id: 1, title: "Organic Wheat – Grade A (5 qtl)", price: "₹12,500", unit: "lot", seller: "Ramesh Patel", location: "Ujjain, MP", state: "MP", rating: 4.8, reviews: 23, category: "Produce", icon: "🌾", available: true, posted: "1 day ago", phone: "+91 94250 12345", desc: "Organically grown in Malwa region. Moisture <11%. Direct farm collection.", verified: true, badge: "Organic", minQty: "5 qtl", quality: "Grade A" },
    { id: 2, title: "Fresh A-Grade Onion (10 qtl)", price: "₹19,000", unit: "lot", seller: "Dnyaneshwar Yadav", location: "Nashik, MH", state: "MH", rating: 5.0, reviews: 41, category: "Produce", icon: "🧅", available: true, posted: "Today", phone: "+91 78910 23456", desc: "Medium-large red onion. Ready for immediate dispatch. Sack packaging available.", verified: true, badge: "Premium", minQty: "2 qtl", quality: "Grade A" },
    { id: 3, title: "Organic Turmeric Powder (50 kg)", price: "₹6,000", unit: "lot", seller: "Kamla Devi", location: "Erode, TN", state: "TN", rating: 4.9, reviews: 34, category: "Produce", icon: "🟡", available: true, posted: "Today", phone: "+91 88123 45678", desc: "Pure Salem turmeric, 3-4% curcumin. Lab-tested. No preservatives.", verified: true, badge: "Lab Tested", minQty: "10 kg", quality: "Export Grade" },
    { id: 4, title: "Soybean (Kharif 2025 – 20 qtl)", price: "₹88,000", unit: "lot", seller: "Pradeep Sharma", location: "Indore, MP", state: "MP", rating: 4.6, reviews: 18, category: "Produce", icon: "🌿", available: true, posted: "2 days ago", phone: "+91 99001 23456", desc: "Bold soybean, moisture 10%. Clean and machine-graded. FCI grading certificate.", verified: false, minQty: "5 qtl", quality: "Grade B+" },
    { id: 5, title: "Fresh Garlic (5 qtl)", price: "₹40,000", unit: "lot", seller: "Kailash Gurjar", location: "Neemuch, MP", state: "MP", rating: 4.7, reviews: 12, category: "Produce", icon: "🧄", available: true, posted: "3 days ago", phone: "+91 98765 11111", desc: "White garlic, large bulb size (60+ mm). Storage variety. Ready for wholesale.", verified: true, badge: "FOB Farm", minQty: "1 qtl", quality: "Grade A" },
    { id: 6, title: "Chilli (Byadagi Dry – 2 qtl)", price: "₹36,000", unit: "lot", seller: "Srinivasa Naik", location: "Hubli, KA", state: "KA", rating: 4.5, reviews: 9, category: "Produce", icon: "🌶️", available: true, posted: "2 days ago", phone: "+91 91234 77777", desc: "Byadagi variety, deep red, low-pungent, high colour value (ASTA 90+).", verified: false, minQty: "50 kg", quality: "Export Grade" },
    { id: 7, title: "Mahindra 575 DI Tractor (2020)", price: "₹5.8 Lakh", unit: "negotiable", seller: "Suresh Singh", location: "Agra, UP", state: "UP", rating: 4.5, reviews: 8, category: "Equipment", icon: "🚜", available: true, posted: "3 days ago", phone: "+91 98765 43210", desc: "Single owner. 1,200 hours. New tyres, all original parts. Full documents available.", verified: true, badge: "Verified Seller", minQty: "", quality: "" },
    { id: 8, title: "Drip Irrigation Kit (1 acre)", price: "₹8,500", unit: "set", seller: "Green Agri Depot", location: "Jaipur, RJ", state: "RJ", rating: 4.7, reviews: 17, category: "Equipment", icon: "💧", available: true, posted: "2 days ago", phone: "+91 91234 56789", desc: "Complete kit with mainline, drip laterals, emitters & filters. Easy installation guide.", verified: true, badge: "ISI Marked", minQty: "1 set", quality: "" },
    { id: 9, title: "Power Knapsack Sprayer (16L)", price: "₹3,200", unit: "unit", seller: "Farm Tools Hub", location: "Bhopal, MP", state: "MP", rating: 4.4, reviews: 26, category: "Equipment", icon: "🔧", available: true, posted: "1 day ago", phone: "+91 77654 00000", desc: "Battery-powered 16L sprayer. 3-hour battery life. Adjustable nozzle. 1-year warranty.", verified: false, minQty: "1", quality: "" },
    { id: 10, title: "HF Holstein Milch Cow (12L/day)", price: "₹55,000", unit: "negotiable", seller: "Govind Dairy", location: "Karnal, HR", state: "HR", rating: 4.6, reviews: 6, category: "Livestock", icon: "🐄", available: true, posted: "5 days ago", phone: "+91 99887 76543", desc: "3-year old, vaccinated & vet-checked. Producing 12L/day. Serious buyers only.", verified: true, badge: "Vet Certified", minQty: "", quality: "" },
    { id: 11, title: "Murrah Buffalo – High Yield", price: "₹85,000", unit: "negotiable", seller: "Balwinder Singh", location: "Ludhiana, PB", state: "PB", rating: 4.8, reviews: 11, category: "Livestock", icon: "🐃", available: true, posted: "4 days ago", phone: "+91 98140 22222", desc: "Pure Murrah breed. 15L/day average. Third lactation. Health certificate available.", verified: true, badge: "Vet Certified", minQty: "", quality: "" },
    { id: 12, title: "Hybrid Bt Cotton Seeds (5 kg)", price: "₹1,800", unit: "pack", seller: "Kisan Input Store", location: "Amravati, MH", state: "MH", rating: 4.4, reviews: 12, category: "Seeds & Inputs", icon: "🌿", available: true, posted: "Today", phone: "+91 77654 32109", desc: "NuCOTN 36B+ variety. Boll weevil resistant. Suitable for irrigated & rainfed.", verified: false, minQty: "1 pack", quality: "Certified" },
    { id: 13, title: "Paddy Seed – PR-126 (25 kg)", price: "₹900", unit: "bag", seller: "Punjab Seed Corp", location: "Patiala, PB", state: "PB", rating: 4.9, reviews: 47, category: "Seeds & Inputs", icon: "🌾", available: true, posted: "Today", phone: "+91 98155 33333", desc: "PAU-certified. Early-maturing, high-yielding. Disease-resistant. Treated seed.", verified: true, badge: "Govt Certified", minQty: "25 kg", quality: "Foundation" },
    { id: 14, title: "Vermicompost (2 tonne)", price: "₹4,000", unit: "lot", seller: "Bio Agri Farm", location: "Pune, MH", state: "MH", rating: 4.8, reviews: 29, category: "Fertilizers", icon: "🌱", available: true, posted: "2 days ago", phone: "+91 91111 22222", desc: "Certified organic vermicompost. Rich in NPK & micronutrients. 50-kg bags.", verified: true, badge: "Organic Cert.", minQty: "500 kg", quality: "" },
    { id: 15, title: "DAP Fertilizer (50 kg bag)", price: "₹1,350", unit: "bag", seller: "Agri Supply Co.", location: "Surat, GJ", state: "GJ", rating: 4.3, reviews: 19, category: "Fertilizers", icon: "🧪", available: true, posted: "1 day ago", phone: "+91 90000 11111", desc: "Diammonium Phosphate (DAP). Govt MRP. GST bill provided. Minimum 10 bags.", verified: true, badge: "Govt MRP", minQty: "10 bags", quality: "" },
    { id: 16, title: "Soil Testing Service (per acre)", price: "₹299", unit: "acre", seller: "KVK Lab Services", location: "Pan India", state: "PAN", rating: 4.7, reviews: 88, category: "Services", icon: "🔬", available: true, posted: "Today", phone: "+91 1800 180 1551", desc: "12-parameter soil test. Report in 7 days. Fertilizer recommendations included. Home collection.", verified: true, badge: "KVK Accredited", minQty: "1 acre", quality: "" },
];

export default function MarketplacePage() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [contact, setContact] = useState<Listing | null>(null);
    const [showNew, setShowNew] = useState(false);
    const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc" | "rating">("default");
    const [newForm, setNewForm] = useState({ title: "", price: "", catg: "Produce", location: "", phone: "", desc: "" });
    const [items, setItems] = useState<Listing[]>(LISTINGS);
    const [showWishlist, setShowWishlist] = useState(false);

    const toggleWishlist = (id: number) =>
        setWishlist(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

    let filtered = items.filter(l =>
        (category === "All" || l.category === category) &&
        (!showWishlist || wishlist.includes(l.id)) &&
        (l.title.toLowerCase().includes(query.toLowerCase()) ||
            l.seller.toLowerCase().includes(query.toLowerCase()) ||
            l.location.toLowerCase().includes(query.toLowerCase()))
    );
    if (sortBy === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

    const handlePost = () => {
        if (!newForm.title || !newForm.price || !newForm.location || !newForm.desc) return;
        const listing: Listing = {
            id: Date.now(), title: newForm.title, price: newForm.price, unit: "negotiable",
            seller: "You (New Listing)", location: newForm.location, state: "",
            rating: 0, reviews: 0, category: newForm.catg || "Produce", icon: "📦",
            available: true, posted: "Just now", phone: newForm.phone, desc: newForm.desc,
            verified: false,
        };
        setItems(p => [listing, ...p]);
        setNewForm({ title: "", price: "", catg: "Produce", location: "", phone: "", desc: "" });
        setShowNew(false);
    };

    return (
        <div className="flex flex-col items-center gap-14 pb-20 px-4 w-full">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-8 w-full max-w-4xl pt-2">
                <ExploreButton />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-500 flex items-center justify-center shadow-2xl shadow-orange-950/40">
                    <ShoppingBag size={40} className="text-white" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-3">Farm Marketplace</h1>
                    <p className="text-orange-400 font-black uppercase tracking-[0.4em] text-sm">Buy · Sell · Connect Directly</p>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full">
                    {[
                        { label: "Active Listings", value: items.filter(l => l.available).length.toString(), icon: "📦" },
                        { label: "Verified Sellers", value: items.filter(l => l.verified).length.toString(), icon: "✅" },
                        { label: "Wishlist", value: wishlist.length.toString(), icon: "❤️" },
                    ].map(s => (
                        <div key={s.label} className="glass-card p-4 text-center">
                            <p className="text-2xl mb-1">{s.icon}</p>
                            <p className="text-white font-black">{s.value}</p>
                            <p className="text-green-800 text-[10px] font-bold uppercase tracking-widest mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-6xl space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-700" />
                        <input className="input-field pl-9 w-full text-sm" placeholder="Search produce, equipment, sellers..." value={query} onChange={e => setQuery(e.target.value)} />
                    </div>
                    <select className="input-field text-sm rounded-xl px-3" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
                        <option value="default">Default</option>
                        <option value="rating">Top Rated</option>
                    </select>
                    <button onClick={() => setShowWishlist(w => !w)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border transition ${showWishlist ? "bg-red-800/30 border-red-600 text-red-300" : "glass-card text-green-500"}`}>
                        <Heart size={14} className={showWishlist ? "fill-red-400 text-red-400" : ""} /> Wishlist ({wishlist.length})
                    </button>
                    <button onClick={() => setShowNew(true)} className="btn-primary px-4 py-2 text-sm flex items-center gap-2 rounded-xl font-bold">
                        <Plus size={14} /> Post Listing
                    </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setCategory(c)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${category === c ? "bg-orange-700/40 border-orange-600 text-orange-200" : "glass-card border-transparent text-green-600 hover:text-green-300"}`}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Listings Grid */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(l => (
                    <div key={l.id} className={`glass-card flex flex-col hover:border-orange-800/30 border border-transparent transition-all ${!l.available ? "opacity-60" : ""}`}>
                        <div className="p-5 flex-1">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3">
                                    <span className="text-3xl">{l.icon}</span>
                                    <div>
                                        <h3 className="text-white font-black text-sm leading-tight">{l.title}</h3>
                                        {l.badge && (
                                            <span className="text-[10px] font-bold text-orange-400 bg-orange-900/20 px-2 py-0.5 rounded-full border border-orange-800/30 mt-1 inline-block">{l.badge}</span>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => toggleWishlist(l.id)} className={`p-1.5 rounded-lg transition flex-shrink-0 ${wishlist.includes(l.id) ? "text-red-400" : "text-green-900 hover:text-red-400"}`}>
                                    <Heart size={16} className={wishlist.includes(l.id) ? "fill-red-400" : ""} />
                                </button>
                            </div>

                            <p className="text-orange-400 font-black text-xl mb-1">{l.price} <span className="text-green-700 text-sm font-normal">/ {l.unit}</span></p>

                            {(l.minQty || l.quality) && (
                                <div className="flex gap-2 mb-2">
                                    {l.minQty && <span className="text-green-700 text-xs">Min: {l.minQty}</span>}
                                    {l.quality && <span className="text-blue-400 text-xs font-bold">· {l.quality}</span>}
                                </div>
                            )}

                            <p className="text-green-600 text-xs mb-3 leading-relaxed line-clamp-2">{l.desc}</p>

                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={10} className={s <= Math.round(l.rating) ? "text-yellow-400 fill-yellow-400" : "text-green-900"} />
                                    ))}
                                </div>
                                <span className="text-green-600 text-xs">{l.rating > 0 ? `${l.rating} (${l.reviews})` : "New listing"}</span>
                                {l.verified && <CheckCircle2 size={12} className="text-blue-400" />}
                            </div>

                            <div className="flex items-center gap-1 text-green-700 text-xs">
                                <MapPin size={10} /> {l.location} · <Clock size={10} className="ml-1" /> {l.posted}
                            </div>
                        </div>

                        <div className="border-t border-green-900/20 p-3 flex gap-2">
                            {l.available ? (
                                <>
                                    <button onClick={() => setContact(l)}
                                        className="btn-primary flex-1 text-xs py-2.5 flex items-center justify-center gap-2 rounded-xl">
                                        <Phone size={12} /> Contact Seller
                                    </button>
                                    <div className="glass-card px-3 py-2 text-xs text-green-500 font-bold rounded-xl">
                                        {l.seller.split(" ")[0]}
                                    </div>
                                </>
                            ) : (
                                <span className="text-red-500 text-xs font-bold py-2 px-3 w-full text-center">❌ Sold / Unavailable</span>
                            )}
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-3 glass-card p-16 text-center text-green-800">
                        <ShoppingBag size={32} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No listings found. Try a different search or category.</p>
                    </div>
                )}
            </div>

            {/* Contact Modal */}
            {contact && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setContact(null)}>
                    <div className="glass-card p-7 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-white font-black">{contact.seller}</h3>
                                <p className="text-green-600 text-xs flex items-center gap-1"><MapPin size={10} /> {contact.location}</p>
                            </div>
                            <button onClick={() => setContact(null)} className="text-green-700 hover:text-red-400"><X size={20} /></button>
                        </div>
                        <div className="bg-green-900/20 rounded-xl p-4 border border-green-900/30">
                            <p className="text-white font-bold text-sm">{contact.title}</p>
                            <p className="text-orange-400 font-black text-xl mt-1">{contact.price}</p>
                        </div>
                        <p className="text-green-300 text-sm leading-relaxed">{contact.desc}</p>
                        <a href={`tel:${contact.phone}`} className="btn-primary w-full py-4 text-center flex items-center justify-center gap-3 text-lg font-black rounded-xl">
                            <Phone size={20} /> {contact.phone}
                        </a>
                        <p className="text-green-800 text-xs text-center">Always verify quality before payment. Meet at a safe location.</p>
                    </div>
                </div>
            )}

            {/* Post Listing Modal */}
            {showNew && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNew(false)}>
                    <div className="glass-card p-7 max-w-md w-full space-y-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-white font-black flex items-center gap-2"><Plus size={18} className="text-orange-400" /> Post New Listing</h3>
                            <button onClick={() => setShowNew(false)} className="text-green-700 hover:text-red-400"><X size={20} /></button>
                        </div>
                        <input className="input-field w-full text-sm" placeholder="Title (e.g. Organic Wheat 5 qtl)" value={newForm.title} onChange={e => setNewForm(p => ({ ...p, title: e.target.value }))} />
                        <div className="grid grid-cols-2 gap-3">
                            <input className="input-field text-sm" placeholder="Price (e.g. ₹12,500)" value={newForm.price} onChange={e => setNewForm(p => ({ ...p, price: e.target.value }))} />
                            <select className="input-field text-sm" value={newForm.catg} onChange={e => setNewForm(p => ({ ...p, catg: e.target.value }))}>
                                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <input className="input-field w-full text-sm" placeholder="Location (City, State)" value={newForm.location} onChange={e => setNewForm(p => ({ ...p, location: e.target.value }))} />
                        <input className="input-field w-full text-sm" placeholder="Phone number" value={newForm.phone} onChange={e => setNewForm(p => ({ ...p, phone: e.target.value }))} />
                        <textarea className="input-field w-full text-sm h-20 resize-none" placeholder="Description — quantity, quality, pickup details..." value={newForm.desc} onChange={e => setNewForm(p => ({ ...p, desc: e.target.value }))} />
                        <button onClick={handlePost} disabled={!newForm.title || !newForm.price || !newForm.location || !newForm.desc}
                            className="btn-primary w-full py-3 text-sm font-bold disabled:opacity-40">Post Listing</button>
                    </div>
                </div>
            )}
        </div>
    );
}
