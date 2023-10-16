import prisma from '../database/client';
import { hashPassword, comparePassword } from '../helpers/bcrypt.helper';

export async function getAllUsers() {
  return prisma.user.findMany();
}

export async function createUser(username: string, password: string) {
  await checkExistingUsername(username);

  const hashedPassword = await hashPassword(password);

  return prisma.user.create({
    data: {
      username,
      password: hashedPassword
    }
  });
}

export async function checkExistingUsername(username: string) {
  const existingUser = await prisma.user.findUnique({
    where: {
      username: username
    }
  });

  if (existingUser) {
    throw new Error('Username already exists');
  }
}

export async function findUserByUsername(username: string) {
  return prisma.user.findUnique({ where: { username } });
}
