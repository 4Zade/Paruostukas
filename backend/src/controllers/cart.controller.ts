import { Request, Response, NextFunction } from 'express';
import TokenService, { TokenProps } from '../services/token.service';
import Cart from '../models/cart.schema';
import Product from '../models/product.schema';
import { throwError } from '../middlewares/error.middleware';
import { UserProps } from '../models/user.schema';
import { CustomRequest } from '../../types/types';

class CartController {
    public async getCart(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user as UserProps;

            const cart = await Cart.findOne({ email: user.email });

            if (!cart || cart.items.length === 0) {
                req.message = "Krepšelis tuščias.";
                next();
            }

            req.message = "Krepšelis gautas!";
            req.cart = cart;
            
            next();
        }
        catch (err: unknown) {
            next(err);
        }
    }

    public async addToCart(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        try {
            const user = req.user as UserProps;

            let cart = await Cart.findOne({ email: user.email });  

            if (!cart) {
                cart = new Cart({
                    email: user.email,
                    items: []
                });
            }

            const productInCart = cart.items.find(item => item.productId == id);

            if (!productInCart) {
                const product = await Product.findOne({ _id: id });

                if (!product) {
                    throwError("Produktas nerastas.", 404);
                    return;
                }

                cart.items.push({
                    productId: id,
                    quantity: 1
                });
            }
            else {
                productInCart.quantity++;
            }

            await cart.save();

            req.message = "Produktas sėkmingai pridetas i krepselį!";
            req.cart = cart;
            
            next();
        }
        catch (err: unknown) {
            next(err);
        }
    }

    public async removeOneFromCart(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;

        try {
            const user = req.user as UserProps;

            const cart = await Cart.findOne({ email: user.email });

            if (!cart) {
                throwError("Krepšelis nerastas.", 404);
                return;
            }

            const productInCart = cart.items.find(item => item.productId === id);

            if (!productInCart) {
                throwError("Produktas nerastas.", 404);
                return;
            }
            
            productInCart.quantity -= 1;

            await cart.save();

            req.message = "Produktas sėkmingai pašalintas is krepselio!";
            req.cart = cart;

            next();
        }
        catch (err: unknown) {
            next(err);
        }
    }
    
    public async removeFromCart(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;

        try {
            const user = req.user as UserProps;

            const cart = await Cart.findOne({ email: user.email });

            if (!cart) {
                throwError("Krepšelis nerastas.", 404);
                return;
            }

            const productInCart = cart.items.find(item => item.productId === id);

            if (!productInCart) {
                throwError("Produktas nerastas.", 404);
                return;
            }

            const index = cart.items.indexOf(productInCart);
            cart.items.splice(index, 1);

            await cart.save();

            req.message = "Produktas sėkmingai pašalintas is krepselio!";
            req.cart = cart;

            next();
        }
        catch (err: unknown) {
            next(err);
        }
    }

    public async clearCart(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user as UserProps;

            await Cart.findOneAndDelete({ email: user.email });

            req.message = "Krepšelis sėkmingai išvalytas!";

            next();
        }
        catch (err: unknown) {
            next(err);
        }
    }
}

export default new CartController();