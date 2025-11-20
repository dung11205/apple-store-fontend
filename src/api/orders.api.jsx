// src/api/orders.api.js
import axios from "axios";
import { getToken } from "../utils/auth";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // nhớ thêm /api vì main.ts đã setGlobalPrefix('api')
});

// Thêm Authorization header nếu có token
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tạo đơn hàng (user)
export const createOrder = (orderData) => API.post("/orders", orderData);

// Lấy tất cả đơn (admin)
export const getOrders = () => API.get("/orders");

// Lấy 1 đơn theo id (admin)
export const getOrderById = (orderId) => API.get(`/orders/${orderId}`);

// Cập nhật trạng thái đơn hàng (admin)
export const updateOrderStatus = (orderId, status) =>
  API.patch(`/orders/${orderId}/status`, { status });

// User xem đơn hàng của mình
export const getUserOrders = (phone) => API.get(`/orders/user/${phone}`);

// user và adm hủy đơn hàng
// User hủy đơn hoặc admin hủy đơn
export const cancelOrder = async (orderId) => {
  return await API.patch(`/orders/${orderId}/status`, { status: "cancelled" });
};
