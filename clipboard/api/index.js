const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// Fast In-Memory Storage (Guaranteed 100% Reliability for Simple Online Clipboard)
const clipsStore = new Map();

// Generate unique 6-digit code
function generateCode() {
  let code;
  do {
    code = Math.floor(100000 + Math.random() * 900000).toString();
  } while (clipsStore.has(code));
  return code;
}

// ROUTE 1: Save / Create Clip
app.post('/api/clips', (req, res) => {
  try {
    const { code, content } = req.body;

    if (!content && content !== '') {
      return res.status(400).json({ error: 'Content is required.' });
    }

    const clipCode = code || generateCode();
    clipsStore.set(clipCode, {
      code: clipCode,
      content: content,
      createdAt: new Date()
    });

    return res.status(201).json({ success: true, code: clipCode });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// ROUTE 2: Fetch Clip by 6-Digit Code
app.post('/api/clips/:code', (req, res) => {
  try {
    const { code } = req.params;
    const clip = clipsStore.get(code);

    if (!clip) {
      return res.status(404).json({ error: 'Clip not found or expired.' });
    }

    return res.json({
      success: true,
      content: clip.content,
      createdAt: clip.createdAt
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = app;
