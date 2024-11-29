import axios from "axios";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { useAlert } from "../../contexts/alert.context";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/cart.context";
import { useAuth } from "../../contexts/auth.context";

export default function CheckoutForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();
    const { success } = useAlert();
    const { total, cart, clearCart } = useCart();
    const { user } = useAuth();

    const { email } = user ? user : { email: '' };

    const onSubmit = async (data: any) => {
        try {
            const token = localStorage.getItem("authToken");

           await axios.post("http://localhost:7000/api/transactions", { ...data, email, total, items: cart.items }, { 
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true 
            });
            success('Užsakymas atliktas!');
            navigate('/');
            clearCart();
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

    return (
        <form className="w-full h-full px-8 py-4 md:bg-slate-100 rounded-lg flex flex-col justify-between">
            <main>
                <h1 className="text-2xl font-bold md:text-center">Atsiskaitymas</h1>
                <p className="text-sm w-full h-7 text-red-400">{errors.global?.message as string}</p>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold md:text-center">Atsiėmimo vieta</h2>
                    <div className="w-full p-2 rounded-lg flex items-center gap-2 bg-slate-200">
                        Trinapolio g. 2, Vilnius, 08221 Vilniaus m. sav.
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-semibold md:text-center">Atsiskaitymo informacija</h2>

                    <label htmlFor="password" className="flex flex-col gap-1">
                        Vardas ir pavardė
                        <section>
                            <div className="w-full p-2 rounded-lg flex items-center gap-2 bg-slate-200">
                                <Icon icon="tabler:user" className={`w-6 h-6 ${errors.name?.message ? 'text-red-400 animate-shake' : ''}`} />
                                <input 
                                    type="text" 
                                    placeholder="Vardas ir pavardė"
                                    className="grow outline-none bg-transparent"
                                    maxLength={128}
                                    onFocus={() => onFocus('name')}
                                    {...register("name")} 
                                />
                            </div>
                            <p className="text-sm w-full h-7 text-red-400">{errors.name?.message as string}</p>
                        </section>
                    </label>

                    <label htmlFor="password" className="flex flex-col gap-1">
                        Kortelės numeris
                        <section>
                            <div className="w-full p-2 rounded-lg flex items-center gap-2 bg-slate-200">
                                <Icon icon="tabler:credit-card" className={`w-6 h-6 ${errors.card?.message ? 'text-red-400 animate-shake' : ''}`} />
                                <input 
                                    type="text" 
                                    placeholder="xxxx-xxxx-xxxx-xxxx"
                                    maxLength={16}
                                    className="grow outline-none bg-transparent"
                                    onFocus={() => onFocus('card')}
                                    {...register("card")} 
                                />
                            </div>
                            <p className="text-sm w-full h-7 text-red-400">{errors.card?.message as string}</p>
                        </section>
                    </label>

                    <label htmlFor="password" className="flex flex-col gap-1">
                        CVV
                        <section>
                            <div className="w-full p-2 rounded-lg flex items-center gap-2 bg-slate-200">
                                <Icon icon="tabler:credit-card" className={`w-6 h-6 ${errors.cvv?.message ? 'text-red-400 animate-shake' : ''}`} />
                                <input 
                                    type="text" 
                                    placeholder="xxx"
                                    maxLength={3}
                                    className="grow outline-none bg-transparent"
                                    onFocus={() => onFocus('cvv')}
                                    {...register("cvv")} 
                                />
                            </div>
                            <p className="text-sm w-full h-7 text-red-400">{errors.cvv?.message as string}</p>
                        </section>
                    </label>

                    <label htmlFor="password" className="flex flex-col gap-1">
                        Galioja iki
                        <section>
                            <div className="w-full p-2 rounded-lg flex items-center gap-2 bg-slate-200">
                                <Icon icon="tabler:calendar" className={`w-6 h-6 ${errors.expires?.message ? 'text-red-400 animate-shake' : ''}`} />
                                <input 
                                    type="text" 
                                    placeholder="YY/MM"
                                    maxLength={5}
                                    className="grow outline-none bg-transparent"
                                    onFocus={() => onFocus('expires')}
                                    {...register("expires")} 
                                />
                            </div>
                            <p className="text-sm w-full h-7 text-red-400">{errors.expires?.message as string}</p>
                        </section>
                    </label>
                </section>
            </main>

            <section className="w-full flex flex-col gap-2">
                <div className="w-full flex items-center justify-between font-bold text-lg">
                    <h1>Viso:</h1>
                    <h1>{total.toFixed(2)}€</h1>
                </div>

                <button 
                    type="submit" 
                    className={`w-full p-2 rounded-lg flex items-center justify-center gap-2 bg-black text-white `}
                    onClick={handleSubmit(onSubmit as () => Promise<void>)}
                >
                    <Icon icon="tabler:arrow-right" className="w-6 h-6" />
                    <span>Pirkti</span>
                </button>
            </section>
        </form>
    )
}