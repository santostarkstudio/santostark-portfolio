/**
 * gemini.js — Gemini AI integration service for SantoStark Portfolio
 * Uses the Google Gemini 1.5 Flash API via REST (no SDK needed).
 *
 * SECURITY: Key is read from VITE_GEMINI_API_KEY env variable.
 * Never hardcode your API key here. Set it in your .env file.
 */

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// ── Portfolio context injected into every prompt so AI knows who you are ──────
const PORTFOLIO_SYSTEM_CONTEXT = `
You are a smart AI assistant embedded in the personal portfolio website of Santosh D A — a Systems Architect, Full-Stack Developer, and IoT Engineer based in Bengaluru, India.

Key facts about Santosh:
- Currently a Systems Development Intern at CloudTech Systems Pvt Ltd (Bengaluru)
- Expert in: C++, Python, React, Vite, Three.js, WebGL, Firebase, ESP32, FreeRTOS, MQTT, AWS IoT Core, Docker
- Passionate about: distributed systems, embedded firmware, 3D web graphics, machine learning
- Education: Computer Science Engineering (B.E.)
- Portfolio sections: Home, About, Projects, Work Experience, Skills, Education, Interests, Certificates, Gallery, Contact

Your role:
- Answer visitor questions about Santosh's skills, projects, experience, and background
- Be professional, concise, and friendly
- If you don't know a specific detail, say so honestly and suggest visiting the relevant section
- Never make up fake projects or fake job details
- Encourage visitors to reach out via the Contact page if they want to collaborate
- Keep responses short (2-4 sentences max) unless the visitor clearly wants detail
`;

/**
 * Send a message to Gemini and get a response.
 * @param {string} userMessage - The visitor's message
 * @param {Array<{role: string, text: string}>} history - Prior conversation history
 * @returns {Promise<string>} - AI response text
 */
export async function askGemini(userMessage, history = []) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'paste_your_new_key_here') {
    return "⚠️ Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.";
  }

  // Build conversation turns
  const contents = [
    // Inject portfolio context as the first user+model exchange
    {
      role: 'user',
      parts: [{ text: PORTFOLIO_SYSTEM_CONTEXT }]
    },
    {
      role: 'model',
      parts: [{ text: "Understood! I'm ready to help visitors learn about Santosh D A's portfolio and work. How can I help?" }]
    },
    // Prior chat history
    ...history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })),
    // Current user message
    {
      role: 'user',
      parts: [{ text: userMessage }]
    }
  ];

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
          topP: 0.9
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('Gemini API error:', err);
      return "Sorry, I had trouble connecting to AI. Please try again or contact Santosh directly.";
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || "I couldn't generate a response. Please try rephrasing your question.";

  } catch (error) {
    console.error('Gemini fetch failed:', error);
    return "Network error. Please check your connection and try again.";
  }
}

/**
 * Generate a smart auto-reply for the Contact form.
 * @param {string} name - Visitor name
 * @param {string} email - Visitor email
 * @param {string} message - Visitor message content
 * @returns {Promise<string>} - AI-crafted reply
 */
export async function generateContactReply(name, message) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'paste_your_new_key_here') {
    return null; // Silently skip if no key — contact form still works normally
  }

  const prompt = `
You are Santosh D A's AI assistant. A visitor named "${name}" just sent the following message through the portfolio contact form:

"${message}"

Write a warm, professional auto-acknowledgement reply FROM Santosh to this visitor. Keep it to 3-4 sentences max. 
- Thank them for reaching out
- Acknowledge the topic they mentioned
- Let them know Santosh will reply personally soon
- Sign off naturally

Do NOT make up specific details. Write as if Santosh is writing this himself.
`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 256 }
      })
    });

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}
