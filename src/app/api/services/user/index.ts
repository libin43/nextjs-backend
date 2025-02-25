import { PrismaClient, User } from "@prisma/client";
import { CreateUserInputType } from "../../../../../types/graphql";
import { GraphQLError } from "graphql";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateUserInput } from "./dto/createUserDto";

const prisma = new PrismaClient();

export class UserService {
    async createUser(user: CreateUserInputType) {
        try {

            const userData = plainToInstance(CreateUserInput, user);
            const errors = await validate(userData);
            console.log(errors)

            if (errors.length > 0) {
                // Format validation errors
                const formattedErrors = errors.map(err => ({
                    property: err.property,
                    messages: Object.values(err.constraints || {}) // Extract all constraint messages
                }));

                throw { type: "VALIDATION_ERROR", errors: formattedErrors };
            }


            console.log(user, 'data in user service')

            if (!user) {
                throw new Error('No user')
            }
            const newUser = await prisma.user.create({
                data: {
                    fname: user.fname,
                    lname: user.lname,
                    email: user.email,
                    mobile: user.mobile,
                    password: user.password,
                    role: user.role,
                },
            });
            return newUser
        } catch (error: any) {
            console.error(error.message, 'error in prisma')
            // throw new Error(error.code)

            if (error.type === "VALIDATION_ERROR") {
                throw new GraphQLError("Validation failed", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        http: { status: 400 },
                        errors: error.errors
                    }
                });
            }

            if (error.code === "P2002") {
                throw new GraphQLError(
                    `User with this ${error.meta?.target?.join(", ")} already exists`,
                    {
                        extensions: {
                            code: "CONFLICT",
                            http: { status: 409 },
                        },
                    }
                );
            }

            throw new GraphQLError("Internal Server Error", {
                extensions: { code: "INTERNAL_SERVER_ERROR", http: { status: 500 } },
            });
        }
    }
}