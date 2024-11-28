import mongoose from "mongoose";
import { cartItemSchema, CartItemProps } from "./cart.schema";

export interface TransactionProps {
    email: string;
    items: CartItemProps[];
}

const transactionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    items: {
        type: [cartItemSchema],
        required: true,
    },
    total: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model("Transaction", transactionSchema);