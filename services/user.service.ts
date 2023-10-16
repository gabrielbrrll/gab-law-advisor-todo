import prisma from "../database/db";

export async function getAllUsers() {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    throw new Error("Error retrieving users");
  }
}
