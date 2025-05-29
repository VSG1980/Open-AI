import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL:
    "https://webapp.v2.vortex.upscale.tech/proxy/techeducators/ee155667/di-openai/v1/",
  defaultHeaders: {
    apiKey: process.env.OPENAI_API_KEY,
  },
});

app.get("/", (req, res) => {
  res.json("This is just the root endpoint. Move along, please.");
});

app.post("/chat", async (req, res) => {
  const userTopic = req.body.prompt;
  console.log(" Prompt received:", userTopic);

  if (!userTopic) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  const structuredPrompt = `
I want to learn more about "${userTopic}".

Please:
1. Recommend one relevant and popular non-fiction book.
2. Summarise the book in exactly 10 concise, practical, bullet-point lessons.
3. At the end, return:
   - Book Title
   - Author
   - Average Rating (approximate is fine)
   - Buy link (Amazon or other)

Return ONLY a JSON object structured exactly like this:
{
  "summary": ["point 1", "point 2", "..."],
  "title": "Book Title",
  "author": "Author Name",
  "rating": "e.g. 4.6/5",
  "buyLink": "https://example.com"
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that returns structured book summaries as JSON.",
        },
        { role: "user", content: structuredPrompt },
      ],
      store: true,
    });

    const result = completion.choices[0]?.message?.content;
    console.log("Raw OpenAI result:\n", result);

    try {
      const parsed = JSON.parse(result);
      console.log(" Parsed JSON:", parsed);
      res.json(parsed);
    } catch (jsonErr) {
      console.error(" Failed to parse JSON from GPT response:", result);
      res.status(500).json({
        error: "OpenAI response was not valid JSON.",
        raw: result,
      });
    }
  } catch (err) {
    console.error(
      " OpenAI API call failed:",
      err.response?.data || err.message
    );
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
