import jwt, { Secret, SignOptions } from "jsonwebtoken";

export class JwtService {
    static generateToken(payload: object, expiresIn: string = "7d"): string {
        console.log(process.env.JWT_SECRET)
        const secret: Secret| undefined = process.env.JWT_SECRET
        if(!secret){
            console.log(secret)
            throw new Error("JWT_SECRET is not defined");
        }
        const options: SignOptions = { expiresIn: expiresIn as SignOptions["expiresIn"] }
        return jwt.sign(payload, secret, options)
    }

    static verifyToken(token: string): any {
        try {
            return jwt.verify(token, process.env.JWT_SECRET!);
        } catch (error) {
            return null;
        }
    }
}
