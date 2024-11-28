import axios from "axios";

const transactionsLoader = async () => {
    try {
        const token = localStorage.getItem("authToken");

        const res = await axios.get(`http://localhost:7000/api/transactions`, { 
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true 
        });
        
        return res.data.transactions;
    }
    catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (err.response.auth === false) {
            window.location.href = "/";
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
        }
        console.error(err);
        return null;
    }
}

export default transactionsLoader;