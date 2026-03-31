const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const SYSTEM = 'You are a WhatsApp message monitor. Analyze the message and return ONLY valid JSON: { "summary": "string", "priority": "high|medium|low", "auto_reply": "string or null", "create_task": { "title": "string", "description": "string", "priority": "string" } or null }. Only set auto_reply if the message needs acknowledgment. Only create_task if something is actionable.';
async function analyzeMessage({ from, name, body }) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514', max_tokens: 1000,
    system: SYSTEM,
    messages: [{ role: 'user', content: 'Sender: ' + name + ' (' + from + ') Message: ' + body }]
  });
  try { return JSON.parse(response.content[0].text.trim()); }
  catch (e) { return { auto_reply: null, create_task: null }; }
}
module.exports = { analyzeMessage };