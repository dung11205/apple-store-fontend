import React, { useState } from "react";
import { registerUser } from "../api/authApi";
import { saveAuth, isAuthenticated, getRole } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // Mặc định 'user'
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check nếu current user là admin để cho phép chọn role
  const isCurrentAdmin = isAuthenticated() && getRole() === "admin";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Nếu không phải admin, force role = 'user'
      const submitData = isCurrentAdmin ? form : { ...form, role: "user" };
      const res = await registerUser(submitData);

      if (!isCurrentAdmin) {
        // Nếu user thường, tự login luôn sau khi đăng ký
        saveAuth(res.access_token, res.user.role, res.user);
        navigate("/"); // redirect về trang chủ
      } else {
        // Admin tạo tài khoản → về dashboard admin
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-100 text-gray-900">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Tạo tài khoản <span className="font-bold text-black">Apple</span> Store
        </h2>
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Họ và tên"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
          />
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

          {/* Chỉ hiện select role nếu current user là admin */}
          {isCurrentAdmin && (
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Đăng ký
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-black font-medium hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
