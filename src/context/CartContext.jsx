/* eslint-disable react-refresh/only-export-components */
// src/context/CartContext.jsx
import { createContext, useState, useEffect } from "react";
import { isAuthenticated, getUserInfo, getToken } from "../utils/auth";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartItems, setCartItems] = useState(0);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [orders, setOrders] = useState([]);

  const getStorageKey = () => {
    if (!isAuthenticated()) return "cart_guest";
    const user = getUserInfo();
    return user?.id || user?._id ? `cart_user_${user.id || user._id}` : "cart_guest";
  };

  const mergeGuestCart = () => {
    const guestCart = JSON.parse(localStorage.getItem("cart_guest")) || [];
    const key = getStorageKey();
    const userCart = JSON.parse(localStorage.getItem(key)) || [];

    const merged = [...userCart];
    guestCart.forEach((item) => {
      const idx = merged.findIndex((i) => i._id === item._id);
      if (idx > -1) merged[idx].quantity += item.quantity;
      else merged.push(item);
    });

    localStorage.setItem(key, JSON.stringify(merged));
    localStorage.removeItem("cart_guest");
  };

  const loadCart = () => {
    setCart([]);
    setCartItems(0);

    try {
      const key = getStorageKey();
      const data = localStorage.getItem(key);
      const storedCart = data ? JSON.parse(data) : [];

      const formatted = storedCart.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image || "/placeholder.png",
      }));

      setCart(formatted);
      setCartItems(formatted.reduce((sum, item) => sum + item.quantity, 0));
    } catch (err) {
      console.error("Lỗi load giỏ hàng:", err);
      setCart([]);
      setCartItems(0);
    } finally {
      setCartLoaded(true);
    }
  };

  const loadOrders = async () => {
    if (!isAuthenticated()) return setOrders([]);
    const user = getUserInfo();
    if (!user?.phone) return setOrders([]);

    try {
      const res = await axios.get(`http://localhost:3000/api/orders/user/${user.phone}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setOrders(Array.isArray(res.data) ? res.data : res.data.orders || []);
    } catch (err) {
      console.error("Lỗi load orders:", err);
      setOrders([]);
    }
  };

  const updateCart = (newCart) => {
    try {
      const key = getStorageKey();
      localStorage.setItem(key, JSON.stringify(newCart));
      setCart(newCart);
      setCartItems(newCart.reduce((sum, item) => sum + item.quantity, 0));
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error("Lỗi lưu giỏ hàng:", err);
    }
  };

  const addToCart = (product, quantity = 1) => {
    const current = [...cart];
    const idx = current.findIndex((item) => item._id === product._id);

    if (idx > -1) current[idx].quantity += quantity;
    else current.push({ ...product, quantity });

    updateCart(current);
  };

  const removeFromCart = (productId) => {
    updateCart(cart.filter((item) => item._id !== productId));
  };

  const clearCart = () => {
    updateCart([]);
  };

  useEffect(() => {
    loadCart();
    loadOrders();

    const handleChange = () => {
      loadCart();
      loadOrders();
    };

    window.addEventListener("cart-updated", handleChange);
    window.addEventListener("storage", (e) => {
      if (e.key && e.key.startsWith("cart_")) handleChange();
    });
    window.addEventListener("auth-changed", () => {
      mergeGuestCart();
      handleChange();
    });

    return () => {
      window.removeEventListener("cart-updated", handleChange);
      window.removeEventListener("storage", handleChange);
      window.removeEventListener("auth-changed", handleChange);
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        cartLoaded,
        orders,
        addToCart,
        removeFromCart,
        clearCart,
        updateCart,
        loadOrders,
      }}
    >
      {cartLoaded ? children : <div className="text-center py-20">Đang tải giỏ hàng...</div>}
    </CartContext.Provider>
  );
};
