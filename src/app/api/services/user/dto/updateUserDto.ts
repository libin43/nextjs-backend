import { IsOptional, IsString, IsNotEmpty } from "class-validator";
import { UserRole } from "./createUserDto";

export class UpdateUserInput {
    @IsString()
    @IsNotEmpty({ message: "User ID is required" })
    id!: string;

    @IsOptional()
    fname?: string;

    @IsOptional()
    lname?: string;

    @IsOptional()
    mobile?: string;

    @IsOptional()
    email?: string;

    @IsOptional()
    password?: string;

    @IsOptional()
    role?: UserRole;
}
