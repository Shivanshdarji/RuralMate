"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Edit3, MapPin, Phone, CheckCircle2, Leaf, Tractor, Loader2, Save, X, AlertCircle } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";
import { useUser } from "@/context/UserContext";

const STATES = ["Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
const CROPS = ["Wheat", "Paddy", "Maize", "Soybean", "Mustard", "Cotton", "Sugarcane", "Chickpea", "Groundnut", "Onion", "Tomato", "Potato", "Tur Dal", "Moong", "Urad", "Jowar", "Bajra"];
const LIVESTOCK_OPTIONS = ["Cattle/Cows", "Buffalo", "Goat", "Sheep", "Poultry", "Pig", "None"];

interface EditForm {
    name: string; phone: string; village: string; district: string;
    state: string; land_acres: string; main_crops: string; livestock: string;
}

export default function ProfilePage() {
    const { data: session } = useSession();
    const { profile, loadingProfile, updateProfile, refreshProfile } = useUser();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState<EditForm>({ name: "", phone: "", village: "", district: "", state: "", land_acres: "", main_crops: "", livestock: "" });

    useEffect(() => {
        if (profile) {
            setForm({ name: profile.name || session?.user?.name || "", phone: profile.phone || (session?.user as any)?.phone || "", village: profile.village || "", district: profile.district || "", state: profile.state || "", land_acres: profile.land_acres || "", main_crops: profile.main_crops || "", livestock: profile.livestock || "" });
        }
    }, [profile, session]);

    function toggleCrop(crop: string) {
        const current = form.main_crops ? form.main_crops.split(",").map(s => s.trim()).filter(Boolean) : [];
        const updated = current.includes(crop) ? current.filter(c => c !== crop) : [...current, crop];
        setForm(f => ({ ...f, main_crops: updated.join(", ") }));
    }
    function toggleLivestock(item: string) {
        const current = form.livestock ? form.livestock.split(",").map(s => s.trim()).filter(Boolean) : [];
        const updated = current.includes(item) ? current.filter(c => c !== item) : [...current, item];
        setForm(f => ({ ...f, livestock: updated.join(", ") }));
    }

    async function handleSave() {
        setSaving(true);
        await updateProfile({ ...form, profile_complete: !!(form.name && form.village && form.state) });
        setSaving(false); setSaved(true); setEditing(false);
        setTimeout(() => setSaved(false), 3000);
    }

    const displayName = profile?.name || session?.user?.name || "Kisan Ji";
    const initials = displayName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
    const crops = profile?.main_crops ? profile.main_crops.split(",").map(s => s.trim()).filter(Boolean) : [];
    const selectedCrops = form.main_crops ? form.main_crops.split(",").map(s => s.trim()).filter(Boolean) : [];
    const selectedLivestock = form.livestock ? form.livestock.split(",").map(s => s.trim()).filter(Boolean) : [];

    if (loadingProfile) return (
        <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
            <Loader2 size={32} className="text-green-500 animate-spin" />
            <p className="text-green-600 text-sm">Loading your profile...</p>
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-8 pb-20 px-4 w-full">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-6 w-full max-w-3xl pt-2">
                <ExploreButton />
                <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-lime-400 flex items-center justify-center text-3xl font-black text-black shadow-2xl shadow-green-950/40">
                        {initials}
                    </div>
                    {profile?.profile_complete && (
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shadow-lg">
                            <CheckCircle2 size={16} className="text-white" />
                        </div>
                    )}
                </div>
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-1">{displayName}</h1>
                    {profile?.village && <p className="text-green-600 flex items-center justify-center gap-1 text-sm font-bold"><MapPin size={12} /> {profile.village}{profile.district ? `, ${profile.district}` : ""}{profile.state ? `, ${profile.state}` : ""}</p>}
                    {profile?.phone && <p className="text-green-700 flex items-center justify-center gap-1 text-xs mt-1"><Phone size={10} /> {profile.phone}</p>}
                </div>
                {saved && (
                    <div className="flex items-center gap-2 text-green-400 text-sm font-bold bg-green-900/20 border border-green-800/30 px-4 py-2 rounded-xl">
                        <CheckCircle2 size={16} /> Profile saved successfully!
                    </div>
                )}

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl">
                {[
                    { label: "Land", value: profile?.land_acres ? `${profile.land_acres} Acres` : "—", icon: "🌾" },
                    { label: "Crops", value: crops.length ? `${crops.length} Active` : "—", icon: "🌱" },
                    { label: "Livestock", value: profile?.livestock ? "Yes" : "—", icon: "🐄" },
                    { label: "Member Since", value: "2025", icon: "⭐" },
                ].map(s => (
                    <div key={s.label} className="glass-card p-4 text-center">
                        <p className="text-2xl mb-1">{s.icon}</p>
                        <p className="text-white font-black">{s.value}</p>
                        <p className="text-green-800 text-[10px] font-bold uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Edit / View Panel */}
            <div className="w-full max-w-3xl space-y-4">
                {!editing ? (
                    <>
                        {/* View mode */}
                        <div className="glass-card p-6 space-y-5">
                            <div className="flex justify-between items-center">
                                <h2 className="text-white font-black flex items-center gap-2"><User size={18} className="text-green-400" /> Farm Details</h2>
                                <button onClick={() => setEditing(true)} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2 rounded-xl">
                                    <Edit3 size={14} /> Edit Profile
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: "Full Name", value: profile?.name || "Not set" },
                                    { label: "Phone", value: profile?.phone || "Not set" },
                                    { label: "Village", value: profile?.village || "Not set" },
                                    { label: "District", value: profile?.district || "Not set" },
                                    { label: "State", value: profile?.state || "Not set" },
                                    { label: "Land Owned", value: profile?.land_acres ? `${profile.land_acres} Acres` : "Not set" },
                                ].map(f => (
                                    <div key={f.label} className="glass-card p-4 rounded-xl bg-green-900/10">
                                        <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-1">{f.label}</p>
                                        <p className="text-white font-bold">{f.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {crops.length > 0 && (
                            <div className="glass-card p-6">
                                <h3 className="text-white font-black mb-4 flex items-center gap-2"><Leaf size={16} className="text-green-400" /> My Crops</h3>
                                <div className="flex flex-wrap gap-2">
                                    {crops.map(c => <span key={c} className="text-green-300 text-sm bg-green-900/20 border border-green-800/30 px-3 py-1.5 rounded-full font-bold">🌱 {c}</span>)}
                                </div>
                            </div>
                        )}

                        {profile?.livestock && (
                            <div className="glass-card p-6">
                                <h3 className="text-white font-black mb-4 flex items-center gap-2"><Tractor size={16} className="text-amber-400" /> My Livestock</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.livestock.split(",").map(s => s.trim()).filter(Boolean).map(l => (
                                        <span key={l} className="text-amber-300 text-sm bg-amber-900/20 border border-amber-800/30 px-3 py-1.5 rounded-full font-bold">{l}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!profile?.profile_complete && (
                            <button onClick={() => setEditing(true)} className="w-full glass-card p-5 flex items-center gap-4 hover:border-green-700/40 border border-dashed border-green-900/40 transition">
                                <div className="w-10 h-10 rounded-xl bg-green-900/20 flex items-center justify-center"><Edit3 size={18} className="text-green-500" /></div>
                                <div className="text-left flex-1">
                                    <p className="text-white font-black">Complete Your Profile</p>
                                    <p className="text-green-700 text-xs">Add village, land, crops for personalized advice</p>
                                </div>
                                <span className="text-green-800 text-xs bg-green-900/20 px-3 py-1.5 rounded-full">⚡ Incomplete</span>
                            </button>
                        )}
                    </>
                ) : (
                    /* Edit mode */
                    <div className="glass-card p-6 space-y-5 border-green-800/30">
                        <div className="flex justify-between items-center">
                            <h2 className="text-white font-black flex items-center gap-2"><Edit3 size={18} className="text-green-400" /> Edit Profile</h2>
                            <button onClick={() => setEditing(false)} className="p-2 text-green-700 hover:text-red-400 transition rounded-xl"><X size={18} /></button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { key: "name", label: "Full Name", placeholder: "Ramesh Patel" },
                                { key: "phone", label: "Phone Number", placeholder: "+91 98765 43210" },
                                { key: "village", label: "Village", placeholder: "Ujjain" },
                                { key: "district", label: "District", placeholder: "Ujjain" },
                                { key: "land_acres", label: "Land Owned (Acres)", placeholder: "5.5" },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2 block">{f.label}</label>
                                    <input className="input-field w-full text-sm" placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                                </div>
                            ))}
                            <div>
                                <label className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2 block">State</label>
                                <select className="input-field w-full text-sm" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}>
                                    <option value="">Select State</option>
                                    {STATES.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-green-600 text-xs font-bold uppercase tracking-widest mb-3 block">Main Crops (select all that apply)</label>
                            <div className="flex flex-wrap gap-2">
                                {CROPS.map(c => (
                                    <button key={c} type="button" onClick={() => toggleCrop(c)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${selectedCrops.includes(c) ? "bg-green-700/40 border-green-600 text-green-200" : "glass-card border-transparent text-green-700 hover:text-green-400"}`}>
                                        {selectedCrops.includes(c) ? "✓ " : ""}{c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-green-600 text-xs font-bold uppercase tracking-widest mb-3 block">Livestock (select all that apply)</label>
                            <div className="flex flex-wrap gap-2">
                                {LIVESTOCK_OPTIONS.map(l => (
                                    <button key={l} type="button" onClick={() => toggleLivestock(l)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${selectedLivestock.includes(l) ? "bg-amber-700/40 border-amber-600 text-amber-200" : "glass-card border-transparent text-green-700 hover:text-green-400"}`}>
                                        {selectedLivestock.includes(l) ? "✓ " : ""}{l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 rounded-xl text-sm">
                                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Profile</>}
                            </button>
                            <button onClick={() => setEditing(false)} className="btn-secondary px-6 py-3 rounded-xl text-sm">Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
