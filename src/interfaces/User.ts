import {Document} from 'mongoose';

// User interface
interface User extends Document {
  user_name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  profilePicture: string;
  bannerPicture: string;
  bio: string;
}

interface UserOutput {
  id: string;
  user_name: string;
  email: string;
  role?: 'admin' | 'user';
  profilePicture?: string;
  bannerPicture?: string;
  bio?: string;
}

export {User, UserOutput};
