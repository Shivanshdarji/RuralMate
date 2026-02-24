import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

async function getSupabase() {
    const { supabase } = await import("@/lib/supabase");
    return supabase;
}

const DEFAULT_SETTINGS = {
    language: "hi",
    notifications_weather: true,
    notifications_market: true,
    notifications_schemes: true,
    notifications_pest: true,
    units_area: "acre",
    units_weight: "quintal",
    units_currency: "inr",
    theme: "dark",
    voice_language: "hi-IN",
    auto_location: true,
};

// ─── GET /api/settings ────────────────────────────────────────────────────────
export async function GET() {
    const session = await getServerSession();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id ?? session.user.name;
    const supabase = await getSupabase();

    if (!supabase) {
        return NextResponse.json({ ...DEFAULT_SETTINGS, _mock: true });
    }

    const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (error && error.code !== "PGRST116") {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        const init = { user_id: userId, ...DEFAULT_SETTINGS };
        await supabase.from("user_settings").insert(init);
        return NextResponse.json(init);
    }

    return NextResponse.json(data);
}

// ─── PATCH /api/settings ─────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
    const session = await getServerSession();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id ?? session.user.name;
    const body = await req.json();
    const supabase = await getSupabase();

    if (!supabase) {
        return NextResponse.json({ ...DEFAULT_SETTINGS, ...body, _mock: true });
    }

    const { data, error } = await supabase
        .from("user_settings")
        .upsert({ user_id: userId, ...body, updated_at: new Date().toISOString() })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
