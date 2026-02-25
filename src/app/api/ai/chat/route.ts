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

export async function POST(req: Request) {
    try {
        const { message, history = [] } = await req.json();

        const key = process.env.OPENAI_API_KEY;

        if (!key || key.startsWith("your_") || key === "your_openai_api_key_here") {
            return NextResponse.json({
                reply: "🤖 No AI API key configured. Please add OPENAI_API_KEY to your environment variables.\n\nFor immediate help call:\n📞 Kisan Call Center: 1800-180-1551",
            });
        }

        const { default: OpenAI } = await import("openai");
        const openai = new OpenAI({ apiKey: key });

        const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
            { role: "system", content: SYSTEM_PROMPT },
            ...history.map((m: any) => ({
                role: m.role === "assistant" ? "assistant" as const : "user" as const,
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

        const reply = completion.choices[0]?.message?.content;
        if (!reply) throw new Error("Empty response from OpenAI");

        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error("AI Chat error:", error?.message ?? error);
        return NextResponse.json({
            reply: "🤖 AI service encountered an error. Please check your OPENAI_API_KEY.\n\nFor immediate help call:\n📞 Kisan Call Center: 1800-180-1551",
        });
    }
}
