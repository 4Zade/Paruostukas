import CartItem from "../../components/Cart/cart.component"
import CheckoutForm from "../../components/forms/checkout.form";
import { useCart } from "../../contexts/cart.context";

export default function CheckoutPage() {
    const { cart, addQuantity, removeQuantity, removeItem } = useCart();

    return (
        <main className="w-full h-full flex flex-col md:flex-row pb-6 md:px-0 md:pr-6">
            <section className="w-full grow hidden md:flex flex-col gap-4 px-6">
                {
                    cart && cart.items.length > 0 ? cart.items.map(item => {
                        return (
                            <CartItem key={item._id} id={item.productId} quantity={item.quantity} addQuantity={addQuantity} removeQuantity={removeQuantity} removeItem={removeItem} />
                        )
                    })
                    :
                    <h1>Produktų nėra</h1>
                }
            </section>

            <section className="w-full md:w-1/3 bg-slate-100 rounded-2xl">
                <CheckoutForm />
            </section>
        </main>
    )
}