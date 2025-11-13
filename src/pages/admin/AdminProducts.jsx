import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import { FiLoader, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    images: [],
  });

  // Lấy danh sách sản phẩm
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:3000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = async (id) => {
    if (deletingId !== id) {
      setDeletingId(id);
      return;
    }
    setLoadingAction(true);
    try {
      const token = getToken();
      await axios.delete(`http://localhost:3000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      setError("Không thể xóa sản phẩm");
    } finally {
      setLoadingAction(false);
    }
  };

  // Xử lý form Thêm/Sửa
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, images: files }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) return;
    setLoadingAction(true);

    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("price", formData.price);
      fd.append("stock", formData.stock || 0);
      if (formData.images.length > 0) {
        Array.from(formData.images).forEach((file) => fd.append("images", file));
      }

      if (editingProduct) {
        // Sửa sản phẩm
        await axios.put(
          `http://localhost:3000/api/products/${editingProduct._id}`,
          fd,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditingProduct(null);
      } else {
        // Thêm sản phẩm
        await axios.post("http://localhost:3000/api/products", fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddingProduct(false);
      }

      setFormData({ name: "", price: "", stock: "", images: [] });
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Không thể thêm/sửa sản phẩm");
    } finally {
      setLoadingAction(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <FiLoader className="animate-spin mr-3 h-8 w-8" />
        Đang tải sản phẩm...
      </div>
    );

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>
        <button
          onClick={() => setAddingProduct(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Thêm sản phẩm
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-green-50 to-green-100 text-gray-700">
              <th className="p-2 text-left font-semibold">#</th>
              <th className="p-2 text-left font-semibold">Ảnh</th>
              <th className="p-2 text-left font-semibold">Tên sản phẩm</th>
              <th className="p-2 text-left font-semibold">Giá</th>
              <th className="p-2 text-left font-semibold">Số lượng</th>
              <th className="p-2 text-center font-semibold">Ngày tạo</th>
              <th className="p-2 text-center font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product._id}
                className="border-b border-gray-100 hover:bg-green-50 transition-colors"
              >
                <td className="p-2 font-medium">{index + 1}</td>
                        <td className="p-2">
                        {product.images?.[0] && (
                            <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-8 w-8 rounded-sm object-cover"
                            />
                        )}
                        </td>

                <td className="p-2 font-medium">{product.name || "—"}</td>
                <td className="p-2 text-green-600 font-semibold">
                  ₫{product.price?.toLocaleString("vi-VN") || "—"}
                </td>
                <td className="p-2">{product.stock || 0}</td>
                <td className="p-2 text-center text-gray-500 text-sm">
                  {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setFormData({
                        name: product.name,
                        price: product.price,
                        stock: product.stock,
                        images: [],
                      });
                    }}
                    className="text-blue-600 hover:text-blue-800 mr-2 transition-colors"
                    title="Sửa"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Xóa"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FiPlus className="mx-auto h-12 w-12 mb-4 opacity-50" />
            Chưa có sản phẩm nào.
          </div>
        )}
      </div>

      {/* Modal Thêm/Sửa sản phẩm */}
      {(addingProduct || editingProduct) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Tên sản phẩm"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full p-2 border rounded-md"
              />
              <input
                type="number"
                name="price"
                placeholder="Giá"
                value={formData.price}
                onChange={handleFormChange}
                className="w-full p-2 border rounded-md"
              />
              <input
                type="number"
                name="stock"
                placeholder="Số lượng"
                value={formData.stock}
                onChange={handleFormChange}
                className="w-full p-2 border rounded-md"
              />
              <input
                type="file"
                name="images"
                multiple
                onChange={handleFormChange}
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setAddingProduct(false);
                  setEditingProduct(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={loadingAction}
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md disabled:opacity-50"
              >
                {loadingAction ? <FiLoader className="animate-spin" /> : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {deletingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Xác nhận xóa?
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể
              hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDeleteProduct(deletingId)}
                disabled={loadingAction}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md disabled:opacity-50"
              >
                {loadingAction ? <FiLoader className="animate-spin" /> : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
