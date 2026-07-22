const fetch = require('node-fetch'); // Add this line to use fetch in CommonJS

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    const mistralApiKey = process.env.MISTRAL_API_KEY;

    if (!mistralApiKey) {
      console.error('MISTRAL_API_KEY is missing!');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await fetch('https://api.mistral.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mistralApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-tiny', // Using a smaller model for testing
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Mistral API error:', errorData);
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error details:', error);
    res.status(500).json({
      error: error.message,
      details: "Check Vercel function logs for more info."
    });
  }
};
