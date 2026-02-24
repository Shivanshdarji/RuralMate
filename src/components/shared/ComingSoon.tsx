"use client";
import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ComingSoonProps {
    featureName: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ featureName }) => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="w-24 h-24 rounded-3xl bg-green-900/20 flex items-center justify-center mb-6 border border-green-800/30">
                <Construction size={48} className="text-green-500 animate-bounce" />
            </div>
            <h1 className="text-3xl font-black text-white mb-3 tracking-tight">
                {featureName} is <span className="text-green-500">Coming Soon</span>
            </h1>
            <p className="max-w-md text-green-200/60 font-medium mb-10 leading-relaxed">
                We&apos;re working hard to bring this feature to RuralMate. It will be available in the next update to help you farm even smarter.
            </p>
            <div className="flex gap-4">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-green-600 text-white font-black uppercase tracking-widest hover:bg-green-700 transition shadow-xl shadow-green-900/40"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
};
