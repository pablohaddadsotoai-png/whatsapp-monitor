const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const FROM = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
async function sendWhatsAppReply(to, message) {
  const result = await client.messages.create({ from: FROM, to, body: message });
  return result;
}
module.exports = { sendWhatsAppReply };