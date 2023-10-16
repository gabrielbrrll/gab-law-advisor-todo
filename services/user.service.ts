import prisma from '../database/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function getAllUsers() {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    throw new Error('Error retrieving users');
  }
}

export async function createUser(username: string, password: string) {
  try {
    // Hash the password before saving it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save the user to the database with the hashed password
    return await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword
      }
    });
  } catch (error) {
    throw new Error('Error creating user');
  }
}

export async function loginUser(username: string, password: string): Promise<string | null> {
  // Find the user by their username
  const user = await prisma.user.findUnique({
    where: {
      username
    }
  });

  if (!user) {
    return null;
  }

  // Compare provided password with stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  // If passwords match, generate JWT token
  const userPayload = {
    id: user.id,
    username: user.username
  };

  const token = jwt.sign(userPayload, process.env.JWT_SECRET!, {
    expiresIn: '1h'
  });

  return token;
}
