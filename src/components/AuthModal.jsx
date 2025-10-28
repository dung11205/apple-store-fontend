import React, { useState, useEffect } from "react";
import { FiX, FiMail, FiLock, FiUserPlus, FiUser } from "react-icons/fi";
import { loginUser, registerUser } from "../api/authApi";
import { saveAuth, isAuthenticated, getRole } from "../utils/auth";

const AuthModal = ({ isOpen, onClose, initialTab = "login" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isCurrentAdmin = isAuthenticated() && getRole() === "admin";

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const firstInput = document.querySelector('input');
        firstInput?.focus();
      }, 200);
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const inputClass =
    "w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-black/70 focus:bg-white focus:border-black/30 outline-none transition-all duration-200";

  const iconClass =
    "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40 animate-fadeIn">
      {/* BACKDROP CLOSE */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* MODAL */}
      <div className="relative bg-white/90 shadow-2xl rounded-3xl max-w-md w-full overflow-hidden animate-scaleIn border border-white/70 backdrop-blur-xl">
        
        {/* HEADER */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold tracking-wide text-gray-900">Apple Store</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* TABS */}
        <div className="flex">
          {["login", "register"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500 hover:text-black hover:bg-gray-100/50"
              }`}
            >
              {tab === "login" ? "Đăng nhập" : "Đăng ký"}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          {activeTab === "login" ? (
            /* LOGIN FORM */
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setError("");
                try {
                  const res = await loginUser(loginForm);
                  const userRole = res.user?.role || "user";
                  saveAuth(res.access_token, userRole);
                  onClose();
                  window.location.reload();
                } catch (err) {
                  setError(err.message || "Đăng nhập thất bại");
                }
                setLoading(false);
              }}
              className="space-y-4"
            >
              <div className="relative group">
                <FiMail className={iconClass} />
                <input
                  name="email"
                  placeholder="Email"
                  type="email"
                  required
                  className={inputClass}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>

              <div className="relative group">
                <FiLock className={iconClass} />
                <input
                  name="password"
                  placeholder="Mật khẩu"
                  type="password"
                  required
                  className={inputClass}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Đang xử lý..." : <> <FiUser /> Đăng nhập </>}
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const data = isCurrentAdmin ? registerForm : { ...registerForm, role: "user" };
                  await registerUser(data);
                  setActiveTab("login");
                  setError("Đăng ký thành công! Đăng nhập ngay nhé.");
                } catch (err) {
                  setError(err.message || "Đăng ký thất bại");
                }
                setLoading(false);
              }}
              className="space-y-4"
            >
              <div className="relative group">
                <FiUserPlus className={iconClass} />
                <input
                  name="name"
                  placeholder="Họ và tên"
                  required
                  className={inputClass}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                />
              </div>

              <div className="relative group">
                <FiMail className={iconClass} />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className={inputClass}
                  required
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </div>

              <div className="relative group">
                <FiLock className={iconClass} />
                <input
                  name="password"
                  type="password"
                  placeholder="Mật khẩu"
                  className={inputClass}
                  required
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
              </div>

              {isCurrentAdmin && (
                <select
                  className={`${inputClass} bg-white`}
                  onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Đang xử lý..." : <> <FiUserPlus /> Đăng ký </>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
