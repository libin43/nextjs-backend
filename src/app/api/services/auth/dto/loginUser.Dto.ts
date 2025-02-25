import { IsNotEmpty, IsString, Matches } from "class-validator";

export class LoginInput {

    @IsNotEmpty()
    @IsString()
    @Matches(/^\d+$/, { message: "Mobile must contain only numbers" })
    mobile!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}
