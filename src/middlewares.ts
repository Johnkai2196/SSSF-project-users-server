/* eslint-disable @typescript-eslint/no-unused-vars */
import {NextFunction, Request, Response} from 'express';
import CustomError from './classes/CustomError';
import ErrorResponse from './interfaces/ErrorResponse';

import jwt from 'jsonwebtoken';
import {UserOutput} from './interfaces/User';
import userModel from './api/models/userModel';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  console.error('errorHandler', err);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearer = req.headers.authorization;

    if (!bearer) {
      next(new CustomError('No token provided', 401));
      return;
    }

    const token = bearer.split(' ')[1];

    if (!token) {
      next(new CustomError('No token provided', 401));
      return;
    }

    const userFromToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as UserOutput;

    const user = await userModel.findById(userFromToken.id).select('-password');

    if (!user) {
      next(new CustomError('token not valid', 403));
      return;
    }

    const outputUser: UserOutput = {
      id: user._id,
      user_name: user.user_name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      bannerPicture: user.bannerPicture,
      bio: user.bio,
    };

    res.locals.user = outputUser;

    next();
  } catch (error) {
    next(new CustomError((error as Error).message, 400));
  }
};

export {notFound, errorHandler, authenticate};
