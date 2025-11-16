import { useEffect, useState } from "react";
import { ShoppingCart, Package } from "lucide-react";
import { getProducts } from "../api/productApi";
import styles from "./ProductList.module.css";

function ProductCard({ product, updateCartCount }) {
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
      .format(price)
      .replace("₫", "đ");

 

  const handleImageError = (e) => {
    e.target.src = "/placeholder.png";
  };
  
  const imageUrl =
    product.images && product.images.length > 0
      ? `http://localhost:3000${product.images[0]}`
      : "/placeholder.png";

  const description = product.description || "Mô tả sản phẩm mặc định.";

  // --- Thêm vào giỏ hàng ---
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1, image: imageUrl });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
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

      <div className={styles.colorOptions}>
        {(product.colors || ['#A5D6FF', '#F8C8DC', '#000000']).map((color, index) => (
          <div
            key={index}
            className={`${styles.colorDot} ${index === 2 ? styles.selectedColor : ''}`}
            style={{ backgroundColor: color }}
          />
        ))}
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
            <ShoppingCart className={styles.cartIcon} /> Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setCartCount] = useState(0); //  Cập nhật Navbar

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        setProducts(res.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const containerClass = styles.container;
  const gridClass = styles.grid;

  if (loading) {
    return (
      <div className={containerClass}>
        <div className={gridClass}>
          {[...Array(10)].map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonImage} />
              <div className={styles.skeletonColors}>
                <div className={styles.skeletonColorDot} />
                <div className={styles.skeletonColorDot} />
                <div className={styles.skeletonColorDot} />
              </div>
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonDesc}>
                  <div />
                  <div />
                </div>
                <div className={styles.skeletonPrice} />
                <div className={styles.skeletonInstallment}>
                  <div />
                  <div />
                </div>
                <div className={styles.skeletonButtons}>
                  <div />
                  <div />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className={gridClass}>
        {products.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Package className={styles.emptyIconSvg} />
            </div>
            <p className={styles.emptyText}>Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              updateCartCount={setCartCount} //  truyền function cập nhật badge
            />
          ))
        )}
      </div>
    </div>
  );
}
