import prisma from '../database/client';
import { hashPassword } from '../helpers/bcrypt.helper';

/**
 * Gets all users from the database.
 *
 * @returns A Promise that resolves to an array of `User` objects.
 */
export async function getAllUsers() {
  return prisma.user.findMany();
}

/**
 * Creates a new user in the database.
 *
 * @param username The username of the new user.
 * @param password The password of the new user.
 * @returns A Promise that resolves to the newly created `User` object.
 */
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

/**
 * Checks if a username already exists in the database.
 *
 * @param username The username to check.
 * @throws An error if the username already exists.
 */
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

/**
 * Finds a user by their username.
 *
 * @param username The username of the user to find.
 * @returns A Promise that resolves to the `User` object, or `null` if the user does not exist.
 */
export async function findUserByUsername(username: string) {
  return prisma.user.findUnique({ where: { username } });
}
