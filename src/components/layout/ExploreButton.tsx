"use client";
import { Menu, Sprout } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

export function ExploreButton() {
    const { toggle } = useSidebar();

    return (
        <button
            onClick={toggle}
            className="flex items-center gap-2 px-3 py-2 rounded-lg glass-card bg-[#0a1a0d]/40 backdrop-blur-xl border border-green-900/20 text-green-400 hover:bg-green-900/30 transition-all duration-300 group shadow-lg shadow-green-950/20 shrink-0"
            aria-label="Explore Features"
        >
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-green-900/20 group-hover:scale-105 transition-transform shrink-0">
                <Menu size={18} />
            </div>
            <span className="font-black text-[10px] uppercase tracking-[0.2em] text-green-100/80 pr-1">Explore</span>
        </button>
    );
}
