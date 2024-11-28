import express from "express";
import AuthController from "../controllers/auth.controller";
import AuthValidator from "../validators/auth.validator";

const router = express.Router();

router.post(
    "/register",
    AuthValidator.register,
    AuthController.register
);

router.post(
    "/login",
    AuthValidator.login,
    AuthController.login
);

export default router;