import { Request } from "express";
import { CartProps } from "../src/models/cart.schema";

export interface CustomRequest extends Request {
    message?: string;
    cart?: CartProps;
}
