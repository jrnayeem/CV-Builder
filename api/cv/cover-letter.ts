// Vercel serverless function
// Route: POST /api/cv/cover-letter
// Env vars required: OPENAI_API_KEY

export const config = { api: { bodyParser: true } };

async function callOpenAI(apiKey: string, messages: Array<{ role: string; content: string }>) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: "gpt-4o-mini", max_tokens: 1200, messages }),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0]?.message?.content ?? "";
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "OPENAI_API_KEY is not configured." });

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { cvData, jobTitle, companyName, recipientName, tone, additionalNotes } = body ?? {};

  if (!cvData) return res.status(400).json({ error: "CV data is required." });

  const candidateName = cvData.name || "the candidate";
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const toneMap: Record<string, string> = {
    professional: "formal, professional, and confident",
    friendly: "warm, personable, and approachable while remaining professional",
    enthusiastic: "enthusiastic, energetic, and passionate while professional",
  };
  const toneDescription = toneMap[tone || "professional"] || toneMap.professional;

  const systemPrompt = `You are an expert cover letter writer. Write compelling, tailored cover letters. Write in a ${toneDescription} tone. Return ONLY the cover letter text — plain text, no JSON, no markdown.`;

  const userPrompt = `
Write a professional cover letter for:

CANDIDATE:
- Name: ${candidateName}
- Title: ${cvData.jobTitle || "Professional"}
- Summary: ${cvData.objective || "(not provided)"}
- Skills: ${Array.isArray(cvData.skills) ? cvData.skills.map((s: any) => s.name).join(", ") : "(none)"}
- Experience: ${Array.isArray(cvData.experience) ? cvData.experience.map((e: any) => `${e.title} at ${e.company}`).join("; ") : "(none)"}
- Education: ${Array.isArray(cvData.education) ? cvData.education.map((e: any) => `${e.degree} from ${e.institution}`).join(", ") : "(none)"}

TARGET:
- Position: ${jobTitle || "the advertised role"}
- Company: ${companyName || "the company"}
- Recipient: ${recipientName || "Hiring Manager"}
${additionalNotes ? `- Notes: ${additionalNotes}` : ""}
- Date: ${today}

Structure: Date, salutation, 3-4 body paragraphs matching experience to role, closing, sign-off. Plain text only. No bullet points.`;

  try {
    const letter = await callOpenAI(apiKey, [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
    return res.status(200).json({ letter });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to generate cover letter." });
  }
}
