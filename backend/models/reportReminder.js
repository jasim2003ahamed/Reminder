import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  title: String,
  type: String,
  notes: String,
  date: Date,
  recurrence: String,
  assignedTo: String,
});

export default mongoose.model('Reminder', reminderSchema);
