import { PrismaClient, User, UserRole } from "@prisma/client";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { ErrorHandler } from "@/utils/errorHandler";
import { CreatePostInput } from "./dto/createPostDto";
import { UpdatePostInput } from "./dto/updatePostDto";

const prisma = new PrismaClient();

export class PostService {


    async createPost(post: CreatePostInput, creatorId: string) {
        try {

            const postData = plainToInstance(CreatePostInput, post)
            const validationResult = await validate(postData);
            if (validationResult.length > 0) {
                const formattedErrors = validationResult.map(res => ({
                    property: res.property,
                    messages: Object.values(res.constraints || {})
                }));
                throw { type: "VALIDATION_ERROR", errors: formattedErrors }
            }

            const newPost = await prisma.post.create({
                data: {
                    title: post.title,
                    content: post.content,
                    authorId: creatorId,
                    createdById: creatorId,
                    updatedById: creatorId,
                },
            })
            return newPost
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


    async updatePost(postData: UpdatePostInput, modifierId: string, modifierRole: UserRole) {
        try {
            const updatedPostData = plainToInstance(UpdatePostInput, postData);

            const validationResult = await validate(updatedPostData);
            if (validationResult.length > 0) {
                const formattedErrors = validationResult.map(res => ({
                    property: res.property,
                    messages: Object.values(res.constraints || {})
                }));

                throw { type: "VALIDATION_ERROR", errors: formattedErrors }
            }

            const existingPost = await prisma.post.findUnique({ where: { id: postData.id } });
            if (!existingPost) {
                throw new Error('POST_NOT_FOUND')
            }

            if (existingPost?.authorId !== modifierId && modifierRole !== UserRole.ADMIN) {
                console.log('haaaaaaaaaaaaaaaaaaaaaaaa')
                throw new Error('FORBIDDEN_POST')
            }

            const updatedPost = await prisma.post.update({
                where: {
                    id: postData.id
                },
                data: {
                    title: postData.title,
                    content: postData.content,
                    updatedById: modifierId,
                },
            })

            return updatedPost;

        } catch (error: any) {

            if (error.type === "VALIDATION_ERROR") {
                ErrorHandler.handleValidationError(error)
            }

            if (error.code === "P2002") {
                ErrorHandler.handlePrismaUniqueConstraintError(error)
            }

            if (error.message === "POST_NOT_FOUND") {
                ErrorHandler.handleNotFoundError("POST")
            }

            if (error.message === "FORBIDDEN_POST") {
                ErrorHandler.handleForbiddenError("POST")
            }

            ErrorHandler.internalServerError()
        }
    }

    async deletePost(id: string, modifierId: string, modifierRole: UserRole) {

        try {
            const existingPost = await prisma.post.findUnique({
                where: {
                    id,
                },
                select: {
                    authorId: true,
                    updatedAt: true,
                }
            })

            if (!existingPost) {
                throw new Error('POST_NOT_FOUND')
            }

            if (existingPost?.authorId !== modifierId && modifierRole !== UserRole.ADMIN) {
                throw new Error('FORBIDDEN_POST')
            }

            return prisma.post.delete({
                where: {
                    id,
                    updatedAt: existingPost?.updatedAt
                },
                select: {
                    id: true,
                }
            })
        } catch (error: any) {
            if (error.message === "POST_NOT_FOUND") {
                ErrorHandler.handleNotFoundError("POST")
            }
            if (error.message === "FORBIDDEN_POST") {
                ErrorHandler.handleForbiddenError("POST")
            }
            ErrorHandler.internalServerError()
        }
    }

    async getPostById(id: string) {
        try {
            const post = await prisma.post.findUnique({
                where: {
                    id
                },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    author: {
                        select: {
                            id: true,
                            fname: true,
                            lname: true,
                        }
                    }
                }
            })
            if (!post) {
                throw new Error('POST_NOT_FOUND')
            }
            return post
        } catch (error: any) {
            if (error.message === "POST_NOT_FOUND") {
                ErrorHandler.handleNotFoundError("POST")
            }
            ErrorHandler.internalServerError()
        }
    }

    async getAllPosts(page: number, limit: number, where?: any) {
        try {
            const totalCount = await prisma.post.count({ where })
            if (totalCount == 0) {
                return {
                    totalCount,
                    data: []
                }
            }

            console.log(totalCount, 'total count')
            const data = await prisma.post.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    title: true,
                    content: true,
                    author: {
                        select: {
                            id: true,
                            fname: true,
                            lname: true,
                        }
                    }
                }
            })

            if (data.length > 0) {
                return {
                    totalCount,
                    data
                }
            }
        } catch (error) {
            console.log(error)
            ErrorHandler.internalServerError()
        }
    }

}