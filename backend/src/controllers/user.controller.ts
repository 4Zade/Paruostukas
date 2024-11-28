import { Request, Response, NextFunction } from 'express';
import User, { UserProps } from "../models/user.schema";
import Product from "../models/product.schema";
import Cart from "../models/cart.schema";


class UserController {
    public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await User.find();
            
            res.status(200).json({
                message: "Vartotojai gauti!",
                users
            });
        }
        catch (err: unknown) {
            next(err);
        }
    }
    public async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user as UserProps;

            const products = await Product.find();

            console.log(user);

            if (products.length) {
                for (const product of products) {
                    if (product.favorites.includes(user.username)) {
                        product.favorites.splice(product.favorites.indexOf(user.username), 1);
                        
                        await product.save();
                    }
                }
            }

            await Cart.deleteOne({ email: user.email });
            await User.deleteOne({ email: user.email });

            res.status(200).json({
                message: "Vartotojas istrintas!"
            });
        }
        catch (err: unknown) {
            next(err);
        }
    }
}

export default new UserController();