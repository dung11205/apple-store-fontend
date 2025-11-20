// src/App.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductList from "./pages/ProductList";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminRoute from "./components/AdminRoute";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import UserOrders from "./pages/UserOrders";

export default function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <CartProvider>
      {!hideNavbar && <Navbar />}  {/* Navbar giờ nằm trong CartProvider */}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/my-orders" element={<UserOrders />} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route  
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <DashboardAdmin />   
            </AdminRoute>
          }
        />

        {/* Redirect tất cả route không tồn tại về / */}
        <Route path="*" element={<Navigate to="/" replace />} />  
      </Routes>
    </CartProvider>
  );
}

