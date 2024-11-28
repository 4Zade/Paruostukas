import mongoose from "mongoose";

export interface CartItemProps {
    productId: string;
    quantity: number;
}

export const cartItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
});

export interface CartProps {
    email: string;
    items: CartItemProps[]
}

const cartSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    items: {
        type: [cartItemSchema],
        required: true,
    }
}, {
    timestamps: true
})

export default mongoose.model("Cart", cartSchema);

