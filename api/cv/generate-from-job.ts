// Vercel / Netlify serverless function
// Route: POST /api/cv/generate-from-job
// Env vars required: OPENAI_API_KEY

export const config = { api: { bodyParser: true } };

async function callOpenAI(apiKey: string, messages: Array<{ role: string; content: string }>) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 1500,
      messages,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${err}`);
  }
  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0]?.message?.content ?? "{}";
}

// Works with both Vercel Node.js and Netlify Functions adapters
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not configured on the server." });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { jobDescription, currentCV } = body ?? {};

  if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length < 20) {
    return res.status(400).json({ error: "Please provide a job description (at least 20 characters)." });
  }

  const userPrompt = `
Analyze this job description and the candidate's current CV info, then suggest improvements.

JOB DESCRIPTION:
${jobDescription.slice(0, 4000)}

CURRENT CV INFO:
- Name: ${currentCV?.name || "(not set)"}
- Current Job Title: ${currentCV?.jobTitle || "(not set)"}
- Current Objective: ${currentCV?.objective || "(not set)"}
- Skills: ${Array.isArray(currentCV?.skills) ? currentCV.skills.map((s: { name: string }) => s.name).join(", ") : "(none)"}
- Experience: ${Array.isArray(currentCV?.experience) ? currentCV.experience.map((e: { title: string; company: string }) => `${e.title} at ${e.company}`).join("; ") : "(none)"}

Return ONLY valid JSON — no markdown, no extra text:
{
  "suggestedJobTitle": "string",
  "suggestedObjective": "string — 2-3 sentences, first person, active voice, match key job description phrases",
  "matchingSkills": ["up to 8 skills from the job description to highlight"],
  "missingSkills": ["up to 5 important missing skills"],
  "keywordsToUse": ["6-10 important keywords from the job description"],
  "tips": ["3-4 short actionable tips"]
}`;

  try {
    const raw = await callOpenAI(apiKey, [
      { role: "system", content: "You are an expert CV writer. Return ONLY valid JSON — no markdown, no extra text." },
      { role: "user", content: userPrompt },
    ]);

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    return res.status(200).json({ result: parsed });
  } catch (err) {
    console.error("generate-from-job error:", err);
    return res.status(500).json({ error: "Failed to generate suggestions. Please try again." });
  }
}
