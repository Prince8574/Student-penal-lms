const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// POST /api/ai/chat
router.post('/chat', protect, async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, message: 'messages array required' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful learning assistant for LearnVerse, an online education platform. Help students with their courses, assignments, concepts, and any learning-related questions.',
          },
          ...messages,
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ success: false, message: err.error?.message || 'Groq API error' });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    res.json({ success: true, reply });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ success: false, message: 'AI service unavailable' });
  }
});

module.exports = router;
