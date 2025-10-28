import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductList from "./pages/ProductList";
import DashboardAdmin from "./pages/DashboardAdmin";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductList />} />

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
    </>
  );
}
