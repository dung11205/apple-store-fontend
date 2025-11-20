import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, cancelOrder } from "../../api/orders.api";
import styles from "./AdminOrders.module.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lấy tất cả đơn hàng
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

  // Cập nhật trạng thái đơn
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

  // Hủy đơn (chỉ cập nhật trạng thái)
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;

    try {
      await cancelOrder(orderId); // giờ PATCH status thành "cancelled"
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (err) {
      console.error("Hủy đơn thất bại:", err.response || err);
      alert("Hủy đơn thất bại.");
    }
  };

  // Chuyển status sang label tiếng Việt
  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Đang chuẩn bị";
      case "shipped":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return status || "Chưa xác nhận";
    }
  };

  if (loading) return <p>Đang tải đơn hàng...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quản lý đơn hàng</h2>

      {orders.length === 0 && <p>Chưa có đơn hàng nào.</p>}

      <div className={styles.list}>
        {orders.map((order) => (
          <div key={order._id} className={styles.orderCard}>
            <div className={styles.row}>
              <span className={styles.label}>Khách hàng:</span>
              <span>
                {order.name} - {order.phone}
              </span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Địa chỉ:</span>
              <span>{order.address}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Sản phẩm:</span>
              <span>
                {order.products
                  .map((p) => `${p.name} (${p.quantity})`)
                  .join(", ")}
              </span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Trạng thái:</span>
              <span className={styles.status}>{getStatusLabel(order.status)}</span>
            </div>

            <div className={styles.actions}>
              <button
                className={`${styles.btn} ${styles.blue}`}
                onClick={() => handleStatusChange(order._id, "pending")}
              >
                Đang chuẩn bị
              </button>

              <button
                className={`${styles.btn} ${styles.green}`}
                onClick={() => handleStatusChange(order._id, "shipped")}
              >
                Đang giao
              </button>

              <button
                className={`${styles.btn} ${styles.gray}`}
                onClick={() => handleStatusChange(order._id, "delivered")}
              >
                Đã giao
              </button>

              {/* Nút hủy đơn */}
              {order.status !== "cancelled" && order.status !== "delivered" && (
                <button
                  className={`${styles.btn} ${styles.red}`}
                  onClick={() => handleCancelOrder(order._id)}
                >
                  Hủy đơn
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
