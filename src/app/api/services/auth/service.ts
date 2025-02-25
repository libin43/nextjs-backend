import { PrismaClient, User } from "@prisma/client";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { ErrorHandler } from "@/utils/errorHandler";
import { LoginInput } from "./dto/loginUser.Dto";
import { BcryptService } from "@/lib/bcryptService";
import { JwtService } from "@/lib/jwtService";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export class AuthService {

    async login(user: LoginInput) {
        console.log(user, 'credentials')

        const userData = plainToInstance(LoginInput, user)
        const validationResult = await validate(userData);
        if (validationResult.length > 0) {
            const formattedErrors = validationResult.map(res => ({
                property: res.property,
                messages: Object.values(res.constraints || {})
            }));
            throw { type: "VALIDATION_ERROR", errors: formattedErrors };
        }

        const data = await prisma.user.findUnique({
            where: {
                mobile: userData.mobile,
            },
            select: {
                fname: true,
                lname: true,
                mobile: true,
                password: true,
                role: true,
            }
        })

        if(data){

            const isPassMatch = await BcryptService.comparePassword(user.password, data.password)
            if(!isPassMatch){
                console.log('Invalid credentials')
            }
            const payload = {
                fname: data.fname,
                lname: data.lname,
                mobile: data.mobile,
                role: data.role,
            }
            const token = JwtService.generateToken(payload)

            return{
                token: token,
                user: payload
            }

        }
        else {
            console.log('no user found.')
        }

    }
}