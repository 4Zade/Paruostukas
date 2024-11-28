import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useMenu } from "../../contexts/menu.context"

export default function Menu() {
    const { toggleMenu } = useMenu();

    // if window width is bigger than md, close menu
    useEffect(() => {
        const handleResize = () => {
            toggleMenu();
        };

        window.addEventListener('resize', handleResize);

        if (window.innerWidth > 768) {
            window.removeEventListener('resize', handleResize);
        }
    }, [toggleMenu]);


    return (
        <main 
            className="
                w-full h-full flex flex-col items-center justify-center gap-12 bg-zinc-800 bg-opacity-40 backdrop-blur-sm fixed top-0 left-0 z-20 md:hidden
                text-4xl font-black text-white
            "
        >
            <Link to="/" onClick={toggleMenu}>Pagrindinis</Link>
            <Link to="/produktai" onClick={toggleMenu}>Produktai</Link>
        </main>
    )
}