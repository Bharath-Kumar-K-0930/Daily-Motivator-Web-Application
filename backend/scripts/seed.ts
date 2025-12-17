
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env or backend specific logic
// Assuming running from backend directory or root. Let's try to load from root .env if possible
dotenv.config({ path: path.join(__dirname, '../../.env') });

import User from '../models/User';
import Challenge from '../models/Challenge';
import UserChallenge from '../models/UserChallenge';
import Quote from '../models/Quote';
import Badge from '../models/Badge';
import UserBadge from '../models/UserBadge';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Daily-Motivator-Web-DataBase';

const seed = async () => {
    try {
        console.log('Connecting to MongoDB at:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Challenge.deleteMany({});
        await UserChallenge.deleteMany({});
        await Quote.deleteMany({});
        await Badge.deleteMany({});
        await UserBadge.deleteMany({});
        console.log('Data cleared.');

        // --- Users ---
        console.log('Seeding Users...');
        const hashedPassword = await bcrypt.hash('password123', 10);
        const demoUser = await User.create({
            username: 'demo_user',
            email: 'demo@example.com',
            password: hashedPassword,
            full_name: 'Demo User',
            selected_interests: ['Fitness', 'Productivity'],
            notification_times: ['08:00', '20:00'],
            enable_notifications: true,
            notification_types: {
                dailyMotivation: true,
                reminders: true,
                alerts: false
            }
        });
        console.log('User created:', demoUser.username);

        // --- Quotes ---
        console.log('Seeding Quotes...');
        const quotes = [
            { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'success' },
            { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt', category: 'personal-growth' },
            { text: 'Health is the greatest gift.', author: 'Buddha', category: 'health' },
            { text: 'Happiness depends upon ourselves.', author: 'Aristotle', category: 'relationships' },
            { text: 'Your time is limited, don\'t waste it living someone else\'s life.', author: 'Steve Jobs', category: 'success' },
            { text: 'The journey of a thousand miles begins with one step.', author: 'Lao Tzu', category: 'personal-growth' }
        ];
        await Quote.insertMany(quotes);
        console.log(`${quotes.length} Quotes inserted.`);

        // --- Challenges and Badges ---
        console.log('Seeding Challenges and Badges...');
        const topics = ['Health & Wellness', 'Fitness', 'Mindfulness', 'Coding Skills', 'Productivity', 'Relationships', 'Mental Health'];
        const durations = [30, 60, 100];

        const challengesData = [];
        const badgesData = [];

        for (const topic of topics) {
            for (const duration of durations) {
                // Create Challenge
                const challenge = new Challenge({
                    title: `${duration}-Day ${topic} Challenge`,
                    description: `A ${duration} days journey to improve your ${topic}. Commit to small daily tasks to achieve big results.`,
                    duration_days: duration,
                    category: topic,
                    difficulty: duration === 30 ? 'Beginner' : duration === 60 ? 'Intermediate' : 'Advanced', // Matching schema enum
                    daily_tasks: Array.from({ length: duration }, (_, i) => ({
                        day: i + 1,
                        task: `Day ${i + 1} task for ${topic}: Dedicate 20 minutes to ${topic.toLowerCase()} practice.`
                    }))
                });
                challengesData.push(challenge);

                // Create Badge
                badgesData.push(new Badge({
                    name: `${duration}-Day ${topic} Master`,
                    description: `Awarded for completing the ${duration}-day ${topic} challenge.`,
                    image_url: `https://ui-avatars.com/api/?name=${topic.replace(/ /g, '+')}+${duration}&background=random&size=200`,
                    category: topic,
                    requirements: { days_completed: duration }
                }));
            }
        }

        const insertedChallenges = await Challenge.insertMany(challengesData);
        const insertedBadges = await Badge.insertMany(badgesData);
        console.log(`${insertedChallenges.length} Challenges inserted.`);
        console.log(`${insertedBadges.length} Badges inserted.`);

        // --- User Challenge (Start one for demo) ---
        console.log('Starting a challenge for demo user...');
        const firstChallenge = insertedChallenges[0];
        await UserChallenge.create({
            user_id: demoUser._id,
            challenge_id: firstChallenge._id,
            status: 'active',
            current_day: 1,
            start_date: new Date(),
            last_updated: new Date()
        });
        console.log('User started challenge:', firstChallenge.title);

        console.log('Seeding completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seed();
