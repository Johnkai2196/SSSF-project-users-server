// mongoose schema for user

import mongoose from 'mongoose';
import {User} from '../../interfaces/User';

const userModel = new mongoose.Schema<User>({
  user_name: {
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
    default: '3ccc63a9283bbe5ae56190b10c5fd456',
  },
  bannerPicture: {
    type: String,
    default: 'upload string here',
  },
  bio: {
    type: String,
    default: 'Hi i am new here',
  },
});
// Duplicate the ID field.
userModel.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userModel.set('toJSON', {
  virtuals: true,
});

export default mongoose.model<User>('User', userModel);
