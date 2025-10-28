import React, { useState } from "react";
import { loginUser } from "../api/authApi";
import { saveAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);

      // ✅ Log để kiểm tra cấu trúc trả về
      console.log("Login Response:", res);

      // ✅ Kiểm tra tất cả khả năng (res.user.role, res.role, fallback)
      const userRole =
        res.user?.role || res.role || res.data?.role || "user";

      if (userRole !== "admin") {
        setError("Bạn không có quyền truy cập trang quản trị");
        return;
      }

      saveAuth(res.access_token || res.token, userRole);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
        <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>

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
      </div>
    </div>
  );
}
