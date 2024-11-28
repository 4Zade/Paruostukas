import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface TokenProps {
    email: string
    iat?: number
    exp?: number
}

class TokenService {
    generateToken(email: string, remember?: boolean) {
        return jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {expiresIn: remember ? "7d" : "30min"});
    }

    validateToken(token: string) {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    }
}

export default new TokenService();