import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  IAIService,
  ChatMessage,
  AIResponse,
} from "../../interfaces/IAIService";
import { env } from "../../config/env";

export class GeminiAIService implements IAIService {
  private readonly client: GoogleGenerativeAI;
  private readonly model = "gemini-2.5-flash";

  constructor() {
    this.client = new GoogleGenerativeAI(env.geminiApiKey);
  }

  async ask(
    prompt: string,
    context: string,
    history: ChatMessage[] = [],
  ): Promise<AIResponse> {
    const model = this.client.getGenerativeModel({
      model: this.model,
      systemInstruction: this.buildSystemPrompt(context),
    });

    const chat = model.startChat({
      history: history.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(prompt);
    const answer = result.response.text();
    const tokensUsed = result.response.usageMetadata?.totalTokenCount ?? 0;

    return { answer, tokensUsed };
  }

  async summarize(data: string): Promise<string> {
    const model = this.client.getGenerativeModel({ model: this.model });

    const result = await model.generateContent(
      `You are a financial analyst. Summarize this spreadsheet data in 4-6 bullet points
for a small business owner. Focus on totals, trends, and anything unusual.
Be direct and use numbers wherever possible.

Data:
${data}`,
    );

    return result.response.text();
  }

  async extractInsights(data: string): Promise<string[]> {
    const model = this.client.getGenerativeModel({ model: this.model });

    const result = await model.generateContent(
      `Analyze this spreadsheet data and return ONLY a JSON array of insight strings.
Each insight should be one sentence. Return 3-5 insights. No explanation, just the JSON array.

Data:
${data}`,
    );

    const text = result.response.text().trim();
    try {
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [text];
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
