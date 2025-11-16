// Lấy giỏ hàng từ localStorage
export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

// Lưu giỏ hàng vào localStorage
export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Thêm sản phẩm vào giỏ
export const addToCart = (product) => {
  const cart = getCart();
  const existing = cart.find((item) => item._id === product._id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  return cart;
};

// Xóa sản phẩm khỏi giỏ
export const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item._id !== id);
  saveCart(cart);
  return cart;
};
// Tính tổng tiền trong giỏ
export const getTotal = () => {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
