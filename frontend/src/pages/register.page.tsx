import { useEffect } from "react";
import RegisterForm from "../components/forms/register.form";
import { useAuth } from "../contexts/auth.context";

export default function RegisterPage() {
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            window.location.href = "/produktai";
        }
    }, [user])

    return (
        <main className="w-full h-full flex items-center justify-center">
            <RegisterForm />
        </main>
    )
}