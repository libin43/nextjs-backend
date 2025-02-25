
import { CreateUserInput, UserRole } from "@/app/api/services/user/dto/createUserDto";
import { UpdateUserInput } from "@/app/api/services/user/dto/updateUserDto";
import { LoginInput } from "@/app/api/services/auth/dto/loginUser.Dto";
import { AuthService } from "@/app/api/services/auth/service";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { PostService } from "@/app/api/services/post/service";
import { CreatePostInput } from "@/app/api/services/post/dto/createPostDto";
import { ErrorHandler } from "@/utils/errorHandler";
import { authorizeRoles } from "@/middlewares/roleMiddleware";

const postService = new PostService()
const authService = new AuthService()

export const postResolvers = {
    Query: {
        // hello: () => "Hello World!",
        // getUser: async (_: any, { id }: { id: string }) => {
        //     try {
        //         return userService.getUserById(id)
        //     } catch (error) {
        //         return error
        //     }
        // },

        // getAllUsers: async (_: any, { search, role, page, limit }: {
        //     search?: string;
        //     role?: UserRole;
        //     page: number;
        //     limit: number
        // }) => {
        //     try {

        //         const where: any = {};

        //         //search filter
        //         if (search) {
        //             where.OR = [
        //                 { fname: { contains: search, mode: "insensitive" } },
        //                 { lname: { contains: search, mode: "insensitive" } },
        //                 // { email: { contains: search, mode: "insensitive" } }
        //             ];
        //         }
        //         if (role) {
        //             where.role = role;
        //         }

        //         return userService.getAllUsers(page, limit, where);
        //     } catch (error) {
        //         return error
        //     }
        // }
    },



    Mutation: {

        createPost: async (_: any, { input }: { input: CreatePostInput }, { user }: any) => {
            try {
                if (!user) ErrorHandler.handleUnauthorizedError()
                return postService.createPost(input, user.id)
            } catch (error) {
                return error
            }
        },

        updatePost: authorizeRoles([UserRole.ADMIN, UserRole.USER])(
            async (_: any, { input }: { input: UpdateUserInput }, { user }: any) => {
            try {
                // console.log(input, 'input')
                if (!user) ErrorHandler.handleUnauthorizedError()
                return postService.updatePost(input, user.id, user.role)
            } catch (error) {
                return error
            }
        })
    },
};

// export default sheets;