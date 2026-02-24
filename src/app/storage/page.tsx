"use client";
import { Warehouse } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";
const warehouses = [
    { name: "NAFED Cold Storage, Ujjain", capacity: "500 MT", fee: "₹120/quintal/month", distance: "8 km", certified: true, commodities: "Wheat, Onion, Potato", icon: "🏭" },
    { name: "District FCI Godown", capacity: "2000 MT", fee: "₹85/quintal/month", distance: "15 km", certified: true, commodities: "All grains", icon: "🏢" },
    { name: "Private Cold Storage, Dewas", capacity: "200 MT", fee: "₹150/quintal/month", distance: "22 km", certified: false, commodities: "Perishables, Vegetables", icon: "❄️" },
];
export default function StoragePage() {
    return (
        <div className="flex flex-col items-center gap-16 md:gap-20 pb-16 px-4 w-full">
            <div className="flex flex-col items-center text-center gap-8 w-full max-w-4xl">
                <div className="flex flex-col items-center gap-6">
                    <ExploreButton />
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-700 to-yellow-500 flex items-center justify-center shadow-2xl shadow-amber-950/40">
                        <Warehouse size={40} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-3">Storage Finder</h1>
                        <p className="text-amber-400 font-black uppercase tracking-[0.5em] text-sm">Find Certified Warehouses Near You</p>
                    </div>
                </div>
            </div>
            <div className="space-y-6 w-full max-w-4xl">
                {warehouses.map(w => (
                    <div key={w.name} className="glass-card p-6">
                        <div className="flex items-start gap-4 mb-4">
                            <span className="text-4xl">{w.icon}</span>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-white font-bold">{w.name}</h3>
                                    {w.certified && <span className="badge-success text-xs">✅ WDRA Certified</span>}
                                </div>
                                <p className="text-green-600 text-sm">📍 {w.distance} · {w.commodities}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="stat-card text-center"><p className="text-xs text-green-600">Capacity</p><p className="text-white font-bold">{w.capacity}</p></div>
                            <div className="stat-card text-center"><p className="text-xs text-green-600">Fee</p><p className="text-white font-bold">{w.fee}</p></div>
                        </div>
                        <div className="flex gap-2"><button className="btn-primary text-sm flex-1">Book Space</button><button className="btn-secondary text-sm">📞 Call</button></div>
                    </div>
                ))}
            </div>
            <div className="glass-card p-5"><h3 className="text-white font-bold mb-2">💡 Pledge Loan Against Stored Grain</h3><p className="text-green-500 text-sm">If your grain is stored in a WDRA-certified warehouse, you can get 70-80% bank loan against it using a Negotiable Warehouse Receipt (NWR).</p><button className="btn-secondary text-sm mt-3">Learn More</button></div>
        </div>
    );
}
