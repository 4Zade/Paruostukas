import express from 'express';

import UserController from '../controllers/user.controller';
import requireAuth from '../middlewares/auth.middleware';

const router = express.Router();

router.get(
    "/",
    requireAuth,
    UserController.getAll
)

router.delete(
    "/",
    requireAuth,
    UserController.deleteAccount
);

export default router;