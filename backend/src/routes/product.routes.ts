import express from "express";
import ProductController from "../controllers/product.controller";
import ProductValidator from "../validators/product.validator";
import { uploadMiddleware, imageHandler } from "../middlewares/upload.middleware";

import requireAuth, { requireAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.get(
    "/", 
    ProductController.getAll
);

router.get(
    "/:id", 
    requireAuth,
    ProductController.getOne
);

router.post(
    "/",
    requireAdmin,
    uploadMiddleware,
    imageHandler as any,
    ProductValidator.create,
    ProductController.create
);

router.post(
    "/favorite/:id",
    requireAuth,
    ProductController.favorite
);

router.put(
    "/:id",
    requireAdmin,
    uploadMiddleware,
    imageHandler as any,
    ProductController.update
);

router.delete(
    "/:id",
    requireAdmin,
    ProductController.delete
);

export default router;