import { Link, useLoaderData, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import ProductProps from "../../types/product.types";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useAuth } from "../../contexts/auth.context";
import { useForm } from "react-hook-form";
import { useCart } from "../../contexts/cart.context";
import { useAlert } from "../../contexts/alert.context";
import { useDropzone } from "react-dropzone";
 
interface ProductFormProps {
    title: string;
    description: string;
    price: string;
    image?: File | null;
}

export default function ProductPage() {
    const navigate = useNavigate();
    const product = useLoaderData() as ProductProps;
    const { user } = useAuth();
    const { success, error } = useAlert();
    const { fetchCart } = useCart();
    const { register, handleSubmit, setError, clearErrors, setValue, formState: { errors } } = useForm();
    const [clicked, setClicked] = useState(false);
    const [liked, setLiked] = useState(0);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [favClickTimeout, setFavClickTimeout] = useState(false);
    const location = useLocation().pathname.split('/').pop();

    useEffect(() => {
        console.log('updated')
        if (location === "redaguoti") {
            setValue("title", product.title);
            setValue("price", product.price);
            setValue("description", product.description);
        }
    }, [location, product])

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

            if (res.data.action === "added") {
                setLiked(liked + 1);
            }
            else {
                setLiked(liked - 1);
            }

            setClicked(!clicked);
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

    const deleteProduct = async (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        try {
            const token = localStorage.getItem("authToken");

            await axios.delete(`http://localhost:7000/api/products/${product._id}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true 
            });

            success('Produktas sėkmingai ištrintas!');
            navigate("/produktai");
        }
        catch (err: unknown) {
            console.error(err);
        }
    }

    const onSubmit = async (data: ProductFormProps) => {
        try {
            const token = localStorage.getItem("authToken");

            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("price", data.price);
            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            await axios.put(`http://localhost:7000/api/products/${product._id}`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true 
            });

            success('Produktas sėkmingai atnaujintas!');
            window.history.back();
        }
        catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.errors) {
                const apiErrors = err.response.data.errors;
                apiErrors.forEach((error: { path: string; msg: string }) => {
                    setError(error.path as string, { type: 'manual', message: error.msg });
                });
            } 
            else if (axios.isAxiosError(err) && err.response?.data?.error) {
                const apiError = err.response.data.error;
                setError(apiError.path as string, { type: 'manual', message: apiError.message });
            }
        }
    }

    const onFocus = (input: string) => {
        clearErrors('global');
        clearErrors(input);
    }

    const goBack = () => {
        setSelectedImage(null);
        window.history.back();
    }


    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedImage(file);
        }
    };

    useDropzone({
        accept: { "image/*": [] },
        maxFiles: 1,
        onDrop,
    });


    useEffect(() => {
        if (product.favorites.includes(user?.username as string)) { // Change this
            setClicked(true);
            setLiked(product.favorites.length);
        }
    }, [])

    return (
        <main className="w-full h-full md:h-min flex flex-col gap-4 relative sm:grid grid-cols-2 2xl:grid-cols-3 place-items-center ~md/xl:~mt-10/20 px-8">
            <section className="w-full h-min sm:col-span-2 md:col-span-1 sm:w-1/2 md:w-full">
                <div
                    className={`w-full h-min relative grid place-items-center ${location === "redaguoti" ? "dropzone" : ""}`}
                    onDragOver={(e) => {
                        if (location === "redaguoti") e.preventDefault();
                    }}
                    onDrop={(e) => {
                        if (location === "redaguoti") {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file && file.type.startsWith("image/")) {
                                setSelectedImage(file);
                            }
                        }
                    }}
                >
                    {/* Show the uploaded or old image */}
                    <img
                        src={
                            location === "redaguoti" ?
                            selectedImage
                                ? URL.createObjectURL(selectedImage)
                                : product.image
                                ? `http://localhost:7000${product.image}`
                                : "https://via.placeholder.com/300x300"
                            :
                            product.image
                                ? `http://localhost:7000${product.image}`
                                : "https://via.placeholder.com/300x300"
                        }
                        className="w-full object-cover aspect-square rounded-xl"
                        alt="Product"
                    />

                    {/* Show the placeholder text if it's a dropzone and no image is uploaded */}
                    {location === "redaguoti" && !selectedImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white rounded-xl">
                            Drag and drop an image here or click to upload a new photo
                        </div>
                    )}

                    {/* Allow click-to-upload functionality */}
                    {location === "redaguoti" && (
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setSelectedImage(file);
                                }
                            }}
                        />
                    )}
                </div>
            </section>

            <section className="w-full h-auto flex flex-col gap-8 justify-center 2xl:col-span-2 sm:col-span-2 md:col-span-1">
                <header className="flex flex-col">
                    <h1 className="text-xl font-bold line-clamp-1">
                        {
                            location === "redaguoti" ? 
                            <label htmlFor="title" className="flex flex-col gap-1">
                                Prekės pavadinimas
                                <section>
                                    <div className="w-full p-2 rounded-lg flex items-center gap-2 bg-slate-200">
                                        <Icon icon="tabler:pencil" className={`w-6 h-6 ${errors.title?.message ? 'text-red-400 animate-shake' : ''}`} />
                                        <input 
                                            type="text" 
                                            placeholder="Prekės pavadinimas"
                                            className="grow outline-none bg-transparent"
                                            maxLength={64}
                                            onFocus={() => onFocus('title')}
                                            {...register("title")} 
                                        />
                                    </div>
                                    <p className="text-sm w-full h-7 text-red-400">{errors.title?.message as string}</p>
                                </section>
                            </label>
                            :
                            product.title

                        }
                    </h1>
                    <p className="text-sm text-slate-500">Kodas: {product._id}</p>
                </header>

                <section className="w-full sm:col-span-2 place-self-start">
                    <div className="w-full flex items-center gap-1">
                        <h1 className="font-bold">Aprašymas:</h1>
                    </div>
                    <p className="w-full">
                        {
                            location === "redaguoti" ?
                            <label htmlFor="description" className="flex flex-col gap-1 w-full mt-1">
                                <section>
                                    <div className="w-full p-2 rounded-lg flex items-center gap-2 bg-slate-200">
                                        <Icon icon="tabler:message" className={`w-6 h-6 ${errors.description?.message ? 'text-red-400 animate-shake' : ''}`} />
                                        <input 
                                            type="text" 
                                            placeholder="Prekės aprašymas"
                                            className="grow outline-none bg-transparent"
                                            onFocus={() => onFocus('description')}
                                            {...register("description")} 
                                        />
                                    </div>
                                    <p className="text-sm w-full h-7 text-red-400">{errors.description?.message as string}</p>
                                </section>
                            </label>
                            :
                            product.description
                        }
                    </p>
                </section>

                <footer className="w-full sm:flex flex-col gap-4 hidden">
                    <div className="flex items-center justify-between px-4">
                        <div className="flex gap-2 items-center">
                            <h1 className="text-xl font-bold">
                                {
                                    location === "redaguoti" ?
                                    <label htmlFor="price" className="flex flex-col gap-1">
                                        Prekės kaina
                                        <section>
                                            <div className="w-full p-2 rounded-lg flex items-center gap-2 bg-slate-200">
                                                <Icon icon="tabler:currency-euro" className={`w-6 h-6 ${errors.price?.message ? 'text-red-400 animate-shake' : ''}`} />
                                                <input 
                                                    type="text" 
                                                    placeholder="Prekės kaina"
                                                    className="grow outline-none bg-transparent"
                                                    onFocus={() => onFocus('price')}
                                                    {...register("price")} 
                                                />
                                            </div>
                                            <p className="text-sm w-full h-7 text-red-400">{errors.price?.message as string}</p>
                                        </section>
                                    </label>
                                    : 
                                    product.price + "€"
                                }
                                
                                </h1>
                        </div>

                        <div className="w-min h-min flex items-center gap-2">
                            <h1>{liked}</h1>
                            <button 
                                className="w-8 h-8 rounded-full grid place-items-center group relative"
                                onClick={favoriteClick}
                            >
                                <div className="w-full h-full bg-zinc-800 bg-opacity-20 absolute rounded-full group-hover:scale-100 scale-0 transition-transform"></div>
                                <Icon icon={clicked ? "tabler:star-filled": "tabler:star"} className={`w-6 h-6 group-active:scale-75 transition-[transform,color] duration-200 z-10 ${clicked ? "text-yellow-400 scale-100" : "text-black scale-90"}`} />
                            </button>
                        </div>
                    </div>

                    <div className="w-full flex items-center gap-2">
                        {
                            location === "redaguoti" 
                            ?
                            <>
                                <button className="w-min p-3 rounded-full bg-red-400 relative group flex items-center gap-2 justify-center text-white" onClick={deleteProduct}>
                                    <Icon icon="tabler:trash" className="w-6 h-6" />
                                </button>

                                <button className="w-full px-6 py-3 rounded-full bg-slate-200 relative group flex items-center gap-2 justify-center" onClick={goBack}>
                                    <Icon icon="tabler:x" className="w-6 h-6" />
                                    Atšaukti
                                </button>

                                <button className="w-full px-6 py-3 rounded-full bg-black relative group flex items-center gap-2 justify-center text-white" onClick={handleSubmit(onSubmit as any)}>
                                    <Icon icon="tabler:device-floppy" className="w-6 h-6" />
                                    Išsaugoti
                                </button>
                            </>
                            :
                            <>
                                {
                                    user?.role === "ADMIN" &&
                                    <>
                                        <button className="w-min p-3 rounded-full bg-red-400 relative group flex items-center gap-2 justify-center text-white" onClick={deleteProduct}>
                                            <Icon icon="tabler:trash" className="w-6 h-6" />
                                        </button>

                                        <Link to={`/produktai/${product._id}/redaguoti`} className="w-full px-6 py-3 rounded-full bg-slate-200 relative group flex items-center gap-2 justify-center">
                                            <Icon icon="tabler:pencil" className="w-6 h-6" />
                                            Redaguoti
                                        </Link>
                                    </>
                                }

                                <button className="w-full px-6 py-3 rounded-full bg-black relative group flex items-center gap-2 justify-center text-white" onClick={addToCart}>
                                    <Icon icon="tabler:basket" className="w-6 h-6" />
                                    Pirkti
                                </button>
                            </>
                        }
                    </div>
                </footer>

                <div className="h-44">

                </div>
            </section>

            <section className="w-full flex flex-col gap-4 sm:hidden p-4 fixed bottom-0 left-0 bg-white shadow-[0_-2px_5px_0px_rgba(0,0,0,0.15)] rounded-xl">
                <div className="flex items-center justify-between px-4">
                    <div className="flex gap-2 items-center">
                        <h1 className="text-xl font-bold">
                            {
                                location === "redaguoti" ?
                                <label htmlFor="price" className="flex flex-col gap-1">
                                    Prekės kaina
                                    <section>
                                        <div className="w-full p-2 rounded-lg flex items-center gap-2 bg-slate-200">
                                            <Icon icon="tabler:currency-euro" className={`w-6 h-6 ${errors.price?.message ? 'text-red-400 animate-shake' : ''}`} />
                                            <input 
                                                type="text" 
                                                placeholder="Prekės kaina"
                                                className="grow outline-none bg-transparent"
                                                onFocus={() => onFocus('price')}
                                                {...register("price")} 
                                            />
                                        </div>
                                        <p className="text-sm w-full h-7 text-red-400">{errors.price?.message as string}</p>
                                    </section>
                                </label>
                                : 
                                product.price + "€"
                            }
                        </h1>
                    </div>

                    <div className="w-min h-min flex items-center gap-2">
                        <h1>{liked}</h1>
                        <button 
                            className="w-8 h-8 rounded-full grid place-items-center group relative"
                            onClick={favoriteClick}
                        >
                            <div className="w-full h-full bg-zinc-800 bg-opacity-20 absolute rounded-full group-hover:scale-100 scale-0 transition-transform"></div>
                            <Icon icon={clicked ? "tabler:star-filled": "tabler:star"} className={`w-6 h-6 group-active:scale-75 transition-[transform,color] duration-200 z-10 ${clicked ? "text-yellow-400 scale-100" : "text-black scale-90"}`} />
                        </button>
                    </div>
                </div>

                <div className="w-full flex items-center gap-2">
                    {
                        location === "redaguoti" 
                        ?
                        <>
                            <button className="w-min p-3 rounded-full bg-red-400 relative group flex items-center gap-2 justify-center text-white" onClick={deleteProduct}>
                                <Icon icon="tabler:trash" className="w-6 h-6" />
                            </button>

                            <button className="w-full px-6 py-3 rounded-full bg-slate-200 relative group flex items-center gap-2 justify-center" onClick={goBack}>
                                <Icon icon="tabler:x" className="w-6 h-6" />
                                Atšaukti
                            </button>

                            <button className="w-full px-6 py-3 rounded-full bg-black relative group flex items-center gap-2 justify-center text-white" onClick={handleSubmit(onSubmit as any)}>
                                <Icon icon="tabler:device-floppy" className="w-6 h-6" />
                                Išsaugoti
                            </button>
                        </>
                        :
                        <>
                            {
                                user?.role === "ADMIN" &&
                                <>
                                    <button className="w-min p-3 rounded-full bg-red-400 relative group flex items-center gap-2 justify-center text-white" onClick={deleteProduct}>
                                        <Icon icon="tabler:trash" className="w-6 h-6" />
                                    </button>

                                    <Link to={`/produktai/${product._id}/redaguoti`} className="w-full px-6 py-3 rounded-full bg-slate-200 relative group flex items-center gap-2 justify-center">
                                        <Icon icon="tabler:pencil" className="w-6 h-6" />
                                        Redaguoti
                                    </Link>
                                </>
                            }

                            <button className="w-full px-6 py-3 rounded-full bg-black relative group flex items-center gap-2 justify-center text-white" onClick={addToCart}>
                                <Icon icon="tabler:basket" className="w-6 h-6" />
                                Pirkti
                            </button>
                        </>
                    }
                </div>
            </section>
        </main>
    )
}