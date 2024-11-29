import axios from "axios";
import { LoaderFunctionArgs } from "react-router-dom";

const productsLoader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const page = searchParams.get("page") || "1";

    try {
        const token = localStorage.getItem("authToken");

        const res = await axios.get("http://localhost:7000/api/products?page=" + page + "&limit=24", {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true 
        });
        return res.data;
    }
    catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (err.response.data.auth === false) {
            window.location.href = "/";
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
        }
        console.error(err);
        return [];
    }
}

export default productsLoader;