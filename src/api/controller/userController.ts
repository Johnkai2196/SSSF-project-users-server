import {NextFunction, Request, Response} from 'express';
import CustomError from '../../classes/CustomError';
import userModel from '../models/userModel';
import {UserOutput, User} from '../../interfaces/User';
import bcrypt from 'bcryptjs';
import DBMessageResponse from '../../interfaces/DBMessageResponse';

const salt = bcrypt.genSaltSync(12);

const userlistGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.find().select('-password -role');
    res.json(users);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};
export default userlistGet;
