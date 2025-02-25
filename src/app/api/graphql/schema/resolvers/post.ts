
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

export const postResolvers = {

    Query: {
        getPost: async (_: any, { id }: { id: string }, { user }: any) => {
            try {
                return postService.getPostById(id)
            } catch (error) {
                return error
            }
        },

        getAllPosts: async (_: any, { search, page, limit }: {
            search?: string;
            page: number;
            limit: number
        }) => {
            try {

                const where: any = {};

                //search
                if (search) {
                    where.OR = [
                        { title: { contains: search, mode: "insensitive" } },
                        // { category: { contains: search, mode: "insensitive" } },
                    ];
                }

                return postService.getAllPosts(page, limit, where);
            } catch (error) {
                return error
            }
        }
    },


    Mutation: {

        createPost: authorizeRoles([UserRole.ADMIN, UserRole.USER])(
            async (_: any, { input }: { input: CreatePostInput }, { user }: any) => {
                try {
                    return postService.createPost(input, user.id)
                } catch (error) {
                    return error
                }
            }),

        updatePost: authorizeRoles([UserRole.ADMIN, UserRole.USER])(
            async (_: any, { input }: { input: UpdateUserInput }, { user }: any) => {
                try {
                    // console.log(input, 'input')
                    // if (!user) ErrorHandler.handleUnauthorizedError()
                    return postService.updatePost(input, user.id, user.role)
                } catch (error) {
                    return error
                }
            }),

        deletePost: authorizeRoles([UserRole.ADMIN, UserRole.USER])(
            async (_: any, { id }: { id: string }, { user }: any) => {
                try {
                    return postService.deletePost(id, user.id, user.role)
                } catch (error) {
                    return error
                }
            })
    },
};