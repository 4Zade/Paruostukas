import { createContext, useContext, useState } from "react";

interface MenuContextProps {
    menu: boolean;
    toggleMenu: () => void;
}

const defaultContextValue: MenuContextProps = {
    menu: false,
    toggleMenu: () => {},
};

// eslint-disable-next-line react-refresh/only-export-components
export const MenuContext = createContext<MenuContextProps>(defaultContextValue);

const MenuProvider = ({ children }: { children: React.ReactNode }) => {
    const [menu, setMenu] = useState<MenuContextProps['menu']>(false);

    const toggleMenu = () => {
        setMenu(!menu);
    };

    return (
        <MenuContext.Provider value={{ menu, toggleMenu }}>
            {children}
        </MenuContext.Provider>
    );
};

const useMenu = () => useContext(MenuContext);

// eslint-disable-next-line react-refresh/only-export-components
export { MenuProvider, useMenu };
