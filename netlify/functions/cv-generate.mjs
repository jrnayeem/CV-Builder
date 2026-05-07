// netlify/functions/cv-generate.js

async function callOpenAI(apiKey, messages) {
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

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`OpenAI error ${res.status}: ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return JSON.parse(text);
  }
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Missing OPENAI_API_KEY in Netlify environment variables",
      }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const { jobDescription, currentCV } = body;

  if (!jobDescription || jobDescription.trim().length < 20) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Please provide a longer job description.",
      }),
    };
  }

  const userPrompt = `
Analyze this job description and improve the CV.

JOB DESCRIPTION:
${jobDescription.slice(0, 4000)}

CURRENT CV:
- Job Title: ${currentCV?.jobTitle || "(not set)"}
- Objective: ${currentCV?.objective || "(not set)"}
- Skills: ${
    Array.isArray(currentCV?.skills)
      ? currentCV.skills.map((s) => s.name).join(", ")
      : "(none)"
  }
- Experience: ${
    Array.isArray(currentCV?.experience)
      ? currentCV.experience.map((e) => `${e.title} at ${e.company}`).join("; ")
      : "(none)"
  }

Return ONLY valid JSON:
{
  "suggestedJobTitle": "",
  "suggestedObjective": "",
  "matchingSkills": [],
  "missingSkills": [],
  "keywordsToUse": [],
  "tips": []
}
`;

  try {
    const completion = await callOpenAI(apiKey, [
      {
        role: "system",
        content:
          "You are an expert CV writer. Always return ONLY valid JSON.",
      },
      { role: "user", content: userPrompt },
    ]);

    const content = completion?.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      const match = content.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(match ? match[0] : content);
    } catch (e) {
      throw new Error("Invalid JSON returned from OpenAI");
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: parsed }),
    };
  } catch (err) {
    console.error("cv-generate error:", err);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Failed to generate suggestions. Please try again.",
        detail: err.message,
      }),
    };
  }
};
