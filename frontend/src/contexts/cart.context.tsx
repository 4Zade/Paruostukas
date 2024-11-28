import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { CartProps } from "../types/cart.types";

interface CartContextProps {
    cart: CartProps;
    total: number;

    fetchCart: () => void;
    addQuantity: (id: string) => void;
    removeQuantity: (id: string) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
}

const defaultContextValue: CartContextProps = {
    cart: { email: '', items: []},
    total: 0,

    fetchCart: () => {},
    addQuantity: () => {},
    removeQuantity: () => {},
    removeItem: () => {},
    clearCart: () => {},
};

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<CartContextProps>(defaultContextValue);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartContextProps['cart']>({ email: '',items: [] });
    const [total, setTotal] = useState<number>(0);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.get("http://localhost:7000/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            setCart(res.data.cart);
            setTotal(res.data.total);
            return;
        }
        catch (err: unknown) {
            console.error(err);
            return null;
        }
    }

    const removeItem = async (id: string) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`http://localhost:7000/api/cart/${id}/all`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            fetchCart();
        }
        catch (err: unknown) {
            console.error(err);
        }
    }

    const addQuantity = async (id: string) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.post(`http://localhost:7000/api/cart/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            fetchCart();
        }
        catch (err: unknown) {
            console.error(err);
        }
    }

    const removeQuantity = async (id: string) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`http://localhost:7000/api/cart/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            fetchCart();
        }
        catch (err: unknown) {
            console.error(err);
        }
    }

    const clearCart = async () => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`http://localhost:7000/api/cart`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            fetchCart();
        }
        catch (err: unknown) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ cart, total, fetchCart, addQuantity, removeQuantity, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

const useCart = () => useContext(CartContext);

// eslint-disable-next-line react-refresh/only-export-components
export { CartProvider, useCart };
