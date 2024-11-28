import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/navbar.component";
import Alert from "../components/alert.component";
import Menu from "../components/Menu/menu.component";
import { useAlert } from "../contexts/alert.context";
import { useMenu } from "../contexts/menu.context";

export default function MainLayout() {
    const { alert } = useAlert();
    const { menu } = useMenu();

    return (
        <main className="w-screen h-screen flex flex-col gap-4">
            {
                alert && <Alert />
            }
            {
                menu && <Menu />
            }
            <Navbar />
            <main className="w-full h-full">
                <Outlet />
            </main>
        </main>
    )
}