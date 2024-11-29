import { body, validationResult} from "express-validator";
import { Request, Response, NextFunction } from "express";

class TransactionValidator {
    public create = [
        body("name")
            .notEmpty()
            .withMessage("Prašome pateikti varda ir pavardę.")
            .isLength({ max: 128 })
            .withMessage("Vardas ir pavardė turi sudaryti ne daugiau kaip 128 simbolius."),

        body("card")
            .notEmpty()
            .withMessage("Prašome pateikti kortelės numerį.")
            .isLength({ min: 16, max: 16 })
            .withMessage("Korteles numeris turi būti sudarytas iš 16 skaitmenų."),

        body('cvv')
            .notEmpty()
            .withMessage("Prašome pateikti kortelės CVV.")
            .isLength({ min: 3, max: 3 })
            .withMessage("Kortelės CVV privalo būti sudaryta iš 3 skaitmenų.")
            .isFloat()
            .withMessage("CVV privalo būti skaičius."),

            body('expires')
            .notEmpty()
            .withMessage("Galiojimo pabaigos data privaloma.")
            .matches(/^\d{2}\/(0[1-9]|1[0-2])$/
)
            .withMessage("Galiojimo pabaigos data turi būti formatu YY/MM.")
            .custom((value) => {
                const [year, month] = value.split('/').map(Number);
                const now = new Date();
                const currentYear = Number(now.getFullYear().toString().slice(-2));
                const currentMonth = now.getMonth() + 1;

                console.log(year, currentYear, month, currentMonth);

                if (year < currentYear || (year === currentYear && month < currentMonth)) {
                    throw new Error("Galiojimo pabaigos data jau praėjo.");
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
}

export default new TransactionValidator();