import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const city = searchParams.get("city");
    const apiKey = (process.env.OPENWEATHER_API_KEY ?? "").trim();

    // No key or still placeholder
    if (!apiKey || apiKey.startsWith("your_")) {
        return NextResponse.json({ error: "no_key" }, { status: 503 });
    }

    try {
        let finalLat = lat;
        let finalLon = lon;
        let resolvedName = city ?? "Your Location";

        // ── 1. Geocode city → lat/lon ─────────────────────────────────────────
        if (city && (!finalLat || !finalLon)) {
            const geoRes = await fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},IN&limit=1&appid=${apiKey}`,
                { next: { revalidate: 0 } }
            );
            if (geoRes.ok) {
                const geoData = await geoRes.json();
                if (geoData?.[0]) {
                    finalLat = String(geoData[0].lat);
                    finalLon = String(geoData[0].lon);
                    resolvedName = geoData[0].local_names?.en ?? geoData[0].name ?? resolvedName;
                }
            }
        }

        if (!finalLat || !finalLon) {
            return NextResponse.json({ error: "location_not_found" }, { status: 400 });
        }

        // ── 2. Current weather (free tier endpoint always works) ──────────────
        const [currentRes, forecastRes] = await Promise.all([
            fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${finalLat}&lon=${finalLon}&appid=${apiKey}&units=metric`,
                { next: { revalidate: 0 } }
            ),
            fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${finalLat}&lon=${finalLon}&appid=${apiKey}&units=metric&cnt=40`,
                { next: { revalidate: 0 } }
            ),
        ]);

        if (!currentRes.ok) {
            const errBody = await currentRes.json().catch(() => ({}));
            console.error("OWM current weather error:", currentRes.status, errBody);
            return NextResponse.json({ error: "owm_error", status: currentRes.status, message: errBody?.message }, { status: 502 });
        }

        const current = await currentRes.json();
        let forecast = null;
        if (forecastRes.ok) {
            forecast = await forecastRes.json();
        }

        return NextResponse.json({
            current,
            forecast,
            name: resolvedName,
        });
    } catch (err) {
        console.error("Weather API exception:", err);
        return NextResponse.json({ error: "fetch_failed" }, { status: 500 });
    }
}
