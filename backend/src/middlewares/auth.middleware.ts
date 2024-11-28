import { Request, Response, NextFunction } from "express";
import User, { UserProps } from "../models/user.schema";
import TokenService from "../services/token.service";
import { throwError } from "./error.middleware";

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            auth: false,
            message: "Vartotojas neprisijunges."
        })
        return;
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "null") {
        res.status(401).json({
            auth: false,
            message: "Vartotojas neprisijungęs."
        });
        return;
    }

    try {
        const decoded = TokenService.validateToken(token) as UserProps;

        const user = await User.findOne({ email: decoded.email });

        req.user = user;

        next();
    }
    catch (err: unknown) {
        next(err);
    }
}

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            auth: false,
            message: "Vartotojas neprisijunges."
        })
        return;
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "null") {
        res.status(401).json({
            auth: false,
            message: "Vartotojas neprisijungęs."
        });
        return;
    }

    try {
        const decoded = TokenService.validateToken(token) as UserProps;

        const user = await User.findOne({ email: decoded.email });

        if (user.role !== "ADMIN") {
            res.status(401).json({
                message: "Vartotojas nėra administratorius"
            });
            return
        }

        req.user = user;

        next();
    }
    catch (err: unknown) {
        next(err);
    }
}

export default requireAuth;