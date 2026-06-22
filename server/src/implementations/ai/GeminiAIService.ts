import { GoogleGenAI } from "@google/genai";
import {
  IAIService,
  ChatMessage,
  AIResponse,
} from "../../interfaces/IAIService";
import { env } from "../../config/env";

export class GeminiAIService implements IAIService {
  private readonly ai: GoogleGenAI;
  private readonly model = "gemini-2.5-flash";

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: env.geminiApiKey });
  }

  async ask(
    prompt: string,
    context: string,
    history: ChatMessage[] = [],
  ): Promise<AIResponse> {
    const chat = this.ai.chats.create({
      model: this.model,
      config: {
        systemInstruction: this.buildSystemPrompt(context),
      },
      history: history.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage({ message: prompt });
    const answer = result.text ?? "";
    const tokensUsed = result.usageMetadata?.totalTokenCount ?? 0;

    return { answer, tokensUsed };
  }

  async summarize(data: string): Promise<{ text: string; tokensUsed: number }> {
    const result = await this.ai.models.generateContent({
      model: this.model,
      contents: `You are a financial analyst. Summarize this spreadsheet data in 4-6 bullet points
for a small business owner. Focus on totals, trends, and anything unusual.
Be direct and use numbers wherever possible.

Data:
${data}`,
    });

    return {
      text: result.text ?? "",
      tokensUsed: result.usageMetadata?.totalTokenCount ?? 0,
    };
  }

  async extractInsights(
    data: string,
  ): Promise<{ insights: string[]; tokensUsed: number }> {
    const result = await this.ai.models.generateContent({
      model: this.model,
      contents: `Analyze this spreadsheet data and return ONLY a JSON array of insight strings.
Each insight should be one sentence. Return 3-5 insights. No explanation, just the JSON array.

Data:
${data}`,
    });

    const text = (result.text ?? "").trim();
    const tokensUsed = result.usageMetadata?.totalTokenCount ?? 0;

    try {
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      return { insights: Array.isArray(parsed) ? parsed : [], tokensUsed };
    } catch {
      return { insights: [text], tokensUsed };
    }
  }

  private buildSystemPrompt(context: string): string {
    return `You are a financial analyst assistant for small business owners.
You have access to the following spreadsheet data:

${context}

Rules:
- Answer based strictly on the provided data
- Be concise and use specific numbers
- If you cannot find the answer in the data, say so clearly
- Format numbers with proper separators (e.g. 1,234.56)`;
  }
}
