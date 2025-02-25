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
                throw { type: "VALIDATION_ERROR", errors: formattedErrors };
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

                throw { type: "VALIDATION_ERROR", errors: formattedErrors };
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
            });

            console.log(updatedPost, 'updated post')

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

}