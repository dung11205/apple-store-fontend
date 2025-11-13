// src/pages/ProductList.jsx
import { useEffect, useState } from "react";
import { ShoppingCart, Flame, Package } from "lucide-react";
import { getProducts } from "../api/productApi";

// --- ProductCard ---
function ProductCard({ product }) {
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
      .format(price)
      .replace("₫", "đ");

  const getStockInfo = () => {
    const stockRatio = product.stock / (product.stockTotal || 10);
    if (stockRatio <= 0) {
      return { color: "bg-gray-100 text-gray-500", text: "Hết hàng" };
    }
    if (stockRatio <= 0.2) {
      return { color: "bg-red-50 text-red-600", text: "Sắp hết" };
    }
    if (stockRatio <= 0.5) {
      return { color: "bg-amber-50 text-amber-600", text: "Còn ít" };
    }
    return { color: "bg-green-50 text-green-600", text: "Còn hàng" };
  };

  const handleImageError = (e) => {
    e.target.src = "/placeholder.png";
  };

  const imageUrl =
    product.images && product.images.length > 0
      ? `http://localhost:3000${product.images[0]}`
      : "/placeholder.png";

  const stockInfo = getStockInfo();
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 hover:border-blue-200">
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          onError={handleImageError}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Stock Badge */}
        <div className={`absolute top-3 right-3 ${stockInfo.color} px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm`}>
          {stockInfo.text}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded-lg text-gray-800 font-bold">
              HẾT HÀNG
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors cursor-pointer">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mb-3">
          <span className="text-xl font-bold text-red-600">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Stock Info */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <Package className="w-4 h-4" />
          <span>
            Còn <strong className="text-gray-900">{product.stock}</strong> / {product.stockTotal || 10} suất
          </span>
        </div>

        {/* Action Button */}
        <button 
          disabled={isOutOfStock}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            isOutOfStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}</span>
        </button>
      </div>
    </div>
  );
}

// --- ProductList Component ---
export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Container căn giữa
  const containerClass = "pt-28 flex justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white";

  // Grid cố định 5 cột
  const gridClass = "max-w-[1600px] w-full grid grid-cols-5 gap-6";

  if (loading) {
    return (
      <div className={containerClass}>
        <div className={gridClass}>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-10 bg-gray-300 rounded-xl w-full" />
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
          <div className="text-center py-16 col-span-full">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          products.map((product) => <ProductCard key={product._id} product={product} />)
        )}
      </div>
    </div>
  );
}
