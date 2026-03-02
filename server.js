import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post('/api/analyze', async (req, res) => {
  const { base64Image, mimeType, systemPrompt, userPrompt } = req.body;

  if (!base64Image || !mimeType) {
    return res.status(400).send('Missing image data');
  }

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: userPrompt,
            },
          ],
        },
      ],
    });

    const text = message.content[0].text;
    res.setHeader('Content-Type', 'text/plain');
    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message || 'Claude API error');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Bruin Scale server running on http://localhost:${PORT}`);
});
