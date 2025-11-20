import { useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";

export default function UserOrders() {
  const { orders, clearCart, cartLoaded } = useContext(CartContext);

  useEffect(() => {
    console.log("CartContext orders:", orders);
    console.log("Cart loaded:", cartLoaded);
  }, [orders, cartLoaded]);

  const getStatusBadge = (status) => {
    const map = {
      pending: { color: "yellow", label: "Đang chuẩn bị" },
      shipped: { color: "green", label: "Đang giao" },
      delivered: { color: "purple", label: "Đã giao" },
      cancelled: { color: "red", label: "Đơn hàng đã bị hủy" },
    };
    const { color, label } = map[status] || { color: "gray", label: "Đang xử lý" };
    return <span className={`px-2 py-1 rounded-full text-white bg-${color}-500`}>{label}</span>;
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn này?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/orders/user/${orderId}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Hủy đơn thất bại");

      // Cập nhật local state orders
      orders.forEach((o) => {
        if (o._id === orderId || o.id === orderId) o.status = "cancelled";
      });

      clearCart();
      console.log("Order cancelled:", orderId);
    } catch (err) {
      console.error(err);
      alert("Hủy đơn thất bại.");
    }
  };

  if (!cartLoaded) return <p className="p-4 text-center">Đang tải giỏ hàng...</p>;

  console.log("Rendering UserOrders with orders:", orders);

  if (!orders || orders.length === 0) return <p className="p-4 text-center">Bạn chưa có đơn hàng nào.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📦 Đơn hàng của bạn</h1>

      {orders.map((order) => {
        const orderId = order._id || order.id;
        const products = order.products || [];
        const total = products.reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 0), 0);

        return (
          <div key={orderId} className="border p-4 mb-4 rounded-lg shadow-sm">
            <div className="mb-2 flex justify-between items-center">
              <span className="font-semibold text-lg">Đơn hàng #{orderId}</span>
              <span>{getStatusBadge(order.status)}</span>
            </div>

            <p className="text-sm mb-1">Người nhận: {order.name}</p>
            <p className="text-sm mb-1">SĐT: {order.phone}</p>
            <p className="text-sm mb-2">Địa chỉ: {order.address}</p>
            <p className="text-sm mb-2">
              Ngày đặt: {new Date(order.createdAt || order.created_at).toLocaleString()}
            </p>

            <div className="border-t pt-2">
              {products.map((product) => {
                const productId = product._id || product.id || product.productId;
                return (
                  <div key={productId} className="flex justify-between py-1">
                    <span>{product.name} x {product.quantity}</span>
                    <span>{((product.price || 0) * (product.quantity || 0)).toLocaleString()} VNĐ</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-2 font-semibold text-right">
              Tổng: {total.toLocaleString()} VNĐ
            </div>

            {(order.status === "pending" || order.status === "shipped") && (
              <div className="mt-2 text-right">
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => handleCancel(orderId)}
                >
                  Hủy đơn
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
