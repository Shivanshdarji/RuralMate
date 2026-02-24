"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface UserProfile {
    id?: string;
    name: string;
    phone: string;
    village: string;
    district: string;
    state: string;
    land_acres: string;
    main_crops: string;
    livestock: string;
    profile_complete: boolean;
    _mock?: boolean;
}

export interface UserSettings {
    language: string;
    notifications_weather: boolean;
    notifications_market: boolean;
    notifications_schemes: boolean;
    notifications_pest: boolean;
    units_area: string;
    units_weight: string;
    theme: string;
    voice_language: string;
    auto_location: boolean;
    _mock?: boolean;
}

interface UserContextValue {
    profile: UserProfile | null;
    settings: UserSettings | null;
    loadingProfile: boolean;
    loadingSettings: boolean;
    refreshProfile: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    updateSettings: (data: Partial<UserSettings>) => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function UserProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingSettings, setLoadingSettings] = useState(true);

    const fetchProfile = useCallback(async () => {
        if (status !== "authenticated") return;
        try {
            setLoadingProfile(true);
            const res = await fetch("/api/profile");
            if (res.ok) setProfile(await res.json());
        } catch { /* silently fail */ }
        finally { setLoadingProfile(false); }
    }, [status]);

    const fetchSettings = useCallback(async () => {
        if (status !== "authenticated") return;
        try {
            setLoadingSettings(true);
            const res = await fetch("/api/settings");
            if (res.ok) setSettings(await res.json());
        } catch { /* silently fail */ }
        finally { setLoadingSettings(false); }
    }, [status]);

    // Auto-populate from session if Supabase not set up
    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            fetchProfile();
            fetchSettings();
        }
        if (status === "unauthenticated") {
            setLoadingProfile(false);
            setLoadingSettings(false);
        }
    }, [status, session, fetchProfile, fetchSettings]);

    const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
        setProfile(prev => prev ? { ...prev, ...data } : null);
        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) setProfile(await res.json());
        } catch { /* silently fail */ }
    }, []);

    const updateSettings = useCallback(async (data: Partial<UserSettings>) => {
        setSettings(prev => prev ? { ...prev, ...data } : null);
        try {
            const res = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) setSettings(await res.json());
        } catch { /* silently fail */ }
    }, []);

    return (
        <UserContext.Provider value={{ profile, settings, loadingProfile, loadingSettings, refreshProfile: fetchProfile, updateProfile, updateSettings }}>
            {children}
        </UserContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used inside UserProvider");
    return ctx;
}
