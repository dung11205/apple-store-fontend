import React, { useEffect, useState } from 'react';
import styles from './UserOrders.module.css';

export default function UserOrders() {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('userOrders');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(orders.length === 0);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn chưa đăng nhập');
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:3000/api/orders/user', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Lỗi khi lấy đơn hàng');
        setOrders([]);
      } else if (!Array.isArray(data)) {
        setError('Backend trả về dữ liệu không đúng định dạng');
        setOrders([]);
      } else {
        setOrders(data);
        localStorage.setItem('userOrders', JSON.stringify(data));
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi kết nối server');
      setOrders([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn này?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Bạn chưa đăng nhập');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/orders/user/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Lỗi khi hủy đơn');
      } else {
        const updatedOrders = orders.map((o) =>
          o._id === orderId ? { ...o, status: 'cancelled' } : o
        );
        setOrders(updatedOrders);
        localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi hủy đơn');
      console.error(err);
    }
  };

  if (loading) return <p className={styles.loadingMsg}>Đang tải đơn hàng...</p>;
  if (error) return <p className={styles.errorMsg}>Lỗi: {error}</p>;
  if (orders.length === 0) return <p className={styles.emptyMsg}>Bạn chưa có đơn hàng nào.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Đơn hàng của bạn</h2>
      {orders.map((order) => (
        <div key={order._id} className={styles.orderCard}>
          <div className={styles.orderHeader}>
            <p style={{ fontWeight: 600 }}>Đơn ID: {order._id}</p>
            <span
              className={`${styles.orderStatus} ${
                order.status === 'pending'
                  ? styles.statusPending
                  : order.status === 'shipped'
                  ? styles.statusShipped
                  : order.status === 'delivered'
                  ? styles.statusDelivered
                  : styles.statusCancelled
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className={styles.orderInfo}>
            <p><strong>Địa chỉ:</strong> {order.address}</p>
            <p><strong>SĐT:</strong> {order.phone}</p>
          </div>

          <div>
            <strong>Sản phẩm:</strong>
            <div className={styles.products}>
              {order.products.map((p) => (
                <div key={p.productId} className={styles.productItem}>
                  <span>{p.name}</span>
                  <span>Số lượng: {p.quantity}</span>
                  <span>Giá: {p.price.toLocaleString()} VNĐ</span>
                </div>
              ))}
            </div>
          </div>

          {order.status === 'pending' && (
            <button className={styles.cancelBtn} onClick={() => cancelOrder(order._id)}>
              Hủy đơn
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
