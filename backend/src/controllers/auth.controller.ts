import { Request, Response, NextFunction } from "express";
import TokenService from "../services/token.service";
import { throwError } from "../middlewares/error.middleware";
import User from "../models/user.schema";

class AuthController {
    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { username, email, password } = req.body;

        try {
            const user = new User({
                username: username.toLowerCase(),
                email,
                password,
            });

            await user.save();

            const token = TokenService.generateToken(user.email);

            res.status(200).json({ 
                message: "Vartotojas sukurtas!",
                token,
                user
            });
            return
        }
        catch (err: unknown) {
            next(err)
        }
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { username, password, remember } = req.body;
        
        try {
            const user = await User.findOne({ username: username.toLowerCase() }) || await User.findOne({ email: username });

            if (!user) {
                res.status(404).json({
                    errors: [
                        {
                            path: "global",
                            msg: "Vartotojas nerastas."
                        }
                    ]
                })
                throwError("Vartotojas nerastas.", 404);
                return;
            }

            const isPasswordValid = await user.verifyPassword(password);

            if (!isPasswordValid) {
                res.status(401).json({
                    errors: [
                        {
                            path: "password",
                            msg: "Slaptažodis neteisingas."
                        }
                    ]
                })
                return;
            }

            const token = TokenService.generateToken(user.email, remember);

            res.status(200).json({
                message: "Vartotojas sėkmingai prisijungė.",
                token,
                user
            });
            return;
        }
        catch (err: unknown) {
            next(err);
        }
    }
}

export default new AuthController();