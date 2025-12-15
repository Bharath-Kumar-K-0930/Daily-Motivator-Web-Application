import mongoose, { Schema, Document } from 'mongoose';

export interface IChallenge extends Document {
    title: string;
    description: string;
    duration_days: number;
    category: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    daily_tasks: { day: number; task: string }[];
    created_at: Date;
}

const ChallengeSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration_days: { type: Number, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    daily_tasks: [{
        day: { type: Number, required: true },
        task: { type: String, required: true }
    }],
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema);
