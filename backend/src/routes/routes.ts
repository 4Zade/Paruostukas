import express from "express";

import AuthRoutes from "./auth.routes";
import ProductRoutes from "./product.routes";
import CartRoutes from "./cart.routes";
import UserRoutes from "./user.routes";
import TransactionRoutes from './transaction.routes'

const router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/products", ProductRoutes);
router.use("/cart", CartRoutes);
router.use("/users", UserRoutes);
router.use("/transactions", TransactionRoutes)

export default router;