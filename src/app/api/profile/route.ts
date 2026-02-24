import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// Dynamic import to avoid crashing when Supabase keys are missing
async function getSupabase() {
    const { supabase } = await import("@/lib/supabase");
    return supabase;
}

// ─── GET /api/profile ─────────────────────────────────────────────────────────
export async function GET() {
    const session = await getServerSession();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id ?? session.user.name;
    const supabase = await getSupabase();

    if (!supabase) {
        // Return session-based fallback if Supabase not configured
        return NextResponse.json({
            id: userId,
            name: session.user.name ?? "Kisan Ji",
            phone: (session.user as any).phone ?? "",
            village: "", district: "", state: "", land_acres: "",
            main_crops: "", livestock: "", profile_complete: false,
            _mock: true,
        });
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error && error.code !== "PGRST116") {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        // Create initial record
        const init = {
            id: userId,
            name: session.user.name ?? "Kisan Ji",
            phone: (session.user as any).phone ?? "",
            village: "", district: "", state: "", land_acres: "",
            main_crops: "", livestock: "", profile_complete: false,
        };
        await supabase.from("profiles").insert(init);
        return NextResponse.json(init);
    }

    return NextResponse.json(data);
}

// ─── PATCH /api/profile ────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
    const session = await getServerSession();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id ?? session.user.name;
    const body = await req.json();
    const supabase = await getSupabase();

    if (!supabase) {
        return NextResponse.json({ ...body, _mock: true });
    }

    const { data, error } = await supabase
        .from("profiles")
        .upsert({ id: userId, ...body, updated_at: new Date().toISOString() })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
