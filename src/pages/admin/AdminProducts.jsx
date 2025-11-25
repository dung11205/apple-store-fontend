import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import { FiLoader, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./AdminProducts.css";

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
    description: "",
    category: "",
  });

  // Danh sách category từ navbar
  const categories = ["Apple", "Mac", "iPad", "iPhone", "Watch", "AirPods", "Phụ Kiện"];

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

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, images: files }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category) return;
    setLoadingAction(true);

    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("price", formData.price);
      fd.append("stock", formData.stock || 0);
      fd.append("description", formData.description);
      fd.append("category", formData.category);
      if (formData.images.length > 0) {
        Array.from(formData.images).forEach((file) => fd.append("images", file));
      }

      if (editingProduct) {
        await axios.put(
          `http://localhost:3000/api/products/${editingProduct._id}`,
          fd,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditingProduct(null);
      } else {
        await axios.post("http://localhost:3000/api/products", fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddingProduct(false);
      }

      setFormData({ name: "", price: "", stock: "", images: [], description: "", category: "" });
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Không thể thêm/sửa sản phẩm");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(products);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setProducts(reordered);

    try {
      const token = getToken();
      await axios.put(
        "http://localhost:3000/api/products/reorder",
        { productIds: reordered.map((p) => p._id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Không thể cập nhật thứ tự sản phẩm:", err);
    }
  };

  if (loading) {
    return (
      <div className="admin-products loading">
        <FiLoader />
        Đang tải sản phẩm...
      </div>
    );
  }

  return (
    <div className="admin-products">
      {error && <div className="error">{error}</div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Danh sách sản phẩm</h2>
        <button className="btn-add" onClick={() => setAddingProduct(true)}>
          <FiPlus style={{ marginRight: "0.5rem" }} />
          Thêm sản phẩm
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Mô tả</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <Droppable droppableId="products">
              {(provided) => (
                <tbody {...provided.droppableProps} ref={provided.innerRef}>
                  {products.map((product, index) => (
                    <Draggable key={product._id} draggableId={product._id} index={index}>
                      {(provided, snapshot) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            backgroundColor: snapshot.isDragging ? "#d1fae5" : "",
                          }}
                        >
                          <td>{index + 1}</td>
                          <td>{product.images?.[0] && <img src={product.images[0]} alt={product.name} />}</td>
                          <td>{product.name || "—"}</td>
                          <td>{product.description || "—"}</td>
                          <td>{product.category || "—"}</td>
                          <td>{product.price?.toLocaleString("vi-VN") || "—"}₫</td>
                          <td>{product.stock || 0}</td>
                          <td>{new Date(product.createdAt).toLocaleDateString("vi-VN")}</td>
                          <td>
                            <button
                              className="btn-edit"
                              onClick={() => {
                                setEditingProduct(product);
                                setFormData({
                                  name: product.name,
                                  price: product.price,
                                  stock: product.stock,
                                  images: [],
                                  description: product.description || "",
                                  category: product.category || "",
                                });
                              }}
                            >
                              <FiEdit2 />
                            </button>
                            <button className="btn-delete" onClick={() => handleDeleteProduct(product._id)}>
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="9" style={{ textAlign: "center", padding: "2rem" }}>
                        <FiPlus style={{ fontSize: "3rem", opacity: 0.5 }} />
                        <div>Chưa có sản phẩm nào.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </Droppable>
          </table>
        </DragDropContext>
      </div>

      {/* Modal Thêm/Sửa */}
      {(addingProduct || editingProduct) && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h3>
            <input
              type="text"
              name="name"
              placeholder="Tên sản phẩm"
              value={formData.name}
              onChange={handleFormChange}
            />
            <textarea
              name="description"
              placeholder="Mô tả sản phẩm"
              value={formData.description}
              onChange={handleFormChange}
              rows={3}
            />
            <select name="category" value={formData.category} onChange={handleFormChange}>
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              name="price"
              placeholder="Giá"
              value={formData.price}
              onChange={handleFormChange}
            />
            <input
              type="number"
              name="stock"
              placeholder="Số lượng"
              value={formData.stock}
              onChange={handleFormChange}
            />
            <input type="file" name="images" multiple onChange={handleFormChange} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
              <button onClick={() => { setAddingProduct(false); setEditingProduct(null); }}>Hủy</button>
              <button onClick={handleSubmit} disabled={loadingAction}>
                {loadingAction ? <FiLoader className="loading" /> : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {deletingId && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Xác nhận xóa?</h3>
            <p>Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button onClick={() => setDeletingId(null)}>Hủy</button>
              <button onClick={() => handleDeleteProduct(deletingId)} disabled={loadingAction}>
                {loadingAction ? <FiLoader className="loading" /> : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
