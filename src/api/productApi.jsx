import axios from "axios";

const API = "http://localhost:3000/api/products"; // Global prefix 'api' đã có trong BE

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});


// 🛍️ API Public - Người dùng xem

export const getProducts = (params = {}) => axios.get(API, { params });

export const getProductById = (id) => axios.get(`${API}/${id}`);


// 🧑‍💼 API Admin - Quản lý sản phẩm

export const createProduct = (data) =>
  axios.post(API, data, {
    ...authHeader(),
    headers: {
      ...authHeader().headers,
      "Content-Type": "multipart/form-data",
    },
  });

export const updateProduct = (id, data) =>
  axios.put(`${API}/${id}`, data, authHeader());

export const deleteProduct = (id) => axios.delete(`${API}/${id}`, authHeader());
