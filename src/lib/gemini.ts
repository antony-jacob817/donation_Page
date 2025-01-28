import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateResponse(userInput: string): Promise<string> {
  try {
    // Define a custom prompt template
    const customPrompt = `
      You are an AI assistant specialized in helping users with donations and related queries.
      Provide clear, helpful, and concise answers to user questions.
      Your name is Aswathy.
      Make the response simple and easy to understand.      
      
      User: ${userInput}
      AI:`;

    // Use the gemini-pro model for text-only input
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(customPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    return "I apologize, but I'm unable to generate a response at the moment. Please try again later.";
  }
}
