import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import * as userService from '../services/user.service';
import * as authService from '../services/auth.service';
import config from '../config/config';
import ApiError from '../utils/ApiError';
import { generateToken } from '../helpers/jwt.helper';

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (e) {
    next(new ApiError(httpStatus.BAD_REQUEST, 'An error occurred while retrieving users.'));
  }
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const user = await userService.createUser(username, password);

    const userPayload = {
      id: user.id,
      username: user.username
    };

    const token = generateToken(userPayload, config.jwt.secret!, {
      expiresIn: '1h'
    });

    res.status(201).json({ token });
  } catch (e) {
    if (e instanceof Error && e.message === 'Username already exists') {
      return next(
        new ApiError(httpStatus.BAD_REQUEST, 'Username already exists. Please choose another.')
      );
    }
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred during signup.'));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const token = await authService.loginUser(username, password);

    if (token) {
      res.json({ token });
    } else {
      next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid username or password.'));
    }
  } catch (e) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred during login.'));
  }
};
