import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProfile extends Document {
  username: string;
  fullName: string;
  notificationTimes: string[];
  selectedInterests: string[];
  whatsappNumber: string;
  profilePic?: Buffer; // Added profilePic field
}

const UserProfileSchema: Schema = new Schema({
  username: { type: String, required: true },
  fullName: { type: String, required: true },
  notificationTimes: { type: [String], default: ['04:00', '05:00', '06:00', '07:00', '10:00'] },
  selectedInterests: { type: [String], default: [] },
  whatsappNumber: { type: String, default: '' },
  profilePic: { type: Buffer }, // Added profilePic field
});

export default mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
