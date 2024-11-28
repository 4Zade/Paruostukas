import { Icon } from "@iconify/react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useAlert } from "../../contexts/alert.context";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProductFormProps {
    title: string;
    description: string;
    price: string;
    image: File | null;
}

export default function ProductForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, setError, clearErrors, setValue, formState: { errors } } = useForm();
    const { success } = useAlert();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file)); // Generate a preview URL
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "image/*": [] },
        maxFiles: 1,
        onDrop,
    });

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

            await axios.post("http://localhost:7000/api/products", formData, { 
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data" 
                },
                withCredentials: true 
            });
            success('Sėkmingai prisijungėte!');
            resetInputs();
            navigate('/produktai');
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

    const resetInputs = () => {
        setValue('title', '');
        setValue('description', '');
        setValue('price', '');
        setSelectedImage(null);
        setImagePreview(null); // Clear the image preview
    }

    const onFocus = (input: string) => {
        clearErrors('global');
        clearErrors(input);
    }

    return (
        <form className="w-min h-min px-8 py-4 bg-slate-100 rounded-lg">
            <h1 className="text-2xl font-bold text-center">Sukutkite produktą!</h1>

            <p className="text-sm w-full h-7 text-red-400">{errors.global?.message as string}</p>

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

            <label htmlFor="description" className="flex flex-col gap-1">
                Prekės aprašymas
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

            <label htmlFor="image" className="flex flex-col gap-1">
                Prekės nuotrauka
                <div
                    {...getRootProps()}
                    className={`w-full p-4 rounded-lg flex justify-center items-center border-dashed border-2 ${
                        isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-400 bg-slate-200"
                    }`}
                >
                    <input {...getInputProps()} />
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="max-h-40 object-contain" />
                    ) : (
                        <p>Vilkite failą arba spustelėkite, kad įkeltumėte nuotrauką</p>
                    )}
                </div>
                <p className="text-sm w-full h-7 text-red-400">{errors.image?.message as string}</p>
            </label>

            <button 
                type="submit" 
                className="w-full p-2 rounded-lg flex items-center justify-center gap-2 bg-blue-400 text-white"
                onClick={handleSubmit(onSubmit as () => Promise<void>)}
            >
                <Icon icon="tabler:plus" className="w-6 h-6" />
                <span>Pridėti produktą</span>
            </button>
        </form>
    )
}