import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAlert } from "../../contexts/alert.context";
import { LoginProps } from "../../types/auth.types";
import { useAuth } from "../../contexts/auth.context";

export default function LoginForm() {
    const { register, handleSubmit, setError, clearErrors, setValue, formState: { errors } } = useForm();
    const { login, user } = useAuth();
    const { success } = useAlert();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        console.log(user);
    }, [user])

    const onSubmit = async (data: LoginProps) => {
        try {
            const res = await axios.post("http://localhost:7000/api/auth/login", data, { withCredentials: true });
            login(res.data.token, res.data.user);
            success('Sėkmingai prisijungėte!');
            setValue('username', '');
            setValue('password', '');
            setValue('remember', false);
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
        <form className="w-min h-min px-8 py-4 md:bg-slate-100 rounded-lg">
            <h1 className="text-2xl font-bold text-center">Prisijunkite</h1>

            <p className="text-sm w-full h-7 text-red-400">{errors.global?.message as string}</p>

            <label htmlFor="username" className="flex flex-col gap-1">
                Slapyvardis
                <section>
                    <div className="w-full p-2 rounded-lg flex items-center gap-2 bg-slate-200">
                        <Icon icon="tabler:user" className={`w-6 h-6 ${errors.username?.message ? 'text-red-400 animate-shake' : ''}`} />
                        <input 
                            type="text" 
                            placeholder="Slapyvardis"
                            className="grow outline-none bg-transparent"
                            onFocus={() => onFocus('username')}
                            {...register("username")} 
                        />
                    </div>
                    <p className="text-sm w-full h-7 text-red-400">{errors.username?.message as string}</p>
                </section>
            </label>

            <label htmlFor="password" className="flex flex-col gap-1">
                Slaptažodis
                <section>
                    <div className="w-full p-2 rounded-lg flex items-center gap-2 bg-slate-200">
                        <div className="w-6 h-6 relative group">
                            <Icon icon="tabler:key" className={`w-6 h-6 ${errors.password?.message ? 'text-red-400 animate-shake' : ''}`} />

                            <section className="w-min h-min hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-10 z-10">
                                <div className="w-min h-min px-2 py-1 bg-slate-200 whitespace-nowrap text-sm rounded-lg">
                                    <h1>Slaptažodis turi atitikti šiuos kriterijus:</h1>
                                    <ul className="list-disc ml-8">
                                        <li>8 simboliai</li>
                                        <li>1 didžioji raide</li>
                                        <li>1 mazoji raide</li>
                                        <li>1 skaičius</li>
                                        <li>1 specialusis simbolis</li>
                                    </ul>
                                </div>
                            </section>
                        </div>
                        <input 
                            type={visible ? 'text' : 'password'} 
                            placeholder="Slaptažodis"
                            className="grow outline-none bg-transparent"
                            onFocus={() => onFocus('password')}
                            {...register("password")} 
                        />
                        <button type="button" className="w-8 h-8 rounded-full grid place-items-center" onClick={() => setVisible(!visible)}>
                            <Icon icon={visible ? 'tabler:eye-closed' : 'tabler:eye'} className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="text-sm w-full h-7 text-red-400 flex items-center">
                        {errors.password?.message as string}
                    </p>
                </section>
            </label>

            <label htmlFor="remember" className="flex items-center gap-2 ml-1 mb-2">
                <input 
                    type="checkbox" 
                    {...register("remember")} 
                />
                Prisiminti mane
            </label>

            <button 
                type="submit" 
                className="w-full p-2 rounded-lg flex items-center justify-center gap-2 bg-blue-400 text-white"
                onClick={handleSubmit(onSubmit as () => Promise<void>)}
            >
                <Icon icon="tabler:login" className="w-6 h-6" />
                <span>Prisijungti</span>
            </button>

            <section className="w-full flex items-center justify-center mt-4">
            <Link 
                to="/registracija" 
                className="text-base relative text-slate-400 after:bg-slate-400 after:absolute after:h-0.5 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
            >
                Registruokis!
            </Link>
            </section>
        </form>
    )
}