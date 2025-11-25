import { useEffect, useState, useContext } from "react";
import { ShoppingCart } from "lucide-react";
import { getProducts } from "../api/productApi";
import { CartContext } from "../context/CartContext";
import { useLocation } from "react-router-dom";   // thêm dòng này
import styles from "./ProductList.module.css";

// ===== Component ProductCard =====
function ProductCard({ product }) {
  const { cart, updateCart } = useContext(CartContext);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
      .format(price)
      .replace("₫", "đ");

  const imageUrl =
    product.images && product.images.length > 0
      ? `http://localhost:3000${product.images[0]}`
      : "/placeholder.png";

  const handleImageError = (e) => {
    e.target.src = "/placeholder.png";
  };

  const description = product.description || "Mô tả sản phẩm mặc định.";

  const handleAddToCart = () => {
    const prodId = product._id || product.id;
    if (!prodId) {
      console.error("Sản phẩm chưa có id!");
      return;
    }

    const existing = cart.find((item) => item._id === prodId);
    let newCart;

    if (existing) {
      newCart = cart.map((item) =>
        item._id === prodId
          ? { ...item, quantity: item.quantity + 1, image: imageUrl }
          : item
      );
    } else {
      newCart = [
        ...cart,
        {
          _id: prodId,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: imageUrl,
        },
      ];
    }

    updateCart(newCart);
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={product.name}
          onError={handleImageError}
          className={styles.productImage}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.description}>{description}</p>

        <div className={styles.priceContainer}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.learnMoreBtn}>Tìm hiểu</button>
          <button className={styles.buyNowBtn} onClick={handleAddToCart}>
            <ShoppingCart className={styles.cartIcon} /> Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Component ProductList =====
export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const category = query.get("category"); // ✅ lấy category từ URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // ✅ truyền category vào API nếu có
        const res = await getProducts(category ? { category } : {});
        setProducts(res.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]); // khi category thay đổi thì gọi lại API

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.grid}>Đang tải...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
