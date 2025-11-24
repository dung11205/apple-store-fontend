
// Lưu token, role, user vào localStorage
export const saveAuth = (token, role, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);

  if (user && typeof user === "object") {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }

  // Dispatch event để CartContext reload giỏ hàng
  window.dispatchEvent(new Event("auth-changed"));
};

// Lấy token từ localStorage
export const getToken = () => localStorage.getItem("token");

// Lấy role
export const getRole = () => localStorage.getItem("role");

// Lấy thông tin user
export const getUserInfo = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user) return null;
    return JSON.parse(user);
  } catch (err) {
    console.error("Lỗi parse user info:", err);
    localStorage.removeItem("user");
    return null;
  }
};

// Kiểm tra đã đăng nhập chưa
export const isAuthenticated = () => !!localStorage.getItem("token");

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");

  // Dispatch event để CartContext reset cart
  window.dispatchEvent(new Event("auth-changed"));

  // Reload trang (tuỳ nhu cầu)
  window.location.reload();
};
