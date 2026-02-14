
import { GoogleGenAI, Type } from "@google/genai";

export const analyzeColorPalette = async (base64Image: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze this image's color composition. Provide:
  1. Dominant color mood.
  2. The balance between Red, Green, and Blue channels.
  3. A creative suggestion for color grading (e.g., cinematic, vintage, high-contrast).
  Return as JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Image.split(',')[1],
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dominantColor: { type: Type.STRING },
          balance: { type: Type.STRING },
          suggestion: { type: Type.STRING },
        },
        required: ['dominantColor', 'balance', 'suggestion'],
      },
    },
  });

  return JSON.parse(response.text);
};
