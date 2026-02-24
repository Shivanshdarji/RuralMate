"use client";
import { Bell, Check, AlertTriangle, TrendingUp, Cloud } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

const notifications = [
    { id: 1, type: "alert", title: "Heavy Rain Alert", body: "Heavy rain expected in your district on Feb 26. Secure your harvested crops.", time: "10 mins ago", read: false, icon: "🌧️" },
    { id: 2, type: "price", title: "Wheat Price Up!", body: "Wheat prices rose ₹45/quintal at Ujjain mandi today — good time to sell!", time: "1 hour ago", read: false, icon: "📈" },
    { id: 3, type: "scheme", title: "PM-KISAN Installment", body: "Your 16th PM-KISAN installment of ₹2,000 has been credited to your account.", time: "3 days ago", read: true, icon: "💰" },
    { id: 4, type: "health", title: "Livestock Vaccination Due", body: "Your cattle vaccination for FMD disease is due next week.", time: "5 days ago", read: true, icon: "💉" },
    { id: 5, type: "community", title: "Reply on your post", body: "Dr. Sharma replied to your question about wheat yellowing.", time: "1 week ago", read: true, icon: "💬" },
];

export default function NotificationsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <ExploreButton />
                    <div>
                        <h1 className="text-2xl font-bold text-white">🔔 Notifications</h1>
                        <p className="text-green-600 text-sm">{notifications.filter(n => !n.read).length} unread alerts</p>
                    </div>
                </div>
                <button className="btn-secondary text-sm flex items-center gap-2"><Check size={14} />Mark all read</button>
            </div>
            <div className="space-y-3">
                {notifications.map(n => (
                    <div key={n.id} className={`glass-card p-5 flex gap-4 ${!n.read ? "border-green-600/30 bg-green-900/5" : ""}`}>
                        <span className="text-3xl flex-shrink-0">{n.icon}</span>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-white font-semibold text-sm">{n.title}</p>
                                {!n.read && <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />}
                            </div>
                            <p className="text-green-400 text-sm">{n.body}</p>
                            <p className="text-green-700 text-xs mt-1">🕐 {n.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="glass-card p-6">
                <h3 className="text-white font-bold mb-4">Alert Preferences</h3>
                <div className="space-y-3">
                    {[
                        { label: "Weather Alerts", desc: "Rain, drought, frost warnings", on: true },
                        { label: "Price Alerts", desc: "Mandi price movements for your crops", on: true },
                        { label: "Scheme Deadlines", desc: "Government scheme cut-off reminders", on: true },
                        { label: "Health Reminders", desc: "Livestock vaccination & doctor follow-ups", on: false },
                    ].map(pref => (
                        <div key={pref.label} className="flex items-center gap-4 p-3 bg-green-900/10 rounded-xl">
                            <div className="flex-1">
                                <p className="text-white font-medium text-sm">{pref.label}</p>
                                <p className="text-green-700 text-xs">{pref.desc}</p>
                            </div>
                            <button className={`w-12 h-6 rounded-full transition flex-shrink-0 relative ${pref.on ? "bg-green-600" : "bg-green-900"}`}>
                                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${pref.on ? "left-7" : "left-1"}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
