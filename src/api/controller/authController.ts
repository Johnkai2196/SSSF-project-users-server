import {Request, Response, NextFunction} from 'express';
import userModel from '../models/userModel';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User, UserRole} from '../../interfaces/User';
import LoginMessageResponse from '../../interfaces/LoginMessageResponse';

const salt = bcrypt.genSaltSync(12);
// Login
const login = async (
  req: Request<{}, {}, {username: string; password: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {username, password} = req.body;
    const user = await userModel.findOne({user_name: username});

    if (!user) {
      next(new CustomError('Incorrect username/password', 200));
      return;
    }
    if (!bcrypt.compareSync(password, user.password)) {
      next(new CustomError('Incorrect username/password', 200));
      return;
    }
    //set expiration depending on the app requirements. For example if social media app then no need, if banking app then 1 hour
    const token = jwt.sign(
      {id: user._id, role: user.role},
      process.env.JWT_SECRET as string
    );

    const userOutput: UserRole = {
      user_name: user.user_name,
      email: user.email,
      id: user._id,
      bio: user.bio,
      bannerPicture: user.bannerPicture,
      profilePicture: user.profilePicture,
      role: user.role,
    };

    const message: LoginMessageResponse = {
      message: 'Login successful',
      token,
      user: userOutput,
    };

    res.json(message);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};
// register
const register = async (
  req: Request<{}, {}, User>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.body;
    user.password = await bcrypt.hash(user.password, salt);
    const newUser = await userModel.create(user);
    const token = jwt.sign(
      {id: newUser._id, role: newUser.role},
      process.env.JWT_SECRET as string
    );

    const userOutput: UserRole = {
      user_name: newUser.user_name,
      email: newUser.email,
      id: newUser._id,
      bio: newUser.bio,
      bannerPicture: newUser.bannerPicture,
      profilePicture: newUser.profilePicture,
      role: newUser.role,
    };

    const message: LoginMessageResponse = {
      message: 'Login successful',
      token,
      user: userOutput,
    };

    res.json(message);
  } catch (error) {
    next(new CustomError('Duplicate entry', 200));
  }
};

export {login, register};
