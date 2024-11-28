import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextProps {
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
}

const defaultContextValue: AuthContextProps = {
    user: null,
    login: async () => {},
    logout: async () => {},
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextProps>(defaultContextValue);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthContextProps["user"] | null>(null);

    useEffect(() => {
        checkAuth();
    }, [])

    const checkAuth = () => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const isTokenValid = payload.exp * 1000 > Date.now();
            if (!isTokenValid) {
                logout();
                return;
            }

            const user = JSON.parse(localStorage.getItem("user") || "{}");
            setUser(user);
        }
    }

    const login = (token: string, user: User) => {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        window.location.href = "/";
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
