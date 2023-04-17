import {Document} from 'mongoose';

// User interface
interface User extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  profilePicture: string | null;
  bannerPicture: string | null;
}

interface UserOutput {
  id: string;
  username: string;
  email: string;
  role?: 'admin' | 'user';
}

export {User, UserOutput};
