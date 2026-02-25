import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getSupabase() {
    const { supabase } = await import("@/lib/supabase");
    return supabase;
}

// ─── GET /api/profile ─────────────────────────────────────────────────────────
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = (session.user as any).id ?? session.user.name;

        // Return session-based fallback if userId is missing or Supabase not configured
        const mockProfile = {
            id: userId ?? "unknown",
            name: session.user.name ?? "Kisan Ji",
            phone: (session.user as any).phone ?? "",
            village: "", district: "", state: "", land_acres: "",
            main_crops: "", livestock: "", profile_complete: false,
            _mock: true,
        };

        if (!userId) return NextResponse.json(mockProfile);

        const supabase = await getSupabase();

        if (!supabase) {
            return NextResponse.json(mockProfile);
        }

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error && error.code !== "PGRST116") {
            console.error("Profile GET error:", error);
            return NextResponse.json(mockProfile);
        }

        if (!data) {
            const init = {
                id: userId,
                name: session.user.name ?? "Kisan Ji",
                phone: (session.user as any).phone ?? "",
                village: "", district: "", state: "", land_acres: "",
                main_crops: "", livestock: "", profile_complete: false,
            };
            await supabase.from("profiles").insert(init).then(({ error: e }) => {
                if (e) console.error("Profile insert error:", e);
            });
            return NextResponse.json(init);
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("Profile GET unexpected error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// ─── PATCH /api/profile ────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = (session.user as any).id ?? session.user.name;
        if (!userId) return NextResponse.json({ error: "No user ID" }, { status: 400 });

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

        if (error) {
            console.error("Profile PATCH error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(data);
    } catch (err) {
        console.error("Profile PATCH unexpected error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
