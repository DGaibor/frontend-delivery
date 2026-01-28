import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { RegisterPage } from '@/pages/register/Register.tsx';
import { LoginPage } from '@/pages/login/Login.tsx';
import { ProductsPage } from '@/pages/products/Products.tsx';
import { CartPage } from '@/pages/cart/Cart.tsx';
import { CreateProducts } from '@/pages/products/CreateProducts.tsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
               path: "login",
                element: <LoginPage />,
            },
            {
                path: "register",
                element: <RegisterPage/>,
            },
            {
                path: "products",
                element: <ProductsPage />,
            },
            {
                path: "cart",
                element: <CartPage />,
            },
            {
                path: "create-product",
                element: <CreateProducts/>,
            }
        ]
            
    },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
