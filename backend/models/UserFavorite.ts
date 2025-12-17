import mongoose from 'mongoose';

const userFavoriteSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quote_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote',
        required: true
    },
    added_at: {
        type: Date,
        default: Date.now
    }
});

// Ensure a user can't favorite the same quote twice
userFavoriteSchema.index({ user_id: 1, quote_id: 1 }, { unique: true });

export default mongoose.model('UserFavorite', userFavoriteSchema);
