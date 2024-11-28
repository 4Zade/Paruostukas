import { useNavigate } from "react-router-dom";
import LoginForm from "../components/forms/login.form";
import { useAuth } from "../contexts/auth.context";
import { useEffect } from "react";

export default function HomePage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/produktai");
        }
    }, [user])

    return (
        <main className="w-full h-full flex items-center justify-center ~/xl:~px-8/32">
            {
                !user
                ?
                <LoginForm />
                :
                <div className="w-full h-full grid place-items-center">
                    <h1>Kraunama...</h1>
                </div>
            }
        </main>
    )
}