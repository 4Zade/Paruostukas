import { Icon } from "@iconify/react/dist/iconify.js";

export default function PageNotFound() {
    const backButton = () => {
        window.history.back();
    }

    return (
        <main className="w-full h-full flex flex-col items-center justify-center gap-4">
            <h1 className="text-8xl font-bold">404</h1>
            <h2 className="text-4xl uppercase">Puslapis nerastas</h2>
            <button
                className="relative after:bg-black after:absolute after:h-0.5 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer flex items-center gap-2 text-xl"
                onClick={backButton}
            >
                <Icon icon="tabler:arrow-left" className="w-6 h-6" />
                Grįžti
            </button>
        </main>
    )
}