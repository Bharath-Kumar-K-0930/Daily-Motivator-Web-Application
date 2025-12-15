import mongoose, { Schema, Document } from 'mongoose';

export interface IUserBadge extends Document {
    user_id: mongoose.Types.ObjectId;
    badge_id: mongoose.Types.ObjectId;
    earned_at: Date;
}

const UserBadgeSchema: Schema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    badge_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge', required: true },
    earned_at: { type: Date, default: Date.now }
});

export default mongoose.models.UserBadge || mongoose.model<IUserBadge>('UserBadge', UserBadgeSchema);
