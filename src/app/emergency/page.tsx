"use client";
import { Phone, AlertTriangle, MapPin, Zap, Truck, ShieldAlert, HeartPulse, Shield, Flame, User, Baby, Waves, DollarSign, Microscope, Sprout } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

const emergencies = [
    { type: "Medical", number: "108", desc: "Free Ambulance · MICU Equipped", icon: HeartPulse, color: "bg-red-600" },
    { type: "Police", number: "100", desc: "Police Emergency · Dial anywhere", icon: Shield, color: "bg-blue-600" },
    { type: "Fire", number: "101", desc: "Fire Service · Rescue Operations", icon: Flame, color: "bg-orange-600" },
    { type: "Women Safety", number: "1090", desc: "Women Power Line · 24x7", icon: User, color: "bg-pink-600" },
    { type: "Child Helpline", number: "1098", desc: "Childline India · Free", icon: Baby, color: "bg-yellow-600" },
    { type: "Disaster Relief", number: "1078", desc: "NDMA Helpline · Flood/Earthquake", icon: Waves, color: "bg-teal-600" },
    { type: "Kisan Helpline", number: "1800-180-1551", desc: "Free Agri Advice · All India", icon: Sprout, color: "bg-green-600" },
    { type: "PM-KISAN", number: "155261", desc: "Scheme queries & complaints", icon: DollarSign, color: "bg-amber-600" },
    { type: "Pesticide Poison", number: "1800-116-117", desc: "Poison Control Center · Free", icon: Microscope, color: "bg-purple-600" },
];

const disasterTips = [
    {
        disaster: "Flood", icon: <Waves className="text-blue-400" />, dos: [
            "Move to higher ground immediately",
            "Save important documents in waterproof bag",
            "Turn off electricity at switchboard",
            "Alert neighbors, especially elderly",
        ], donts: [
            "Don't walk through flowing water",
            "Don't use electrical appliances during flood",
            "Don't ignore evacuation orders",
        ],
    },
    {
        disaster: "Drought", icon: <Sprout className="text-yellow-400" />, dos: [
            "Switch to drought-resistant crops (pearl millet, sorghum)",
            "Use drip irrigation to save water",
            "Apply for PM Fasal Bima claim immediately",
            "Contact local Agriculture Dept for relief",
        ], donts: [
            "Don't waste water for non-essential use",
            "Don't sell livestock in panic — prices crash further",
        ],
    },
    {
        disaster: "Pesticide Poisoning", icon: <Microscope className="text-purple-400" />, dos: [
            "Call 108 immediately",
            "Move person to fresh air",
            "Remove contaminated clothing",
            "Keep the pesticide container to show doctor",
        ], donts: [
            "Don't induce vomiting unless doctor advises",
            "Don't give milk or water without medical guidance",
        ],
    },
];

export default function EmergencyPage() {
    return (
        <div className="flex flex-col items-center gap-20 pb-32 px-4 w-full">
            <div className="flex flex-col items-center text-center gap-10 w-full max-w-4xl pt-10">
                <div className="flex flex-col items-center gap-8">
                    <ExploreButton />
                    <div className="flex flex-col items-center">
                        <h1 className="text-5xl md:text-8xl font-black text-red-500 tracking-tighter leading-none mb-4 animate-pulse">🆘 EMERGENCY</h1>
                        <p className="text-red-400 font-black uppercase tracking-[0.5em] text-xs md:text-lg">Critical Helplines & Services</p>
                    </div>
                </div>
            </div>

            {/* Emergency numbers */}
            <div>
                <h2 className="text-white font-bold mb-4">📞 Emergency Helplines</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {emergencies.map(e => (
                        <a key={e.type} href={`tel:${e.number.replace(/-/g, "")}`}
                            className="glass-card p-5 flex items-center gap-4 hover:border-red-600/40 transition group">
                            <div className={`w-12 h-12 rounded-lg ${e.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition`}>
                                <e.icon size={22} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-sm tracking-tight">{e.type}</p>
                                <p className="text-green-600 text-[10px] leading-tight mt-0.5">{e.desc}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-green-400 font-black text-lg group-hover:text-green-200 tracking-tighter">{e.number}</p>
                                <p className="text-[10px] text-green-700 font-bold flex items-center gap-1 justify-end"><Phone size={10} /> Call</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Disaster tips */}
            <div>
                <h2 className="text-white font-bold mb-4">🧭 Disaster Guidance</h2>
                <div className="space-y-4">
                    {disasterTips.map(d => (
                        <div key={d.disaster} className="glass-card p-6 border-l-4 border-l-red-500/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-900/10 rounded-lg">{d.icon}</div>
                                <h3 className="text-white font-bold text-lg">{d.disaster} — Safety Protocol</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-green-400 font-semibold text-sm mb-2">✅ Do</p>
                                    <ul className="space-y-2">
                                        {d.dos.map(item => <li key={item} className="text-green-300 text-sm flex gap-2"><span className="text-green-600 flex-shrink-0">→</span>{item}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-red-400 font-semibold text-sm mb-2">❌ Don&apos;t</p>
                                    <ul className="space-y-2">
                                        {d.donts.map(item => <li key={item} className="text-red-300 text-sm flex gap-2"><span className="text-red-600 flex-shrink-0">✗</span>{item}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
