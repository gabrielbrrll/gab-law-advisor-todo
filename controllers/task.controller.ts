import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import * as todoService from '../services/task.service';
import ApiError from '../utils/ApiError';
import { Todo, User } from '@prisma/client';

const BASE_10_RADIX = 10;

export const listTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as User)?.id;
    const tasks = await todoService.listTasks(userId);

    res.json(tasks);
  } catch (e) {
    next(new ApiError(httpStatus.BAD_REQUEST, 'An error occurred while retrieving tasks.'));
  }
};

export const addTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as User)?.id;
    const taskData = req.body as Todo;

    const task = await todoService.addTask(userId, taskData);
    res.status(httpStatus.CREATED).json({
      success: true,
      data: task
    });
  } catch (e) {
    next(new ApiError(httpStatus.BAD_REQUEST, 'An error occurred while adding the task.'));
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as User)?.id;
    const taskId = parseInt(req.params.taskId, BASE_10_RADIX);

    const task = await todoService.updateTask(userId, taskId, req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      data: task
    });
  } catch (e: any) {
    if (e.message === 'Task not found or not owned by the user') {
      next(new ApiError(httpStatus.UNAUTHORIZED, e.message));
    }

    next(new ApiError(httpStatus.BAD_REQUEST, 'An error occurred while updating the task.'));
  }
};

export const removeTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as User)?.id;
    const taskId = parseInt(req.params.taskId, BASE_10_RADIX);

    await todoService.removeTask(userId, taskId);

    res.status(httpStatus.OK).json({
      success: true
    });
  } catch (e: any) {
    if (e.message === 'Task not found or not owned by the user') {
      next(new ApiError(httpStatus.UNAUTHORIZED, e.message));
    }

    next(new ApiError(httpStatus.BAD_REQUEST, 'An error occurred while removing the task.'));
  }
};
