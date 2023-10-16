import { Router } from 'express';

import authenticateJwt from '../middleware/auth';
import * as todoController from '../controllers/task.controller';

const router = Router();

// List all tasks of the logged-in user
router.get('/', authenticateJwt, todoController.listTasks);

// Add a new task
router.post('/', authenticateJwt, todoController.addTask);

// Update a task (the user can only update their own tasks)
router.put('/:taskId', authenticateJwt, todoController.updateTask);

// Remove a task (the user can only remove their own tasks)
router.delete('/:taskId', authenticateJwt, todoController.removeTask);

export default router;
