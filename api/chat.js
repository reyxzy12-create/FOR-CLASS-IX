export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({
      error: "GROQ_API_KEY belum diatur di Vercel Environment Variables."
    });
  }

  try {
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const messages = Array.isArray(body?.messages)
      ? body.messages.slice(-30)
      : [];

    const input = [
      {
        role: "system",
        content: "Kamu adalah CLASS-AI, asisten ramah untuk website FOR-CLASS IX. Jawab dalam bahasa yang digunakan pengguna. Jelas, sopan, dan membantu."
      },
      ...messages
        .filter(m =>
          ["user", "assistant"].includes(m.role) &&
          typeof m.content === "string"
        )
        .map(m => ({
          role: m.role,
          content: m.content.slice(0, 8000)
        }))
    ];

    const upstream = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          messages: input,
          temperature: 0.7,
          max_tokens: 2048
        })
      }
    );

    const result = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: result?.error?.message || "Groq API error."
      });
    }

    const reply =
      result.choices?.[0]?.message?.content || "";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("[CLASS-AI ERROR]", error);

    return res.status(500).json({
      error: error.message || "Internal server error."
    });
  }
}