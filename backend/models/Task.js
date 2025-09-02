import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Low' },
  labels: [String],
  date: { type: Date, default: Date.now }, // ✅ important for filtering in dashboard
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;
