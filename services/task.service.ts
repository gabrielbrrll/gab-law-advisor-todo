import { Todo } from '@prisma/client';

import prisma from '../database/client';
import { TaskOwnershipError } from '../utils/TaskOwnershipError';
import { calculateMiddleRankString } from '../helpers/task.helper';
import RankStringUniquenessError from '../utils/RankStringUniquenessError';

/**
 * Lists all of the user's tasks.
 *
 * @param userId The ID of the user to list the tasks for.
 * @returns A Promise that resolves to an array of `Todo` objects.
 */
export async function listTasks(userId: number) {
  return prisma.todo.findMany({
    where: { userId },
    orderBy: {
      rankString: 'asc'
    }
  });
}

/**
 * Adds a new task for the user.
 *
 * @param userId The ID of the user to add the task for.
 * @param taskData The data for the new task.
 * @returns A Promise that resolves to the newly created `Todo` object.
 */
export async function addTask(userId: number, taskData: Todo) {
  return prisma.todo.create({
    data: {
      ...taskData,
      userId,
      isComplete: false
    }
  });
}

/**
 * Updates an existing task for the user.
 *
 * @param userId The ID of the user to update the task for.
 * @param taskId The ID of the task to update.
 * @param newTaskData The new data for the task.
 * @returns A Promise that resolves to the updated `Todo` object.
 */
export async function updateTask(userId: number, taskId: number, newTaskData: Todo) {
  // Ensure the task belongs to the logged-in user
  const existingTask = await prisma.todo.findUnique({ where: { id: taskId } });

  if (!existingTask || existingTask.userId !== userId) {
    throw new TaskOwnershipError();
  }

  return prisma.todo.update({
    where: { id: taskId },
    data: {
      ...existingTask,
      ...newTaskData
    }
  });
}

/**
 * Removes an existing task for the user.
 *
 * @param userId The ID of the user to remove the task for.
 * @param taskId The ID of the task to remove.
 * @returns A Promise that resolves when the task has been removed.
 */
export async function removeTask(userId: number, taskId: number) {
  // Ensure the task belongs to the logged-in user
  const task = await prisma.todo.findUnique({ where: { id: taskId } });

  if (!task || task.userId !== userId) {
    throw new TaskOwnershipError();
  }

  return prisma.todo.delete({ where: { id: taskId } });
}

/**
 * Gets the rank string of the last task for the user.
 *
 * @param userId The ID of the user to get the last task rank for.
 * @returns A Promise that resolves to the rank string of the last task, or `null` if the user has no tasks.
 */

export async function getLastTaskRank(userId: number): Promise<string | null> {
  const lastTask = await prisma.todo.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { rankString: true }
  });

  return lastTask?.rankString || null;
}

/**
 * Reorders a task for the user.
 *
 * @param userId The ID of the user to reorder the task for.
 * @param taskId The ID of the task to reorder.
 * @param initialRankString The initial rank string of the task.
 * @returns A Promise that resolves when the task has been reordered.
 *
 */
export async function reorderTask(userId: number, taskId: number, initialRankString: string) {
  const task = await prisma.todo.findUnique({ where: { id: taskId } });

  if (!task || task.userId !== userId) {
    throw new TaskOwnershipError();
  }

  let attempts = 0;
  let rankString = initialRankString;

  while (attempts < 10) {
    try {
      return await prisma.todo.update({
        where: { id: taskId },
        data: { rankString: rankString }
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        // Fetch the next rankString in the list after the newly calculated one.
        const nextTask = await prisma.todo.findFirst({
          where: {
            rankString: {
              gt: rankString
            }
          },
          orderBy: {
            rankString: 'asc'
          }
        });

        const nextRank = nextTask ? nextTask.rankString : 'zzzzzzzzzz'; // default to a high value if no next rankString exists

        rankString = calculateMiddleRankString(rankString, nextRank);
        attempts++;
      } else {
        throw e;
      }
    }
  }
  throw new RankStringUniquenessError();
}
