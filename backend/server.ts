import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import UserProfile from '../src/models/UserProfile';
import path from 'path';
import { Pool } from 'pg';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.error('MongoDB connection error:', err));

// PostgreSQL pool setup
const pgPool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
});

// API route to upload profile picture
app.post('/api/profile/picture', upload.single('profilePic'), async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Profile picture file is required' });
    }

    const profilePicBuffer = req.file.buffer;

    const userProfile = await UserProfile.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    userProfile.profilePic = profilePicBuffer;
    await userProfile.save();

    res.status(200).json({ message: 'Profile picture uploaded successfully' });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API route to get profile picture
app.get('/api/profile/picture/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const userProfile = await UserProfile.findById(userId);
    if (!userProfile || !userProfile.profilePic) {
      return res.status(404).json({ error: 'Profile picture not found' });
    }

    res.set('Content-Type', 'image/jpeg');
    res.send(userProfile.profilePic);
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to send immediate WhatsApp message
app.post('/api/send-whatsapp', async (req: Request, res: Response) => {
  try {
    const { userId, message, phone } = req.body;
    if (!userId || !message || !phone) {
      return res.status(400).json({ error: 'userId, message, and phone are required' });
    }

    // TODO: Integrate with WhatsApp API to send message immediately
    console.log(`Sending WhatsApp message to user ${userId} at phone ${phone}: ${message}`);

    // Log the notification as sent
    await pgPool.query(
      'INSERT INTO notification_logs (notification_id, sent_at, status, response) VALUES ($1, NOW(), $2, $3)',
      [null, 'sent', 'Message sent immediately']
    );

    res.status(200).json({ message: 'WhatsApp message sent successfully' });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to schedule WhatsApp notification
app.post('/api/schedule-whatsapp-notification', async (req: Request, res: Response) => {
  try {
    const { userId, message, scheduledTime } = req.body;
    if (!userId || !message || !scheduledTime) {
      return res.status(400).json({ error: 'userId, message, and scheduledTime are required' });
    }

    const result = await pgPool.query(
      'INSERT INTO scheduled_notifications (user_id, message, scheduled_time, status, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id',
      [userId, message, scheduledTime, 'pending']
    );

    res.status(201).json({ message: 'Notification scheduled', notificationId: result.rows[0].id });
  } catch (error) {
    console.error('Error scheduling WhatsApp notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to clear old scheduled notifications
app.post('/api/clear-scheduled-notifications', async (req: Request, res: Response) => {
  try {
    const { beforeDate } = req.body;
    if (!beforeDate) {
      return res.status(400).json({ error: 'beforeDate is required' });
    }

    const result = await pgPool.query(
      'DELETE FROM scheduled_notifications WHERE scheduled_time < $1',
      [beforeDate]
    );

    res.status(200).json({ message: 'Old scheduled notifications cleared', deletedCount: result.rowCount });
  } catch (error) {
    console.error('Error clearing scheduled notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to get user profile by userId
app.get('/api/profile/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const userProfile = await UserProfile.findById(userId).lean();
    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    // Map fields to frontend format
    const profileData = {
      id: userProfile._id,
      username: userProfile.username,
      full_name: userProfile.fullName,
      whatsapp_number: userProfile.whatsappNumber,
      notification_times: userProfile.notificationTimes,
      selected_interests: userProfile.selectedInterests,
      avatar_url: userProfile.profilePic ? `/api/profile/picture/${userId}` : null,
      enable_notifications: !!userProfile.whatsappNumber && userProfile.notificationTimes.length > 0,
    };
    res.json(profileData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to update user profile by userId
app.put('/api/profile/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const {
      username,
      full_name,
      whatsapp_number,
      notification_times,
      selected_interests,
    } = req.body;

    const userProfile = await UserProfile.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    userProfile.username = username || userProfile.username;
    userProfile.fullName = full_name || userProfile.fullName;
    userProfile.whatsappNumber = whatsapp_number || userProfile.whatsappNumber;
    userProfile.notificationTimes = notification_times || userProfile.notificationTimes;
    userProfile.selectedInterests = selected_interests || userProfile.selectedInterests;

    await userProfile.save();

    res.json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { app };
