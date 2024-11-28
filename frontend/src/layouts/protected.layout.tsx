import { useEffect } from "react";
import { useAuth } from "../contexts/auth.context"
import { useNavigate, Outlet } from "react-router-dom";

export default function ProtectedLayout() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = localStorage.getItem("authToken");
                
                if (!token) {
                    navigate("/");
                    return;
                }

                const payload = JSON.parse(atob(token.split(".")[1]));
                const isTokenValid = payload.exp * 1000 > Date.now();
                if (!isTokenValid) {
                    logout();
                    return;
                }

                return;
            }
            catch (error: unknown) {
                console.error(error);
                navigate("/");
            }
        }

        checkAuth();
    }, [user])

    return (
        <main className="w-full h-full">
            <Outlet />
        </main>
    )
}