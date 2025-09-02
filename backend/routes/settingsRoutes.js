// routes/settingsRoutes.js
import express from 'express';
import Settings from '../models/Settings.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();

// GET user settings
router.get('/', authMiddleware, async (req, res) => {
  const settings = await Settings.findOne({ user: req.user.id });
  res.json(settings);
});

// UPDATE settings
router.put('/', authMiddleware, async (req, res) => {
  const updated = await Settings.findOneAndUpdate(
    { user: req.user.id },
    req.body,
    { new: true, upsert: true }
  );
  res.json(updated);
});

export default router;
