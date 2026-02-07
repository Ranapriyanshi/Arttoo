import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

function buildTattooPrompt(body) {
  const {
    personality = [],
    lifestyle = [],
    style = "minimalist",
    placement = "arm",
    colors = "black and grey",
    extra = "",
  } = body;

  const personalityStr = [].concat(personality).filter(Boolean).join(", ") || "balanced";
  const lifestyleStr = [].concat(lifestyle).filter(Boolean).join(", ") || "versatile";

  const prompt = `Single tattoo design, ${style} style, suitable for ${placement} placement. 
Reflects: ${personalityStr}. Lifestyle: ${lifestyleStr}. 
Color scheme: ${colors}. 
Clean, wearable tattoo artwork, one coherent design, no text unless requested. 
${extra ? `Additional notes: ${extra}` : ""}`.replace(/\n/g, " ").trim();

  return prompt;
}

app.post("/api/generate", async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "Server missing OPENAI_API_KEY. Add it to a .env file.",
    });
  }

  try {
    const prompt = buildTattooPrompt(req.body);
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      return res.status(500).json({ error: "No image URL in API response." });
    }
    res.json({ imageUrl, prompt });
  } catch (err) {
    console.error(err);
    const message = err?.message || "Image generation failed.";
    res.status(500).json({ error: message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Arttoo running at http://localhost:${PORT}`);
});
