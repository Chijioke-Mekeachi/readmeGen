// pages/api/generate-readme.js

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer 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`, // Set your key in .env
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    // OpenRouter returns the message content inside data.choices[0].message.content
    const readme = data.choices?.[0]?.message?.content || "No content returned";

    res.status(200).json({ readme });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate README" });
  }
}
