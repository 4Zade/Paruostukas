export interface CartProps {
    email: string;
    items: CartItemProps[];
}

export interface CartItemProps {
    _id: string;
    productId: string;
    quantity: number;
}