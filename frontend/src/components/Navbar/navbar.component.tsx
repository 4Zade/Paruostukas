import { Link } from "react-router-dom";
import { Icon } from '@iconify/react';
import NavbarDropdown from "./dropdown/dropdown.navbar";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth.context";
import { useMenu } from "../../contexts/menu.context";

export default function Navbar() {
    const { user } = useAuth();
    const { menu, toggleMenu } = useMenu();
    const [open, setOpen] = useState(false);
    const userRef = useRef<HTMLDivElement>(null);

    const goBack = () => {
        window.history.back();
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className={`w-full ~h-16/20 ~min-h-16/20 flex items-center justify-between ~px-4/6 transition-colors duration-200 relative z-30 ${menu && "text-white"}`}>
            <div className="w-min h-min absolute -bottom-6 left-4">
                <button className="~w-8/10 ~h-8/10 rounded-full grid place-items-center relative group" onClick={goBack}>
                    <div className="w-full h-full bg-zinc-800 bg-opacity-20 absolute rounded-full group-hover:scale-100 scale-0 transition-transform"></div>
                    <Icon icon="tabler:arrow-left" className="~w-6/8 ~h-6/8 z-10" />
                </button>
            </div>
            
            <section className="w-min h-full flex items-center ~md/2xl:~gap-8/12">
                <header className="flex items-center ~gap-2/4">
                    <button className="md:hidden w-8 h-8 rounded-full grid place-items-center relative group" onClick={toggleMenu}>
                        <div className="w-full h-full bg-zinc-800 bg-opacity-20 absolute rounded-full group-hover:scale-100 scale-0 transition-transform"></div>
                        <Icon icon="tabler:menu-2" className="w-6 h-6 z-10" />
                    </button>

                    <Link to="/" className="~text-lg/2xl font-black tracking-widest">PAVADINIMAS</Link>
                </header>

                <Link 
                        to="/produktai" 
                        className="hidden md:block text-base relative after:bg-slate-400 after:absolute after:h-0.5 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
                    >
                        Produktai
                    </Link>
            </section>

            <section className="w-min h-full flex items-center ~gap-2/6">
                {
                    user
                    &&
                    <>
                        <Link to="/transakcijos" className="w-8 h-8 rounded-full grid place-items-center relative group">
                            <div className="w-full h-full bg-zinc-800 bg-opacity-20 absolute rounded-full group-hover:scale-100 scale-0 transition-transform"></div>
                            <Icon icon="tabler:receipt" className="w-6 h-6 z-10" />
                        </Link>

                        <Link to="/krepselis" className="w-8 h-8 rounded-full grid place-items-center relative group">
                            <div className="w-full h-full bg-zinc-800 bg-opacity-20 absolute rounded-full group-hover:scale-100 scale-0 transition-transform"></div>
                            <Icon icon="tabler:basket" className="w-6 h-6 z-10" />
                        </Link>
                    </>
                }

                {
                    user
                    ?
                    <div className="w-min h-min relative" ref={userRef}>
                        <button className="w-8 h-8 rounded-full grid place-items-center relative group" onClick={() => setOpen(!open)}>
                            <div className="w-full h-full bg-zinc-800 bg-opacity-20 absolute rounded-full group-hover:scale-100 scale-0 transition-transform"></div>
                            <Icon icon="tabler:user" className="w-6 h-6 z-10" />
                        </button>

                        {
                            open && <NavbarDropdown />
                        }
                    </div>
                    :
                    <Link 
                        to="/" 
                        className="hidden md:block text-base relative after:bg-slate-400 after:absolute after:h-0.5 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
                    >
                        Prisijungti
                    </Link>
                }
            </section>
        </nav>
    )
}