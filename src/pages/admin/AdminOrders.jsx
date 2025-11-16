// src/pages/admin/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../api/orders.api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Lấy đơn hàng thất bại:", err.response || err);
      setError("Không thể tải đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Cập nhật trạng thái thất bại:", err.response || err);
      alert("Cập nhật trạng thái thất bại.");
    }
  };

  if (loading) return <p>Đang tải đơn hàng...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      {orders.length === 0 && <p>Chưa có đơn hàng nào.</p>}
      {orders.map((order) => (
        <div
          key={order._id}
          className="p-4 border border-gray-200 rounded-lg shadow-sm"
        >
          <p>
            <strong>Khách hàng:</strong> {order.name} - {order.phone}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {order.address}
          </p>
          <p>
            <strong>Sản phẩm:</strong>{" "}
            {order.products.map((p) => `${p.name} (${p.quantity})`).join(", ")}
          </p>
          <p>
            <strong>Trạng thái:</strong> {order.status || "Chưa xác nhận"}
          </p>
          <div className="mt-2 space-x-2">
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded"
              onClick={() => handleStatusChange(order._id, "Đang chuẩn bị")}
            >
              Đang chuẩn bị
            </button>
            <button
              className="px-3 py-1 bg-green-600 text-white rounded"
              onClick={() => handleStatusChange(order._id, "Đang giao")}
            >
              Đang giao
            </button>
            <button
              className="px-3 py-1 bg-gray-600 text-white rounded"
              onClick={() => handleStatusChange(order._id, "Đã giao")}
            >
              Đã giao
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
