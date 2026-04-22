import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "path";

// Local dev API handler — mimics the Vercel serverless function
function localApiPlugin() {
  return {
    name: "local-api",
    configureServer(server) {
      server.middlewares.use("/api/generate", async (req, res, next) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        let body = "";
        for await (const chunk of req) body += chunk;
        const data = JSON.parse(body);

        const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "GROQ_API_KEY not set in .env" }));
          return;
        }

        const { role, topic, tone, hook, question, emoji } = data;
        if (!role || !topic) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Role and topic are required." }));
          return;
        }

        const lines = [
          `Write a LinkedIn post for a ${role} about: ${topic}`,
          `Tone: ${tone || "Story-driven"}`,
        ];
        if (hook) lines.push("Start with a viral scroll-stopping hook.");
        if (question) lines.push("End with an engaging question to drive comments.");
        if (emoji) lines.push("Use 2-3 relevant emojis naturally throughout.");
        lines.push("Keep it 150-220 words. Make it feel real and human, not AI-generated.");

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
                {
                  role: "system",
                  content:
                    "You are PostPilot AI — a LinkedIn ghostwriter for students, freshers, and young professionals. Write posts that feel authentic and human. Never use corporate buzzwords.",
                },
                { role: "user", content: lines.join("\n") },
              ],
              max_tokens: 1024,
              temperature: 0.9,
            }),
          });

          if (!groqRes.ok) {
            const errBody = await groqRes.text();
            res.statusCode = 502;
            res.end(JSON.stringify({ error: `Groq error ${groqRes.status}: ${errBody}` }));
            return;
          }

          const result = await groqRes.json();
          const post = result.choices?.[0]?.message?.content?.trim() ?? "";

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ post }));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Generation failed: " + err.message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    localApiPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080,
    host: true,
  },
  envPrefix: ["VITE_", "GROQ_"],
});