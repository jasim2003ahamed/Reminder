import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import fileUpload from 'express-fileupload';
import customerRoutes from './routes/customerRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import groupRoutes from './routes/groupRoutes.js';


dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());


connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/groups', groupRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
