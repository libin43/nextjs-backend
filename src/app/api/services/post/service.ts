import { PrismaClient, User } from "@prisma/client";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { ErrorHandler } from "@/utils/errorHandler";
import { CreatePostInput } from "./dto/createPostDto";

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



            console.log(post, 'data in user service')
            console.log(creatorId, 'creatorId')

            const newPost = await prisma.post.create({
                data: {
                   title: post.title,
                   content: post.content,
                   authorId: creatorId,
                   created_by_user_id: creatorId,
                   updated_by_user_id: creatorId,
                },
            });
            return newPost
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
}