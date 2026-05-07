// Netlify serverless function (ESM JavaScript - no TypeScript required)
// Route: POST /api/cv/cover-letter  →  /.netlify/functions/cv-cover-letter

async function callOpenAI(apiKey, messages) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: "gpt-4o-mini", max_tokens: 1200, messages }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenAI error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 503,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "AI features are not configured yet. To enable them:\n1. Go to Netlify dashboard → Site settings → Environment variables\n2. Add OPENAI_API_KEY with your key from platform.openai.com/api-keys\n3. Trigger a redeploy",
        setup_required: true,
      }),
    };
  }

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch { body = {}; }

  const { cvData, jobTitle, companyName, recipientName, tone, additionalNotes } = body;
  if (!cvData) return { statusCode: 400, body: JSON.stringify({ error: "CV data is required." }) };

  const candidateName = cvData.name || "the candidate";
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const toneMap = {
    professional: "formal, professional, and confident",
    friendly: "warm, personable, and approachable",
    enthusiastic: "enthusiastic, energetic, and passionate",
  };
  const toneDescription = toneMap[tone || "professional"] || toneMap.professional;

  const systemPrompt = `You are an expert cover letter writer. Write in a ${toneDescription} tone. Return ONLY the cover letter plain text — no JSON, no markdown, no extra commentary.`;

  const userPrompt = `
Write a cover letter for:
CANDIDATE: ${candidateName}, ${cvData.jobTitle || "Professional"}
SKILLS: ${Array.isArray(cvData.skills) ? cvData.skills.map((s) => s.name).join(", ") : ""}
EXPERIENCE: ${Array.isArray(cvData.experience) ? cvData.experience.map((e) => `${e.title} at ${e.company}`).join("; ") : ""}
EDUCATION: ${Array.isArray(cvData.education) ? cvData.education.map((e) => `${e.degree} from ${e.institution}`).join(", ") : ""}
SUMMARY: ${cvData.objective || ""}

TARGET: ${jobTitle || "role"} at ${companyName || "the company"}, addressed to ${recipientName || "Hiring Manager"}
DATE: ${today}
${additionalNotes ? `NOTES: ${additionalNotes}` : ""}

Format: Date, salutation, 3-4 paragraphs, closing, "Sincerely,\n${candidateName}". Plain text only.`;

  try {
    const letter = await callOpenAI(apiKey, [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ letter }),
    };
  } catch (err) {
    console.error("cv-cover-letter error:", err);
    return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Failed to generate cover letter. Please try again." }) };
  }
};
