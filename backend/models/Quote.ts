import mongoose, { Schema, Document } from 'mongoose';

export interface IQuote extends Document {
    text: string;
    author: string;
    category: string;
    created_at: Date;
}

const QuoteSchema: Schema = new Schema({
    text: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Quote || mongoose.model<IQuote>('Quote', QuoteSchema);
