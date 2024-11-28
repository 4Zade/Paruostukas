import { createContext, useContext, useState } from "react";

interface ModalContextProps {
    modal: {
        type: 'confirm' | 'login';
        message: string;
    } | null;
    openModal: (type: 'confirm' | 'login', message: string) => void;
    closeModal: () => void;
}

const defaultContextValue: ModalContextProps = {
    modal: null,
    openModal: () => {},
    closeModal: () => {},
};

// eslint-disable-next-line react-refresh/only-export-components
export const ModalContext = createContext<ModalContextProps>(defaultContextValue);

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [modal, setModal] = useState<ModalContextProps['modal']>(null);

    const openModal = (type: 'confirm' | 'login', message: string) => {
        setModal({ type, message });
    };

    const closeModal = () => {
        setModal(null);
    };

    return (
        <ModalContext.Provider value={{ modal, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};

const useModal = () => useContext(ModalContext);

// eslint-disable-next-line react-refresh/only-export-components
export { ModalProvider, useModal };
