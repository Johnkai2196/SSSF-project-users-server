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

export default User;
