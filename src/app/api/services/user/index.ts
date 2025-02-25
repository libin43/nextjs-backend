import { PrismaClient, User } from "@prisma/client";
import { CreateUserInputType } from "../../../../../types/graphql";
import { GraphQLError } from "graphql";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateUserInput } from "./dto/createUserDto";
import { UpdateUserInput } from "./dto/updateUserDto";

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


            console.log(user, 'data in user service')

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
                throw new GraphQLError("User not found", {
                    extensions: {
                        code: "NOT_FOUND",
                        http: { status: 404 },
                    },
                });
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
            console.error(error.message, "error in prisma");
    
            if (error.type === "VALIDATION_ERROR") {
                throw new GraphQLError("Validation failed", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        http: { status: 400 },
                        errors: error.errors,
                    },
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

    async getUserById(id: string){
        try{
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
            if(!user){

            }
            return user
        }catch(error){

        }
    }

    async getAllUsers(page: number, limit: number, where?: any){
        

        console.log(where, page, limit, 'in user service')
        try{
            const totalCount = await prisma.user.count({where})
            if(totalCount==0){
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
                    // id: true,
                    fname: true,
                    lname: true,
                    email: true,
                    mobile: true,
                    role: true,
                    password: true
                }
            })

            console.log(data, 'its data')
    
            if(data.length>0){
                return{
                    totalCount,
                    data
                }
            }
        } catch(error){
        
        }
        
    }
}