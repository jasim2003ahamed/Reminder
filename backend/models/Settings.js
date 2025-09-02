// models/Settings.js
import mongoose from 'mongoose';

const reminderTemplateSchema = new mongoose.Schema({
  title: String,
  body: String,
});

const settingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  businessInfo: {
    name: String,
    address: String,
    phone: String,
    email: String,
    website: String,
  },

  reminderTemplates: [reminderTemplateSchema],

  notifications: {
    emailEnabled: { type: Boolean, default: true },
    smsEnabled: { type: Boolean, default: false },
    emailSender: String,
    smsSender: String,
  },
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
