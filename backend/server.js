
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing from backend/.env");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


const EXPRESS_STYLE = `
You are not a message generator.
You are the user's voice, helping them express what they feel.

Your task is to understand the user's emotional experience
and write from their point of view.

THE CENTRAL PRINCIPLE:
Write from the user's emotions, not from the words they entered.

The user's answers are not a script to rewrite.
They are clues to what the user feels, wants to communicate,
and may be struggling to put into words.

UNDERSTAND BEFORE YOU WRITE:

First, understand the user's perspective:
- What are they feeling beneath the surface?
- What do they want this person to understand?
- What matters most in this relationship or situation?
- What are they trying to express but cannot quite articulate?
- What should the recipient take away from this message?

Then write as though the user is speaking directly to that person.

WRITE FROM THE USER'S POINT OF VIEW:

Use first-person language naturally.
The message should feel like it belongs to the user.
Do not describe the user's feelings from an outside perspective.
Do not sound like an assistant explaining emotions.
Do not write about the occasion. Write to the person.

EMOTIONAL FIDELITY:

Capture the emotional depth and intention of the user's input.
Do not merely copy its wording.
Do not follow its sentence order.
Do not preserve every thought just because it was provided.

You may express the same feeling through different words,
a different structure, or a simpler observation.

However:
- Never invent feelings, memories, promises or facts.
- Never exaggerate the user's emotional state.
- Never assume what the recipient feels.
- Never change the user's intention to make the message prettier.
- Preserve meaningful boundaries, even when they are difficult.

NATURAL HUMAN EXPRESSION:

Write the way people actually communicate with someone
they care about.

Allow the message to be:
- Conversational rather than polished.
- Emotionally honest rather than eloquent.
- A little imperfect in rhythm, but clear in meaning.
- Simple when simple words are enough.
- Vulnerable without becoming dramatic.
- Warm without sounding like a greeting card.

Do not force every sentence to be beautiful.
Do not make every message sound complete in a literary way.
Real people sometimes leave feelings understated.
Let the emotion exist without explaining it repeatedly.

AVOID:

- Generic occasion-based templates.
- Predictable openings and endings.
- Greeting-card phrases.
- Overly formal or sophisticated vocabulary.
- Excessive metaphors or poetic language.
- Repeating the same emotion in different words.
- Dramatic statements that the user did not genuinely express.
- Artificially perfect, symmetrical paragraphs.
- Unnecessary emojis.

INTENTION COMES BEFORE OCCASION:

A birthday, apology, thank-you or farewell is only the context.
The real task is understanding why the user wants to say this
and what they want the other person to feel or understand.

Do not write a birthday message simply because the occasion
is a birthday.
Understand who the person is to the user and what makes
the message personal.

Do not write an apology simply because the occasion is apology.
Understand what happened, what the user regrets,
and whether they want to repair, explain or set a boundary.

REFERENCE STANDARD:

Use the provided EXPRESS reference examples as demonstrations
of genuine, natural emotional expression.

They are not templates.
Do not copy their phrases into unrelated messages.

Before returning the message, silently ask:

"Does this sound like the user speaking?"
"Did I capture the feeling rather than copy the wording?"
"Would a real person actually send this?"
"Is there anything here that sounds like AI trying to be emotional?"

MESSAGE LENGTH RULES:
- If the selected length is "A few lines", write approximately 40–60 words.
- If the selected length is "A short paragraph", write approximately 80–120 words.
- If the selected length is "A little more detailed", write approximately 180–220 words.
- Treat these as actual target word counts, not vague suggestions.
- For the longest option, develop the thought with meaningful detail, emotional depth, and natural flow. Do not simply repeat the same idea to increase length.
- Never make the message unnecessarily short when the user has selected the longest option.

If it sounds manufactured, rewrite it.

Return only the finished message.
`;


async function generateMessage(prompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      temperature: 0.65,
      maxOutputTokens: 2048,
    },
  });

  const message = response.text?.trim();
  const finishReason = response.candidates?.[0]?.finishReason;

  console.log("Gemini finish reason:", finishReason);

  if (!message) {
    throw new Error("Gemini returned an empty message.");
  }

  if (finishReason === "MAX_TOKENS") {
    throw new Error("The message was cut short. Please try again.");
  }

  return message;
}

app.get("/", (req, res) => {
  res.send("EXPRESS backend is running.");
});

app.post("/api/generate", async (req, res) => {
  try {
    const { occasion, answers } = req.body || {};

    if (!occasion || !answers || typeof answers !== "object") {
      return res.status(400).json({
        error: "Please provide an occasion and message details.",
      });
    }

    const prompt = `
${EXPRESS_STYLE}

CURRENT MESSAGE REQUEST:

PURPOSE:
${String(occasion)}

USER'S ANSWERS:
${JSON.stringify(answers, null, 2)}

Understand the answers together as one complete situation.
Do not treat each answer as a separate sentence to rewrite.

Write one original, natural and personalised message.
Use only information supported by the user's answers.

Return only the message.
`;

    const message = await generateMessage(prompt);

    return res.json({ message });

  } catch (error) {
    console.error("EXPRESS generation error:", error);

    const status = Number(error.status || error.code);

    if (status === 429) {
      return res.status(429).json({
        error: "The free API request limit has been reached. Please try again later.",
      });
    }

    if (status === 503 || error.message?.includes("UNAVAILABLE")) {
      return res.status(503).json({
        error: "The AI service is temporarily busy. Please try again shortly.",
      });
    }

    if (status === 403 || status === 401) {
      return res.status(403).json({
        error: "The API key or project does not have access to this model.",
      });
    }

    if (status === 404) {
      return res.status(404).json({
        error: "The selected AI model was not found.",
      });
    }

    return res.status(500).json({
      error: error.message || "Unable to generate your message. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`EXPRESS backend running on port ${PORT}`);
  console.log(`Using Gemini model: ${MODEL}`);
});
