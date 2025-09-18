import express from 'express';
import jwt from 'jsonwebtoken';
import Snippet from '../models/Snippet.js';

const router = express.Router();

// Middleware to verify JWT
function auth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Get all snippets for logged-in user
router.get('/', auth, async (req, res) => {
  const snippets = await Snippet.find({ user: req.userId });
  res.json(snippets);
});

// Create new snippet
router.post('/', auth, async (req, res) => {
  const { title, code, language } = req.body;
  const snippet = new Snippet({ user: req.userId, title, code, language });
  await snippet.save();
  res.status(201).json(snippet);
});

// Delete snippet
router.delete('/:id', auth, async (req, res) => {
  await Snippet.deleteOne({ _id: req.params.id, user: req.userId });
  res.json({ message: 'Snippet deleted' });
});

export default router;