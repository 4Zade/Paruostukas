import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAlert } from "../../contexts/alert.context";
import { LoginProps } from "../../types/auth.types";
import { useAuth } from "../../contexts/auth.context";

export default function RegisterForm() {
    const { register, handleSubmit, setError, clearErrors, setValue, formState: { errors } } = useForm();
    const { login, user } = useAuth();
    const { success } = useAlert();
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [visibleRepeatPassword, setVisibleRepeatPassword] = useState(false);

    useEffect(() => {
        console.log(user);
    }, [user])

    const onSubmit = async (data: LoginProps) => {
        try {
            const res = await axios.post("http://localhost:7000/api/auth/register", data, { withCredentials: true });
            login(res.data.token, res.data.user);
            success('Sėkmingai užsiregistravote!');
            resetInputs();
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
        setValue('username', '');
        setValue('email', '');
        setValue('password', '');
        setValue('repeatPassword', '');
    }

    const onFocus = (input: string) => {
        clearErrors('global');
        clearErrors(input);
    }

    return (
        <form className="w-min h-min px-8 py-4 bg-slate-100 rounded-lg">
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
                            maxLength={32}
                            onFocus={() => onFocus('username')}
                            {...register("username", { required: "Slapyvardis yra privalomas" })} 
                        />
                    </div>
                    <p className="text-sm w-full h-7 text-red-400">{errors.username?.message as string}</p>
                </section>
            </label>

            <label htmlFor="username" className="flex flex-col gap-1">
                El. Paštas.
                <section>
                    <div className="w-full p-2 rounded-lg flex items-center gap-2 bg-slate-200">
                        <Icon icon="tabler:user" className={`w-6 h-6 ${errors.email?.message ? 'text-red-400 animate-shake' : ''}`} />
                        <input 
                            type="email" 
                            placeholder="El. Paštas"
                            className="grow outline-none bg-transparent"
                            maxLength={64}
                            onFocus={() => onFocus('email')}
                            {...register("email")} 
                        />
                    </div>
                    <p className="text-sm w-full h-7 text-red-400">{errors.email?.message as string}</p>
                </section>
            </label>

            <label htmlFor="password" className="flex flex-col gap-1">
                Slaptažodis
                <section>
                    <div className="w-full p-2 rounded-lg flex items-center gap-2 bg-slate-200">
                        <Icon icon="tabler:key" className={`w-6 h-6 ${errors.password?.message ? 'text-red-400 animate-shake' : ''}`} />
                        <input 
                            type={visiblePassword ? 'text' : 'password'} 
                            placeholder="Slaptažodis"
                            className="grow outline-none bg-transparent"
                            maxLength={64}
                            onFocus={() => onFocus('password')}
                            {...register("password")} 
                        />
                        <button type="button" className="w-8 h-8 rounded-full grid place-items-center" onClick={() => setVisiblePassword(!visiblePassword)}>
                            <Icon icon={visiblePassword ? 'tabler:eye-closed' : 'tabler:eye'} className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="text-sm w-full h-7 text-red-400">{errors.password?.message as string}</p>
                </section>
            </label>

            <label htmlFor="password" className="flex flex-col gap-1">
                Pakartoti Slaptažodį
                <section>
                    <div className="w-full p-2 rounded-lg flex items-center gap-2 bg-slate-200">
                        <Icon icon="tabler:key" className={`w-6 h-6 ${errors.repeatPassword?.message ? 'text-red-400 animate-shake' : ''}`} />
                        <input 
                            type={visibleRepeatPassword ? 'text' : 'password'} 
                            placeholder="Pakartoti slaptažodį"
                            className="grow outline-none bg-transparent"
                            maxLength={64}
                            onFocus={() => onFocus('password')}
                            {...register("repeatPassword")} 
                        />
                        <button type="button" className="w-8 h-8 rounded-full grid place-items-center" onClick={() => setVisibleRepeatPassword(!visibleRepeatPassword)}>
                            <Icon icon={visibleRepeatPassword ? 'tabler:eye-closed' : 'tabler:eye'} className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="text-sm w-full h-7 text-red-400">{errors.repeatPassword?.message as string}</p>
                </section>
            </label>

            <button 
                type="submit" 
                className="w-full p-2 rounded-lg flex items-center justify-center gap-2 bg-blue-400 text-white"
                onClick={handleSubmit(onSubmit as () => Promise<void>)}
            >
                <Icon icon="tabler:user-plus" className="w-6 h-6" />
                <span>Registruotis</span>
            </button>

            <section className="w-full flex items-center justify-center mt-4">
            <Link 
                to="/" 
                className="text-base relative text-slate-400 after:bg-slate-400 after:absolute after:h-0.5 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
            >
                Prisijunk!
            </Link>
            </section>
        </form>
    )
}