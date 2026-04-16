import OpenAI from "openai";
import { SymptomCheckRequest, StreamEvent } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a medical AI assistant for Medibot, a symptom checker tool.
Your role is to analyze user-described symptoms and provide:
1. 3-5 possible conditions (with confidence percentages)
2. Severity level (mild/moderate/urgent) based on symptoms
3. Specific next-step recommendations (home care, doctor, ER)

IMPORTANT RULES:
- Always include this disclaimer at the end: "This is not a medical diagnosis. Please consult a healthcare professional for proper evaluation."
- If symptoms suggest emergency (chest pain, difficulty breathing, severe bleeding, etc.), mark as URGENT and recommend ER immediately.
- Be conservative with severity assessments - err on the side of caution.
- Consider symptom combinations, not just individual symptoms.
- Provide confidence scores as percentages (e.g., "85%").
- Format conditions as: "Condition Name - Confidence: X%"
- Format recommendations as bullet points.

Response format (strict JSON):
{
  "conditions": [
    {"name": "...", "confidence": 85, "description": "..."},
    ...
  ],
  "severity": "mild|moderate|urgent",
  "recommendations": ["...", "..."],
  "disclaimer": "This is not a medical diagnosis. Please consult a healthcare professional for proper evaluation."
}`;

export async function* analyzeSymptomsStream(
  symptoms: string
): AsyncGenerator<StreamEvent> {
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `My symptoms: ${symptoms}` },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    });

    let fullContent = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullContent += content;
        yield { type: "token", token: content };
      }
    }

    // Parse the complete JSON response
    try {
      // Extract JSON from markdown code blocks if present
      let jsonMatch = fullContent.match(/```(?:json)?\n([\s\S]*?)\n```/);
      let jsonStr = jsonMatch ? jsonMatch[1] : fullContent;

      const parsed = JSON.parse(jsonStr);

      // Validate and emit structured events
      if (parsed.conditions && Array.isArray(parsed.conditions)) {
        for (const condition of parsed.conditions) {
          yield {
            type: "condition",
            condition: {
              name: condition.name || "Unknown condition",
              confidence: condition.confidence || 0,
              description: condition.description || "",
            },
          };
        }
      }

      if (parsed.severity) {
        yield {
          type: "severity",
          severity: parsed.severity as "mild" | "moderate" | "urgent",
        };
      }

      if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        yield {
          type: "recommendations",
          recommendations: parsed.recommendations,
        };
      }

      const confidence_score =
        parsed.conditions?.reduce((sum: number, c: any) => sum + (c.confidence || 0), 0) /
          (parsed.conditions?.length || 1) / 100 || 0;

      yield {
        type: "complete",
        data: {
          conditions: parsed.conditions?.map((c: any) => ({
            name: c.name || "Unknown",
            confidence: c.confidence || 0,
            description: c.description || "",
          })) || [],
          severity: parsed.severity || "moderate",
          recommendations: parsed.recommendations || [],
          confidence_score,
        },
      };
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      yield {
        type: "error",
        message: "Failed to parse the response. Please try again.",
      };
    }
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    yield {
      type: "error",
      message: error.message || "An error occurred while analyzing symptoms.",
    };
  }
}