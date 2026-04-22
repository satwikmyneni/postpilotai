/**
 * Netlify Function — /api/generate
 *
 * Accepts POST { role, topic, tone, hook, question, emoji }
 * Calls Groq (Llama 3.1) via the OpenAI-compatible chat completions API.
 */

const SYSTEM_PROMPT =
  "You are PostPilot AI — a LinkedIn ghostwriter for students, " +
  "freshers, and young professionals. Write posts that feel " +
  "authentic and human. Never use corporate buzzwords.";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

function buildUserPrompt({ role, topic, tone, hook, question, emoji }) {
  const lines = [
    `Write a LinkedIn post for a ${role} about: ${topic}`,
    `Tone: ${tone}`,
  ];
  if (hook) lines.push("Start with a viral scroll-stopping hook.");
  if (question) lines.push("End with an engaging question to drive comments.");
  if (emoji) lines.push("Use 2-3 relevant emojis naturally throughout.");
  lines.push(
    "Keep it 150-220 words. Make it feel real and human, not AI-generated.",
  );
  return lines.join("\n");
}

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GROQ_API_KEY is not configured on the server." }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const { role, topic, tone, hook, question, emoji } = body;

  if (!role || !topic || typeof role !== "string" || typeof topic !== "string") {
    return new Response(
      JSON.stringify({ error: "Both role and topic are required." }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  if (role.length > 200 || topic.length > 1000) {
    return new Response(JSON.stringify({ error: "Inputs are too long." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const sanitised = {
    role: role.slice(0, 200).trim(),
    topic: topic.slice(0, 1000).trim(),
    tone: tone || "Story-driven",
    hook: !!hook,
    question: !!question,
    emoji: !!emoji,
  };

  try {
    const groqRes = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(sanitised) },
        ],
        max_tokens: 1024,
        temperature: 0.9,
      }),
    });

    if (!groqRes.ok) {
      const errBody = await groqRes.text();
      console.error("Groq API error:", groqRes.status, errBody);
      return new Response(
        JSON.stringify({ error: `Groq error ${groqRes.status}: ${errBody}` }),
        { status: 502, headers: { "content-type": "application/json" } },
      );
    }

    const data = await groqRes.json();
    const post = data.choices?.[0]?.message?.content?.trim() ?? "";

    if (!post) {
      return new Response(
        JSON.stringify({ error: "Empty response from Groq. Please try again." }),
        { status: 502, headers: { "content-type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ post }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate post. Please try again." }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }
};

export const config = {
  path: "/api/generate",
};
