import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import * as userService from '../services/user.service';
import * as authService from '../services/auth.service';
import config from '../config/config';
import ApiError from '../utils/ApiError';
import { generateToken } from '../helpers/jwt.helper';
import logger from '../config/logger.config';

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();

    logger.info('Successfully retrieved all users.');
    res.json(users);
  } catch (e) {
    logger.error('Error while retrieving users:', e);
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

    res.status(201).json({ success: true, token });
    logger.info(`User registered successfully: ${username}`);
  } catch (e) {
    if (e instanceof Error && e.message === 'Username already exists') {
      logger.warn('Signup attempt with existing username');

      return next(
        new ApiError(httpStatus.BAD_REQUEST, 'Username already exists. Please choose another.')
      );
    }

    logger.error('Error during signup:', e);
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred during signup.'));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const token = await authService.loginUser(username, password);

    if (token) {
      res.json({ success: true, token });
      logger.info(`User logged in successfully: ${username}`);
    } else {
      logger.warn(`Failed login attempt for username: ${username}`);
      next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid username or password.'));
    }
  } catch (e) {
    logger.error('Error during login:', e);
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred during login.'));
  }
};
