import React, { useState } from "react";
import { createOrder } from "../api/orders.api";
import { useCart } from "../context/CartContext";

export default function CheckoutModal({ isOpen, onClose }) {
  const { cartItems, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.address) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    try {
      setLoading(true);
      await createOrder({ buyer: form, products: cartItems });
      clearCart();
      onClose();
      alert("Đặt hàng thành công!");
    } catch (err) {
      setError(err.message || "Đặt hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative bg-white p-6 rounded-xl max-w-md w-full z-10">
        <h2 className="text-xl font-semibold mb-4">Thông tin người mua</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            {loading ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        </form>
      </div>
    </div>
  );
}
