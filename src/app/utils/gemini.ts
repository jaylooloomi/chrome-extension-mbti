import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "./logger";

export interface MBTIResult {
  mbti: string;
  title: string;
  description: string;
  traits: string[];
  food: string[];
  clothing: string[];
  housing: string[];
  travel: string[];
  education: string[];
  entertainment: string[];
  money: string[];
  sex: string[];
  pornstar: string[];
  foodpercent: string;
  clothingpercent: string;
  housingpercent: string;
  travelpercent: string;
  educationpercent: string;
  entertainmentpercent: string;
  moneypercent: string;
  sexpercent: string;
  pornstarpercent: string;
  yourself: string;
  couple: string;
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
      
      Please analyze the document and extract the following keywords from the "title",
      Return ONLY a raw JSON object (no markdown formatting, no code blocks) with the following keys:
      - "mbti": The 4-letter MBTI code (e.g., INTJ, ENFP).
      - "title": A cool, cyberpunk-themed title for this persona (e.g., "The Neon Architect", "The Void Navigator"). (Language for: ${langPrompt})
      - "description": A short, engaging analysis of why their bookmarks lead to this conclusion. Tone: Cyberpunk/Sci-fi. (Language for: ${langPrompt})
      - "traits": An array of 3 short keywords describing their digital habits (e.g., "Chaotic", "Optimized", "Data-hoarder"). (Language for: ${langPrompt})
      - "food": (Extract the 7 most relevant keywords related to food preferences from the document; only display the keywords without explanation.)
      - "clothing": (Extract the 7 most relevant keywords related to fashion sense from the document, only display the keywords without explanation)
      - "housing": (Extract the 7 most relevant keywords related to living conditions from the document, only display the keywords without explanation)
      - "travel": (Extract the 7 most relevant keywords related to travel preferences from the document, only display the keywords without explanation)
      - "education": (Extract the 7 most relevant keywords related to educational values ​​from the document, only display the keywords without explanation)
      - "entertainment": (Extract the 7 most relevant keywords related to entertainment values ​​from the document, only display the keywords without explanation)
      - "money": (Extract the 7 most relevant keywords related to money values ​​from the document, only display the keywords without explanation)
      - "sex": (Extract the 7 most relevant keywords related to sexual fetishes and sexual orientation from the document, only display the keywords without explanation)
      - "pornstar": (Extract the 7 most relevant keywords related to pornstar from the document, only display the keywords without explanation)
      - "foodpercent": (Estimate based on tile quantity and distribution density) (ex: If the tile quantity is 80% give me 80)
      - "clothingpercent": (Estimate based on tile quantity and distribution density) (ex: If the tile quantity is 80% give me 80)
      - "housingpercent": (Estimate based on tile quantity and distribution density) (ex: If the tile quantity is 80% give me 80)
      - "travelpercent": (Estimate based on tile quantity and distribution density) (ex: If the tile quantity is 80% give me 80)
      - "educationpercent": (Estimate based on tile quantity and distribution density) (ex: If the tile quantity is 80% give me 80)
      - "entertainmentpercent": (Estimate based on tile quantity and distribution density) (ex: If the tile quantity is 80% give me 80)
      - "moneypercent": (Estimate based on tile quantity and distribution density) (ex: If the tile quantity is 80% give me 80)
      - "sexpercent": (Estimate based on tile quantity and distribution density) (ex: If the tile quantity is 80% give me 80)
      - "yourself": Analyze what kind of person you are? (Summarize the key points in 1-3 sentences)
      - "couple": Analyze What qualities make a good couple for you? (Summarize the key points in 1-3 sentences) (more about sexual compatibility and emotional connection) (Language for: ${langPrompt})
      - "coupleolddata": Analyze which person is right for you? (Summarize the key points in 1-3 sentences) (more about sexual compatibility and emotional connection) (Language for: ${langPrompt})
      Language for response: ${langPrompt}
    `;
    
    //logger.debug("bookmarkStructure:",JSON.stringify(bookmarkStructure))
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
