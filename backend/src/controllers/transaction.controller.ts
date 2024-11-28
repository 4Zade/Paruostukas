import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { UserProps } from "../models/user.schema";
import Transaction from "../models/transaction.schema";
import { throwError } from "../middlewares/error.middleware";

class TransactionController {
    public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user as UserProps;

            const transactions = await Transaction.find();

            if (user.role !== "ADMIN") {
                const filteredTransactions = transactions.filter(transaction => transaction.email === user.email);

                res.status(200).json({
                    message: "Transakcijos gautos!",
                    transactions: filteredTransactions
                });
                return;
            }

            res.status(200).json({
                message: "Transakcijos gautos!",
                transactions
            });
            return;
        }
        catch (err: unknown) {
            next(err);
        }
    }

    public async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;

        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throwError("Invalid transaction ID.", 400);
                res.status(400).json({
                    message: "Netinkamas transakcijos ID."
                });
                return;
            }

            const transaction = await Transaction.findById(id);

            if (!transaction) {
                throwError("Transakcija nerasta.", 404);
                res.status(404).json({
                    message: "Transakcija nerasta."
                });
                return;
            }

            res.status(200).json({
                message: "Transakcija gauta!",
                transaction
            });
            return;
        }
        catch (err: unknown) {
            next(err);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { items, email, name, total, count } = req.body;

        try {
            const transaction = await Transaction.create({
                email,
                name,
                items: items,
                total,
                count
            });

            await transaction.save();

            res.status(200).json({
                message: "Transakcija sukurtos!",
                transaction
            });
            return;
        }
        catch (err: unknown) {
            next(err);
        }       
    }
}

export default new TransactionController();