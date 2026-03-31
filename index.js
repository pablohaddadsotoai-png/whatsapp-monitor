const express = require('express');
const { analyzeMessage } = require('./claude');
const { sendWhatsAppReply } = require('./twilio');
const { createNotionTask } = require('./notion');
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get('/', (req, res) => res.send('WhatsApp Monitor running'));
app.post('/webhook', async (req, res) => {
  try {
    const from = req.body.From;
    const body = req.body.Body;
    const name = req.body.ProfileName || 'Unknown';
    const decision = await analyzeMessage({ from, name, body });
    if (decision.auto_reply) await sendWhatsAppReply(from, decision.auto_reply);
    if (decision.create_task) await createNotionTask(decision.create_task);
    res.status(200).send('OK');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server on port ' + PORT));