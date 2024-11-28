import { body, validationResult} from "express-validator";
import { Request, Response, NextFunction } from "express";

class AuthValidator {
    public register = [
        body("username")
            .notEmpty()
            .withMessage("Prašome pateikti vartotojo vardą.")
            .matches(/^[A-Za-z0-9]+$/)
            .withMessage("Vartotojo vardas negali turiėti specialiųjų simbolių."),

        body("email")
            .isEmail()
            .withMessage("Neteisingas El.pašto formatas.")
            .notEmpty()
            .withMessage("Prašome pateikti El.paštą."),

        body("password")
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Slaptažodis turi atitikti nurodytus reikalavimus.")
            .notEmpty()
            .withMessage("Prašome pateikti slaptažodį."),

        body("repeatPassword")
        .notEmpty()
        .withMessage("Prašome pateikti slaptažodį.")
        .custom((value, { req }) => {
            console.log(value, req.body.password);
            if (value !== req.body.password) {
            throw new Error("Slaptažodžiai nesutampa.");
            }
            return true;
        }),

        (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
        },
    ]

    public login = [
        body("username")
            .notEmpty()
            .withMessage("Prašome pateikti vartotojo vardą."),

        body("password")
            .notEmpty()
            .withMessage("Prašome pateikti slaptažodį."),

        (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
        },
    ]
}

export default new AuthValidator();