import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getRole } from "../utils/auth";

export default function AdminRoute({ children }) {
  const isAuth = isAuthenticated();
  const role = getRole();
  const location = useLocation();

  // Nếu chưa đăng nhập -> chuyển hướng đến trang admin login
  if (!isAuth) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Nếu đăng nhập nhưng không phải admin -> đưa về trang chủ
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Nếu là admin -> cho phép truy cập
  return children;
}