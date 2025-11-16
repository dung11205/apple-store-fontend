import { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getCart, removeFromCart } from "../utils/cartHelper";
import { createOrder } from "../api/orders.api";
import styles from "./CartPage.module.css";

function CartPage() {
  const [cart, setCart] = useState([]);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [userInfo, setUserInfo] = useState({ name: "", phone: "", address: "" });
  const navigate = useNavigate();

  useEffect(() => {
    setCart(getCart());
  }, []);

  const removeItem = (id) => {
    const updatedCart = removeFromCart(id);
    setCart(updatedCart);
  };

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleBuyNow = (product) => {
    setCheckoutProduct(product);
    setUserInfo({ name: "", phone: "", address: "" });
  };

  const handlePlaceOrder = async () => {
    if (!userInfo.name || !userInfo.phone || !userInfo.address) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const orderData = {
      productId: checkoutProduct._id,
      productName: checkoutProduct.name,
      quantity: Number(checkoutProduct.quantity),
      name: userInfo.name,
      phone: userInfo.phone,
      address: userInfo.address,
    };

    try {
      console.log("DEBUG: GỬI ORDER", orderData);
      const res = await createOrder(orderData);
      console.log("DEBUG: RESPONSE", res.data);

      alert(`Cảm ơn ${userInfo.name} đã đặt ${checkoutProduct.name}!`);

      // Lưu phone vào localStorage để xem đơn hàng
      localStorage.setItem("userPhone", userInfo.phone);

      // Xóa sản phẩm khỏi giỏ
      const updatedCart = cart.filter((item) => item._id !== checkoutProduct._id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      setCheckoutProduct(null);
    } catch (error) {
      console.error("Đặt hàng thất bại:", error.response || error);
      alert("Đặt hàng thất bại, vui lòng thử lại!");
    }
  };

  const handleViewOrders = () => {
    const phoneToUse = userInfo.phone || localStorage.getItem("userPhone");
    if (!phoneToUse) {
      alert("Vui lòng nhập số điện thoại để xem đơn hàng đã mua!");
      return;
    }
    navigate("/my-orders", { state: { phone: phoneToUse } });
  };

  const getTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>🛒 Giỏ hàng của bạn</h1>

      {/* Nút xem đơn hàng đã mua */}
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={handleViewOrders}
      >
        📦 Xem đơn hàng đã mua
      </button>

      {cart.length === 0 ? (
        <p className={styles.emptyState}>
          Giỏ hàng trống.{" "}
          <span className={styles.emptyLink} onClick={() => navigate("/")}>
            Mua sắm ngay
          </span>
        </p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className={styles.cartItem}>
              <div className={styles.cartItemTop}>
                <div className={styles.cartItemInfo}>
                  <img src={item.image} alt={item.name} className={styles.cartItemImg} />
                  <div className={styles.cartItemDetails}>
                    <h2>{item.name}</h2>
                    <p>{item.price.toLocaleString()} VNĐ</p>
                    <p>Số lượng: {item.quantity}</p>
                  </div>
                </div>
                <div className={styles.cartItemActions}>
                  <button onClick={() => handleBuyNow(item)} className={styles.buyBtn}>
                    Mua sản phẩm
                  </button>
                  <button onClick={() => removeItem(item._id)} className={styles.removeBtn}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              {checkoutProduct?._id === item._id && (
                <div className={styles.checkoutForm}>
                  <h3>Đặt hàng: {checkoutProduct.name}</h3>
                  <input
                    type="text"
                    name="name"
                    placeholder="Tên của bạn"
                    value={userInfo.name}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={userInfo.phone}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Địa chỉ nhận hàng"
                    value={userInfo.address}
                    onChange={handleInputChange}
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={handlePlaceOrder} className={styles.checkoutBtn}>
                      Xác nhận đặt hàng
                    </button>
                    <button onClick={() => setCheckoutProduct(null)} className={styles.cancelBtn}>
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className={styles.cartTotal}>
            <span>Tổng cộng:</span>
            <span>{getTotal().toLocaleString()} VNĐ</span>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
