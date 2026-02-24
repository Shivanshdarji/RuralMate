"use client";
import { useEffect, useState } from "react";
import { Bell, Globe, Volume2, Shield, Ruler, Moon, Save, Loader2, CheckCircle2, AlertCircle, LogOut, RotateCcw } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";
import { useUser } from "@/context/UserContext";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
    return (
        <button onClick={() => onChange(!on)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${on ? "bg-green-600" : "bg-green-900/40 border border-green-900"}`}>
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${on ? "left-7" : "left-1"}`} />
        </button>
    );
}

export default function SettingsPage() {
    const { data: session } = useSession();
    const { settings, loadingSettings, updateSettings } = useUser();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [local, setLocal] = useState(settings);

    useEffect(() => { if (settings) setLocal(settings); }, [settings]);

    function update(key: string, val: unknown) {
        setLocal(prev => prev ? { ...prev, [key]: val } : null);
    }

    async function handleSave() {
        if (!local) return;
        setSaving(true);
        await updateSettings(local);
        setSaving(false); setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    function handleReset() {
        updateSettings({
            language: "hi", notifications_weather: true, notifications_market: true,
            notifications_schemes: true, notifications_pest: true,
            units_area: "acre", units_weight: "quintal", theme: "dark",
            voice_language: "hi-IN", auto_location: true,
        });
    }

    if (loadingSettings) return (
        <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
            <Loader2 size={32} className="text-green-500 animate-spin" />
            <p className="text-green-600 text-sm">Loading settings...</p>
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-8 pb-20 px-4 w-full">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-6 w-full max-w-3xl pt-2">
                <ExploreButton />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-600 to-zinc-600 flex items-center justify-center shadow-2xl">
                    <span className="text-3xl">⚙️</span>
                </div>
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-1">Settings</h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Your preferences — auto-saved to Supabase</p>
                </div>
                {saved && (
                    <div className="flex items-center gap-2 text-green-400 text-sm font-bold bg-green-900/20 border border-green-800/30 px-4 py-2 rounded-xl">
                        <CheckCircle2 size={16} /> Settings saved!
                    </div>
                )}
            </div>

            <div className="w-full max-w-3xl space-y-4">

                {/* Language & Voice */}
                <div className="glass-card p-6 space-y-4">
                    <h3 className="text-white font-black flex items-center gap-2"><Globe size={16} className="text-blue-400" /> Language & Voice</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2 block">App Language</label>
                            <select className="input-field w-full text-sm" value={local?.language ?? "hi"} onChange={e => update("language", e.target.value)}>
                                <option value="hi">हिंदी (Hindi)</option>
                                <option value="en">English</option>
                                <option value="mr">मराठी (Marathi)</option>
                                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                                <option value="te">తెలుగు (Telugu)</option>
                                <option value="ta">தமிழ் (Tamil)</option>
                                <option value="gu">ગુજરાતી (Gujarati)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2 block">AI Voice Language</label>
                            <select className="input-field w-full text-sm" value={local?.voice_language ?? "hi-IN"} onChange={e => update("voice_language", e.target.value)}>
                                <option value="hi-IN">Hindi Female</option>
                                <option value="hi-IN-male">Hindi Male</option>
                                <option value="en-IN">English (Indian)</option>
                                <option value="mr-IN">Marathi</option>
                                <option value="pa-IN">Punjabi</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Units */}
                <div className="glass-card p-6 space-y-4">
                    <h3 className="text-white font-black flex items-center gap-2"><Ruler size={16} className="text-orange-400" /> Measurement Units</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2 block">Area Unit</label>
                            <select className="input-field w-full text-sm" value={local?.units_area ?? "acre"} onChange={e => update("units_area", e.target.value)}>
                                <option value="acre">Acre (एकड़)</option>
                                <option value="bigha">Bigha (बीघा)</option>
                                <option value="hectare">Hectare (हेक्टेयर)</option>
                                <option value="guntha">Guntha / Gunta</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2 block">Weight Unit</label>
                            <select className="input-field w-full text-sm" value={local?.units_weight ?? "quintal"} onChange={e => update("units_weight", e.target.value)}>
                                <option value="quintal">Quintal (क्विंटल)</option>
                                <option value="kg">Kilogram (किग्रा)</option>
                                <option value="tonne">Tonne (टन)</option>
                                <option value="maund">Maund (मन)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="glass-card p-6 space-y-4">
                    <h3 className="text-white font-black flex items-center gap-2"><Bell size={16} className="text-yellow-400" /> Notifications & Alerts</h3>
                    <div className="space-y-3">
                        {[
                            { key: "notifications_weather", label: "Weather Alerts", desc: "Rain, heat wave, frost warnings" },
                            { key: "notifications_market", label: "Market Price Updates", desc: "When your crop prices change by ±5%" },
                            { key: "notifications_schemes", label: "Scheme Deadline Alerts", desc: "PM-KISAN, PMFBY, and other deadlines" },
                            { key: "notifications_pest", label: "Pest & Disease Alerts", desc: "Nearby pest outbreak warnings" },
                        ].map(n => (
                            <div key={n.key} className="flex items-center justify-between py-3 border-b border-green-900/20 last:border-0">
                                <div>
                                    <p className="text-white font-bold text-sm">{n.label}</p>
                                    <p className="text-green-700 text-xs">{n.desc}</p>
                                </div>
                                <Toggle on={!!(local as any)?.[n.key]} onChange={v => update(n.key, v)} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Privacy */}
                <div className="glass-card p-6 space-y-4">
                    <h3 className="text-white font-black flex items-center gap-2"><Shield size={16} className="text-purple-400" /> Privacy & Location</h3>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-white font-bold text-sm">Auto-Detect Location</p>
                            <p className="text-green-700 text-xs">Used for weather & nearby market prices</p>
                        </div>
                        <Toggle on={!!local?.auto_location} onChange={v => update("auto_location", v)} />
                    </div>
                    <div className="glass-card p-4 bg-purple-900/10 border-purple-900/20 rounded-xl space-y-2 text-xs text-purple-400">
                        <p className="font-bold">🔒 Your data is secure:</p>
                        <p className="text-purple-600">• We never sell your data to third parties</p>
                        <p className="text-purple-600">• Location is only used for weather and market features</p>
                        <p className="text-purple-600">• You can delete your account and all data at any time</p>
                    </div>
                </div>

                {/* Save */}
                <div className="flex gap-3">
                    <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2 rounded-xl text-sm font-bold">
                        {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Settings</>}
                    </button>
                    <button onClick={handleReset} className="btn-secondary px-5 py-3.5 rounded-xl text-sm flex items-center gap-2">
                        <RotateCcw size={14} /> Reset
                    </button>
                </div>

                {/* Account section */}
                <div className="glass-card p-6 space-y-4">
                    <h3 className="text-white font-black flex items-center gap-2"><Shield size={16} className="text-red-400" /> Account</h3>
                    {session?.user && (
                        <div className="flex items-center gap-4 glass-card p-4 bg-green-900/10 border-transparent rounded-xl">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-lime-400 flex items-center justify-center font-black text-black text-sm">
                                {(session.user.name || "K").slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-black">{session.user.name || "Kisan Ji"}</p>
                                <p className="text-green-700 text-xs">{(session.user as any).phone || "Logged in"}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-3 flex-wrap">
                        <button className="btn-secondary text-xs px-4 py-2.5 rounded-xl">Privacy Policy</button>
                        <button className="btn-secondary text-xs px-4 py-2.5 rounded-xl">Terms of Use</button>
                        <button className="btn-secondary text-xs px-4 py-2.5 rounded-xl">Contact Support</button>
                    </div>
                    <button onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-full flex items-center justify-center gap-2 text-red-400 border border-red-900/30 bg-red-900/10 hover:bg-red-900/20 py-3 rounded-xl text-sm font-bold transition">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>

                <div className="glass-card p-4 text-center">
                    <p className="text-green-800 text-xs">RuralMate v2.0 · Made with ❤️ for Indian farmers · Data secured by Supabase</p>
                </div>
            </div>
        </div>
    );
}
