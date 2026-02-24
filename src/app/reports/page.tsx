"use client";
import { FileText, Download } from "lucide-react";
import { ExploreButton } from "@/components/layout/ExploreButton";

export default function ReportsPage() {
    const reports = [
        { name: "Season Report — Rabi 2025-26", type: "Crop Summary", date: "Feb 2026", size: "1.2 MB", icon: "🌾" },
        { name: "Income & Expense Statement — 2025", type: "Financial", date: "Dec 2025", size: "0.8 MB", icon: "💰" },
        { name: "Soil Health Report — Field A & B", type: "Soil Analysis", date: "Nov 2025", size: "2.1 MB", icon: "🌍" },
        { name: "PM-KISAN Installment Record", type: "Govt Scheme", date: "All Time", size: "0.3 MB", icon: "🏛️" },
    ];
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <ExploreButton />
                    <div>
                        <h1 className="text-2xl font-bold text-white">📋 Reports & Data Export</h1>
                        <p className="text-green-600 text-sm">Download your farming records, income statements, and reports</p>
                    </div>
                </div>
                <button className="btn-primary flex items-center gap-2 text-sm"><FileText size={16} />Generate New Report</button>
            </div>
            <div className="space-y-3">
                {reports.map(r => (
                    <div key={r.name} className="glass-card p-5 flex items-center gap-4">
                        <span className="text-3xl flex-shrink-0">{r.icon}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm">{r.name}</p>
                            <div className="flex gap-3 text-xs text-green-700 mt-1">
                                <span>📁 {r.type}</span><span>📅 {r.date}</span><span>💾 {r.size}</span>
                            </div>
                        </div>
                        <button className="btn-secondary flex items-center gap-2 text-sm flex-shrink-0">
                            <Download size={14} />Download PDF
                        </button>
                    </div>
                ))}
            </div>
            <div className="glass-card p-6">
                <h3 className="text-white font-bold mb-4">📊 Custom Report Generator</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <select className="input-field text-sm"><option>Report Type</option><option>Crop Summary</option><option>Financial</option><option>Soil Health</option></select>
                    <input type="date" className="input-field text-sm" placeholder="From date" />
                    <input type="date" className="input-field text-sm" placeholder="To date" />
                </div>
                <button className="btn-primary flex items-center gap-2">Generate & Download Report</button>
            </div>
        </div>
    );
}
