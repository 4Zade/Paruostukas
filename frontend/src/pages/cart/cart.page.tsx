import CartItem from "../../components/Cart/cart.component"
import CartFooter from "../../components/Cart/footer.cart";
import { useCart } from "../../contexts/cart.context";

export default function CartPage() {
    const { cart, total, addQuantity, removeQuantity, removeItem } = useCart();

    return (
        <main className="w-full h-full flex flex-col">
            <section className="w-full grow flex flex-col gap-4 px-6 py-4">
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

            <CartFooter total={total}/>
        </main>
    )
}