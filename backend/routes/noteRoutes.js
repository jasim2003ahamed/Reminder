// routes/noteRoutes.js
import express from 'express';
import Note from '../models/Note.js';
import Customer from '../models/Customer.js';

const router = express.Router();

// Create Note
router.post('/', async (req, res) => {
  try {
    const note = new Note(req.body);
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all notes or by customer
router.get('/', async (req, res) => {
  try {
    const filter = req.query.customerId ? { customer: req.query.customerId } : {};
    const notes = await Note.find(filter).populate('customer');
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete note
router.delete('/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
