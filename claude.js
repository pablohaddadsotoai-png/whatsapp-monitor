const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = 'You are a WhatsApp message monitor assistant. Analyze the incoming message and ALWAYS return ONLY valid JSON with NO extra text, NO markdown, NO backticks. Structure: { "summary": "brief summary", "priority": "high|medium|low", "auto_reply": "a friendly acknowledgment reply - ALWAYS provide this, never null", "create_task": { "title": "task title", "description": "details" } or null if not actionable }';

async function analyzeMessage({ from, name, body }) {
  console.log('Analyzing message from ' + name + ': ' + body);
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: SYSTEM,
    messages: [{ role: 'user', content: 'Sender: ' + name + ' (' + from + ')\nMessage: ' + body }]
  });
  const text = response.content[0].text.trim();
  console.log('Claude raw response:', text.substring(0, 100));
  try {
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    console.error('Parse error:', e.message, 'Raw:', text.substring(0, 200));
    return { auto_reply: 'Got your message! I will look into it.', create_task: null, summary: 'Parse error', priority: 'low' };
  }
}

module.exports = { analyzeMessage };