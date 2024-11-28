import { createContext, useContext, useState } from "react";

interface AlertContextProps {
    alert: {
        type: 'success' | 'error' | '';
        message: string;
    } | null;
    success: (message: string) => void;
    error: (message: string) => void;
}

const defaultContextValue: AlertContextProps = {
    alert: null,
    success: async () => {},
    error: async () => {},
};

// eslint-disable-next-line react-refresh/only-export-components
export const AlertContext = createContext<AlertContextProps>(defaultContextValue);

const AlertProvider = ({ children }: { children: React.ReactNode }) => {
    const [alert, setAlert] = useState<AlertContextProps['alert']>(null);

    const success = (message: string) => {
        setAlert({ type: 'success', message });
        setTimeout(() => {
            setAlert(null);
        }, 5000);
    };

    const error = (message: string) => {
        setAlert({ type: 'error', message });
        setTimeout(() => {
            setAlert(null);
        }, 5000);
    };

    return (
        <AlertContext.Provider value={{ alert, success, error }}>
            {children}
        </AlertContext.Provider>
    );
};

const useAlert = () => useContext(AlertContext);

// eslint-disable-next-line react-refresh/only-export-components
export { AlertProvider, useAlert };
