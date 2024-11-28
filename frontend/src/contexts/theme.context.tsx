import { createContext, useContext, useEffect, useState } from "react";
import { AuthProvider } from "./auth.context";
import { AlertProvider } from "./alert.context";
import { ModalProvider } from "./modal.context";
import { MenuProvider } from "./menu.context";
import { CartProvider } from "./cart.context";

interface ThemeContextProps {
    theme: string;
    toggleTheme?: () => void;
}

const defaultContextValue: ThemeContextProps = {
    theme: 'light',
};

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextProps>(defaultContextValue);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<string>("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
    }, []);

    useEffect(() => {
        const body = document.body;

        if (theme === "dark") {
            body.classList.add("dark");
        } else {
            body.classList.remove("dark");
        }
    }, [theme])

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <AuthProvider>
                <AlertProvider>
                    <ModalProvider>
                        <MenuProvider>
                            <CartProvider>
                                {children}
                            </CartProvider>
                        </MenuProvider>
                    </ModalProvider>
                </AlertProvider>
            </AuthProvider>
        </ThemeContext.Provider>
    );
};

const useTheme = () => useContext(ThemeContext);

// eslint-disable-next-line react-refresh/only-export-components
export { ThemeProvider, useTheme };
