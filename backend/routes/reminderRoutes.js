import express from 'express';
import Reminder from '../models/Reminder.js';
import scheduleReminder from '../Reminder/scheduleReminder.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const reminders = await Reminder.find().sort({ date: -1 });
  res.json(reminders);
});

router.post('/', async (req, res) => {
  try {
    const reminder = await Reminder.create(req.body);
    scheduleReminder(reminder); // schedule when created
    res.json(reminder);
  } catch (err) {
    console.error('❌ Reminder create error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    scheduleReminder(reminder); // re-schedule if edited
    res.json(reminder);
  } catch (err) {
    console.error('❌ Reminder update error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  await Reminder.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});



// GET all reminders for calendar
router.get('/calendar', async (req, res) => {
  try {
    const reminders = await Reminder.find();
    const events = reminders.map(r => ({
      id: r._id.toString(),
      title: r.title,
      start: r.date.toISOString(),
    }));
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE reminder
router.post('/', async (req, res) => {
  try {
    const newReminder = new Reminder(req.body);
    await newReminder.save();
    res.status(201).json(newReminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE reminder
router.put('/:id', async (req, res) => {
  try {
    const updated = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE reminder
router.delete('/:id', async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
