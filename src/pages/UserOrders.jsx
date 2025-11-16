import { useEffect, useState } from "react";
import { getUserOrders } from "../api/orders.api";
import { useLocation } from "react-router-dom";


function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const phone = location.state?.phone || "";

  useEffect(() => {
    const fetchOrders = async () => {
      if (!phone) {
        setError("Không có thông tin người dùng để hiển thị đơn hàng.");
        setLoading(false);
        return;
      }
      try {
        const res = await getUserOrders(phone);
        setOrders(res.data);
      } catch (err) {
        console.error("Lấy đơn hàng thất bại:", err.response || err);
        setError("Không thể tải đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [phone]);

  if (loading) return <p className="p-4">Đang tải đơn hàng...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  // Hàm định dạng badge trạng thái
  const getStatusBadge = (status) => {
    let color = "gray";
    let label = "Đang xử lý";

    switch (status) {
      case "pending":
        color = "yellow";
        label = "Đang xử lý";
        break;
      case "confirmed":
        color = "blue";
        label = "Đã xác nhận";
        break;
      case "shipped":
        color = "green";
        label = "Đang giao";
        break;
      case "delivered":
        color = "purple";
        label = "Đã giao";
        break;
      case "cancelled":
        color = "red";
        label = "Đã hủy";
        break;
      default:
        color = "gray";
        label = status || "Đang xử lý";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-white font-semibold bg-${color}-600`}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📦 Đơn hàng của bạn</h1>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border p-4 mb-4 rounded-lg shadow-sm"
          >
            <div className="mb-2 flex justify-between items-center">
              <span className="font-semibold text-lg">Đơn hàng #{order._id}</span>
              <span>{getStatusBadge(order.status)}</span>
            </div>

            <p className="text-sm mb-1">Người nhận: {order.name}</p>
            <p className="text-sm mb-1">SĐT: {order.phone}</p>
            <p className="text-sm mb-2">Địa chỉ: {order.address}</p>
            <p className="text-sm mb-2">Ngày đặt: {new Date(order.createdAt).toLocaleString()}</p>

            <div className="border-t pt-2">
              {order.products.map((product) => (
                <div
                  key={product.productId}
                  className="flex justify-between items-center py-1"
                >
                  <span>{product.name} x {product.quantity}</span>
                  <span>{(product.price * product.quantity).toLocaleString()} VNĐ</span>
                </div>
              ))}
            </div>

            <div className="mt-2 font-semibold text-right">
              Tổng: {order.products.reduce((sum, p) => sum + p.price * p.quantity, 0).toLocaleString()} VNĐ
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UserOrders;
