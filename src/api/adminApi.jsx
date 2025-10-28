import { getToken } from "../utils/auth";

// Lấy list users (admin only)
export const getUsers = async () => {
  const token = getToken();
  const res = await fetch("/api/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Không thể tải users");
  return res.json();
};

// Update role user
export const updateUserRole = async (id, role) => {
  const token = getToken();
  const res = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error("Cập nhật thất bại");
  return res.json();
};

// Delete user
export const deleteUser = async (id) => {
  const token = getToken();
  const res = await fetch(`/api/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Xóa thất bại");
  return res.json();
};