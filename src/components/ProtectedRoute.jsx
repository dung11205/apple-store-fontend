import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../utils/auth";

const ProtectedAdminRoute = ({ children }) => {
  const auth = isAuthenticated();
  const role = getRole();
  return auth && role === "admin" ? children : <Navigate to="/login" replace />;
};

export default ProtectedAdminRoute;