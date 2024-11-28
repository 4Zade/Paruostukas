import mongoose from "mongoose";

export interface ProductProps extends mongoose.Document {
    title: string;
    description: string;
    image?: string;
    price: number;
    favorites: string[];
}

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    favorites: {
        type: [String],
        default: [],
    }
}, {
    timestamps: true
})

export default mongoose.model("Product", productSchema);