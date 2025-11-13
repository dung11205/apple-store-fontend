import { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    alert("Cảm ơn bạn đã mua hàng!");
    localStorage.removeItem("cart");
    setCart([]);
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto mt-28 px-4">
      <h1 className="text-2xl font-bold mb-6">🛒 Giỏ hàng của bạn</h1>
      {cart.length === 0 ? (
        <p>Giỏ hàng trống. <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/")}>Mua sắm ngay</span></p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p>{item.price.toLocaleString()} VNĐ</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span>Số lượng: {item.quantity}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeItem(item._id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6 text-lg font-semibold">
            <span>Tổng cộng:</span>
            <span>{getTotal().toLocaleString()} VNĐ</span>
          </div>

          <button
            onClick={handleCheckout}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Thanh toán ngay
          </button>
        </>
      )}
    </div>
  );
}

export default CartPage;
