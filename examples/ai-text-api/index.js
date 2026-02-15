const express = require('express');
const { x402Handler } = require('./middleware/x402-handler');
const config = require('./stackpay.config.json');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3003;

// Text generation templates (simulated AI responses)
const TEMPLATES = {
  summary: (text) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const keyPoints = sentences.slice(0, Math.min(3, sentences.length));
    return `Summary: ${keyPoints.join('. ').trim()}.`;
  },
  sentiment: (text) => {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'love', 'best', 'happy', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'poor', 'horrible', 'sad', 'disappointed'];
    const words = text.toLowerCase().split(/\s+/);
    const posCount = words.filter(w => positiveWords.includes(w)).length;
    const negCount = words.filter(w => negativeWords.includes(w)).length;

    let sentiment, score;
    if (posCount > negCount) { sentiment = 'positive'; score = Math.min(0.5 + posCount * 0.1, 1); }
    else if (negCount > posCount) { sentiment = 'negative'; score = Math.max(0.5 - negCount * 0.1, 0); }
    else { sentiment = 'neutral'; score = 0.5; }

    return { sentiment, score: +score.toFixed(2), positive: posCount, negative: negCount };
  },
  keywords: (text) => {
    const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either', 'neither', 'each', 'every', 'all', 'any', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than', 'too', 'very', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'they', 'them']);
    const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    const freq = {};
    words.forEach(w => { if (!stopWords.has(w) && w.length > 2) freq[w] = (freq[w] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([word, count]) => ({ word, count }));
  },
  translate: (text, targetLang) => {
    // Simulated translation (in production, use real translation API)
    const translations = {
      es: `[ES] ${text}`,
      fr: `[FR] ${text}`,
      de: `[DE] ${text}`,
      ja: `[JA] ${text}`,
      zh: `[ZH] ${text}`,
    };
    return translations[targetLang] || `[${targetLang}] ${text}`;
  },
};

// API info (free)
app.get('/', (req, res) => {
  res.json({
    name: 'StackPay AI Text API',
    version: '1.0.0',
    description: 'Text analysis & generation API monetized with Bitcoin micropayments',
    pricing: `${config.price} ${config.currency} per request`,
    endpoints: [
      { path: '/api/summarize', method: 'POST', description: 'Summarize text', body: '{ "text": "..." }' },
      { path: '/api/sentiment', method: 'POST', description: 'Analyze sentiment', body: '{ "text": "..." }' },
      { path: '/api/keywords', method: 'POST', description: 'Extract keywords', body: '{ "text": "..." }' },
      { path: '/api/translate', method: 'POST', description: 'Translate text', body: '{ "text": "...", "target": "es" }' },
    ],
  });
});

// Apply payment middleware
app.use('/api', x402Handler(config));

// Summarize text
app.post('/api/summarize', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text field required in body' });

  const summary = TEMPLATES.summary(text);
  res.json({
    original_length: text.length,
    summary,
    summary_length: summary.length,
    compression_ratio: +(summary.length / text.length).toFixed(2),
    timestamp: new Date().toISOString(),
  });
});

// Sentiment analysis
app.post('/api/sentiment', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text field required in body' });

  const analysis = TEMPLATES.sentiment(text);
  res.json({
    text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
    analysis,
    timestamp: new Date().toISOString(),
  });
});

// Keyword extraction
app.post('/api/keywords', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text field required in body' });

  const keywords = TEMPLATES.keywords(text);
  res.json({
    text_length: text.length,
    keywords,
    total_keywords: keywords.length,
    timestamp: new Date().toISOString(),
  });
});

// Translation
app.post('/api/translate', (req, res) => {
  const { text, target } = req.body;
  if (!text) return res.status(400).json({ error: 'Text field required' });
  if (!target) return res.status(400).json({ error: 'Target language required (e.g., es, fr, de, ja, zh)' });

  const translated = TEMPLATES.translate(text, target);
  res.json({
    original: text,
    translated,
    source_language: 'en',
    target_language: target,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log(`  🤖 AI Text API running on http://localhost:${PORT}`);
  console.log(`  💰 Price: ${config.price} ${config.currency} per request`);
  console.log(`  📄 Docs: http://localhost:${PORT}/`);
  console.log('');
});
