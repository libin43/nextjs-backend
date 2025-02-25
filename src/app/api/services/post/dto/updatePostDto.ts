import { IsString, MinLength, MaxLength, IsOptional, IsNotEmpty } from "class-validator";

export class UpdatePostInput {
    @IsString()
    @IsNotEmpty({ message: "User ID is required" })
    id!: string;

    @IsOptional()
    @MaxLength(50, { message: "Title name must be at most 50 characters" })
    title?: string;

    @IsOptional()
    @MinLength(5, { message: "Content must be at least 5 characters" })
    content?: string;
}
