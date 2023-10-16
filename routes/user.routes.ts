import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import * as userService from '../services/user.service';
import * as authService from '../services/auth.service';
import validate from '../middleware/validate';
import authValidation from '../validations/auth.validation';
import config from '../config/config';

const router = Router();

router.get('/', passport.authenticate('jwt', { session: false }), async (_req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred while retrieving users.' });
  }
});

router.post('/signup', validate(authValidation.register), async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userService.createUser(username, password);

    const userPayload = {
      id: user.id,
      username: user.username
    };

    const token = jwt.sign(userPayload, config.jwt.secret!, {
      expiresIn: '1h'
    });

    res.status(201).json({ token });
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message); // Now it's safe to access the message property

      if (e.message === 'Username already exists') {
        return res.status(400).json({ error: 'Username already exists. Please choose another.' });
      }
    } else {
      console.error(e); // If e is not an instance of Error, just log it as it is.
    }

    res.status(500).json({ error: 'An error occurred during signup.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await authService.loginUser(username, password);

    if (token) {
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid username or password.' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
});

export default router;
