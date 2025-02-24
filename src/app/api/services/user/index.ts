import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export class UserService {
  async createUser(data: User) {
    try {
      // Ensure timestamps are added dynamically
    //   data.createdAt = new Date().toISOString();
    //   data.updatedAt = new Date().toISOString();

      // Insert user into the database
      const newUser = await prisma.user.create({
        data,
      });

      return newUser;
    } catch (error) {
        console.log(error)
    //   throw new Error(`Failed to create user: ${error.message}`);
    }
  }
}