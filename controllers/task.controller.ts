import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import * as todoService from '../services/task.service';
import ApiError from '../utils/ApiError';
import { Todo, User } from '@prisma/client';
import { TaskOwnershipError } from '../utils/TaskOwnershipError';
import logger from '../config/logger.config';
import { calculateMiddleRankString, getNextRankString } from '../helpers/task.helper';
import RankStringUniquenessError from '../utils/RankStringUniquenessError';

const BASE_10_RADIX = 10;

export const listTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as User)?.id;
    const tasks = await todoService.listTasks(userId);

    logger.info(`Tasks retrieved for user ${userId}.`);
    res.json(tasks);
  } catch (e) {
    logger.error('Error while retrieving tasks:', e);
    next(new ApiError(httpStatus.BAD_REQUEST, 'An error occurred while retrieving tasks.'));
  }
};

export const addTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as User)?.id;
    const taskData = req.body as Todo;

    // Fetch the rank of the last task to determine the new task's rank
    const lastTaskRank = await todoService.getLastTaskRank(userId);
    const newTaskRank = getNextRankString(lastTaskRank);
    logger.info(lastTaskRank);
    logger.info(newTaskRank);

    const task = await todoService.addTask(userId, {
      ...taskData,
      rankString: newTaskRank
    });

    logger.info(`Task added for user ${userId}.`);
    res.status(httpStatus.CREATED).json({
      success: true,
      data: task
    });
  } catch (e) {
    logger.error('Error while adding task:', e);
    next(new ApiError(httpStatus.BAD_REQUEST, 'An error occurred while adding the task.'));
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as User)?.id;
    const taskId = parseInt(req.params.taskId, BASE_10_RADIX);

    const task = await todoService.updateTask(userId, taskId, req.body);

    logger.info(`Task ${taskId} updated for user ${userId}.`);
    res.status(httpStatus.CREATED).json({
      success: true,
      data: task
    });
  } catch (e: any) {
    if (e instanceof TaskOwnershipError) {
      const userId = (req.user as User)?.id;

      logger.warn(`Task ownership error for user ${userId} and task ${req.params.taskId}.`);
      next(new ApiError(httpStatus.UNAUTHORIZED, e.message));
    }

    logger.error('Error while updating task:', e);
    next(new ApiError(httpStatus.BAD_REQUEST, 'An error occurred while updating the task.'));
  }
};

export const removeTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as User)?.id;
    const taskId = parseInt(req.params.taskId, BASE_10_RADIX);

    await todoService.removeTask(userId, taskId);

    logger.info(`Task ${taskId} removed for user ${userId}.`);
    res.status(httpStatus.OK).json({
      success: true
    });
  } catch (e: any) {
    if (e instanceof TaskOwnershipError) {
      const userId = (req.user as User)?.id;

      logger.warn(`Task ownership error for user ${userId} and task ${req.params.taskId}.`);
      next(new ApiError(httpStatus.UNAUTHORIZED, e.message));
    }

    logger.error('Error while removing task:', e);
    next(new ApiError(httpStatus.BAD_REQUEST, 'An error occurred while removing the task.'));
  }
};

export const reorderTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as User)?.id;
    const taskId = parseInt(req.params.taskId, 10);
    const { prevRank, nextRank } = req.body;

    const initialRankString = calculateMiddleRankString(prevRank, nextRank);
    const task = await todoService.reorderTask(userId, taskId, initialRankString);

    res.status(httpStatus.OK).json({
      success: true,
      data: task
    });
  } catch (e) {
    if (e instanceof RankStringUniquenessError) {
      next(
        new ApiError(
          httpStatus.CONFLICT,
          'Rank string conflict. Unable to reorder the task after multiple attempts.'
        )
      );
    } else {
      next(new ApiError(httpStatus.BAD_REQUEST, 'An error occurred while reordering the task.'));
    }
  }
};
