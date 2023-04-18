import {Document} from 'mongoose';

// User interface
interface User extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  profilePicture: string;
  bannerPicture: string;
}

interface UserOutput {
  id: string;
  username: string;
  email: string;
  role?: 'admin' | 'user';
  profilePicture?: string;
  bannerPicture?: string;
}

export {User, UserOutput};
