import { IsString, MinLength, MaxLength } from "class-validator";

export class CreatePostInput {
    @IsString()
    @MaxLength(50, { message: "Title name must be at most 50 characters" })
    title!: string;

    @IsString()
    @MinLength(5, { message: "Content must be at least 5 characters" })
    content!: string;
}
