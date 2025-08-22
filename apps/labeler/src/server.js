import express from 'express';

const app = express();
const port = process.env.PORT || 8082;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'labeler' });
});

// Placeholder rule: label posts containing the word "music"
app.post('/label', (req, res) => {
  const { text } = req.body ?? {};
  const labels = [];
  if (typeof text === 'string' && /\bmusic\b/i.test(text)) {
    labels.push({ label: 'demo:music', reason: 'keyword:music' });
  }
  res.json({ labels });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Labeler listening on :${port}`);
});

