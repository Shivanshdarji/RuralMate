"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Cloud, TrendingUp, Bell, Calendar, Bug, Droplets, Brain, HeartPulse, AlertTriangle, ArrowRight, RefreshCw, CheckCircle2, Circle, Plus, Loader2, Send, Video, Phone, MapPin } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import { ExploreButton } from "@/components/layout/ExploreButton";

const quickLinks = [
    { label: "AI Advisor", href: "/ai-advisor", icon: Brain, color: "bg-purple-600" },
    { label: "Weather", href: "/weather", icon: Cloud, color: "bg-sky-600" },
    { label: "Prices", href: "/market-prices", icon: TrendingUp, color: "bg-yellow-600" },
    { label: "Doctor", href: "/health", icon: HeartPulse, color: "bg-red-600" },
    { label: "Schemes", href: "/schemes", icon: Calendar, color: "bg-indigo-600" },
    { label: "Pest", href: "/pest-detector", icon: Bug, color: "bg-orange-600" },
    { label: "Irrigation", href: "/irrigation", icon: Droplets, color: "bg-blue-600" },
    { label: "Emergency", href: "/emergency", icon: AlertTriangle, color: "bg-red-700" },
];

const alerts = [
    { type: "warning", message: "Heavy rain expected in your region on Feb 26 — delay irrigation & fertilizer application", icon: <Cloud className="text-yellow-400" /> },
    { type: "info", message: "PM-KISAN 19th installment to credit on March 15 — check your eligibility status", icon: <TrendingUp className="text-blue-400" /> },
    { type: "success", message: "Wheat prices up ₹45/quintal at Indore mandi this week — good time to sell", icon: <CheckCircle2 className="text-green-400" /> },
];

const cropActivities = [
    { crop: "Wheat", stage: "Harvesting", health: 92, image: "https://images.unsplash.com/photo-1542713396-c11651470d8a?w=400&h=300&fit=crop", daysLeft: 12 },
    { crop: "Mustard", stage: "Flowering", health: 78, image: "https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?w=400&h=300&fit=crop", daysLeft: 25 },
    { crop: "Chickpea", stage: "Pod Fill", health: 85, image: "https://images.unsplash.com/photo-1594488687399-569d6ec7a85d?w=400&h=300&fit=crop", daysLeft: 30 },
];

const recentPrices = [
    { commodity: "Wheat", price: "₹2,250", change: "+₹45", positive: true, unit: "/qtl" },
    { commodity: "Onion", price: "₹1,850", change: "-₹120", positive: false, unit: "/qtl" },
    { commodity: "Tomato", price: "₹890", change: "+₹200", positive: true, unit: "/qtl" },
    { commodity: "Rice", price: "₹2,100", change: "+₹30", positive: true, unit: "/qtl" },
];

const initialTasks = [
    { id: "1", task: "Apply 2nd irrigation to wheat field (3 acres)", done: true, priority: "High" },
    { id: "2", task: "Check for aphids on mustard crop", done: false, priority: "High" },
    { id: "3", task: "Apply potash fertilizer to chickpea", done: false, priority: "Medium" },
    { id: "4", task: "Renew Fasal Bima registration before March 1", done: false, priority: "Low" },
];

interface Task { id: string; task: string; done: boolean; priority: string; }

export default function DashboardPage() {
    const { data: session } = useSession();
    const [greeting, setGreeting] = useState("Good Morning");
    const [currentDate, setCurrentDate] = useState("");
    const { lat, lon, city: geoCity, loading: geoLoading } = useLocation();
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [newTask, setNewTask] = useState("");
    const [weather, setWeather] = useState({ temp: "--°C", desc: "Loading...", humidity: "--%", wind: "-- km/h", city: "Detecting..." });
    const [prices, setPrices] = useState(recentPrices);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [pricesLoading, setPricesLoading] = useState(true);
    const [kisanQuery, setKisanQuery] = useState("");
    const [kisanReply, setKisanReply] = useState("");
    const [kisanLoading, setKisanLoading] = useState(false);
    const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

    useEffect(() => {
        if (!lat || !lon) return;

        const fetchWeather = async () => {
            setWeatherLoading(true);
            try {
                const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
                const data = await res.json();
                if (!data.error) {
                    setWeather({
                        temp: `${Math.round(data.main?.temp || 0)}°C`,
                        desc: data.weather?.[0]?.description || "Clear",
                        humidity: `${data.main?.humidity || 0}%`,
                        wind: `${Math.round((data.wind?.speed || 0) * 3.6)} km/h`,
                        city: data.name || "Known Village"
                    });
                }
            } catch (err) {
                console.error("Weather fetch error:", err);
            } finally {
                setWeatherLoading(false);
            }
        };

        const fetchPrices = async () => {
            setPricesLoading(true);
            try {
                const res = await fetch(`/api/market-prices`);
                const data = await res.json();
                if (!data.error) {
                    setPrices(data.slice(0, 4));
                }
            } catch (err) {
                console.error("Prices fetch error:", err);
            } finally {
                setPricesLoading(false);
            }
        };

        fetchWeather();
        fetchPrices();
    }, [lat, lon]);

    useEffect(() => {
        const now = new Date();
        const h = now.getHours();
        if (h >= 5 && h < 12) setGreeting("Good Morning");
        else if (h >= 12 && h < 17) setGreeting("Good Afternoon");
        else if (h >= 17 && h < 21) setGreeting("Good Evening");
        else setGreeting("Good Night");

        setCurrentDate(now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
    }, []);

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const addTask = () => {
        if (!newTask.trim()) return;
        setTasks(prev => [...prev, { id: Date.now().toString(), task: newTask.trim(), done: false, priority: "Medium" }]);
        setNewTask("");
    };

    const askKisan = async () => {
        if (!kisanQuery.trim() || kisanLoading) return;
        const q = kisanQuery.trim();
        setKisanQuery("");
        setKisanLoading(true);
        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: `[Quick farm question from dashboard] ${q}. Give a brief, practical answer in 2-3 sentences.`, history: [] }),
            });
            const data = await res.json();
            setKisanReply(data.reply);
        } catch {
            setKisanReply("Connection error. Please try again.");
        } finally {
            setKisanLoading(false);
        }
    };

    const completedTasks = tasks.filter(t => t.done).length;

    return (
        <div className="flex flex-col items-center gap-8 animate-fade-in pb-24 w-full">
            {/* Greeting */}
            <div className="flex flex-col items-center text-center gap-4 w-full max-w-6xl">
                <div className="flex flex-col items-center gap-4">
                    <ExploreButton />
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none mb-2">
                            {greeting}, <span className="text-green-500">{session?.user?.name?.split(' ')[0] || "Kisan Ji"}</span>
                        </h1>
                        <p className="text-green-600/90 text-xs md:text-sm font-black uppercase tracking-[0.4em]">{currentDate}</p>
                    </div>
                </div>
                <button className="glass-card p-3 text-green-500 hover:text-green-300 transition rounded-full hover:scale-110 active:scale-95 shadow-lg shadow-green-950/20">
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* Alert Banners */}
            <div className="flex flex-col items-center gap-2 w-full max-w-6xl">
                {alerts.map((alert, i) => (
                    !dismissedAlerts.includes(i) && (
                        <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm w-full shadow-md transition-all hover:scale-[1.005]
              ${alert.type === "warning" ? "bg-yellow-900/20 border-yellow-700/30 text-yellow-100" :
                                alert.type === "info" ? "bg-blue-900/20 border-blue-700/30 text-blue-100" :
                                    "bg-green-900/20 border-green-700/30 text-green-100"}`}>
                            <span className="text-lg flex-shrink-0">{alert.icon}</span>
                            <span className="flex-1 font-medium">{alert.message}</span>
                            <button onClick={() => setDismissedAlerts(prev => [...prev, i])} className="opacity-40 hover:opacity-100 transition text-base px-1">✕</button>
                        </div>
                    )
                ))}
            </div>

            {/* Quick Access Services */}
            <div className="w-full max-w-6xl">
                <h2 className="text-xs font-black text-green-800 uppercase tracking-[0.5em] mb-6 text-center">Quick Access Services</h2>
                <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-6">
                    {quickLinks.map(({ label, href, icon: Icon, color }) => (
                        <Link key={href} href={href} className="flex flex-col items-center gap-3 group">
                            <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 relative`}>
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                                <Icon size={24} className="text-white" />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.15em] text-green-700 group-hover:text-green-400 font-bold transition text-center leading-tight">{label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Ask KisanAI */}
            <div className="glass-card p-6 md:p-8 bg-purple-950/5 border-purple-800/20 w-full max-w-6xl rounded-2xl shadow-xl shadow-purple-950/20">
                <div className="flex items-center justify-center gap-3 mb-5">
                    <Brain size={22} className="text-purple-400" />
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">Ask KisanAI</h3>
                    <span className="bg-purple-600/20 text-purple-400 border border-purple-500/30 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-black tracking-widest">AI Expert</span>
                </div>
                {kisanReply && (
                    <div className="mb-5 p-4 bg-purple-900/20 rounded-xl border border-purple-800/30 text-green-100 text-sm leading-relaxed shadow-inner">
                        <span className="text-lg mr-1.5">🤖</span> {kisanReply}
                    </div>
                )}
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        className="input-field flex-1 text-sm py-3 px-4 rounded-lg bg-black/40 border-purple-800/30 focus:border-purple-500/50 transition-all"
                        placeholder="Ask anything about crops, market prices, or farming techniques..."
                        value={kisanQuery}
                        onChange={e => setKisanQuery(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && askKisan()}
                    />
                    <button onClick={askKisan} disabled={kisanLoading || !kisanQuery.trim()}
                        className="btn-primary px-6 py-3 rounded-lg shadow-lg shadow-purple-950/40 flex items-center justify-center gap-2 text-sm font-bold min-w-[130px]">
                        {kisanLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        <span>Ask AI</span>
                    </button>
                </div>
                <div className="flex gap-2 flex-wrap justify-center mt-5">
                    {["Which crop is best for March in Rajasthan?", "Symptoms of wheat rust and its cure?", "How to apply for PM-KISAN scheme?"].map(q => (
                        <button key={q} onClick={() => setKisanQuery(q)}
                            className="text-[11px] font-semibold text-purple-400/70 border border-purple-800/30 px-3.5 py-1.5 rounded-full hover:bg-purple-900/40 hover:text-purple-300 transition-all">
                            {q}
                        </button>
                    ))}
                </div>
            </div>

            {/* Row 1: Weather + My Crops */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full max-w-6xl">
                {/* Weather */}
                <div className="glass-card p-6 bg-gradient-to-br from-sky-900/20 to-blue-900/10 border-sky-700/10 relative overflow-hidden">
                    {weatherLoading && <div className="absolute inset-0 bg-sky-900/10 backdrop-blur-[2px] z-10 animate-pulse" />}
                    <div className="flex justify-between items-start mb-3 relative z-20">
                        <div>
                            <p className="text-sky-400 text-sm font-medium">Local weather</p>
                            <p className="text-xs text-sky-600 flex items-center gap-1">
                                <MapPin size={10} /> {geoCity || "Detecting Location..."}
                            </p>
                        </div>
                        <Cloud size={20} className="text-sky-400" />
                    </div>
                    <div className="flex items-end gap-3 relative z-20">
                        <div className="text-4xl font-black text-white">{weather.temp}</div>
                        <div className="text-sky-300 text-sm pb-1 leading-tight">
                            <p className="font-bold">{weather.desc}</p>
                            <p className="opacity-70 text-xs">💧 {weather.humidity} | 💨 {weather.wind}</p>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs text-sky-400">
                        {[
                            { day: "Mon", icon: "☀️", temp: "26°" },
                            { day: "Tue", icon: "⛅", temp: "23°" },
                            { day: "Wed", icon: "🌧️", temp: "20°" },
                            { day: "Thu", icon: "☀️", temp: "25°" },
                        ].map(d => (
                            <div key={d.day} className="bg-sky-900/30 rounded-lg p-2">
                                <p>{d.day}</p>
                                <p className="text-lg">{d.icon}</p>
                                <p className="font-semibold text-white">{d.temp}</p>
                            </div>
                        ))}
                    </div>
                    <Link href="/weather" className="mt-3 text-xs text-sky-400 hover:text-sky-200 flex items-center gap-1">
                        Full forecast <ArrowRight size={11} />
                    </Link>
                </div>

                {/* My Crops */}
                <div className="glass-card p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg text-white font-black tracking-tight">My Crops 🌱</h3>
                        <Link href="/crop-calendar" className="text-[10px] font-bold text-green-500 hover:text-green-300 uppercase tracking-widest">View Calendar</Link>
                    </div>
                    <div className="space-y-5">
                        {cropActivities.map(crop => (
                            <div key={crop.crop} className="group">
                                <div className="flex items-center gap-3 mb-1.5">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-green-900/30">
                                        <img src={crop.image} alt={crop.crop} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="text-sm font-semibold text-white truncate">{crop.crop}</span>
                                            <span className="text-[10px] text-green-500 font-bold">{crop.daysLeft}d left</span>
                                        </div>
                                        <span className="text-[10px] text-green-600 bg-green-900/20 px-1.5 py-0.5 rounded">{crop.stage}</span>
                                    </div>
                                </div>
                                <div className="w-full bg-green-950 rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full transition-all ${crop.health > 85 ? "bg-green-500" : crop.health > 70 ? "bg-yellow-500" : "bg-red-500"}`}
                                        style={{ width: `${crop.health}%` }}
                                    />
                                </div>
                                <p className="text-right text-[10px] text-green-600 mt-0.5">Health {crop.health}%</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 2: Live Prices + Farm Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full max-w-6xl">
                {/* Market Prices */}
                <div className="glass-card p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg text-white font-black tracking-tight">Live Prices 📊</h3>
                        <Link href="/market-prices" className="text-[10px] font-bold text-green-500 hover:text-green-300 uppercase tracking-widest">All prices</Link>
                    </div>
                    <div className="space-y-1 relative overflow-hidden">
                        {pricesLoading && <div className="absolute inset-0 bg-green-900/5 backdrop-blur-[1px] z-10 animate-pulse" />}
                        {prices.map(p => (
                            <div key={p.commodity} className="flex items-center justify-between py-2.5 border-b border-green-900/20 last:border-0 relative z-20">
                                <span className="text-sm text-green-200">{p.commodity}</span>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-white">{p.price}<span className="text-xs text-green-600">{p.unit}</span></span>
                                    <span className={`text-xs ml-2 font-medium ${p.positive ? "text-green-400" : "text-red-400"}`}>{p.change}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link href="/market-prices" className="mt-3 text-xs text-green-500 hover:text-green-300 flex items-center gap-1">
                        View all mandi rates <ArrowRight size={11} />
                    </Link>
                </div>

                {/* Interactive Task List */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg text-white font-black tracking-tight">📋 Today&apos;s Farm Tasks</h3>
                            <p className="text-green-700 font-bold text-[10px] uppercase tracking-widest mt-0.5">{completedTasks}/{tasks.length} completed</p>
                        </div>
                        <div className="w-9 h-9 rounded-full border-2 border-green-700 flex items-center justify-center">
                            <span className="text-green-400 text-[10px] font-bold">{Math.round((completedTasks / tasks.length) * 100)}%</span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-green-950 rounded-full h-1.5 mb-3">
                        <div className="h-1.5 rounded-full bg-green-500 transition-all" style={{ width: `${(completedTasks / tasks.length) * 100}%` }} />
                    </div>

                    <div className="space-y-1.5">
                        {tasks.map(item => (
                            <div
                                key={item.id}
                                onClick={() => toggleTask(item.id)}
                                className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition ${item.done ? "opacity-50 bg-green-900/5" : "bg-green-900/10 hover:bg-green-900/20"}`}
                            >
                                {item.done
                                    ? <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                                    : <Circle size={16} className="text-green-700 flex-shrink-0" />
                                }
                                <span className={`text-sm flex-1 ${item.done ? "line-through text-green-700" : "text-green-200"}`}>{item.task}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.priority === "High" ? "badge-danger" : item.priority === "Medium" ? "badge-warning" : "badge-info"}`}>{item.priority}</span>
                            </div>
                        ))}
                    </div>

                    {/* Add task */}
                    <div className="flex gap-2 mt-3">
                        <input
                            className="input-field flex-1 text-sm"
                            placeholder="Add a new task..."
                            value={newTask}
                            onChange={e => setNewTask(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && addTask()}
                        />
                        <button onClick={addTask} className="btn-secondary px-3">
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Row 3: Health Corner — full width */}
            <div className="w-full max-w-6xl">
                <div className="glass-card p-6 bg-gradient-to-br from-red-900/10 to-pink-900/5 border-red-800/10">
                    <div className="flex items-center gap-3 mb-4">
                        <HeartPulse size={20} className="text-red-400" />
                        <h3 className="text-lg text-white font-black tracking-tight">Health Corner</h3>
                        <span className="badge-danger text-[10px]">24×7</span>
                    </div>
                    <p className="text-red-200 text-sm mb-4">Quick access to health services designed for rural communities</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Link href="/health" className="flex items-center gap-3 p-4 bg-red-950/20 border border-red-800/20 rounded-lg hover:bg-red-950/40 transition group">
                            <div className="w-9 h-9 rounded-lg bg-red-900/30 flex items-center justify-center text-red-400 flex-shrink-0">
                                <Brain size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-red-100">AI Symptom Checker</p>
                                <p className="text-xs text-red-500/80 truncate">Instant health guidance in Hindi/English</p>
                            </div>
                            <ArrowRight size={14} className="text-red-400 ml-auto group-hover:translate-x-1 transition flex-shrink-0" />
                        </Link>
                        <Link href="/health?tab=doctors" className="flex items-center gap-3 p-4 bg-red-950/20 border border-red-800/20 rounded-lg hover:bg-red-950/40 transition group">
                            <div className="w-9 h-9 rounded-lg bg-red-900/30 flex items-center justify-center text-red-400 flex-shrink-0">
                                <Video size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-red-100">Video Call a Doctor</p>
                                <p className="text-xs text-red-500/80 truncate">Consult in &lt;10 minutes · ₹150–₹400</p>
                            </div>
                            <ArrowRight size={14} className="text-red-400 ml-auto group-hover:translate-x-1 transition flex-shrink-0" />
                        </Link>
                        <a href="tel:108" className="flex items-center gap-3 p-4 bg-red-600/10 border border-red-600/30 rounded-lg hover:bg-red-600/20 transition group">
                            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white flex-shrink-0">
                                <Phone size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-red-100">Medical Helpline</p>
                                <p className="text-xs text-white font-bold">108 — Free Ambulance</p>
                            </div>
                            <span className="text-red-400 text-[10px] ml-auto animate-pulse font-black uppercase tracking-wider flex-shrink-0">Call Now</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
