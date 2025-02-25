
import { UserService } from "@/app/api/services/user";
import { CreateUserInputType } from "../../../../../../types/graphql";
import { CreateUserInput, UserRole } from "@/app/api/services/user/dto/createUserDto";
import { UpdateUserInput } from "@/app/api/services/user/dto/updateUserDto";
import { LoginInput } from "@/app/api/services/auth/dto/loginUser.Dto";
import { AuthService } from "@/app/api/services/auth/service";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

const userService = new UserService()
const authService = new AuthService()

export const userResolvers = {
    Query: {
        hello: () => "Hello World!",
        getUser: async (_: any, { id }: { id: string }) => {
            try {
                return userService.getUserById(id)
            } catch (error) {
                return error
            }
        },

        getAllUsers: async (_: any, { search, role, page, limit }: {
            search?: string;
            role?: UserRole;
            page: number;
            limit: number
        }) => {
            try {

                const where: any = {};

                //search filter
                if (search) {
                    where.OR = [
                        { fname: { contains: search, mode: "insensitive" } },
                        { lname: { contains: search, mode: "insensitive" } },
                        // { email: { contains: search, mode: "insensitive" } }
                    ];
                }
                if (role) {
                    where.role = role;
                }

                return userService.getAllUsers(page, limit, where);
            } catch (error) {
                return error
            }
        }
    },



    Mutation: {
        login: async(_: any, { input }: { input: LoginInput }, context: any) => {
            try {

                console.log(context, 'context')
                return authService.login(input)
            } catch (error) {
                return error
            }
        },

        createUser: async (_: any, { input }: { input: CreateUserInput }) => {
            try {
                // console.log(input, 'input')
                const newUser = await userService.createUser(input);
                console.log(newUser, 'created in db')
                return newUser;
            } catch (error) {
                return error
            }
        },

        updateUser: async (_: any, { input }: { input: UpdateUserInput }) => {
            try {
                // console.log(input, 'input')
                return userService.updateUser(input);
            } catch (error) {
                return error
            }
        },
    },
};

// export default sheets;