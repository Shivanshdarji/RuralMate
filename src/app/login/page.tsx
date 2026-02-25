"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sprout, Phone, User, Loader2, ArrowRight, MapPin, Leaf,
  CheckCircle2, Tractor, ChevronRight, Shield, Zap, Heart
} from "lucide-react";

const STATES = ["Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
const CROPS = ["Wheat", "Paddy", "Maize", "Soybean", "Mustard", "Cotton", "Sugarcane", "Chickpea", "Groundnut", "Onion", "Tomato", "Potato", "Tur Dal", "Moong", "Bajra"];

const FEATURES = [
  { icon: Zap, label: "AI Crop Advisor", desc: "Real-time disease & pest diagnosis" },
  { icon: Leaf, label: "Market Prices", desc: "Live MSP & mandi rates" },
  { icon: Heart, label: "Health & Schemes", desc: "Govt schemes & telemedicine" },
  { icon: Shield, label: "Crop Insurance", desc: "PMFBY & weather protection" },
];

// ─── Step 1: Phone + Name ─────────────────────────────────────────────────────
function StepAuth({ onNext }: { onNext: (phone: string, name: string) => void }) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function fmt(v: string) {
    // keep only digits and + at start
    const digits = v.replace(/[^\d]/g, "");
    if (digits.length <= 5) return digits;
    if (digits.length <= 10) return `${digits.slice(0, 5)} ${digits.slice(5)}`;
    return `${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
  }

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const clean = phone.replace(/\s/g, "");
    if (clean.length < 10) { setError("Enter a valid 10-digit mobile number"); return; }
    if (!name.trim()) { setError("Please enter your name"); return; }
    setLoading(true);
    // Attempt sign-in first to validate
    const res = await signIn("credentials", { redirect: false, phone: clean, name: name.trim() });
    setLoading(false);
    if (res?.error) { setError("Something went wrong. Please try again."); return; }
    onNext(clean, name.trim());
  }

  return (
    <form onSubmit={handle} className="space-y-5">
      <div>
        <label className="text-green-500 text-xs font-black uppercase tracking-widest mb-2 block">आपका नाम (Your Name) *</label>
        <div className="relative">
          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-700" />
          <input
            type="text" value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ramesh Patel"
            className="input-field pl-10 w-full text-base"
            autoFocus
          />
        </div>
      </div>
      <div>
        <label className="text-green-500 text-xs font-black uppercase tracking-widest mb-2 block">मोबाइल नंबर (Mobile Number) *</label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <Phone size={15} className="text-green-700" />
            <span className="text-green-600 text-sm font-bold border-r border-green-900 pr-2">+91</span>
          </div>
          <input
            type="tel" value={phone}
            onChange={e => setPhone(fmt(e.target.value))}
            placeholder="98765 43210"
            maxLength={11}
            className="input-field pl-20 w-full text-base tracking-wider"
          />
        </div>
        <p className="text-green-900 text-[11px] mt-1.5 flex items-center gap-1">
          <Shield size={10} /> Your number is your login ID — no OTP needed in this version
        </p>
      </div>

      {error && (
        <div className="text-red-400 text-xs bg-red-900/10 border border-red-900/20 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading}
        className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base font-black rounded-xl disabled:opacity-60 mt-2">
        {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : <>Continue <ArrowRight size={18} /></>}
      </button>

      <p className="text-green-900 text-[11px] text-center leading-relaxed">
        New farmer? You&apos;ll set up your farm profile in the next step.
      </p>
    </form>
  );
}

// ─── Step 2: Farm Onboarding ──────────────────────────────────────────────────
function StepFarm({ name, phone, callbackUrl }: { name: string; phone: string; callbackUrl: string }) {
  const router = useRouter();
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [land, setLand] = useState("");
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function toggleCrop(c: string) {
    setSelectedCrops(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, village, district, state,
          land_acres: land,
          main_crops: selectedCrops.join(", "),
          profile_complete: !!(village && state),
        }),
      });
    } catch { /* silently proceed */ }
    router.push(callbackUrl);
  }

  function handleSkip() { router.push(callbackUrl); }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 bg-green-900/10 border border-green-900/20 rounded-xl p-4">
        <CheckCircle2 size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-white font-black text-sm">Welcome, {name}! 🎉</p>
          <p className="text-green-700 text-xs mt-0.5">You&apos;re logged in. Tell us about your farm for personalised advice.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-green-600 text-xs font-bold uppercase tracking-widest mb-1.5 block">Village / Town</label>
            <div className="relative">
              <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-700" />
              <input className="input-field pl-8 w-full text-sm" placeholder="Ujjain" value={village} onChange={e => setVillage(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-green-600 text-xs font-bold uppercase tracking-widest mb-1.5 block">District</label>
            <input className="input-field w-full text-sm" placeholder="Ujjain" value={district} onChange={e => setDistrict(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-green-600 text-xs font-bold uppercase tracking-widest mb-1.5 block">State</label>
            <select className="input-field w-full text-sm" value={state} onChange={e => setState(e.target.value)}>
              <option value="">Select...</option>
              {STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-green-600 text-xs font-bold uppercase tracking-widest mb-1.5 block">Land (Acres)</label>
            <div className="relative">
              <Tractor size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-700" />
              <input type="number" className="input-field pl-8 w-full text-sm" placeholder="5.5" value={land} onChange={e => setLand(e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <label className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2 block flex items-center gap-1.5"><Leaf size={11} /> Main Crops (select all)</label>
          <div className="flex flex-wrap gap-2">
            {CROPS.map(c => (
              <button key={c} type="button" onClick={() => toggleCrop(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${selectedCrops.includes(c) ? "bg-green-700/40 border-green-600 text-green-200" : "glass-card border-transparent text-green-700 hover:text-green-400"}`}>
                {selectedCrops.includes(c) ? "✓ " : ""}{c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={handleSave} disabled={saving}
          className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2 rounded-xl text-sm font-black">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><CheckCircle2 size={16} /> Save & Enter RuralMate</>}
        </button>
        <button onClick={handleSkip} className="btn-secondary px-5 py-3.5 rounded-xl text-sm flex items-center gap-1.5">
          Skip <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Inner page (uses useSearchParams — must be inside Suspense) ──────────────
function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [step, setStep] = useState<"auth" | "farm">("auth");
  const [userData, setUserData] = useState({ phone: "", name: "" });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function handleAuthNext(phone: string, name: string) {
    setUserData({ phone, name });
    setStep("farm");
  }

  return (
    <div className="min-h-screen bg-[#060f08] flex flex-col lg:flex-row overflow-hidden">

      {/* ─── Left Hero ──────────────────────────────────────────────────── */}
      <div className="lg:flex-1 flex flex-col justify-between p-8 lg:p-14 relative lg:min-h-screen overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-green-700/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-lime-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-900/40">
            <Sprout size={24} className="text-[#0a1a0d]" />
          </div>
          <div>
            <h2 className="text-white font-black text-xl tracking-tight">RuralMate</h2>
            <p className="text-green-700 text-[10px] font-bold uppercase tracking-widest">Village Edition</p>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative py-12 lg:py-0">
          <div className="inline-flex items-center gap-3 text-xs font-black text-green-500 bg-green-950/40 border border-green-800/40 px-4 py-2 rounded-full mb-8 animate-fade-in shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
            Used by 50,000+ Progressive Farmers
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-6 drop-shadow-2xl">
            Empowering<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400">
              India&apos;s Fields
            </span>
          </h1>
          <p className="text-green-600/80 text-lg max-w-md leading-relaxed font-medium mb-10">
            The next generation of farming starts here. Real-time insights, AI-powered diagnosis, and a supportive community for the modern Kisan.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            {FEATURES.map((f, i) => (
              <div key={f.label}
                className={`glass-card p-5 border-green-900/10 hover:border-green-600/30 group transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-10 h-10 rounded-xl bg-green-900/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <f.icon size={20} className="text-green-400" />
                </div>
                <p className="text-white font-black text-sm mb-1">{f.label}</p>
                <p className="text-green-800 text-xs leading-snug">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust badge */}
        <div className="relative flex items-center gap-6 pt-12 border-t border-green-900/10">
          <div className="flex -space-x-3">
            {[
              { label: "RK", color: "from-green-600 to-emerald-600" },
              { label: "MP", color: "from-blue-600 to-indigo-600" },
              { label: "SS", color: "from-amber-600 to-orange-600" },
              { label: "GD", color: "from-rose-600 to-pink-600" },
            ].map((p, i) => (
              <div key={p.label} className={`w-10 h-10 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-[10px] font-black text-white border-2 border-[#060f08] shadow-lg animate-fade-in`} style={{ transitionDelay: `${i * 150}ms` }}>{p.label}</div>
            ))}
          </div>
          <div className="space-y-0.5">
            <p className="text-white font-bold text-sm">Join the Revolution</p>
            <p className="text-green-700 text-xs font-medium">1,247 farmers signed up today</p>
          </div>
        </div>
      </div>

      {/* ─── Right Panel ─────────────────────────────────────────────────── */}
      <div className="lg:w-[480px] flex items-center justify-center p-6 lg:p-12 bg-[#0a1a0d]/60 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-green-900/20">
        <div className="w-full max-w-md">

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {["Login", "Farm Setup"].map((label, i) => {
              const isActive = (i === 0 && step === "auth") || (i === 1 && step === "farm");
              const isDone = i === 0 && step === "farm";
              return (
                <div key={label} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black transition-all ${isActive ? "bg-green-700/40 border border-green-600 text-green-200" : isDone ? "text-green-600" : "text-green-900"}`}>
                    {isDone ? <CheckCircle2 size={12} /> : <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]" style={{ borderColor: isActive ? "#4ade80" : "#1a3320" }}>{i + 1}</span>}
                    {label}
                  </div>
                  {i === 0 && <ChevronRight size={12} className="text-green-900" />}
                </div>
              );
            })}
          </div>

          <div className="glass-card p-7 border-green-900/20">
            {step === "auth" ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-white mb-1">
                    {step === "auth" ? "Sign In / Register" : "Your Farm"}
                  </h2>
                  <p className="text-green-700 text-sm">New or returning − same login for all.</p>
                </div>
                <StepAuth onNext={handleAuthNext} />
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-white mb-1">Set Up Your Farm</h2>
                  <p className="text-green-700 text-sm">Help us personalise advice for you.</p>
                </div>
                <StepFarm name={userData.name} phone={userData.phone} callbackUrl={callbackUrl} />
              </>
            )}
          </div>

          <p className="mt-5 text-green-900 text-[11px] text-center leading-relaxed">
            🔒 Your data is stored securely. We never share it with third parties.<br />
            RuralMate — Made with ❤️ for India&apos;s farmers
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page (Suspense wrapper required for useSearchParams) ─────────────────
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#060f08] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-green-900 border-t-green-500 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
