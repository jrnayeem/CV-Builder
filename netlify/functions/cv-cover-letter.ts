// Netlify function — maps to POST /api/cv/cover-letter

async function callOpenAI(apiKey: string, messages: Array<{ role: string; content: string }>) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: "gpt-4o-mini", max_tokens: 1200, messages }),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0]?.message?.content ?? "";
}

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { statusCode: 500, body: JSON.stringify({ error: "OPENAI_API_KEY not configured" }) };

  let body: any;
  try { body = JSON.parse(event.body || "{}"); } catch { body = {}; }

  const { cvData, jobTitle, companyName, recipientName, tone, additionalNotes } = body;
  if (!cvData) return { statusCode: 400, body: JSON.stringify({ error: "CV data is required." }) };

  const candidateName = cvData.name || "the candidate";
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const toneMap: Record<string, string> = {
    professional: "formal, professional, and confident",
    friendly: "warm, personable, and approachable",
    enthusiastic: "enthusiastic, energetic, and passionate",
  };
  const toneDescription = toneMap[tone || "professional"] || toneMap.professional;

  const systemPrompt = `You are an expert cover letter writer. Write in a ${toneDescription} tone. Return ONLY the cover letter text — plain text, no JSON, no markdown.`;

  const userPrompt = `
Write a cover letter for:
CANDIDATE: ${candidateName}, ${cvData.jobTitle || "Professional"}
SKILLS: ${Array.isArray(cvData.skills) ? cvData.skills.map((s: any) => s.name).join(", ") : ""}
EXPERIENCE: ${Array.isArray(cvData.experience) ? cvData.experience.map((e: any) => `${e.title} at ${e.company}`).join("; ") : ""}
EDUCATION: ${Array.isArray(cvData.education) ? cvData.education.map((e: any) => `${e.degree} from ${e.institution}`).join(", ") : ""}
SUMMARY: ${cvData.objective || ""}

TARGET: ${jobTitle || "role"} at ${companyName || "the company"}, to ${recipientName || "Hiring Manager"}
DATE: ${today}
${additionalNotes ? `NOTES: ${additionalNotes}` : ""}

Structure: Date, salutation, 3-4 body paragraphs, closing, "Sincerely, ${candidateName}". Plain text only.`;

  try {
    const letter = await callOpenAI(apiKey, [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ letter }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to generate cover letter." }) };
  }
};
