// Vercel / Netlify serverless function
// Route: POST /api/cv/score
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

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not configured on the server." });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { cvData } = body ?? {};

  if (!cvData) {
    return res.status(400).json({ error: "CV data is required." });
  }

  const userPrompt = `
Analyze this CV data and score it objectively. Be honest but constructive.

CV DATA:
${JSON.stringify(cvData, null, 2).slice(0, 5000)}

Return ONLY valid JSON — no markdown:
{
  "overallScore": <number 0-100>,
  "grade": <"A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F">,
  "summary": "<one encouraging sentence>",
  "sections": [
    { "name": "Contact & Personal Info", "score": <0-15>, "maxScore": 15, "status": <"excellent"|"good"|"needs-work"|"missing">, "feedback": "<1-2 sentences>" },
    { "name": "Career Objective", "score": <0-10>, "maxScore": 10, "status": <"excellent"|"good"|"needs-work"|"missing">, "feedback": "<1-2 sentences>" },
    { "name": "Work Experience", "score": <0-25>, "maxScore": 25, "status": <"excellent"|"good"|"needs-work"|"missing">, "feedback": "<1-2 sentences>" },
    { "name": "Education", "score": <0-15>, "maxScore": 15, "status": <"excellent"|"good"|"needs-work"|"missing">, "feedback": "<1-2 sentences>" },
    { "name": "Skills", "score": <0-15>, "maxScore": 15, "status": <"excellent"|"good"|"needs-work"|"missing">, "feedback": "<1-2 sentences>" },
    { "name": "Additional Sections", "score": <0-10>, "maxScore": 10, "status": <"excellent"|"good"|"needs-work"|"missing">, "feedback": "<1-2 sentences>" },
    { "name": "ATS Optimization", "score": <0-10>, "maxScore": 10, "status": <"excellent"|"good"|"needs-work"|"missing">, "feedback": "<1-2 sentences>" }
  ],
  "quickWins": ["top 3-5 specific improvements that would boost the score most"],
  "strengths": ["2-3 things already done well"]
}`;

  try {
    const raw = await callOpenAI(apiKey, [
      { role: "system", content: "You are an expert ATS analyst and CV coach. Return ONLY valid JSON — no markdown." },
      { role: "user", content: userPrompt },
    ]);

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    return res.status(200).json({ result: parsed });
  } catch (err) {
    console.error("cv-score error:", err);
    return res.status(500).json({ error: "Failed to score CV. Please try again." });
  }
}
