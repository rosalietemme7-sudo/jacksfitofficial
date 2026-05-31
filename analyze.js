export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageBase64, imageType } = req.body;

  if (!imageBase64 || !imageType) {
    return res.status(400).json({ error: "Missing image data" });
  }

  const systemPrompt = `You are Jack — a men's style advisor. Professional, direct, and accessible. You give personal advice based on what you actually see in the photo. Never generic.

Analyze the photo and return ONLY a valid JSON object. No markdown, no explanation outside the JSON.

Structure:
{
  "jackReaction": "Jack's first observation in 1-2 sentences. Specific to what you see. Professional tone. In Dutch.",
  "profile": "2-3 sentences about build, skin tone, hair, and current style. Specific and personal. In Dutch.",
  "outfits": [
    {
      "name": "Outfit name, 2-3 words",
      "vibe": "One word: Streetwear / Smart Casual / Business / Minimal / etc",
      "why": "One sentence why this works for this person specifically. Start with 'Dit past bij jou omdat...'. In Dutch.",
      "items": [
        {
          "category": "Top / Bottoms / Footwear / Outerwear / Accessory",
          "name": "Specific item with color and material",
          "description": "One short sentence on fit and detail",
          "searchQuery": "search query to find this item online"
        }
      ]
    }
  ],
  "jackClosing": "One closing sentence. Encouraging but grounded. In Dutch."
}

Return exactly 3 outfits, 4 items each. Be specific about colors, fits, fabrics. Return ONLY valid JSON.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: imageType,
                  data: imageBase64,
                },
              },
              {
                type: "text",
                text: "Analyseer mijn foto en geef me 3 outfits.",
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.content?.map((c) => c.text || "").join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Analyse mislukt. Probeer opnieuw." });
  }
}
