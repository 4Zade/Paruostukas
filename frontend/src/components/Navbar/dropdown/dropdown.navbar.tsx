import { Icon } from "@iconify/react/dist/iconify.js";
import { useAuth } from "../../../contexts/auth.context";

export default function NavbarDropdown() {
    const { logout } = useAuth();

    return (
        <div className="w-min h-min p-1 bg-slate-200 absolute top-10 right-0 whitespace-nowrap flex flex-col gap-1 rounded-lg select-none">
            <li className="flex items-center gap-2 w-full h-min px-3 py-1 hover:bg-slate-100 rounded-md cursor-pointer" onClick={() => logout()}>
                <Icon icon="tabler:user" className="w-6 h-6" />
                <span>Atsijungti</span>
            </li>
        </div>
    )
}