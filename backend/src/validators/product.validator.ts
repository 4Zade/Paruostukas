import { body, validationResult} from "express-validator";
import { Request, Response, NextFunction } from "express";

class ProductValidator {
    public create = [
        body("title")
            .notEmpty()
            .withMessage("Prašome pateikti produkto pavadinimą.")
            .isLength({ min: 3 })
            .withMessage("Produkto pavadinimas turi tureti bent 3 simbolius.")
            .isLength({ max: 64 })
            .withMessage("Produkto pavadinimas turi tureti ne daugiau kaip 64 simbolius."),

        body("description")
            .notEmpty()
            .withMessage("Prašome pateikti produkto aprašymą.")
            .isLength({ min: 3 })
            .withMessage("Produkto aprašymas turi tureti bent 3 simbolius.")
            .isLength({ max: 256 })
            .withMessage("Produkto aprašymas turi tureti ne daugiau kaip 512 simbolių."),

        body('price')
            .notEmpty()
            .withMessage("Prašome pateikti produkto kainą.")
            .isLength({ min: 1 })
            .withMessage("Produkto kaina turi tureti bent 1 simbolius.")
            .isFloat()
            .withMessage("Produkto kaina turi buti skaiciaus."),

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

export default new ProductValidator();