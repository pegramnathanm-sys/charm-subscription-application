require('dotenv').config();
const express = require('express');
const https = require('https');
const { URL } = require('url');

const app = express();
const PORT = process.env.PORT || 3000;
const RYE_API_KEY = process.env.RYE_API_KEY;
const RYE_BASE = process.env.RYE_BASE_URL || 'https://api.rye.com/api/v1';
const RYE_AUTH = `Basic ${Buffer.from(RYE_API_KEY + ':').toString('base64')}`;

// Static files
app.use(express.static('public'));

// API proxy: /api/products/lookup → Rye
app.get('/api/products/lookup', (req, res) => {
  const productUrl = req.query.url;
  if (!productUrl) {
    return res.status(400).json({ error: 'url param required' });
  }

  const ryeUrl = new URL(`${RYE_BASE}/products/lookup`);
  ryeUrl.searchParams.set('url', productUrl);

  console.log(`→ Rye lookup: ${productUrl}`);

  const proxyReq = https.request(ryeUrl.toString(), {
    headers: { 'Authorization': RYE_AUTH },
  }, proxyRes => {
    let body = '';
    proxyRes.on('data', chunk => body += chunk);
    proxyRes.on('end', () => {
      console.log(`← Rye ${proxyRes.statusCode}:`, body.slice(0, 300));
      res.status(proxyRes.statusCode).type('json').send(body);
    });
  });

  proxyReq.on('error', err => {
    console.error('Proxy error:', err.message);
    res.status(500).json({ error: 'Proxy request failed' });
  });

  proxyReq.end();
});

app.listen(PORT, () => {
  console.log(`Running → http://localhost:${PORT}`);
});
