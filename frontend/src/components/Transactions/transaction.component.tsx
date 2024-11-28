import axios from "axios";
import { Icon } from "@iconify/react";
import ProductProps from "../../types/product.types";
import { useEffect, useState } from "react";
import { TransactionProps } from "../../pages/transactions.page";


export default function TransactionItem({ transaction }: { transaction: TransactionProps }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full h-min flex flex-col items-center justify-center shadow-lg px-4 py-2 rounded-2xl cursor-pointer select-none" onClick={() => setOpen(!open)}>
            <h1 className="font-semibold">Vardas: <span className="font-normal">{transaction.name}</span></h1>
            <h1 className="font-semibold">Email: <span className="font-normal">{transaction.email}</span></h1>
            <h1 className="font-semibold">Sumokėta: <span className="font-normal">{transaction.total.toFixed(2)}</span></h1>
            <ul>
                {
                    transaction.items.map(item => {
                        return (
                           <TransactionProductItem key={item._id} productId={item.productId} quantity={item.quantity} open={open} />
                        )
                    })
                }
            </ul>
        </div>
    )
}

function TransactionProductItem({ productId, quantity, open }: { productId: string, quantity: number, open: boolean} ) {
    const [product, setProduct] = useState<ProductProps | null>(null);

    useEffect(() => {
        const getProduct = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await axios.get(`http://localhost:7000/api/products/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });
                setProduct(res.data.product);
                return;
            }
            catch (err: unknown) {
                console.error(err);
            }
        }

        getProduct();
    }, [productId]);

    return (
        <li className="flex flex-row items-center justify-between w-min min-w-24">
            <ul className="flex flex-col">
                <li className="flex flex-col whitespace-nowrap">
                    <header className="flex items-center gap-1 font-bold">
                        <Icon icon="tabler:chevron-right" className="w-4 h-4" />
                        {product && product.title}
                    </header>
                    <ul className={`ml-8 ${open ? 'block' : 'hidden'}`}>
                        <li className="font-semibold">ID: <span className="text-sm font-normal">{product && product._id}</span></li>
                        <li className="font-semibold">Kiekis: <span className="text-sm font-normal">{quantity}</span></li>
                        <li className="font-semibold">Kaina: <span className="text-sm font-normal">{product && product.price.toFixed(2)}€</span></li>
                    </ul>
                </li>
            </ul>
        </li>
    )
}