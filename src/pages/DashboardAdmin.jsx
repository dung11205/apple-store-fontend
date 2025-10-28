import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, logout } from "../utils/auth";
import { FiUsers, FiLogOut, FiLoader, FiEdit2, FiTrash2, FiPlus, FiX, FiCheck } from "react-icons/fi";

export default function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]); // Thêm state cho products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("users"); // Tab cho users/products
  const [editingUser, setEditingUser] = useState(null); // User đang edit
  const [showEditModal, setShowEditModal] = useState(false); // Modal edit user
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" }); // Form edit
  const [deletingId, setDeletingId] = useState(null); // ID đang delete để confirm
  const [loadingAction, setLoadingAction] = useState(false); // Loading cho actions

  // ✅ Lấy danh sách người dùng và sản phẩm khi vào trang
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = getToken();
        
        // Fetch users
        const usersRes = await axios.get("http://localhost:3000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersRes.data);

        // Fetch products (giả sử API endpoint là /api/products)
        const productsRes = await axios.get("http://localhost:3000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(productsRes.data);

        setError("");
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Xử lý edit user
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
      
      // Cập nhật local state
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

  // ✅ Xử lý delete user
  const handleDeleteUser = async (id) => {
    if (deletingId !== id) {
      setDeletingId(id); // Trigger confirm
      return;
    }

    setLoadingAction(true);
    try {
      const token = getToken();
      await axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Cập nhật local state
      setUsers(users.filter(u => u._id !== id));
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      setError("Không thể xóa người dùng");
    } finally {
      setLoadingAction(false);
    }
  };

  // ✅ Xử lý delete product (tương tự user)
  const handleDeleteProduct = async (id) => {
    if (deletingId !== id) {
      setDeletingId(id); // Reuse deletingId for confirm
      return;
    }

    setLoadingAction(true);
    try {
      const token = getToken();
      await axios.delete(`http://localhost:3000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setProducts(products.filter(p => p._id !== id));
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      setError("Không thể xóa sản phẩm");
    } finally {
      setLoadingAction(false);
    }
  };

  // Render table cho users
  const renderUsersTable = () => (
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
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === "admin"
                    ? "bg-black text-white"
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="p-4 text-center text-gray-500 text-sm">
                {new Date(user.createdAt).toLocaleDateString("vi-VN")}
              </td>
              <td className="p-4 text-center">
                <button
                  onClick={() => handleEditUser(user)}
                  className="text-blue-600 hover:text-blue-800 mr-2 transition-colors"
                  title="Sửa"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Xóa"
                >
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
  );

  // Render table cho products (tương tự, bạn có thể mở rộng thêm edit nếu cần)
  const renderProductsTable = () => (
    <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-green-50 to-green-100 text-gray-700">
            <th className="p-4 text-left font-semibold">#</th>
            <th className="p-4 text-left font-semibold">Tên sản phẩm</th>
            <th className="p-4 text-left font-semibold">Giá</th>
            <th className="p-4 text-left font-semibold">Số lượng</th>
            <th className="p-4 text-center font-semibold">Ngày tạo</th>
            <th className="p-4 text-center font-semibold">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id} className="border-b border-gray-100 hover:bg-green-50 transition-colors">
              <td className="p-4 font-medium">{index + 1}</td>
              <td className="p-4 font-medium">{product.name || "—"}</td>
              <td className="p-4 text-green-600 font-semibold">₫{product.price?.toLocaleString("vi-VN") || "—"}</td>
              <td className="p-4">{product.stock || 0}</td>
              <td className="p-4 text-center text-gray-500 text-sm">
                {new Date(product.createdAt).toLocaleDateString("vi-VN")}
              </td>
              <td className="p-4 text-center">
                <button
                  onClick={() => {/* Thêm handleEditProduct nếu cần */}}
                  className="text-blue-600 hover:text-blue-800 mr-2 transition-colors"
                  title="Sửa"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Xóa"
                >
                  <FiTrash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FiPlus className="mx-auto h-12 w-12 mb-4 opacity-50" />
          Chưa có sản phẩm nào. <button className="text-blue-600 hover:underline">Thêm mới</button>
        </div>
      )}
    </div>
  );

  // Confirm delete message
  const confirmDeleteMessage = deletingId ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Xác nhận xóa?</h3>
        <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeletingId(null)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              if (activeTab === "users") handleDeleteUser(deletingId);
              else handleDeleteProduct(deletingId);
            }}
            disabled={loadingAction}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
          >
            {loadingAction ? <FiLoader className="animate-spin" /> : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  // Edit modal
  const editModal = showEditModal ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chỉnh sửa người dùng</h3>
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                setEditingUser(null);
                setEditForm({ name: "", email: "", role: "" });
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loadingAction}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loadingAction ? <FiLoader className="animate-spin" /> : <FiCheck />}
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FiUsers className="text-blue-600" />
            Bảng điều khiển Admin
          </h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <FiLogOut />
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-white rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "users"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Quản lý Người dùng
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "products"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Quản lý Sản phẩm
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500">
            <FiLoader className="animate-spin mr-3 h-8 w-8" />
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === "users" ? renderUsersTable() : renderProductsTable()}
          </div>
        )}
      </main>

      {confirmDeleteMessage}
      {editModal}
    </div>
  );
}