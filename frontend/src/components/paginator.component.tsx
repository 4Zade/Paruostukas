import { Icon } from "@iconify/react";

interface PaginatorProps {
    setPage: (page: number) => void
    page: string;
    pages: number
}

export default function Paginator({ setPage, page, pages }: PaginatorProps) {
    const goBack = () => {
        if (parseFloat(page) > 1) setPage(parseFloat(page) - 1);
        return;
    }

    const goForward = () => {
        setPage(parseFloat(page) + 1);
    }

    return (
        <div
            className="w-min h-min flex items-center gap-1 py-4"
        >
            {
                parseFloat(page) > 1 && <button className="w-8 h-8 rounded-full grid place-items-center relative group" onClick={goBack}>
                    <div className="w-full h-full bg-zinc-800 bg-opacity-20 absolute rounded-full group-hover:scale-100 scale-0 transition-transform"></div>
                    <Icon icon="tabler:arrow-left" className="w-6 h-6 z-10" />
                </button>
            }

            {
                [...Array(pages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (pageNumber == parseFloat(page)) {
                        return (
                            <button
                                key={pageNumber}
                                className="w-8 h-8 rounded-full grid place-items-center relative group"
                                onClick={() => setPage(pageNumber)}
                            >
                                <div className="w-full h-full bg-zinc-800 bg-opacity-20 absolute rounded-full group-hover:scale-100 scale-0 transition-transform"></div>
                                <span className="z-10">{pageNumber}</span>
                            </button>
                        )
                    } else {
                        return (
                            <button
                                key={pageNumber}
                                className="w-8 h-8 rounded-full grid place-items-center relative group"
                                onClick={() => setPage(pageNumber)}
                            >
                                <div className="w-full h-full bg-zinc-800 bg-opacity-20 absolute rounded-full group-hover:scale-100 scale-0 transition-transform"></div>
                                <span className="z-10">{pageNumber}</span>
                            </button>
                        )
                    }
                })             
            }

            {
                parseFloat(page) < pages && <button className="w-8 h-8 rounded-full grid place-items-center relative group" onClick={goForward}>
                    <div className="w-full h-full bg-zinc-800 bg-opacity-20 absolute rounded-full group-hover:scale-100 scale-0 transition-transform"></div>
                    <Icon icon="tabler:arrow-right" className="w-6 h-6 z-10" />
                </button>
            }
        </div>
    )
}