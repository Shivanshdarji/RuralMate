import { NextResponse } from "next/server";

const VISION_PROMPT = `You are KisanAI Vision — an expert agricultural AI for Indian farmers.

Analyze this crop image and provide a detailed, structured response in the exact JSON format below. Be very specific based on what you actually see in the image. Do NOT say "I cannot see" or "I'm unable to analyze" — give your best expert assessment.

Return ONLY valid JSON, no other text:
{
  "pest": "Name of pest/disease/deficiency detected (e.g., 'Leaf Blight', 'Aphid Infestation', 'Nitrogen Deficiency')",
  "confidence": "Your confidence percentage (e.g., '87%')",
  "severity": "Low | Medium | High | Critical",
  "affectedCrop": "Which crop this typically affects",
  "symptoms": "What visual symptoms you observe in this image",
  "cause": "What causes this pest/disease",
  "treatment": {
    "chemical": "Specific chemical treatment with dosage",
    "organic": "Organic/natural treatment option",
    "preventive": "Preventive measures for next season"
  },
  "urgency": "How urgently the farmer needs to act",
  "helpline": "Kisan Call Center: 1800-180-1551"
}`;

export async function POST(req: Request) {
    try {
        const { imageBase64, mimeType = "image/jpeg" } = await req.json();

        if (!imageBase64) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        const key = process.env.OPENAI_API_KEY;

        // Use mock if key is missing or is a placeholder
        if (!key || key.startsWith("your_") || key === "your_openai_api_key_here") {
            const mockResult = {
                pest: "Leaf Blight (Suspected)",
                confidence: "72%",
                severity: "Medium",
                affectedCrop: "Wheat / Paddy (common for this symptom pattern)",
                symptoms: "Yellow-brown lesions on leaf surface, irregular spots with darker margins, possible wilting at leaf tips.",
                cause: "Fungal pathogen (Alternaria or Helminthosporium species) — triggered by high humidity and poor air circulation.",
                treatment: {
                    chemical: "Mancozeb 75% WP @ 2g/liter water — spray every 7 days for 3 cycles",
                    organic: "Neem oil spray (5ml/liter) + Trichoderma viride soil application @ 2.5 kg/acre",
                    preventive: "Use certified disease-resistant seeds, maintain crop spacing, avoid overhead irrigation"
                },
                urgency: "Act within 3-5 days to prevent spread. Remove heavily infected leaves immediately.",
                helpline: "Kisan Call Center: 1800-180-1551",
                note: "⚠️ Add your OPENAI_API_KEY to .env.local for real image analysis."
            };
            return NextResponse.json({ result: mockResult, usedMock: true });
        }

        const { default: OpenAI } = await import("openai");
        const openai = new OpenAI({ apiKey: key });

        const dataUrl = `data:${mimeType};base64,${imageBase64}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            max_tokens: 1000,
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: VISION_PROMPT },
                        { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
                    ],
                },
            ],
        });

        const text = response.choices[0]?.message?.content ?? "";

        // Parse JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON in response: " + text.slice(0, 200));
        }

        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ result: parsed, usedMock: false });

    } catch (error: any) {
        console.error("Vision API error:", error?.message ?? error);

        return NextResponse.json({
            result: {
                pest: "Analysis Incomplete",
                confidence: "—",
                severity: "Unknown",
                affectedCrop: "Unable to determine",
                symptoms: "Could not process image. Please try again with a clearer photo.",
                cause: "Image analysis failed",
                treatment: {
                    chemical: "Consult your local agriculture department",
                    organic: "Call Kisan Call Center for guidance",
                    preventive: "Maintain crop hygiene and regular inspection"
                },
                urgency: "Please describe symptoms to KisanAI chat for immediate help.",
                helpline: "Kisan Call Center: 1800-180-1551",
                note: `Error: ${error?.message ?? "Unknown error"}`
            },
            usedMock: true,
            error: error?.message
        });
    }
}
