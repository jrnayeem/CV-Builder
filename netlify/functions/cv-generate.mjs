// Netlify serverless function (ESM JavaScript - no TypeScript required)
// Route: POST /api/cv/generate-from-job  →  /.netlify/functions/cv-generate

async function callOpenAI(apiKey, messages) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: "gpt-4o-mini", max_tokens: 1500, messages }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenAI error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "{}";
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

  const { jobDescription, currentCV } = body;
  if (!jobDescription || String(jobDescription).trim().length < 20) {
    return { statusCode: 400, body: JSON.stringify({ error: "Please provide a longer job description." }) };
  }

  const userPrompt = `
Analyze this job description and suggest CV improvements.

JOB DESCRIPTION:
${String(jobDescription).slice(0, 4000)}

CURRENT CV:
- Job Title: ${currentCV?.jobTitle || "(not set)"}
- Objective: ${currentCV?.objective || "(not set)"}
- Skills: ${Array.isArray(currentCV?.skills) ? currentCV.skills.map((s) => s.name).join(", ") : "(none)"}
- Experience: ${Array.isArray(currentCV?.experience) ? currentCV.experience.map((e) => `${e.title} at ${e.company}`).join("; ") : "(none)"}

Return ONLY valid JSON (no markdown):
{
  "suggestedJobTitle": "string",
  "suggestedObjective": "2-3 sentences, first person, active voice",
  "matchingSkills": ["up to 8 skills to highlight"],
  "missingSkills": ["up to 5 skills gaps"],
  "keywordsToUse": ["6-10 important keywords"],
  "tips": ["3-4 actionable tips"]
}`;

  try {
    const raw = await callOpenAI(apiKey, [
      { role: "system", content: "You are an expert CV writer. Return ONLY valid JSON, no markdown." },
      { role: "user", content: userPrompt },
    ]);
    const match = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : raw);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: parsed }),
    };
  } catch (err) {
    console.error("cv-generate error:", err);
    return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Failed to generate suggestions. Please try again." }) };
  }
};
