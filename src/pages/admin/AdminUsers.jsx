import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import { FiUsers, FiLoader, FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";

export default function AdminUsers({ setError }) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });
  const [deletingId, setDeletingId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Thêm state cho modal thêm người dùng
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", role: "user" });

  // Lấy danh sách người dùng
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:3000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Hàm chỉnh sửa user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditForm({ name: user.name || "", email: user.email, role: user.role });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.email || !editForm.role) return;

    setLoadingAction(true);
    try {
      const token = getToken();
      await axios.put(`http://localhost:3000/api/users/${editingUser._id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(u => u._id === editingUser._id ? { ...u, ...editForm } : u));
      setShowEditModal(false);
      setEditingUser(null);
      setEditForm({ name: "", email: "", role: "" });
    } catch (err) {
      console.error(err);
      setError("Không thể cập nhật người dùng");
    } finally {
      setLoadingAction(false);
    }
  };

  // Hàm xóa user
  const handleDeleteUser = async (id) => {
    if (deletingId !== id) {
      setDeletingId(id);
      return;
    }
    setLoadingAction(true);
    try {
      const token = getToken();
      await axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(u => u._id !== id));
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      setError("Không thể xóa người dùng");
    } finally {
      setLoadingAction(false);
    }
  };

  // ✅ Hàm thêm người dùng mới
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.email || !addForm.password || !addForm.role) return;

    setLoadingAction(true);
    try {
      const token = getToken();
      const res = await axios.post("http://localhost:3000/api/users", addForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers([...users, res.data]);
      setShowAddModal(false);
      setAddForm({ name: "", email: "", password: "", role: "user" });
    } catch (err) {
      console.error(err);
      setError("Không thể thêm người dùng");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-500">
          <FiLoader className="animate-spin mr-3 h-8 w-8" /> Đang tải người dùng...
        </div>
      ) : (
        <>
          {/* Nút thêm người dùng */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Thêm người dùng
            </button>
          </div>

          {/* Bảng người dùng */}
          <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
                  <th className="p-4 text-left font-semibold">#</th>
                  <th className="p-4 text-left font-semibold">Tên người dùng</th>
                  <th className="p-4 text-left font-semibold">Email</th>
                  <th className="p-4 text-left font-semibold">Vai trò</th>
                  <th className="p-4 text-center font-semibold">Ngày tạo</th>
                  <th className="p-4 text-center font-semibold">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="p-4 font-medium">{index + 1}</td>
                    <td className="p-4">{user.name || "—"}</td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-black text-white" : "bg-blue-100 text-blue-800"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-500 text-sm">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:text-blue-800 mr-2 transition-colors">
                        <FiEdit2 size={18} />
                      </button>
                      <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-800 transition-colors">
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FiUsers className="mx-auto h-12 w-12 mb-4 opacity-50" />
                Chưa có người dùng nào.
              </div>
            )}
          </div>

          {/* Confirm delete */}
          {deletingId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Xác nhận xóa?</h3>
                <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa người dùng này?</p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setDeletingId(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Hủy</button>
                  <button onClick={() => handleDeleteUser(deletingId)} disabled={loadingAction} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors disabled:opacity-50">
                    {loadingAction ? <FiLoader className="animate-spin" /> : "Xóa"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Chỉnh sửa người dùng</h3>
                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                    <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                    <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => { setShowEditModal(false); setEditingUser(null); setEditForm({ name: "", email: "", role: "" }); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Hủy</button>
                    <button type="submit" disabled={loadingAction} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2">
                      {loadingAction ? <FiLoader className="animate-spin" /> : <><FiCheck /> Lưu</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm người dùng mới</h3>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                    <input type="text" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                    <input type="password" value={addForm.password} onChange={e => setAddForm({ ...addForm, password: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                    <select value={addForm.role} onChange={e => setAddForm({ ...addForm, role: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Hủy</button>
                    <button type="submit" disabled={loadingAction} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2">
                      {loadingAction ? <FiLoader className="animate-spin" /> : "Thêm"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
