import { Todo } from '@prisma/client';

import prisma from '../database/client';
import { TaskOwnershipError } from '../utils/TaskOwnershipError';

export async function listTasks(userId: number) {
  return prisma.todo.findMany({ where: { userId } });
}

export async function addTask(userId: number, taskData: Todo) {
  return prisma.todo.create({
    data: {
      ...taskData,
      userId,
      isComplete: false
    }
  });
}

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

export async function removeTask(userId: number, taskId: number) {
  // Ensure the task belongs to the logged-in user
  const task = await prisma.todo.findUnique({ where: { id: taskId } });

  if (!task || task.userId !== userId) {
    throw new TaskOwnershipError();
  }

  return prisma.todo.delete({ where: { id: taskId } });
}
