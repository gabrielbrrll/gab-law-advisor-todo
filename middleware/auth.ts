import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import httpStatus from 'http-status';

import ApiError from '../utils/ApiError';
import { User } from '@prisma/client';

// Custom middleware for JWT authentication
const auth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error | null, user: User) => {
    if (err) {
      return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message));
    }

    if (!user) {
      return next(
        new ApiError(httpStatus.UNAUTHORIZED, 'You are unathorized from accessing this.')
      );
    }

    // Attach user to the request object
    req.user = user;

    next();
  })(req, res, next);
};

export default auth;
