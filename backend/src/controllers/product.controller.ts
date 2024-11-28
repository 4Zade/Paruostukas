import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { throwError } from "../middlewares/error.middleware";
import Product from "../models/product.schema";
import { UserProps } from "../models/user.schema";

class ProductController {
    public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { limit = 20, page = 1 } = req.query;
    
        try {
            const parsedLimit = Number(limit);
            const parsedPage = Number(page);
    
            if (isNaN(parsedLimit) || isNaN(parsedPage)) {
                res.status(400).json({ message: "Invalid limit or page value." });
                return;
            }
    
            const products = await Product.find()
                .limit(parsedLimit)
                .skip((parsedPage - 1) * parsedLimit);
    
            const totalProducts = await Product.countDocuments();
    
            res.status(200).json({
                message: "Produktai gauti!",
                products,
                pagination: {
                    totalProducts,
                    totalPages: Math.ceil(totalProducts / parsedLimit),
                    currentPage: parsedPage,
                    limit: parsedLimit,
                },
            });
            return;
        } catch (err: unknown) {
            next(err);
        }
    }
    

    public async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;

        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throwError("Invalid product ID.", 400);
                return;
            }

            const product = await Product.findById(id);

            if (!product) {
                throwError("Produktas nerastas.", 404);
                return;
            }

            res.status(200).json({
                message: "Produktas gautas!",
                product
            });
            return;
        }
        catch (err: unknown) {
            next(err);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { title, description, imageUrl, price } = req.body;

        try {
            const product = new Product({
                title,
                description,
                image: imageUrl,
                price
            });

            await product.save();

            res.status(200).json({
                message: "Produktas sukurtas!",
                product
            });
            return;
        }
        catch (err: unknown) {
            next(err);
        }
    }

    public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        const fieldsToUpdate = req.body;

        try {
            await Product.updateOne(
                { _id: id },
                { $set: fieldsToUpdate }
            )

            if (fieldsToUpdate.imageUrl) {
                await Product.updateOne(
                    { _id: id },
                    { $set: { image: fieldsToUpdate.imageUrl } }
                )
            }

            const updated = await Product.findById(id);

            res.status(200).json({
                message: "Produktas atnaujintas!",
                updated,
            });
            return;
        }
        catch (err: unknown) {
            next(err);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;

        try {
            await Product.deleteOne({ _id: id });

            const deleted = await Product.findById(id);

            res.status(200).json({
                message: "Produktas istrintas!",
                deleted,
            });
            return;
        }
        catch (err: unknown) {
            next(err);
        }
    }

    public async favorite(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;

        try {
            const user = req.user as UserProps;

            const product = await Product.findById(id);

            if (!product) {
                throwError("Produktas nerastas.", 404);
                return;
            }
            
            let action = "removed"

            if (product.favorites.includes(user.username)) {
                product.favorites.splice(product.favorites.indexOf(user.username), 1);       
            }
            else {
                product.favorites.push(user.username);
                action = "added";
            }

            await product.save();

            res.status(200).json({
                message: "Produktas pasirinktas kaip mėgstamiausias!",
                action,
                favorited: product
            });
            return;
        }
        catch (err: unknown) {
            next(err);
        }
    }
}

export default new ProductController();