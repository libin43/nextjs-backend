import { PrismaClient, User } from "@prisma/client";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { ErrorHandler } from "@/utils/errorHandler";

const prisma = new PrismaClient();

export class PostService {

}