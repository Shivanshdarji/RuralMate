"use client";
import { useEffect, useState } from "react";
import { Cloud, Wind, Droplets, Thermometer, Sun, RefreshCw, MapPin, Sunrise, Sunset, Eye, Gauge } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

// ─── Types ───────────────────────────────────────────────────────────────────
interface WeatherDay {
    date: string; day: string; icon: string; desc: string;
    high: number; low: number; rain: number; humidity: number; wind: number;
}
interface CurrentWeather {
    temp: number; feelsLike: number; humidity: number; windSpeed: number;
    desc: string; icon: string; visibility: number; pressure: number;
    sunrise: string; sunset: string; city: string; uvIndex: number;
}

// ─── Farm Advisory Logic ──────────────────────────────────────────────────────
function getFarmAdvisory(temp: number, humidity: number, wind: number, rain: number) {
    const advisories: { type: "warning" | "info" | "good"; title: string; desc: string }[] = [];
    if (rain > 15) advisories.push({ type: "warning", title: "Heavy Rain Expected", desc: "Delay spraying operations. Ensure drainage channels are clear. Harvest ripe crops immediately." });
    else if (rain > 5) advisories.push({ type: "info", title: "Moderate Rain Likely", desc: "Plan irrigation accordingly. Good time for transplanting seedlings." });
    if (temp > 40) advisories.push({ type: "warning", title: "Heat Stress Alert", desc: "Irrigate early morning or evening only. Check for wilting crops. Apply mulch to retain moisture." });
    else if (temp < 8) advisories.push({ type: "warning", title: "Cold Wave / Frost Risk", desc: "Cover sensitive crops overnight. Delay sowing if temp < 5°C. Turn on sprinklers to prevent frost." });
    if (humidity > 85) advisories.push({ type: "warning", title: "High Humidity — Disease Risk", desc: "Risk of fungal diseases (blight, downy mildew). Avoid foliar spray. Improve field ventilation." });
    if (wind > 30) advisories.push({ type: "warning", title: "High Wind — Spray Ineffective", desc: "Postpone pesticide/herbicide spraying. Secure greenhouse covers." });
    if (advisories.length === 0) advisories.push({ type: "good", title: "Good Conditions for Farm Work", desc: "Suitable for sowing, weeding, fertilizer application, and field preparation." });
    return advisories;
}

// ─── Crop Weather Fit ─────────────────────────────────────────────────────────
const CROP_CONDITIONS = [
    { crop: "🌾 Wheat", idealTemp: "15–25°C", idealRain: "Low", growthStage: "Rabi — sowing till March", tip: "Irrigate at CRI, tillering & grain filling stages" },
    { crop: "🌾 Paddy", idealTemp: "25–35°C", idealRain: "High", growthStage: "Kharif — June–November", tip: "Maintain 5cm water level during vegetative stage" },
    { crop: "🌿 Soybean", idealTemp: "20–30°C", idealRain: "Medium", growthStage: "Kharif — July to October", tip: "Avoid waterlogging. Ridge & furrow recommended" },
    { crop: "🌻 Mustard", idealTemp: "10–25°C", idealRain: "Low", growthStage: "Rabi — October–February", tip: "Apply one irrigation at flowering" },
    { crop: "🧅 Onion", idealTemp: "13–24°C", idealRain: "Low", growthStage: "Year round with irrigation", tip: "Stop irrigation 15 days before harvest" },
    { crop: "🍬 Sugarcane", idealTemp: "25–35°C", idealRain: "High", growthStage: "Year round — 12–18 months", tip: "Drip irrigation saves 40% water" },
];

// ─── Mock fallback data (used when API key missing) ───────────────────────────
function getMockWeather(city: string): { current: CurrentWeather; forecast: WeatherDay[] } {
    const now = new Date();
    const current: CurrentWeather = {
        temp: 28, feelsLike: 31, humidity: 62, windSpeed: 14, pressure: 1012,
        desc: "Partly Cloudy", icon: "⛅", visibility: 9, uvIndex: 6,
        sunrise: "6:42 AM", sunset: "6:18 PM", city,
    };
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const icons = ["☀️", "⛅", "🌧️", "⛅", "☀️", "🌤️", "☀️"];
    const descs = ["Clear", "Partly cloudy", "Rainy", "Mostly cloudy", "Sunny", "Partly sunny", "Clear"];
    const forecast: WeatherDay[] = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now); d.setDate(d.getDate() + i);
        return {
            date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
            day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : days[d.getDay()],
            icon: icons[i], desc: descs[i],
            high: 26 + Math.round(Math.sin(i + 1) * 4),
            low: 16 + Math.round(Math.cos(i) * 3),
            rain: [0, 2, 18, 8, 0, 0, 1][i],
            humidity: [60, 65, 85, 75, 58, 55, 60][i],
            wind: [12, 15, 22, 18, 8, 6, 10][i],
        };
    });
    return { current, forecast };
}

const ADVISORY_COLORS = {
    warning: "bg-red-900/20 border-red-800/30 text-red-300",
    info: "bg-blue-900/20 border-blue-800/30 text-blue-300",
    good: "bg-green-900/20 border-green-800/30 text-green-300",
};
const ADVISORY_ICONS = { warning: "⚠️", info: "ℹ️", good: "✅" };

// OWM condition code → emoji icon
function owmCodeToIcon(id?: number): string {
    if (!id) return "⛅";
    if (id >= 200 && id < 300) return "⛈️";  // thunderstorm
    if (id >= 300 && id < 400) return "🌦️";  // drizzle
    if (id >= 500 && id < 510) return "🌧️";  // rain
    if (id >= 510 && id < 600) return "🌨️";  // freezing rain
    if (id >= 600 && id < 700) return "❄️";   // snow
    if (id >= 700 && id < 800) return "🌫️";  // atmosphere (fog/haze)
    if (id === 800) return "☀️";   // clear sky
    if (id === 801) return "🌤️";  // few clouds
    if (id === 802) return "⛅";   // scattered clouds
    if (id >= 803) return "☁️";   // broken/overcast clouds
    return "🌡️";
}

export default function WeatherPage() {
    const [city, setCity] = useState("Bhopal");
    const [inputCity, setInputCity] = useState("Bhopal");
    const [weather, setWeather] = useState<{ current: CurrentWeather; forecast: WeatherDay[] } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState("");

    async function fetchWeather(searchCity: string, lat?: string, lon?: string) {
        setLoading(true); setError("");
        try {
            const url = lat && lon
                ? `/api/weather?lat=${lat}&lon=${lon}`
                : `/api/weather?city=${encodeURIComponent(searchCity)}`;

            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error ?? "API failed");

            const cur = data.current;
            const fc = data.forecast;
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

            const current: CurrentWeather = {
                temp: Math.round(cur.main.temp),
                feelsLike: Math.round(cur.main.feels_like),
                humidity: cur.main.humidity,
                windSpeed: Math.round(cur.wind.speed * 3.6),
                pressure: cur.main.pressure,
                desc: cur.weather?.[0]?.description ?? "Clear",
                icon: owmCodeToIcon(cur.weather?.[0]?.id),
                visibility: Math.round((cur.visibility ?? 9000) / 1000),
                sunrise: new Date(cur.sys.sunrise * 1000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
                sunset: new Date(cur.sys.sunset * 1000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
                city: data.name ?? searchCity,
                uvIndex: 5,
            };

            const now = new Date();
            const forecast: WeatherDay[] = Array.from({ length: 7 }, (_, i) => {
                const d = new Date(now);
                d.setDate(d.getDate() + i);
                const dateStr = d.toISOString().slice(0, 10);
                const slots = (fc?.list || []).filter((s: { dt_txt?: string }) => s.dt_txt?.startsWith(dateStr));
                const slot = slots.find((s: { dt_txt?: string }) => s.dt_txt?.includes("12:00") || s.dt_txt?.includes("15:00")) || slots[0];
                const temps = slots.map((s: { main?: { temp: number } }) => s.main?.temp ?? current.temp);
                return {
                    date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
                    day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : days[d.getDay()],
                    icon: owmCodeToIcon(slot?.weather?.[0]?.id),
                    desc: slot?.weather?.[0]?.description ?? "Partly cloudy",
                    high: temps.length ? Math.round(Math.max(...temps)) : current.temp + 2,
                    low: temps.length ? Math.round(Math.min(...temps)) : current.temp - 6,
                    rain: Math.round((slot?.pop ?? 0) * 100),
                    humidity: slot?.main?.humidity ?? current.humidity,
                    wind: Math.round((slot?.wind?.speed ?? 10) * 3.6),
                };
            });

            setWeather({ current, forecast });
            setCity(data.name || searchCity);
            setInputCity(data.name || searchCity);
        } catch {
            setWeather(getMockWeather(searchCity));
        }
        setLastUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
        setLoading(false);
    }

    const detectLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                fetchWeather("", String(pos.coords.latitude), String(pos.coords.longitude));
            },
            () => {
                setLoading(false);
                setError("Location access denied. Please search manually.");
                fetchWeather("Bhopal");
            }
        );
    };

    useEffect(() => {
        // Try auto-detect first, fallback to Bhopal
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchWeather("", String(pos.coords.latitude), String(pos.coords.longitude)),
                () => fetchWeather("Bhopal")
            );
        } else {
            fetchWeather("Bhopal");
        }
    }, []);

    const advisory = weather ? getFarmAdvisory(weather.current.temp, weather.current.humidity, weather.current.windSpeed, weather.forecast[0]?.rain ?? 0) : [];

    const getRainColor = (r: number) => r > 15 ? "text-blue-400" : r > 5 ? "text-cyan-400" : "text-green-700";
    const getTempColor = (t: number) => t > 38 ? "text-red-400" : t < 10 ? "text-blue-400" : "text-white";

    return (
        <div className="flex flex-col items-center gap-12 pb-20 px-4 w-full">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-8 w-full max-w-4xl pt-2">
                <ExploreButton />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-sky-950/50">
                    <Cloud size={40} className="text-white" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-3">Farm Weather</h1>
                    <p className="text-sky-400 font-black uppercase tracking-[0.4em] text-sm">7-Day Forecast · Advisory · Crop Guide</p>
                </div>
            </div>

            {/* Search */}
            <div className="w-full max-w-3xl">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-600" />
                        <input className="input-field pl-9 w-full" placeholder="Enter your city or district (e.g. Ujjain, Nashik...)"
                            value={inputCity} onChange={e => setInputCity(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") fetchWeather(inputCity); }} />
                    </div>
                    <button onClick={() => fetchWeather(inputCity)} disabled={loading}
                        className="btn-primary px-5 py-3 flex items-center gap-2 text-sm rounded-xl disabled:opacity-50">
                        <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                        {loading ? "Loading..." : "Search"}
                    </button>
                    <button onClick={detectLocation} disabled={loading}
                        className="btn-secondary px-5 py-3 flex items-center gap-2 text-sm rounded-xl disabled:opacity-50">
                        <MapPin size={15} />
                        Locate
                    </button>
                </div>
                {lastUpdated && <p className="text-green-900 text-xs mt-1">Last updated: {lastUpdated}</p>}
            </div>

            {weather && (
                <>
                    {/* Current Conditions */}
                    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* Main card */}
                        <div className="lg:col-span-2 glass-card p-7 bg-gradient-to-br from-sky-900/30 to-blue-900/20 border-sky-800/20">
                            <div className="flex items-start justify-between mb-5">
                                <div>
                                    <p className="text-sky-400 text-sm font-bold flex items-center gap-1"><MapPin size={12} /> {weather.current.city}</p>
                                    <p className={`font-black text-7xl mt-2 ${getTempColor(weather.current.temp)}`}>{weather.current.temp}°C</p>
                                    <p className="text-sky-300 text-lg capitalize mt-1">{weather.current.desc}</p>
                                    <p className="text-sky-700 text-sm">Feels like {weather.current.feelsLike}°C · UV Index: {weather.current.uvIndex}</p>
                                </div>
                                <span className="text-7xl">{weather.forecast[0]?.icon}</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { icon: <Droplets size={16} />, label: "Humidity", value: `${weather.current.humidity}%`, color: "text-blue-400" },
                                    { icon: <Wind size={16} />, label: "Wind", value: `${weather.current.windSpeed} km/h`, color: "text-teal-400" },
                                    { icon: <Eye size={16} />, label: "Visibility", value: `${weather.current.visibility} km`, color: "text-sky-400" },
                                    { icon: <Gauge size={16} />, label: "Pressure", value: `${weather.current.pressure} hPa`, color: "text-purple-400" },
                                ].map(m => (
                                    <div key={m.label} className="glass-card p-3 text-center rounded-xl">
                                        <div className={`flex justify-center mb-1 ${m.color}`}>{m.icon}</div>
                                        <p className={`font-black text-sm ${m.color}`}>{m.value}</p>
                                        <p className="text-green-800 text-[10px] font-bold uppercase tracking-widest">{m.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Sun times + farm metrics */}
                        <div className="space-y-4">
                            <div className="glass-card p-5 space-y-3">
                                <h4 className="text-white font-black text-sm">🌅 Sun Times</h4>
                                <div className="flex justify-between">
                                    <div className="text-center">
                                        <Sunrise size={24} className="text-yellow-400 mx-auto mb-1" />
                                        <p className="text-white font-black">{weather.current.sunrise}</p>
                                        <p className="text-green-800 text-xs">Sunrise</p>
                                    </div>
                                    <div className="text-center">
                                        <Sunset size={24} className="text-orange-400 mx-auto mb-1" />
                                        <p className="text-white font-black">{weather.current.sunset}</p>
                                        <p className="text-green-800 text-xs">Sunset</p>
                                    </div>
                                </div>
                            </div>
                            <div className="glass-card p-5">
                                <h4 className="text-white font-black text-sm mb-3">🌱 Field Conditions</h4>
                                {[
                                    { label: "Spray Conditions", val: weather.current.windSpeed < 15 && weather.forecast[0]?.rain < 5 ? "✅ Suitable" : "❌ Avoid today", ok: weather.current.windSpeed < 15 },
                                    { label: "Irrigation Need", val: weather.forecast[0]?.rain > 10 ? "💧 Skip today" : "🚿 Water crops", ok: weather.forecast[0]?.rain < 10 },
                                    { label: "Harvest Risk", val: weather.forecast[0]?.rain > 15 ? "⚠️ Harvest now!" : "✅ Safe", ok: weather.forecast[0]?.rain < 15 },
                                    { label: "Disease Risk", val: weather.current.humidity > 80 ? "⚠️ High" : "✅ Low", ok: weather.current.humidity < 80 },
                                ].map(f => (
                                    <div key={f.label} className="flex justify-between items-center py-1.5 border-b border-green-900/20 last:border-0">
                                        <span className="text-green-700 text-xs">{f.label}</span>
                                        <span className={`text-xs font-bold ${f.ok ? "text-green-400" : "text-yellow-400"}`}>{f.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Farm Advisory */}
                    {advisory.length > 0 && (
                        <div className="w-full max-w-6xl space-y-3">
                            <h2 className="text-white font-black text-lg flex items-center gap-2">
                                <span className="text-yellow-400">⚠️</span> Today&apos;s Farm Advisory
                            </h2>
                            {advisory.map((a, i) => (
                                <div key={i} className={`rounded-xl p-4 border flex items-start gap-3 ${ADVISORY_COLORS[a.type]}`}>
                                    <span className="text-xl flex-shrink-0">{ADVISORY_ICONS[a.type]}</span>
                                    <div>
                                        <p className="font-black text-sm">{a.title}</p>
                                        <p className="text-xs opacity-80 mt-0.5">{a.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 7-Day Forecast */}
                    <div className="w-full max-w-6xl">
                        <h2 className="text-white font-black text-lg mb-4">📅 7-Day Forecast</h2>
                        <div className="glass-card overflow-hidden border-sky-900/20">
                            {weather.forecast.map((d, i) => (
                                <div key={i} className={`flex items-center gap-4 px-5 py-4 ${i < weather.forecast.length - 1 ? "border-b border-sky-900/10" : ""} hover:bg-sky-900/10 transition`}>
                                    <div className="w-24 flex-shrink-0">
                                        <p className="text-white font-black text-sm">{d.day}</p>
                                        <p className="text-sky-700 text-xs">{d.date}</p>
                                    </div>
                                    <span className="text-2xl">{d.icon}</span>
                                    <p className="text-sky-400 text-xs capitalize flex-1 hidden sm:block">{d.desc}</p>
                                    <div className="flex items-center gap-1 text-blue-400 text-xs w-14 flex-shrink-0">
                                        <Droplets size={10} /> <span className={getRainColor(d.rain)}>{d.rain}%</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-teal-400 text-xs w-16 flex-shrink-0">
                                        <Wind size={10} /> {d.wind} km/h
                                    </div>
                                    <div className="flex gap-2 text-sm font-black w-20 flex-shrink-0 justify-end">
                                        <span className={getTempColor(d.high)}>{d.high}°</span>
                                        <span className="text-green-800">{d.low}°</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Crop Season Guide */}
                    <div className="w-full max-w-6xl">
                        <h2 className="text-white font-black text-lg mb-4">🌾 Crop Weather Guide</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {CROP_CONDITIONS.map(c => (
                                <div key={c.crop} className="glass-card p-5 hover:border-sky-800/30 border border-transparent transition">
                                    <h3 className="text-white font-black mb-2">{c.crop}</h3>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-sky-700">Ideal Temp</span>
                                            <span className="text-sky-300 font-bold">{c.idealTemp}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-sky-700">Rainfall Need</span>
                                            <span className="text-blue-300 font-bold">{c.idealRain}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-sky-700">Season</span>
                                            <span className="text-green-300 font-bold text-right max-w-[55%]">{c.growthStage}</span>
                                        </div>
                                    </div>
                                    <p className="text-sky-600 text-xs mt-3 leading-relaxed border-t border-sky-900/20 pt-2">💡 {c.tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
