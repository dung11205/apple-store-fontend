import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import { FiUsers, FiLoader, FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";
import "./AdminUsers.css";

export default function AdminUsers({ setError }) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });
  const [deletingId, setDeletingId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal thêm người dùng
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
  }, [setError]);

  // Chỉnh sửa user
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

  // Xóa user
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

  // Thêm user
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
    <div className="admin-users-container">
      {loading ? (
        <div className="loading">
          <FiLoader className="spinner" /> Đang tải người dùng...
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowAddModal(true)} className="btn btn-green">
              Thêm người dùng
            </button>
          </div>

          <div className="admin-users-table-wrapper">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên người dùng</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name || "—"}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`user-role ${user.role}`}>{user.role}</span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
                    <td>
                      <button onClick={() => handleEditUser(user)} className="btn btn-blue">
                        <FiEdit2 /> Sửa
                      </button>
                      <button onClick={() => handleDeleteUser(user._id)} className="btn btn-red">
                        <FiTrash2 /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="no-users">
                <FiUsers className="icon-large" /> Chưa có người dùng nào.
              </div>
            )}
          </div>

          {/* Modal xóa */}
          {deletingId && (
            <div className="modal-overlay">
              <div className="modal-box">
                <h3>Xác nhận xóa?</h3>
                <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setDeletingId(null)} className="btn btn-gray">Hủy</button>
                  <button onClick={() => handleDeleteUser(deletingId)} disabled={loadingAction} className="btn btn-red">
                    {loadingAction ? <FiLoader className="spinner" /> : "Xóa"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal sửa */}
          {showEditModal && (
            <div className="modal-overlay">
              <div className="modal-box">
                <h3>Chỉnh sửa người dùng</h3>
                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <div>
                    <label>Tên</label>
                    <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="input-field" required />
                  </div>
                  <div>
                    <label>Email</label>
                    <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="input-field" required />
                  </div>
                  <div>
                    <label>Vai trò</label>
                    <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} className="select-field" required>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => { setShowEditModal(false); setEditingUser(null); setEditForm({ name: "", email: "", role: "" }); }} className="btn btn-gray">Hủy</button>
                    <button type="submit" disabled={loadingAction} className="btn btn-blue">
                      {loadingAction ? <FiLoader className="spinner" /> : <><FiCheck /> Lưu</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal thêm */}
          {showAddModal && (
            <div className="modal-overlay">
              <div className="modal-box">
                <h3>Thêm người dùng mới</h3>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label>Tên</label>
                    <input type="text" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} className="input-field" required />
                  </div>
                  <div>
                    <label>Email</label>
                    <input type="email" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} className="input-field" required />
                  </div>
                  <div>
                    <label>Mật khẩu</label>
                    <input type="password" value={addForm.password} onChange={e => setAddForm({ ...addForm, password: e.target.value })} className="input-field" required />
                  </div>
                  <div>
                    <label>Vai trò</label>
                    <select value={addForm.role} onChange={e => setAddForm({ ...addForm, role: e.target.value })} className="select-field" required>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-gray">Hủy</button>
                    <button type="submit" disabled={loadingAction} className="btn btn-green">{loadingAction ? <FiLoader className="spinner" /> : "Thêm"}</button>
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
