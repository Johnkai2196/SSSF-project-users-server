import {NextFunction, Request, Response} from 'express';
import CustomError from '../../classes/CustomError';
import userModel from '../models/userModel';
import {UserOutput, User} from '../../interfaces/User';
import bcrypt from 'bcryptjs';
import DBMessageResponse from '../../interfaces/DBMessageResponse';

const salt = bcrypt.genSaltSync(12);

// Get all users
const userlistGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.find().select('-password -role');
    res.json(users);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};
// Get one user
const userGet = async (
  req: Request<{id: String}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .select('-password -role');
    if (!user) {
      next(new CustomError('User not found', 404));
      return;
    }
    res.json(user);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// Update user
const userPut = async (
  req: Request<{}, {}, User>,
  res: Response<{}, {user: UserOutput}>,
  next: NextFunction
) => {
  try {
    const userFromToken = res.locals.user;

    const user = req.body;
    if (user.password) {
      user.password = await bcrypt.hash(user.password, salt);
    }

    const result = await userModel
      .findByIdAndUpdate(userFromToken.id, user, {new: true})
      .select('-password -role');

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    const response: DBMessageResponse = {
      message: 'User updated',
      user: {
        user_name: result.user_name,
        email: result.email,
        id: result._id,
        bio: result.bio,
        bannerPicture: result.bannerPicture,
        profilePicture: result.profilePicture,
      },
    };

    res.json(response);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// Delete user
const userDelete = async (
  req: Request,
  res: Response<{}, {user: UserOutput}>,
  next: NextFunction
) => {
  try {
    const userFromToken = res.locals.user;

    const result = await userModel.findByIdAndDelete(userFromToken.id);

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    const response: DBMessageResponse = {
      message: 'User deleted',
      user: {
        user_name: result.user_name,
        email: result.email,
        id: result._id,
        bannerPicture: result.bannerPicture,
        profilePicture: result.profilePicture,
        bio: result.bio,
      },
    };

    res.json(response);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// Admin functions
// update user as admin
const userPutAsAdmin = async (
  req: Request<{}, {}, {id: string; user: User}>,
  res: Response<{}, {user: UserOutput}>,
  next: NextFunction
) => {
  try {
    if (res.locals.user.role !== 'admin') {
      next(new CustomError('You are not authorized to do this', 401));
      return;
    }

    const user = req.body;

    if (user.user.password) {
      user.user.password = await bcrypt.hash(user.user.password, salt);
    }
    console.log(user);

    const result = await userModel
      .findByIdAndUpdate(user.id, user.user, {
        new: true,
      })
      .select('-password -role');

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    const response: DBMessageResponse = {
      message: 'user updated',
      user: {
        user_name: result.user_name,
        email: result.email,
        id: result._id,
        bio: result.bio,
        bannerPicture: result.bannerPicture,
        profilePicture: result.profilePicture,
      },
    };
    res.json(response);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// delete user as admin
const userDeleteAsAdmin = async (
  req: Request,
  res: Response<{}, {user: UserOutput}>,
  next: NextFunction
) => {
  try {
    if (res.locals.user.role !== 'admin') {
      next(new CustomError('You are not authorized to do this', 401));
      return;
    }

    const result = await userModel.findByIdAndDelete(req.params.id);
    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }
    const response: DBMessageResponse = {
      message: 'user deleted',
      user: {
        user_name: result.user_name,
        email: result.email,
        id: result._id,
        bannerPicture: result.bannerPicture,
        profilePicture: result.profilePicture,
        bio: result.bio,
      },
    };
    res.json(response);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

//check if a token is valid
const checkToken = async (
  req: Request,
  res: Response<{}, {user: UserOutput}>,
  next: NextFunction
) => {
  const userFromToken = res.locals.user;

  const message: DBMessageResponse = {
    message: 'Token is valid',
    user: userFromToken,
  };

  res.json(message);
};

export {
  userlistGet,
  userGet,
  userPut,
  userDelete,
  userPutAsAdmin,
  userDeleteAsAdmin,
  checkToken,
};
