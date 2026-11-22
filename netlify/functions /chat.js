export default async (request) => {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json; charset=utf-8", "Allow": "POST" } }
    );
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GROQ_API_KEY belum diatur di Netlify Environment Variables." }),
      { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Body request harus berupa JSON yang valid." }),
        { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    const messages = Array.isArray(body?.messages) ? body.messages.slice(-30) : [];
    const input = [
      {
        role: "system",
        content: "Kamu adalah CLASS-AI, asisten ramah untuk website FOR-CLASS IX. Jawab dalam bahasa yang digunakan pengguna. Jelas, sopan, dan membantu."
      },
      ...messages
        .filter((message) =>
          ["user", "assistant"].includes(message?.role) &&
          typeof message?.content === "string"
        )
        .map((message) => ({
          role: message.role,
          content: message.content.slice(0, 8000)
        }))
    ];

    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: input,
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    const result = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return new Response(
        JSON.stringify({ error: result?.error?.message || "Groq API error." }),
        { status: upstream.status, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    const reply = result?.choices?.[0]?.message?.content || "";
    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  } catch (error) {
    console.error("[CLASS-AI ERROR]", error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan pada server CLASS-AI." }),
      { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }
};
