import { Router } from 'express';
import * as userService from '../services/user.service';
import passport from 'passport';
import jwt from 'jsonwebtoken';

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

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userService.createUser(username, password);

    const userPayload = {
      id: user.id,
      username: user.username
    };

    const token = jwt.sign(userPayload, process.env.JWT_SECRET!, {
      expiresIn: '1h'
    });

    res.status(201).json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred during signup.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await userService.loginUser(username, password);

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
