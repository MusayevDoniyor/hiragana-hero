import { GoogleGenAI, Type } from "@google/genai";
import { WordAnalysis, AppLanguage } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeWord = async (characters: string, language: AppLanguage): Promise<WordAnalysis> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const model = "gemini-2.5-flash";
  const langName = language;

  const prompt = `Analyze the Japanese string "${characters}" composed of Hiragana. 
  1. Determine if it forms a valid Japanese word or common phrase.
  2. If valid, provide the reading (romaji).
  3. Provide the meaning in ${langName}.
  4. Provide a breakdown/nuance in ${langName}.
  5. Provide 3 simple example sentences using this word. Each example must have the Japanese sentence, Romaji reading, and translation in ${langName}.
  
  If it is NOT a valid word, suggest the closest real word. Return meaning and breakdown explaining why it's invalid in ${langName}.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      isValid: { type: Type.BOOLEAN },
      reading: { type: Type.STRING },
      meaning: { type: Type.STRING },
      breakdown: { type: Type.STRING },
      examples: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            japanese: { type: Type.STRING },
            romaji: { type: Type.STRING },
            translation: { type: Type.STRING }
          }
        }
      }
    },
    required: ["isValid", "reading", "meaning", "breakdown", "examples"],
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as WordAnalysis;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      isValid: false,
      reading: "Error",
      meaning: "Service unavailable",
      breakdown: "Please check your internet or API key.",
      examples: []
    };
  }
};

export const generateMnemonic = async (char: string, romaji: string, language: AppLanguage): Promise<string> => {
  if (!apiKey) return "API Key missing. Imagine a picture matching the shape!";

  const model = "gemini-2.5-flash";
  const langName = language;
  const prompt = `Create a short, memorable, and visual mnemonic to help a student memorize the Hiragana character "${char}" (pronounced "${romaji}"). Focus on the shape. The mnemonic must be in ${langName}. Keep it under 20 words.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "Visualize the shape!";
  } catch (error) {
    return "Visualize the shape!";
  }
};

export const generateVocab = async (input: string, language: AppLanguage): Promise<{ japanese: string, romaji: string, meaning: string } | null> => {
  if (!apiKey) return null;

  const model = "gemini-2.5-flash";
  const langName = language;

  const prompt = `The user wants to add a Japanese word to their study list.
  The user input is: "${input}".
  
  The input might be in English (e.g., "cat"), Romaji (e.g., "neko"), or another language.
  
  1. Identify the intended Japanese word.
  2. Return the word written primarily in Hiragana (use Kanji only if it is very common for beginners).
  3. Return the Romaji reading.
  4. Return the meaning in ${langName}.
  
  Return JSON.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      japanese: { type: Type.STRING, description: "The word in Hiragana" },
      romaji: { type: Type.STRING },
      meaning: { type: Type.STRING, description: `Meaning in ${langName}` }
    },
    required: ["japanese", "romaji", "meaning"],
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Vocab Generation Error:", error);
    return null;
  }
};

// Check if user's translation is correct using AI (Soft match)
export const validateAnswer = async (userAnswer: string, correctAnswer: string, language: AppLanguage): Promise<boolean> => {
  if (!apiKey) {
    // Fallback if no API key: exact case-insensitive string match
    return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
  }

  const model = "gemini-2.5-flash";
  const prompt = `
  Context: A language learning app.
  Target Meaning: "${correctAnswer}"
  User Input: "${userAnswer}"
  Language Context: ${language}
  
  Question: Is the User Input a valid correct translation or synonym for the Target Meaning? 
  Be generous with typos, but strict with meaning.
  
  Return JSON: { "isCorrect": boolean }
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      isCorrect: { type: Type.BOOLEAN },
    },
    required: ["isCorrect"],
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    
    const json = JSON.parse(response.text || '{"isCorrect": false}');
    return json.isCorrect;
  } catch (e) {
    console.error(e);
    // Fallback
    return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
  }
}
