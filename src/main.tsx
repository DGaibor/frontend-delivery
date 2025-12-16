import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { RegisterPage } from '@/pages/register/Register.tsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
               path: "login",
                element: <div>Login Page</div>,
            },
            {
                path: "register",
                element: <RegisterPage/>,
            },
            {
                path: "shop",
                element: <div>Shop Page</div>,
            }
        ]
            
    },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
