import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "./logger";

export interface MBTIResult {
  mbti: string;
  title: string;
  description: string;
  traits: string[];
}

export const analyzeMBTI = async (apiKey: string, bookmarkStructure: any, language: string): Promise<MBTIResult> => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const langPrompt = language === 'zh' ? 'Traditional Chinese (繁體中文)' : 'English';
    
    const prompt = `
      You are a psychological expert specializing in digital footprints. 
      Analyze the following browser bookmark directory structure and website names and determine the user's likely MBTI personality type.
      
      Bookmark StructureName And WebsiteName:
      ${JSON.stringify(bookmarkStructure)} 
      
      Return ONLY a raw JSON object (no markdown formatting, no code blocks) with the following keys:
      - "mbti": The 4-letter MBTI code (e.g., INTJ, ENFP).
      - "title": A cool, cyberpunk-themed title for this persona (e.g., "The Neon Architect", "The Void Navigator").
      - "description": A short, engaging analysis of why their bookmarks lead to this conclusion. Tone: Cyberpunk/Sci-fi.
      - "traits": An array of 3 short keywords describing their digital habits (e.g., "Chaotic", "Optimized", "Data-hoarder").

      Language for response: ${langPrompt}
    `;
    logger.debug("bookmarkStructure:",JSON.stringify(bookmarkStructure))
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    logger.debug("response:",text)

    // Clean up if Gemini wraps in markdown code blocks
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText) as MBTIResult;
  } catch (error) {
    logger.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze MBTI. Please check your API Key.");
  }
};
