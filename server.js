const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Views
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/judge', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/judge.html'));
});

app.get('/dictionary', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/dictionary.html'));
});

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// API endpoint
app.post('/api/judge', async (req, res) => {
  const { arg1, arg2 } = req.body;

  if (!arg1 || !arg2) {
    return res.status(400).json({ error: 'Both arguments are required.' });
  }

  const messages = [
    {
      role: 'system',
      content: 'You are a fair and objective judge. Given two arguments, decide which is stronger and explain why.'
    },
    {
      role: 'user',
      content: `Argument 1: ${arg1}\nArgument 2: ${arg2}\n\nPlease provide:\n1. Verdict (choose from: Argument 1 wins, Argument 2 wins, Draw)\n2. Explanation for your verdict.`
    }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.5,
      max_tokens: 500
    });

    const result = completion.choices?.[0]?.message?.content?.trim();
    res.json({ result });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      error: error?.response?.data?.error?.message || 'Failed to get response from OpenAI.'
    });
  }
});

app.post('/api/define', async (req, res) => {
  const { word } = req.body;

  if (!word) {
    return res.status(400).json({ error: 'Word is required.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a legal dictionary. Explain legal terms in simple but legally accurate language.'
        },
        {
          role: 'user',
          content: `Define the legal meaning of the word: "${word}".`
        }
      ],
      temperature: 0.3,
      max_tokens: 150
    });

    const definition = completion.choices?.[0]?.message?.content?.trim();
    res.json({ definition });
  } catch (error) {
    console.error('Definition Error:', error);
    res.status(500).json({ error: error?.response?.data?.error?.message || 'Definition lookup failed.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
