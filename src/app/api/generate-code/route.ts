import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { html, css } = req.body;

    const prompt = `
      Optimize and format the following HTML and CSS:
      - Ensure proper structure
      - Format Tailwind CSS styles correctly
      - Maintain the original layout and positioning

      HTML:
      ${html}

      CSS:
      ${css}
    `;

    // ✅ Send request to Gemini API
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText",
      {
        prompt: { text: prompt },
        temperature: 0.7,
        maxTokens: 2048,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`, // ✅ Store API Key in .env
        },
      }
    );

    const aiOptimizedCode = response.data.candidates[0].content;
    return res.status(200).json({ code: aiOptimizedCode });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Failed to generate code" });
  }
}
