import { Router } from 'express';

import authenticateJwt from '../middleware/auth';
import * as todoController from '../controllers/task.controller';
import taskValidation from '../validations/task.validation';
import validate from '../middleware/validate';

const router = Router();

router.get('/', authenticateJwt, todoController.listTasks);

router.post('/', authenticateJwt, validate(taskValidation.addTask), todoController.addTask);

router.put(
  '/:taskId',
  authenticateJwt,
  validate(taskValidation.updateTask),
  todoController.updateTask
);

router.put(
  '/reorder/:taskId',
  authenticateJwt,
  validate(taskValidation.reorderTask),
  todoController.reorderTask
);

router.delete('/:taskId', authenticateJwt, todoController.removeTask);

export default router;
