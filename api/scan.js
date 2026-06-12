export default async function handler(req, res) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://leaf-health-scanner-v2.vercel.app",
        "X-Title": "Leaf Health Scanner"
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text(); // 👈 IMPORTANT FIX

    console.log("OpenRouter RAW RESPONSE:", text);

    // Try parsing safely
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({
        error: "Invalid JSON from OpenRouter",
        raw: text
      });
    }

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}