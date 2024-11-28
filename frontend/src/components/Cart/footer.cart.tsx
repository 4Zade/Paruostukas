import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export default function CartFooter({ total = 0.00 }: { total: number }) {
    return (
        <footer className="w-full h-min p-4 flex flex-col gap-2 bg-slate-100 rounded-t-2xl">
            <section className="flex items-center justify-between px-4">
                <h1 className="text-lg font-bold">Viso:</h1>
                <h1 className="text-lg font-bold">{total.toFixed(2)}€</h1>
            </section>

            <Link to="/atsiskaitymas" className="w-full h-10 bg-black text-white flex items-center justify-center rounded-lg gap-2">
                <Icon icon="tabler:arrow-right" className="w-6 h-6" />
                Eiti į atsiskaitymą
            </Link>
        </footer>
    )
}