import { PrismaClient, User } from "@prisma/client";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateUserInput } from "./dto/createUserDto";
import { UpdateUserInput } from "./dto/updateUserDto";
import { ErrorHandler } from "@/utils/errorHandler";
import { BcryptService } from "@/lib/bcryptService";

const prisma = new PrismaClient();

export class UserService {
    async createUser(user: CreateUserInput) {
        try {

            const userData = plainToInstance(CreateUserInput, user)
            const validationResult = await validate(userData);
            if (validationResult.length > 0) {
                const formattedErrors = validationResult.map(res => ({
                    property: res.property,
                    messages: Object.values(res.constraints || {})
                }));

                throw { type: "VALIDATION_ERROR", errors: formattedErrors };
            }


            const hashPass = await BcryptService.hashPassword(user.password)

            console.log(user, 'data in user service')

            const newUser = await prisma.user.create({
                data: {
                    fname: user.fname,
                    lname: user.lname,
                    email: user.email,
                    mobile: user.mobile,
                    password: hashPass,
                    role: user.role,
                },
            });
            return newUser
        } catch (error: any) {
            console.error(error.message, 'error in prisma')

            if (error.type === "VALIDATION_ERROR") {
                ErrorHandler.handleValidationError(error)
            }

            if (error.code === "P2002") {
                ErrorHandler.handlePrismaUniqueConstraintError(error)
            }

            ErrorHandler.internalServerError()
        }
    }


    async updateUser(userData: UpdateUserInput) {
        try {
            const updatedUserData = plainToInstance(UpdateUserInput, userData);

            const validationResult = await validate(updatedUserData);
            if (validationResult.length > 0) {
                const formattedErrors = validationResult.map(res => ({
                    property: res.property,
                    messages: Object.values(res.constraints || {})
                }));

                throw { type: "VALIDATION_ERROR", errors: formattedErrors };
            }

            const existingUser = await prisma.user.findUnique({ where: { id: userData.id } });
            if (!existingUser) {
                ErrorHandler.handleNotFoundError('User')
            }

            const updatedUser = await prisma.user.update({
                where: { id: userData.id },
                data: {
                    fname: userData.fname,
                    lname: userData.lname,
                    email: userData.email,
                    mobile: userData.mobile,
                    password: userData.password,
                    role: userData.role,
                },
            });

            return updatedUser;
        } catch (error: any) {

            if (error.type === "VALIDATION_ERROR") {
                ErrorHandler.handleValidationError(error)
            }

            if (error.code === "P2002") {
                ErrorHandler.handlePrismaUniqueConstraintError(error)
            }

            ErrorHandler.internalServerError()
        }
    }

    async getUserById(id: string) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id
                },
                select: {
                    id: true,
                    fname: true,
                    lname: true,
                    email: true,
                    mobile: true,
                    role: true,
                    password: true

                }
            })
            if (!user) {
                ErrorHandler.handleNotFoundError('User')
            }
            return user
        } catch (error) {
            ErrorHandler.internalServerError()
        }
    }

    async getAllUsers(page: number, limit: number, where?: any) {

        try {
            const totalCount = await prisma.user.count({ where })
            if (totalCount == 0) {
                return {
                    totalCount,
                    data: []
                }
            }

            console.log(totalCount, 'total count')
            const data = await prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    fname: true,
                    lname: true,
                    email: true,
                    mobile: true,
                    role: true,
                    password: true
                }
            })

            if (data.length > 0) {
                return {
                    totalCount,
                    data
                }
            }
        } catch (error) {

            ErrorHandler.internalServerError()
        }

    }
}