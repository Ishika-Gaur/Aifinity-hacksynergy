import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not set in environment variables.");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

/**
 * Sends a chat request to Gemini API to generate assessment questions.
 * @param {string} field - The field (e.g., Backend Development)
 * @param {string} topic - The topic (e.g., Node.js)
 * @param {string} difficulty - Difficulty level (Easy, Medium, Hard)
 * @param {number} count - Number of questions
 * @returns {Promise<Object>} - The structured JSON response containing questions
 */
export const generateQuestions = async (field, topic, difficulty, count) => {
  try {
    const ai = getGenAI();
    // Using gemini-3.6-flash as it's fast and good at JSON generation
    const model = ai.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `You are an expert technical assessor. Generate exactly ${count} multiple-choice questions for an assessment.
    
Field: ${field}
Topic: ${topic}
Difficulty: ${difficulty}

Requirements:
- Provide exactly 4 options per question.
- Only one option can be correct.
- Ensure questions are technically accurate and appropriate for the ${difficulty} difficulty level.
- Provide a short, useful explanation for the correct answer.
- Do NOT include duplicate questions.
- Return ONLY a valid JSON object matching this exact schema, with NO markdown formatting, NO backticks, and NO extra text:

{
  "questions": [
    {
      "question": "The question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "The exact string of the correct option",
      "explanation": "Short explanation of why the answer is correct",
      "difficulty": "${difficulty}",
      "topic": "${topic}"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Clean up potential markdown formatting from the response
    if (text.startsWith("\`\`\`json")) {
      text = text.replace(/^\`\`\`json\n/, "").replace(/\n\`\`\`$/, "");
    } else if (text.startsWith("\`\`\`")) {
      text = text.replace(/^\`\`\`\n/, "").replace(/\n\`\`\`$/, "");
    }

    const parsedJson = JSON.parse(text);
    return parsedJson;
  } catch (error) {
    console.error("Gemini API Error in generateQuestions:", error);
    throw new Error("Failed to generate AI questions: " + error.message);
  }
};

/**
 * Sends a multi-turn chat request to Gemini for the Personal Intelligence feature.
 * @param {string} systemPrompt - The system-level context/instructions
 * @param {Array} messages - Conversation history [{role, content}]
 * @returns {Promise<string>} - The AI response text
 */
export const chatCompletion = async (systemPrompt, messages) => {
  try {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction: systemPrompt,
    });

    // Gemini requires:
    // 1. History must start with a "user" role message
    // 2. Roles must alternate user/model
    // 3. Last message is sent separately via sendMessage()
    //
    // The frontend passes the full conversation including the initial assistant
    // greeting. We skip leading assistant messages and only keep valid pairs.

    const allButLast = messages.slice(0, -1);

    // Drop any leading assistant/model messages (e.g. the greeting)
    let start = 0;
    while (start < allButLast.length && allButLast[start].role !== "user") {
      start++;
    }

    const history = allButLast.slice(start).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });

    // The last message must always be from the user
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini Chat API Error:", error.message);
    throw new Error("Failed to get response from Personal Intelligence: " + error.message);
  }
};
