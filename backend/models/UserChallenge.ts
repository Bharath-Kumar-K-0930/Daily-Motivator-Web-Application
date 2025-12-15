import mongoose, { Schema, Document } from 'mongoose';

export interface IUserChallenge extends Document {
    user_id: mongoose.Types.ObjectId;
    challenge_id: mongoose.Types.ObjectId;
    status: 'active' | 'completed' | 'abandoned';
    current_day: number;
    start_date: Date;
    last_updated: Date;
    completed_at?: Date;
}

const UserChallengeSchema: Schema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    challenge_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
    status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
    current_day: { type: Number, default: 1 },
    start_date: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now },
    completed_at: { type: Date }
});

export default mongoose.models.UserChallenge || mongoose.model<IUserChallenge>('UserChallenge', UserChallengeSchema);
