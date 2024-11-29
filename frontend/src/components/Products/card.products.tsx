import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductProps from "../../types/product.types";
import { useAuth } from "../../contexts/auth.context";
import { useCart } from "../../contexts/cart.context";
import { useAlert } from "../../contexts/alert.context";

export default function ProductCard({ product }: { product: ProductProps }) {
    const [clicked, setClicked] = useState(false);
    const [liked, setLiked] = useState(0);
    const { error } = useAlert();
    const [favClickTimeout, setFavClickTimeout] = useState(false);
    const { user } = useAuth();
    const { fetchCart } = useCart();

    const favoriteClick = async (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (favClickTimeout) {
            error("Palaukite prieš spaudžiant dar karta!");
            return;
        }

        if (!user) {
            error("Prisijunkite, kad galėtumėte įvertinti!");
        }
        
        try {
            const token = localStorage.getItem("authToken");

            const res = await axios.post(`http://localhost:7000/api/products/favorite/${product._id}`, {}, { 
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true 
            });

            setClicked(!clicked);

            if (res.data.action === "added") {
                setLiked(liked + 1);
            }
            else {
                setLiked(liked - 1);
            }
        }
        catch (err: unknown) {
            console.error(err);
        }
        finally {
            setFavClickTimeout(true);
            setTimeout(() => {
                setFavClickTimeout(false);
            }, 500);
        }
    }

    const addToCart = async (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        try {
            const token = localStorage.getItem("authToken");

            await axios.post(`http://localhost:7000/api/cart/${product._id}`, {}, {
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
        if (product.favorites.includes(user?.username as string)) { // Change this
            setClicked(true);
            setLiked(product.favorites.length);
        }
    }, [])

    return (
        <Link to={`/produktai/${product._id}`} className="w-full h-auto rounded-xl flex flex-col gap-2 p-2 bg-transparent">
            <div className="aspect-square rounded-lg bg-slate-100 overflow-hidden relative">
                <img src={product.image ? `http://localhost:7000${product.image}` : "https://via.placeholder.com/300x300"} className="w-full h-full object-cover" draggable={false} />
            </div>

            <header className="w-full flex flex-col text-clip gap-2">
                <h1 className="text-sm sm:text-base truncate w-max-0">{product.title}</h1>

                <footer className="w-full flex items-center justify-between">
                    <h1 className="text-base md:text-xl font-bold flex items-center">{product.price.toFixed(2)}<span className="text-sm">€</span></h1>

                    <div className="flex items-center gap-2">
                        <p>{liked}</p>
                        <button 
                            className="w-8 h-8 rounded-full grid place-items-center group relative"
                            onClick={favoriteClick}
                        >
                            <div className="w-full h-full bg-zinc-800 bg-opacity-20 absolute rounded-full group-hover:scale-100 scale-0 transition-transform"></div>
                            <Icon icon={clicked ? "tabler:star-filled": "tabler:star"} className={`w-6 h-6 group-active:scale-75 transition-[transform,color] duration-200 z-10 ${clicked ? "text-yellow-400 scale-100" : "text-black scale-90"}`} />
                        </button>
                    </div>
                </footer>
            </header>

            {
                user 
                && 
                <button 
                    className="w-full h-10 rounded-lg bg-black text-white flex items-center justify-center gap-2"
                    onClick={addToCart}
                >
                    <Icon icon="tabler:basket" className="w-6 h-6" />
                    Pridėti
                </button>
            }
        </Link>
    )
}