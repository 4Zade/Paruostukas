import express from "express";
import CartController from "../controllers/cart.controller";
import requireAuth from "../middlewares/auth.middleware";
import CartMiddleware from "../middlewares/cart.middleware";

const router = express.Router();

router.get(
    "/",
    requireAuth,
    CartMiddleware.checkCartItems,
    CartController.getCart,
    CartMiddleware.calculateCart,
);

router.post(
    "/:id",
    requireAuth,
    CartMiddleware.checkCartItems,
    CartController.addToCart,
    CartMiddleware.calculateCart,
);

router.delete(
    "/",
    requireAuth,
    CartMiddleware.checkCartItems,
    CartController.clearCart,
    CartMiddleware.calculateCart,
);

router.delete(
    "/:id/all",
    requireAuth,
    CartMiddleware.checkCartItems,
    CartController.removeFromCart,
    CartMiddleware.calculateCart,
)

router.delete(
    "/:id",
    requireAuth,
    CartMiddleware.checkCartItems,
    CartController.removeOneFromCart,
    CartMiddleware.calculateCart,
);

export default router;