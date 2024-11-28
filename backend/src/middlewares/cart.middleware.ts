import { Request, Response, NextFunction } from "express";
import { throwError } from "../middlewares/error.middleware";
import Cart from "../models/cart.schema";
import Product from "../models/product.schema";
import { UserProps } from "../models/user.schema";
import { CustomRequest } from "../../types/types";

class CartMiddleware {
    public async checkCartItems(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user as UserProps;

            const cart = await Cart.findOne({ email: user.email });

            if (cart && cart.items.length) {
                for (const item of [...cart.items]) {
                    const product = await Product.findById(item.productId);

                    if (!product) {
                        cart.items.splice(cart.items.indexOf(item), 1);
                    }
                }

                await cart.save();
            }

            next();
        }
        catch (err: unknown) {
            next(err);
        }
    }

    public async calculateCart(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const cart = req.cart;

            let total = 0;
            let count = 0;

            if (!cart || !cart.items.length) {
                res.status(200).json({
                    message: req.message ? req.message : "Krepšelis tuščias.",
                    cart: { items: [] },
                    total,
                    count
                })                
            }

            for(const item of cart.items) {
                const product = await Product.findById(item.productId);

                if(product) {
                    total += product.price * item.quantity;
                    count += item.quantity;
                }
            }

            res.status(200).json({
                message: req.message,
                cart,
                count,
                total
            });
            return;
        }
        catch (err: unknown) {
            next(err);
        }
    }
}

export default new CartMiddleware();