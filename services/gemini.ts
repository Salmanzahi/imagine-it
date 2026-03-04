import { GoogleGenerativeAI } from "@google/generative-ai";

export const genai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
// export const ai = genAI.getGenerativeModel({model: "gemini-2.5-flash"})


