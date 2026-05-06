// Netlify serverless function
// Maps to: POST /api/cv/generate-from-job (via netlify.toml redirect)

async function callOpenAI(apiKey: string, messages: Array<{ role: string; content: string }>) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: "gpt-4o-mini", max_tokens: 1500, messages }),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0]?.message?.content ?? "{}";
}

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "OPENAI_API_KEY not configured" }) };
  }

  let body: any;
  try { body = JSON.parse(event.body || "{}"); } catch { body = {}; }

  const { jobDescription, currentCV } = body;
  if (!jobDescription || jobDescription.trim().length < 20) {
    return { statusCode: 400, body: JSON.stringify({ error: "Please provide a longer job description." }) };
  }

  const userPrompt = `
Analyze this job description and suggest CV improvements.

JOB DESCRIPTION:
${jobDescription.slice(0, 4000)}

CURRENT CV:
- Job Title: ${currentCV?.jobTitle || "(not set)"}
- Objective: ${currentCV?.objective || "(not set)"}
- Skills: ${Array.isArray(currentCV?.skills) ? currentCV.skills.map((s: any) => s.name).join(", ") : "(none)"}
- Experience: ${Array.isArray(currentCV?.experience) ? currentCV.experience.map((e: any) => `${e.title} at ${e.company}`).join("; ") : "(none)"}

Return ONLY valid JSON:
{
  "suggestedJobTitle": "string",
  "suggestedObjective": "string — 2-3 sentences, first person, active voice",
  "matchingSkills": ["up to 8 matching skills"],
  "missingSkills": ["up to 5 missing skills"],
  "keywordsToUse": ["6-10 important keywords"],
  "tips": ["3-4 actionable tips"]
}`;

  try {
    const raw = await callOpenAI(apiKey, [
      { role: "system", content: "You are an expert CV writer. Return ONLY valid JSON." },
      { role: "user", content: userPrompt },
    ]);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: parsed }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to generate suggestions." }) };
  }
};
