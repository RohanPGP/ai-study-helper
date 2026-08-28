const https = require('https');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-6';

/**
 * Call the Anthropic messages API
 */
async function callClaude(prompt, maxTokens = 4096) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }]
    });

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) return reject(new Error(parsed.error.message));
          const text = parsed.content?.[0]?.text || '';
          resolve(text);
        } catch (e) {
          reject(new Error('Failed to parse AI response'));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/**
 * Generate a complete study pack from extracted text
 */
async function generateStudyPack(text, title) {
  const truncated = text.slice(0, 12000); // stay within token limits

  const prompt = `You are an expert educational assistant. Analyze the following study material and generate a comprehensive study pack.

TITLE: ${title}

CONTENT:
${truncated}

Generate a JSON response with EXACTLY this structure (no markdown, no code blocks, just raw JSON):
{
  "summary": "A clear, comprehensive 3-4 paragraph summary of the main content",
  "keyPoints": [
    "Key point 1 - concise and informative",
    "Key point 2",
    "Key point 3",
    "Key point 4",
    "Key point 5",
    "Key point 6",
    "Key point 7",
    "Key point 8"
  ],
  "flashcards": [
    {
      "question": "Question about a key concept?",
      "answer": "Clear, concise answer"
    },
    {
      "question": "Another concept question?",
      "answer": "Another answer"
    }
  ],
  "quiz": [
    {
      "question": "Multiple choice question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

Requirements:
- Summary: 3-4 substantial paragraphs covering all main topics
- Key points: exactly 8 most important takeaways
- Flashcards: exactly 10 question-answer pairs covering key vocabulary and concepts
- Quiz: exactly 8 multiple-choice questions with 4 options each, varying difficulty

Return ONLY the JSON object, no other text.`;

  const raw = await callClaude(prompt, 4096);

  // Strip any accidental markdown fences
  const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    return JSON.parse(clean);
  } catch (e) {
    // Attempt to extract JSON from response
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('AI returned invalid JSON structure');
  }
}

module.exports = { generateStudyPack };
