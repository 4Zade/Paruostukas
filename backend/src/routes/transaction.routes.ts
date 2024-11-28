import express from "express";
import TransactionValidator from "../validators/transaction.validator";
import TransactionController from "../controllers/transaction.controller";
import requireAuth, {requireAdmin} from "../middlewares/auth.middleware";

const router = express.Router();

router.get(
    "/",
    requireAuth,
    TransactionController.getAll
)

router.get(
    "/:id",
    requireAdmin,
    TransactionController.getOne,
)

router.post(
    "/",
    requireAuth,
    TransactionValidator.create,
    TransactionController.create
)

export default router;