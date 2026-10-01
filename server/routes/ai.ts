import { Router, type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { GoogleGenAI } from "@google/genai/node";

const router = Router();

// ── Gemini client using the newer @google/genai SDK ──────────
const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY! });

// ── Auth guard ───────────────────────────────────────────────
const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};

// ── Helper – strip markdown / code fences ────────────────────
function cleanJson(text: string): string {
  return text.trim().replace(/(^```json|^```|```$)/gm, "").trim();
}

// ── POST /api/ai/generate-questions ─────────────────────────
router.post(
  "/generate-questions",
  authGuard,
  async (req: Request, res: Response) => {
    const { position, description, experience, techStack } = req.body as {
      position: string;
      description: string;
      experience: number;
      techStack: string;
    };

    if (!position || !description || !techStack) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const prompt = `
As an experienced prompt engineer, generate a JSON array containing 5 technical interview questions along with detailed answers based on the following job information. Each object in the array should have the fields "question" and "answer", formatted as follows:

[
  { "question": "<Question text>", "answer": "<Answer text>" },
  ...
]

Job Information:
- Job Position: ${position}
- Job Description: ${description}
- Years of Experience Required: ${experience}
- Tech Stacks: ${techStack}

The questions should assess skills in ${techStack} development and best practices, problem-solving, and experience handling complex requirements.
Return ONLY the JSON array, no markdown, no explanation, no code fences.
`.trim();

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const raw = response.text ?? "";
      const cleaned = cleanJson(raw);

      const match = cleaned.match(/\[[\s\S]*\]/);
      if (!match) throw new Error("No JSON array found in AI response");

      const questions = JSON.parse(match[0]);
      res.json({ questions });
    } catch (err) {
      console.error("[generate-questions]", err);
      res.status(500).json({ error: "Failed to generate questions" });
    }
  }
);

// ── POST /api/ai/evaluate-answer ─────────────────────────────
router.post(
  "/evaluate-answer",
  authGuard,
  async (req: Request, res: Response) => {
    const { question, correctAnswer, userAnswer } = req.body as {
      question: string;
      correctAnswer: string;
      userAnswer: string;
    };

    if (!question || !correctAnswer || !userAnswer) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const prompt = `
Question: "${question}"
User Answer: "${userAnswer}"
Correct Answer: "${correctAnswer}"

Please compare the user's answer to the correct answer, and provide:
1. A rating from 1 to 10 based on answer quality and accuracy
2. Constructive feedback for improvement

Return the result as a JSON object with exactly these two fields:
{ "ratings": <number>, "feedback": "<string>" }

Return ONLY the JSON object, no markdown, no code fences, no extra text.
`.trim();

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const raw = response.text ?? "";
      const cleaned = cleanJson(raw);
      const parsed = JSON.parse(cleaned);
      res.json({ ratings: parsed.ratings, feedback: parsed.feedback });
    } catch (err) {
      console.error("[evaluate-answer]", err);
      res.status(500).json({ error: "Failed to evaluate answer" });
    }
  }
);

export { router as aiRouter };
