import { Hono } from "hono";

const router = new Hono();

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

router.post("/", async (c: any) => {
  const { type, text } = await c.req.json();
  const apiKey = c.env.GEMINI_API_KEY;

  if (!text || !type) {
    return c.json({ error: "Text and type are required." }, 400);
  }

  let prompt = "";

  if (type === "paraphrase") prompt = `Paraphrase the following text clearly, keeping the meaning unchanged. Use simple, commonly used words. Only return the revised text, no extra commentary:\n\n${text}`;
  else if (type === "grammar") prompt = `Correct grammar and improve sentence structure in the following text without changing its meaning. Use a clear, natural tone. Only return the improved text:\n\n${text}`;
  else if (type === "shorten") prompt = `Rewrite the following text to be shorter and more concise while keeping the meaning intact. Avoid losing important details. Only return the shortened version:\n\n${text}`;
  else if (type === "extend") prompt = `Expand the following text by adding meaningful details, examples, or context. Keep the tone simple and natural. Do not overcomplicate. Only return the expanded version:\n\n${text}`;
  else if (type === "title") prompt = `Based on the following blog content, generate a catchy, relevant, and concise title. Keep it clear and suitable for a blog. Only return the title, nothing else:\n\n${text}`;
  else return c.json({ error: "Invalid type." }, 400);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data: any = await response.json();

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return c.json({ result: data.candidates[0].content.parts[0].text.trim() })
    } else {
      console.error("Empty AI response:", data);
      return c.json({ error: "AI response was empty." }, 500);
    }
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to communicate with inkwell Ai." }, 500);
  }
});

export default router;
