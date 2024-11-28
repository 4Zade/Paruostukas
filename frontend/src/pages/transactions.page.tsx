import { useEffect } from "react";
import { useLoaderData } from "react-router-dom"
import { CartItemProps } from "../types/cart.types";
import TransactionItem from "../components/Transactions/transaction.component";

export interface TransactionProps {
    _id: string;
    email: string;
    name: string;
    items: CartItemProps[];
    total: number;
}

export default function TransactionsPage() {
    const transactions = useLoaderData() as TransactionProps[];

    useEffect(() => {
        console.log(transactions);
    }, [transactions])

    return (
        <main className="w-full h-min grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 grid-rows-auto gap-4 px-8">
            {
                transactions.length ? transactions.map(item => {
                    return (
                        <TransactionItem key={item._id} transaction={item} />
                    )
                }) 
                : 
                <h1>no transactions</h1>
            }
        </main>
    )
}