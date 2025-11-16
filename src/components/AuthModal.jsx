import React, { useState, useEffect, useRef } from "react";
import { FiX, FiMail, FiLock, FiUserPlus, FiUser } from "react-icons/fi";
import { loginUser, registerUser } from "../api/authApi";
import { saveAuth, isAuthenticated, getRole } from "../utils/auth";
import styles from "./AuthModal.module.css";

const AuthModal = ({ isOpen, onClose, initialTab = "login" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isCurrentAdmin = isAuthenticated() && getRole() === "admin";
  const loginEmailRef = useRef(null);
  const registerNameRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const firstInput = activeTab === "login" 
          ? loginEmailRef.current 
          : registerNameRef.current;
        firstInput?.focus();
      }, 200);
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(loginForm.email)) { setError("Email không hợp lệ"); return; }
    if (loginForm.password.length < 6) { setError("Mật khẩu phải ít nhất 6 ký tự"); return; }
    setLoading(true); setError("");
    try {
      const res = await loginUser(loginForm);
      const userRole = res.user?.role || "user";
      saveAuth(res.access_token, userRole);
      onClose();
      window.location.reload();
    } catch (err) { setError(err.message || "Đăng nhập thất bại"); }
    setLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerForm.name.trim().length < 2) { setError("Tên phải ít nhất 2 ký tự"); return; }
    if (!validateEmail(registerForm.email)) { setError("Email không hợp lệ"); return; }
    if (registerForm.password.length < 6) { setError("Mật khẩu phải ít nhất 6 ký tự"); return; }
    setLoading(true); setError("");
    try {
      const data = isCurrentAdmin ? registerForm : { ...registerForm, role: "user" };
      await registerUser(data);
      setActiveTab("login");
      setError("Đăng ký thành công! Vui lòng đăng nhập.");
      setRegisterForm({ name: "", email: "", password: "", role: "user" });
    } catch (err) { setError(err.message || "Đăng ký thất bại"); }
    setLoading(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <FiX className={styles.closeBtn} onClick={onClose} />

        {/* Tabs */}
        <div className={styles.tabs}>
          {["login", "register"].map((tab) => (
            <div
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "login" ? "Đăng nhập" : "Đăng ký"}
            </div>
          ))}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {activeTab === "login" ? (
          <form onSubmit={handleLoginSubmit}>
            <div className={styles.formGroup}>
              <input
                ref={loginEmailRef}
                className={styles.input}
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              />
              <FiMail className={styles.icon} />
            </div>
            <div className={styles.formGroup}>
              <input
                className={styles.input}
                type="password"
                placeholder="Mật khẩu"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
              <FiLock className={styles.icon} />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              <FiUser /> {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className={styles.formGroup}>
              <input
                ref={registerNameRef}
                className={styles.input}
                type="text"
                placeholder="Họ và tên"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              />
              <FiUserPlus className={styles.icon} />
            </div>
            <div className={styles.formGroup}>
              <input
                className={styles.input}
                type="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              />
              <FiMail className={styles.icon} />
            </div>
            <div className={styles.formGroup}>
              <input
                className={styles.input}
                type="password"
                placeholder="Mật khẩu"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              />
              <FiLock className={styles.icon} />
            </div>
            {isCurrentAdmin && (
              <div className={styles.formGroup}>
                <select
                  className={styles.input}
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              <FiUserPlus /> {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
