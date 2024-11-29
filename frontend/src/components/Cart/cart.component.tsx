import axios from "axios";
import { Icon } from "@iconify/react";
import ProductProps from "../../types/product.types";
import { useEffect, useState } from "react";

interface CartItemProps {
    id: string;
    quantity: number;
    removeQuantity: (id: string) => void;
    addQuantity: (id: string) => void;
    removeItem: (id: string) => void;
}

export default function CartItem({ id, quantity, removeQuantity, addQuantity, removeItem }: CartItemProps) {
    const [item, setItem] = useState<ProductProps | null>(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await axios.get(`http://localhost:7000/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });
                setItem(res.data.product);
            }
            catch (err: unknown) {
                console.error(err);
            }
        }
        fetchItem();
    }, [id, quantity]);

    useEffect(() => {
        if (quantity <= 0) {
            removeItem(id);
        }
    }, [quantity]);

    return (
        <div className="flex items-center bg-white shadow-md rounded-lg p-2 pr-4 space-x-4 relative">
            <section className="w-16 h-16 flex-shrink-0">
                <img
                    src={item && item.image ? `http://localhost:7000${item.image}` : "https://via.placeholder.com/300x300"}
                    alt="Product"
                    className="w-full h-full object-cover rounded-md"
                />
            </section>
    
            <section className="flex flex-col grow min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {item && item.title}
                </h3>
                <span className="text-sm text-gray-500">{item && item.price.toFixed(2)}€</span>
            </section>
    
            {/* Quantity Controls */}
            <section className="flex items-center space-x-2">
                <button className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-sm" onClick={() => removeQuantity(id)}>
                    <Icon icon="tabler:minus" className="w-3 h-3" />
                </button>
                <span className="text-gray-700 text-sm">{quantity}</span>
                <button className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-sm" onClick={() => addQuantity(id)}>
                    <Icon icon="tabler:plus" className="w-3 h-3" />
                </button>
            </section>

            <button className="w-6 h-6 rounded-full bg-red-500 grid place-items-center absolute -top-2 -right-2" onClick={() => removeItem(id)}>
                <Icon icon="tabler:x" className="w-4 h-4 text-white" />
            </button>
        </div>
    )
}