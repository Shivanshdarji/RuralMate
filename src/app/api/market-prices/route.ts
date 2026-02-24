import { NextResponse } from "next/server";

const MANDI_DATA = [
    // Cereals
    { commodity: "Wheat", category: "Cereals", basePrice: 2425, msp: 2275, unit: "/qtl", mandi: "Ujjain APMC", icon: "🌾", state: "MP" },
    { commodity: "Paddy (Common)", category: "Cereals", basePrice: 2183, msp: 2183, unit: "/qtl", mandi: "Bhopal Mandi", icon: "🌾", state: "MP" },
    { commodity: "Maize", category: "Cereals", basePrice: 2090, msp: 2090, unit: "/qtl", mandi: "Indore APMC", icon: "🌽", state: "MP" },
    { commodity: "Jowar (Hybrid)", category: "Cereals", basePrice: 3180, msp: 3180, unit: "/qtl", mandi: "Dewas Mandi", icon: "🌾", state: "MP" },
    { commodity: "Bajra", category: "Cereals", basePrice: 2500, msp: 2500, unit: "/qtl", mandi: "Ratlam Mandi", icon: "🌿", state: "MP" },
    { commodity: "Barley", category: "Cereals", basePrice: 1735, msp: 1735, unit: "/qtl", mandi: "Sagar Mandi", icon: "🌾", state: "MP" },

    // Pulses
    { commodity: "Chana (Gram)", category: "Pulses", basePrice: 5440, msp: 5440, unit: "/qtl", mandi: "Indore APMC", icon: "🫘", state: "MP" },
    { commodity: "Arhar (Tur Dal)", category: "Pulses", basePrice: 7000, msp: 7000, unit: "/qtl", mandi: "Bhopal Mandi", icon: "🫘", state: "MP" },
    { commodity: "Moong", category: "Pulses", basePrice: 8558, msp: 8558, unit: "/qtl", mandi: "Ujjain APMC", icon: "🫘", state: "MP" },
    { commodity: "Urad (Black Gram)", category: "Pulses", basePrice: 7400, msp: 7400, unit: "/qtl", mandi: "Dewas Mandi", icon: "🫘", state: "MP" },
    { commodity: "Masur (Lentil)", category: "Pulses", basePrice: 6425, msp: 6425, unit: "/qtl", mandi: "Jabalpur Mandi", icon: "🫘", state: "MP" },

    // Oilseeds
    { commodity: "Mustard (Rapeseed)", category: "Oilseeds", basePrice: 5650, msp: 5650, unit: "/qtl", mandi: "Kota APMC", icon: "🌻", state: "RAJ" },
    { commodity: "Soybean", category: "Oilseeds", basePrice: 4600, msp: 4600, unit: "/qtl", mandi: "Indore APMC", icon: "🌿", state: "MP" },
    { commodity: "Groundnut", category: "Oilseeds", basePrice: 6377, msp: 6377, unit: "/qtl", mandi: "Rajkot APMC", icon: "🥜", state: "GUJ" },
    { commodity: "Sunflower Seeds", category: "Oilseeds", basePrice: 5800, msp: 5800, unit: "/qtl", mandi: "Gulbarga Mandi", icon: "🌻", state: "KA" },
    { commodity: "Sesame (Til)", category: "Oilseeds", basePrice: 8635, msp: 8635, unit: "/qtl", mandi: "Amravati Mandi", icon: "🌱", state: "MH" },

    // Vegetables
    { commodity: "Onion", category: "Vegetables", basePrice: 2200, msp: null, unit: "/qtl", mandi: "Lasalgaon APMC", icon: "🧅", state: "MH" },
    { commodity: "Potato", category: "Vegetables", basePrice: 1100, msp: null, unit: "/qtl", mandi: "Agra Mandi", icon: "🥔", state: "UP" },
    { commodity: "Tomato", category: "Vegetables", basePrice: 1800, msp: null, unit: "/qtl", mandi: "Kolar APMC", icon: "🍅", state: "KA" },
    { commodity: "Garlic", category: "Vegetables", basePrice: 8000, msp: null, unit: "/qtl", mandi: "Neemuch APMC", icon: "🧄", state: "MP" },
    { commodity: "Cabbage", category: "Vegetables", basePrice: 600, msp: null, unit: "/qtl", mandi: "Nashik Mandi", icon: "🥬", state: "MH" },

    // Fruits
    { commodity: "Banana (Robusta)", category: "Fruits", basePrice: 1600, msp: null, unit: "/qtl", mandi: "Anand APMC", icon: "🍌", state: "GUJ" },
    { commodity: "Mango (Alphonso)", category: "Fruits", basePrice: 12000, msp: null, unit: "/qtl", mandi: "Ratnagiri Mandi", icon: "🥭", state: "MH" },
    { commodity: "Orange", category: "Fruits", basePrice: 4000, msp: null, unit: "/qtl", mandi: "Nagpur APMC", icon: "🍊", state: "MH" },
    { commodity: "Grapes (White)", category: "Fruits", basePrice: 5500, msp: null, unit: "/qtl", mandi: "Nashik Mandi", icon: "🍇", state: "MH" },

    // Spices
    { commodity: "Cumin (Jeera)", category: "Spices", basePrice: 22000, msp: null, unit: "/qtl", mandi: "Unjha APMC", icon: "🌿", state: "GUJ" },
    { commodity: "Turmeric", category: "Spices", basePrice: 14000, msp: null, unit: "/qtl", mandi: "Nizamabad Mandi", icon: "🟡", state: "TG" },
    { commodity: "Chilli (Red, Dry)", category: "Spices", basePrice: 18000, msp: null, unit: "/qtl", mandi: "Guntur APMC", icon: "🌶️", state: "AP" },
    { commodity: "Coriander", category: "Spices", basePrice: 7500, msp: null, unit: "/qtl", mandi: "Kota Mandi", icon: "🌿", state: "RAJ" },
    { commodity: "Ginger (Fresh)", category: "Spices", basePrice: 4500, msp: null, unit: "/qtl", mandi: "Erode APMC", icon: "🫚", state: "TN" },

    // Cotton & Fibres
    { commodity: "Cotton (MCU 5)", category: "Fibres", basePrice: 6620, msp: 6620, unit: "/qtl", mandi: "Akola APMC", icon: "☁️", state: "MH" },
    { commodity: "Jute (TD-3)", category: "Fibres", basePrice: 5050, msp: 5050, unit: "/qtl", mandi: "Kolkata Mandi", icon: "🌿", state: "WB" },
];

export async function GET() {
    try {
        const now = new Date();
        const seed = Math.floor(now.getTime() / (1000 * 60 * 5)); // changes every 5 min

        const prices = MANDI_DATA.map((item, idx) => {
            const rng = Math.sin(seed * 9301 + idx * 49297 + 233) * 0.5 + 0.5; // deterministic pseudo-random
            const fluctuationPct = (rng - 0.5) * 0.06; // ±3% fluctuation
            const price = Math.round(item.basePrice * (1 + fluctuationPct));
            const prevPrice = Math.round(item.basePrice * (1 + (Math.sin((seed - 1) * 9301 + idx * 49297 + 233) * 0.5 + 0.5 - 0.5) * 0.06));
            const change = price - prevPrice;
            const changePct = ((change / prevPrice) * 100).toFixed(2);
            const aboveMSP = item.msp ? price >= item.msp : null;

            return {
                commodity: item.commodity,
                category: item.category,
                price,
                priceFormatted: `₹${price.toLocaleString("en-IN")}`,
                msp: item.msp,
                mspFormatted: item.msp ? `₹${item.msp.toLocaleString("en-IN")}` : null,
                aboveMSP,
                change,
                changeFormatted: `${change >= 0 ? "+" : ""}₹${Math.abs(change)}`,
                changePct: `${change >= 0 ? "+" : ""}${changePct}%`,
                positive: change >= 0,
                unit: item.unit,
                mandi: item.mandi,
                state: item.state,
                icon: item.icon,
                // 7-day simulated sparkline data
                sparkline: Array.from({ length: 7 }, (_, i) => {
                    const r = Math.sin((seed - (6 - i)) * 9301 + idx * 49297 + 233) * 0.5 + 0.5;
                    return Math.round(item.basePrice * (1 + (r - 0.5) * 0.06));
                }),
            };
        });

        return NextResponse.json({
            prices,
            updatedAt: now.toISOString(),
            nextUpdateIn: 300 - (Math.floor(now.getTime() / 1000) % 300), // seconds until next update
        });
    } catch {
        return NextResponse.json({ error: "Failed to fetch market prices" }, { status: 500 });
    }
}
