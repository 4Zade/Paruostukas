import axios from "axios";

const productsLoader = async () => {
    try {
        const token = localStorage.getItem("authToken");

        const res = await axios.get("http://localhost:7000/api/products", {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true 
        });
        return res.data.products;
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