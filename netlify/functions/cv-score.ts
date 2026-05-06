// Netlify serverless function
// Maps to: POST /api/cv/score (via netlify.toml redirect)

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
  const { cvData } = body;
  if (!cvData) return { statusCode: 400, body: JSON.stringify({ error: "CV data is required." }) };

  const userPrompt = `
Score this CV objectively:

CV DATA:
${JSON.stringify(cvData, null, 2).slice(0, 5000)}

Return ONLY valid JSON:
{
  "overallScore": <0-100>,
  "grade": <"A+"|"A"|"B+"|"B"|"C+"|"C"|"D"|"F">,
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
  "quickWins": ["top 3-5 improvements"],
  "strengths": ["2-3 strengths"]
}`;

  try {
    const raw = await callOpenAI(apiKey, [
      { role: "system", content: "You are an expert ATS analyst. Return ONLY valid JSON." },
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
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to score CV." }) };
  }
};
