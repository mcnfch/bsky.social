import express from 'express';

const app = express();
const port = process.env.PORT || 8081;

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'feed-generator' });
});

// Placeholder endpoint for feed skeleton
app.get('/xrpc/app.bsky.feed.getFeedSkeleton', (_req, res) => {
  res.json({ cursor: null, feed: [] });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Feed generator listening on :${port}`);
});

