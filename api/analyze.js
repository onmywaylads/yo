export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1300,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.find(c => c.type === 'text')?.text || '응답 없음';
    res.status(200).json({ result: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
