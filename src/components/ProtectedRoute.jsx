import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../utils/auth";

// Chỉ cho phép người có role = 'admin' truy cập
const ProtectedAdminRoute = ({ children }) => {
  const auth = isAuthenticated();
  const role = getRole();
  return auth && role === "admin" ? children : <Navigate to="/login" replace />;
};

export default ProtectedAdminRoute;