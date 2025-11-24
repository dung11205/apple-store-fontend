import React, { useState } from "react";
import { loginUser } from "../api/authApi";
import { saveAuth } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(form);
      const userRole = res.user?.role || "user";

      // Lưu token + role + user → CartContext sẽ nhận event auth-changed
      saveAuth(res.access_token, userRole, res.user);

      // Chuyển hướng theo role
      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        // Redirect user sau khi login về /my-orders
        navigate("/my-orders");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-100 text-gray-900">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
        <h2 className="text-2xl font-semibold text-center mb-6">
          <span className="font-bold text-black">Apple</span> Store
        </h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Mật khẩu"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
          />
          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-black font-medium hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
