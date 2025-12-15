import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password?: string;
    username: string;
    full_name: string;
    avatar_url?: string;
    selected_interests: string[];
    notification_times?: string[];
    enable_notifications?: boolean;
    whatsapp_number?: string;
    notification_types?: {
        dailyMotivation: boolean;
        reminders: boolean;
        alerts: boolean;
    };
    created_at: Date;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth, required for email/pass
    username: { type: String, required: true, unique: true },
    full_name: { type: String },
    avatar_url: { type: String },
    selected_interests: [{ type: String }],
    notification_times: [{ type: String }],
    enable_notifications: { type: Boolean, default: false },
    whatsapp_number: { type: String },
    notification_types: {
        dailyMotivation: { type: Boolean, default: true },
        reminders: { type: Boolean, default: false },
        alerts: { type: Boolean, default: false }
    },
    created_at: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
