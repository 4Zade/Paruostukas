import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import ProductCard from "../../components/Products/card.products";
import ProductProps from "../../types/product.types";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth.context";
import Paginator from "../../components/paginator.component";

interface ProductsProps {
    products: ProductProps[];
    pagination: {
        totalPages: number;
    };
}

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [pages, setPages] = useState(0);
    const page = searchParams.get("page") || "1";
    const [products, setProducts] = useState([] as ProductProps[]);
    const data = useLoaderData() as ProductsProps;
    const { user } = useAuth();

    const updatePage = (newPage: number) => {
        setSearchParams({ page: String(newPage) });
    };

    useEffect(() => {
        setProducts(data.products);
        setPages(data.pagination.totalPages);
    }, [data])


    return (
        <main className="w-full h-full ~/xl:~px-8/32">
            <div className="w-full flex items-center justify-between">
                <h1 className="text-2xl font-bold">Produktai</h1>
                {
                    user?.role === "ADMIN" && <Link to="/produktai/prideti" className="w-min h-min flex items-center justify-center gap-2 whitespace-nowrap group">
                    <div className="w-8 h-8 rounded-full grid place-items-center relative">
                        <div className="w-full h-full bg-zinc-800 bg-opacity-20 absolute rounded-full group-hover:scale-100 scale-0 transition-transform"></div>
                        <Icon icon="tabler:plus" className="w-6 h-6 z-10" />
                    </div>
                    <span className="hidden md:block">Pridėti produktą</span>
                </Link>
                }
            </div>
            <hr className="my-4 mb-6 h-0.5 bg-black"/>
            <div 
                className="
                    w-full h-auto grid ~gap-0/4
                    grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6
                    auto-rows-auto
                "
            >
                {
                    products.length ? products.map(item => {
                        return (
                            <ProductCard key={item._id} product={item}/>
                        )
                    })
                    :
                    <h1>Produktų nėra</h1>
                }
            </div>
            <Paginator setPage={updatePage} page={page} pages={pages}/>
        </main>
    )
}