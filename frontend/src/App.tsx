import { Route, RouterProvider, createRoutesFromElements, createBrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/main.layout'
import { ThemeProvider } from './contexts/theme.context'

import productsLoader from './loaders/products/products.loader'
import PageNotFound from './pages/fallbacks/notFound.page'
import FallbackPage from './pages/fallbacks/fallback.page'
import ProductPage from './pages/products/product.page'
import productLoader from './loaders/products/product.loader'
import HomePage from './pages/home.page'
import ProtectedLayout from './layouts/protected.layout'
import CartPage from './pages/cart/cart.page'
import ProductsPage from './pages/products/products.page'
import CheckoutPage from './pages/cart/checkout.page'
import RegisterPage from './pages/register.page'
import AddProductPage from './pages/products/add.page'
import TransactionsPage from './pages/transactions.page'
import transactionsLoader from './loaders/transaction/transactions.loader'

export default function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} HydrateFallback={FallbackPage}/>
                <Route path="/produktai" element={<ProductsPage />} loader={productsLoader} HydrateFallback={FallbackPage}></Route>
                <Route path="/registracija" element={<RegisterPage />} HydrateFallback={FallbackPage} />

                <Route element={<ProtectedLayout />}>
                    <Route path="/produktai/prideti" element={<AddProductPage />} HydrateFallback={FallbackPage}/>
                    <Route path="/produktai/:id" element={<ProductPage />} loader={productLoader} HydrateFallback={FallbackPage}/>
                    <Route path="/produktai/:id/redaguoti" element={<ProductPage />} loader={productLoader} HydrateFallback={FallbackPage}/>
                    <Route path="/krepselis" element={<CartPage />} HydrateFallback={FallbackPage}/>
                    <Route path="/atsiskaitymas" element={<CheckoutPage />} HydrateFallback={FallbackPage}/>
                    <Route path="/transakcijos" element={<TransactionsPage />} loader={transactionsLoader} HydrateFallback={FallbackPage}/>
                </Route>

                <Route path="*" element={<PageNotFound />} />
            </Route>
        ), {
            future: {
                v7_startTransition: true,
                v7_fetcherPersist: true,
                v7_normalizeFormMethod: true,
                v7_partialHydration: true,
                v7_skipActionErrorRevalidation: true,
            },
    })

    return (
        <ThemeProvider>
            <RouterProvider router={router} />
        </ThemeProvider>
    )
}