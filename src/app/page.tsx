"use client";
import Link from "next/link";
import { ArrowRight, Leaf, Shield, HeartPulse, TrendingUp, Brain, Cloud, Bug, Calendar, Droplets, BookOpen, MessageSquare } from "lucide-react";

const features = [
  { icon: Brain, title: "AI Crop Advisor", desc: "Get personalized crop recommendations powered by Gemini AI", href: "/ai-advisor", color: "from-purple-600 to-violet-600", badge: "AI Powered" },
  { icon: HeartPulse, title: "Health & Doctor", desc: "AI health check + connect with rural doctors via telemedicine", href: "/health", color: "from-red-600 to-pink-600", badge: "New" },
  { icon: TrendingUp, title: "Market Prices", desc: "Live mandi rates for 500+ crops updated every hour", href: "/market-prices", color: "from-yellow-600 to-amber-600", badge: "Live" },
  { icon: Cloud, title: "Weather Forecast", desc: "Hyperlocal 7-day weather forecast for your village/tehsil", href: "/weather", color: "from-sky-600 to-blue-600", badge: "" },
  { icon: Bug, title: "Pest Detector", desc: "Upload a photo — AI identifies disease or pest in seconds", href: "/pest-detector", color: "from-red-700 to-orange-600", badge: "AI Vision" },
  { icon: Calendar, title: "Crop Calendar", desc: "Season-smart planting & harvesting calendar for your region", href: "/crop-calendar", color: "from-green-600 to-emerald-600", badge: "" },
  { icon: Droplets, title: "Irrigation Planner", desc: "Smart water-saving irrigation schedule based on soil & crop", href: "/irrigation", color: "from-blue-600 to-cyan-600", badge: "" },
  { icon: BookOpen, title: "Gov. Schemes", desc: "Browse 100+ subsidies & schemes — PM-KISAN, Fasal Bima & more", href: "/schemes", color: "from-indigo-600 to-blue-600", badge: "Updated" },
  { icon: MessageSquare, title: "Community Forum", desc: "Ask questions, share knowledge with 50,000+ farmers", href: "/community", color: "from-pink-600 to-rose-600", badge: "" },
  { icon: Shield, title: "Crop Insurance", desc: "Understand, apply, and track your crop insurance claims", href: "/insurance", color: "from-teal-600 to-green-600", badge: "" },
];

const stats = [
  { label: "Active Farmers", value: "2.4L+", icon: "👨‍🌾" },
  { label: "States Covered", value: "28", icon: "🗺️" },
  { label: "Crops Supported", value: "500+", icon: "🌾" },
  { label: "AI Queries / Day", value: "10K+", icon: "🤖" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center gap-24 md:gap-32 pb-40 px-4 w-full">
      {/* Hero */}
      <section className="hero-bg rounded-xl p-6 sm:p-8 md:p-12 lg:p-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.18),transparent_55%)] opacity-90 rounded-xl" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,197,94,0.06)_1px,transparent_1px),linear-gradient(rgba(34,197,94,0.06)_1px,transparent_1px)] bg-[size:28px_28px] opacity-[0.18] rounded-xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-700/60 bg-green-950/40 text-green-200 text-xs sm:text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              India&apos;s Smart Farming Platform — अब खेती होगी स्मार्ट!
            </div>

            <h1 className="font-black leading-[1.05] tracking-tight mb-5 text-[40px] sm:text-[52px] md:text-[64px] lg:text-[72px]">
              <span className="gradient-text">RuralMate</span>{" "}
              <span className="text-white">for</span>
              <br />
              <span className="text-white">Farmers & Rural Life</span>
            </h1>

            <p className="text-green-200/80 text-base sm:text-lg md:text-xl mb-7 max-w-xl">
              Crop advice, live mandi prices, weather, schemes, health services, and tools — built for rural India with a fast, clean UI that works on every screen.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link href="/dashboard" className="btn-primary flex items-center gap-2 text-sm sm:text-base">
                Open Dashboard <ArrowRight size={18} />
              </Link>
              <Link href="/ai-advisor" className="btn-secondary flex items-center gap-2 text-sm sm:text-base">
                Talk to KisanAI
              </Link>
              <Link href="/market-prices" className="btn-secondary flex items-center gap-2 text-sm sm:text-base">
                Check Prices
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-green-300/70">
              <span className="px-3 py-1 rounded-full border border-green-900/40 bg-green-950/20">Hindi + English</span>
              <span className="px-3 py-1 rounded-full border border-green-900/40 bg-green-950/20">Mobile-first</span>
              <span className="px-3 py-1 rounded-full border border-green-900/40 bg-green-950/20">Offline-friendly</span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="glass-card p-6 sm:p-7 lg:p-8 bg-green-950/25 border-green-700/20 overflow-hidden">
              <div className="absolute -right-14 -top-14 w-44 h-44 rounded-full bg-green-500/15 blur-2xl" />
              <div className="absolute -left-14 -bottom-14 w-44 h-44 rounded-full bg-sky-500/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-lime-400 flex items-center justify-center text-black font-black">
                      🌾
                    </div>
                    <div>
                      <p className="text-white font-bold leading-tight">Today at your farm</p>
                      <p className="text-green-400/70 text-xs">Quick overview</p>
                    </div>
                  </div>
                  <span className="badge-success text-xs">Live</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg bg-green-900/15 border border-green-900/30">
                    <p className="text-green-400 text-xs mb-1">Weather</p>
                    <p className="text-white font-black text-2xl">24°C</p>
                    <p className="text-green-300/60 text-xs">Partly cloudy</p>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-900/15 border border-yellow-900/25">
                    <p className="text-yellow-300 text-xs mb-1">Wheat</p>
                    <p className="text-white font-black text-2xl">₹2,250</p>
                    <p className="text-yellow-200/60 text-xs">+₹45 today</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-900/15 border border-purple-900/25 col-span-2">
                    <p className="text-purple-300 text-xs mb-1">KisanAI tip</p>
                    <p className="text-green-100 text-sm leading-relaxed">
                      Spray fungicide before Wednesday rain; avoid urea top dressing during heavy humidity.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute right-6 -top-3 text-4xl animate-float hidden md:block">☀️</div>
            <div className="absolute -left-2 bottom-2 text-4xl animate-float hidden md:block" style={{ animationDelay: "1s" }}>🌱</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stats.map(stat => (
            <div key={stat.label} className="stat-card text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-black gradient-text">{stat.value}</div>
              <div className="text-green-300/60 text-xs sm:text-sm mt-1 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Everything You Need</h2>
            <p className="text-green-200/60 mt-2">32+ features built for rural India</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <Link href="/features" className="btn-secondary text-sm flex items-center gap-2">
              All Features
            </Link>
            <Link href="/dashboard" className="btn-secondary text-sm flex items-center gap-2">
              Open Dashboard <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, href, color, badge }) => (
            <Link key={href} href={href} className="glass-card p-6 group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className={`feature-icon bg-gradient-to-br ${color}`}>
                  <Icon size={22} className="text-white" />
                </div>
                {badge && <span className="badge-success text-xs">{badge}</span>}
              </div>
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-green-300 transition">{title}</h3>
              <p className="text-green-600 text-sm leading-relaxed">{desc}</p>
              <div className="mt-4 flex items-center gap-1 text-green-500 text-xs font-medium opacity-0 group-hover:opacity-100 transition">
                Open <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI Doctor CTA */}
      <section className="rounded-xl p-8 bg-gradient-to-r from-red-900/40 to-pink-900/30 border border-red-700/30">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="text-6xl">🏥</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">AI Doctor + Telemedicine</h2>
            <p className="text-red-200">Get instant health advice from our AI, or video-call a licensed rural health doctor from your phone. No travel required — healthcare comes to you.</p>
          </div>
          <Link href="/health" className="flex-shrink-0 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition flex items-center gap-2">
            <HeartPulse size={18} /> Find a Doctor
          </Link>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="rounded-lg p-6 border border-red-900/40 bg-red-950/20">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div>
            <h3 className="text-red-400 font-bold text-lg">🆘 Emergency Helplines</h3>
            <p className="text-red-300 text-sm">For immediate help in any rural emergency</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="badge-danger">📞 Kisan: 1800-180-1551</span>
            <span className="badge-danger">🏥 Medical: 108</span>
            <span className="badge-danger">👮 Police: 100</span>
            <span className="badge-danger">🌊 NDRF: 011-24363260</span>
          </div>
        </div>
      </section>
    </div>
  );
}
