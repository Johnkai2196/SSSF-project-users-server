// mongoose schema for user

import mongoose from 'mongoose';
import {User} from '../../interfaces/User';

const userModel = new mongoose.Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  profilePicture: {
    type: String,
    default: null,
  },
  bannerPicture: {
    type: String,
    default: null,
  },
});

export default mongoose.model<User>('User', userModel);
