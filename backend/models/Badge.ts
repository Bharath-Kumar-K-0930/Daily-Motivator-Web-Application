import mongoose, { Schema, Document } from 'mongoose';

export interface IBadge extends Document {
    name: string;
    description: string;
    image_url: string;
    category: string;
    requirements: Record<string, any>;
    created_at: Date;
}

const BadgeSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image_url: { type: String, required: true },
    category: { type: String, required: true },
    requirements: { type: Object, default: {} },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Badge || mongoose.model<IBadge>('Badge', BadgeSchema);
