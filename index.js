const express = require('express');
const { analyzeMessage } = require('./claude');
const { sendWhatsAppReply } = require('./twilio');
const { createNotionTask } = require('./notion');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => res.send('WhatsApp Monitor running'));

app.post('/webhook', (req, res) => {
  // Respond to Twilio IMMEDIATELY to avoid 5s timeout
  res.status(200).send('OK');

  const from = req.body.From;
  const body = req.body.Body;
  const name = req.body.ProfileName || 'Unknown';
  console.log('Message from ' + name + ' (' + from + '): ' + body);

  // Process asynchronously after responding
  (async () => {
    try {
      const decision = await analyzeMessage({ from, name, body });
      console.log('Decision:', JSON.stringify(decision));

      if (decision.auto_reply) {
        await sendWhatsAppReply(from, decision.auto_reply);
        console.log('Reply sent');
      }

      if (decision.create_task) {
        await createNotionTask(decision.create_task);
        console.log('Notion task created');
      }
    } catch (err) {
      console.error('Processing error:', err.message);
    }
  })();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server on port ' + PORT));