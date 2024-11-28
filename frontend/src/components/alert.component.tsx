import { useAlert } from "../contexts/alert.context"

export default function Alert() {
    const { alert } = useAlert();

    return (
        <main
            className="w-full h-min fixed bottom-0 left-0 py-2 px-4 z-20 grid place-items-center"
        >
            <div className={`w-full max-w-[420px] h-min flex flex-col animate-pop-up rounded-md p-2 ${alert?.type === 'success' ? 'bg-green-300' : 'bg-red-400'}`}>
                <h1 className="font-bold text-white text-lg">{alert?.type === 'success' ? 'Įvykdyta' : 'Klaida'}</h1>
                <p className="text-white">{alert?.message}</p>
            </div>
        </main>
    )
}