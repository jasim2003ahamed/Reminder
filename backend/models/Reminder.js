import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  title: String,
  type: String,
  notes: String,
  date: Date,
  recurrence: String,
  assignedTo: String,
  deliveryMethods: [String], // ['email', 'phone', 'whatsapp']
  email: String,
  phone: String,
  whatsapp: String,
  groupemail:[String] // Array of email addresses for group notifications
});

export default mongoose.model('Reminder', reminderSchema);
