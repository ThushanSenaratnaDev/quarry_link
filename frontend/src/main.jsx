import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import ProductCatalogue from './pages/ProductCatalogue.jsx'
import InventoryControl from './pages/InventoryControl.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProductCatalogue />
  },
  {
    path: "inventory_control",
    element: <InventoryControl />
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
