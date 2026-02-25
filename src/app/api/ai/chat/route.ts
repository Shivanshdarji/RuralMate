import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are KisanAI, a highly knowledgeable and empathetic AI assistant for Indian farmers and rural communities. 

Your personality:
- Warm, helpful, and easy to understand
- Speak in simple Hindi or English depending on the user's question
- Use relevant emojis to make responses friendly
- Give practical, actionable advice

Your expertise:
- Crop advice: what to plant, when to plant, soil preparation, crop diseases, pest management
- Medical/health advice: basic first aid, common rural health issues, when to see a doctor, connect to telehealth
- Weather-based farming tips
- Government schemes (PM-KISAN, Fasal Bima Yojana, Soil Health Card, etc.)
- Market prices and best selling strategies
- Irrigation and water management
- Fertilizer recommendations (NPK, organic)
- Livestock care
- Emergency guidance (flood, drought, pesticide poisoning)

Important rules:
- For health/medical queries, provide basic advice but ALWAYS recommend consulting a real doctor
- For emergencies, provide immediate guidance and helpline numbers
- Keep responses concise and practical
- Use numbers and bullet points for clarity

National helplines to mention when relevant:
- Kisan Call Center: 1800-180-1551
- Medical Emergency: 108
- PM-KISAN Helpline: 155261`;

// ---------- Gemini ----------
async function tryGemini(message: string, history: any[]) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "your_gemini_api_key_here") return null;

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const chat = model.startChat({
        history: history.map((m: any) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
        })),
        generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
        systemInstruction: SYSTEM_PROMPT,
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
}

// ---------- OpenAI ----------
async function tryOpenAI(message: string, history: any[]) {
    const key = process.env.OPENAI_API_KEY;
    if (!key || key === "your_openai_api_key_here") return null;

    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: key });

    const messages: any[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.map((m: any) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
        })),
        { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 800,
        temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || null;
}

// ---------- Handler ----------
export async function POST(req: Request) {
    try {
        const { message, history = [] } = await req.json();

        // Try Gemini first, then OpenAI as fallback
        let reply = await tryGemini(message, history).catch(() => null);
        if (!reply) {
            reply = await tryOpenAI(message, history).catch(() => null);
        }

        if (!reply) {
            return NextResponse.json({
                reply: "🤖 No AI API key configured. Please add either GEMINI_API_KEY or OPENAI_API_KEY to your .env.local file.\n\nFor immediate help call:\n📞 Kisan Call Center: 1800-180-1551",
            });
        }

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error("AI Chat error:", error);
        return NextResponse.json({
            reply: "🤖 AI service encountered an error. Please check your API keys in .env.local.\n\nFor immediate help call:\n📞 Kisan Call Center: 1800-180-1551",
        });
    }
}
