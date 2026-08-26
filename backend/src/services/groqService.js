import { Groq } from "groq-sdk";

let groqClient = null;

const getGroqClient = () => {
  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
};

/**
 * Sends a chat request to Groq API.
 * @param {Array} messages - Array of message objects { role, content }
 * @returns {Promise<String>} - The AI response text
 */
export const chatCompletion = async (messages) => {
  try {
    const groq = getGroqClient();
    const response = await groq.chat.completions.create({
      model: "groq/compound",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
    });
    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error("Failed to get response from Personal Intelligence.");
  }
};
