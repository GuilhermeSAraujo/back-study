import { GoogleGenerativeAI } from "@google/generative-ai";
import { InternalServerError } from "./throw-error.js";

export interface QuizQuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizQuestionOptions;
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
}

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) {
      throw new InternalServerError(
        "API key do Gemini não configurada. Configure a variável GEMINI_API_KEY no arquivo .env"
      );
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function generateContent(
  prompt: string,
  modelName: string = "gemini-2.5-flash"
): Promise<string> {
  const genAIClient = getGenAI();
  const model = genAIClient.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateJsonContent<T = unknown>(
  prompt: string,
  modelName: string = "gemini-2.5-flash"
): Promise<T> {
  const text = await generateContent(prompt, modelName);

  // Extract JSON from response (remove possible markdown code blocks)
  let jsonText = text.trim();
  if (jsonText.startsWith("```json")) {
    jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  try {
    return JSON.parse(jsonText) as T;
  } catch (error) {
    throw new Error("Erro ao processar resposta do Gemini: A resposta não contém JSON válido");
  }
}
