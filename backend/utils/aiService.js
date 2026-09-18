const https = require('https');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = 'openai/gpt-oss-20b';

const DIFFICULTY_TEXT = {
  easy: 'straightforward and beginner-friendly, focused on basic recall of the material',
  medium: 'moderately challenging, testing understanding and application of the material',
  hard: 'challenging, testing deep understanding, analysis, and tricky edge cases of the material'
};

async function callAI(prompt, maxTokens = 4096) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }]
    });

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
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
          const text = parsed.choices?.[0]?.message?.content || '';
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

async function generateStudyPack(text, title, difficulty = 'medium') {
  const truncated = text.slice(0, 12000);
  const difficultyText = DIFFICULTY_TEXT[difficulty] || DIFFICULTY_TEXT.medium;

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
    { "question": "Question about a key concept?", "answer": "Clear, concise answer" },
    { "question": "Another concept question?", "answer": "Another answer" }
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

Formatting rules:
- Do NOT use LaTeX notation or backslash commands (no \\frac, \\sqrt, \\tan, \\times, etc.). Write math using plain text or unicode symbols instead (e.g. √, π, ², ½, ×, ÷).

Requirements:
- Summary: 3-4 substantial paragraphs covering all main topics
- Key points: exactly 8 most important takeaways
- Flashcards: exactly 10 question-answer pairs covering key vocabulary and concepts
- Quiz: exactly 8 multiple-choice questions with 4 options each, ${difficultyText}

Return ONLY the JSON object, no other text.`;

  const raw = await callAI(prompt, 4096);
  const stripped = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const clean = stripped.replace(/\\(?!["\\n])/g, '\\\\');

  try {
    return JSON.parse(clean);
  } catch (e) {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('AI returned invalid JSON structure');
  }
}

module.exports = { generateStudyPack };
