import { Router } from 'express';
import * as userService from '../services/user.service';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred while retrieving users.' });
  }
});

export default router;
