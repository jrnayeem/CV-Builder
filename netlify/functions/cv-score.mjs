// Netlify serverless function (ESM JavaScript - no TypeScript required)
// Route: POST /api/cv/score  →  /.netlify/functions/cv-score

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
  const { cvData } = body;
  if (!cvData) return { statusCode: 400, body: JSON.stringify({ error: "CV data is required." }) };

  const userPrompt = `
Score this CV objectively (0-100):

CV DATA:
${JSON.stringify(cvData, null, 2).slice(0, 5000)}

Return ONLY valid JSON (no markdown):
{
  "overallScore": <0-100 integer>,
  "grade": "<A+|A|B+|B|C+|C|D|F>",
  "summary": "<one encouraging sentence>",
  "sections": [
    { "name": "Contact & Personal Info", "score": <0-15>, "maxScore": 15, "status": "<excellent|good|needs-work|missing>", "feedback": "<1-2 sentences>" },
    { "name": "Career Objective", "score": <0-10>, "maxScore": 10, "status": "<excellent|good|needs-work|missing>", "feedback": "<1-2 sentences>" },
    { "name": "Work Experience", "score": <0-25>, "maxScore": 25, "status": "<excellent|good|needs-work|missing>", "feedback": "<1-2 sentences>" },
    { "name": "Education", "score": <0-15>, "maxScore": 15, "status": "<excellent|good|needs-work|missing>", "feedback": "<1-2 sentences>" },
    { "name": "Skills", "score": <0-15>, "maxScore": 15, "status": "<excellent|good|needs-work|missing>", "feedback": "<1-2 sentences>" },
    { "name": "Additional Sections", "score": <0-10>, "maxScore": 10, "status": "<excellent|good|needs-work|missing>", "feedback": "<1-2 sentences>" },
    { "name": "ATS Optimization", "score": <0-10>, "maxScore": 10, "status": "<excellent|good|needs-work|missing>", "feedback": "<1-2 sentences>" }
  ],
  "quickWins": ["top 3-5 improvement actions"],
  "strengths": ["2-3 things done well"]
}`;

  try {
    const raw = await callOpenAI(apiKey, [
      { role: "system", content: "You are an expert ATS analyst and CV reviewer. Return ONLY valid JSON, no markdown." },
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
    console.error("cv-score error:", err);
    return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Failed to score CV. Please try again." }) };
  }
};
