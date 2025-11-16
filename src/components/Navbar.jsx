import { useState, useEffect } from "react";
import { FiSearch, FiShoppingBag, FiChevronDown, FiUser, FiX } from "react-icons/fi";
import { FaApple } from "react-icons/fa";
import { isAuthenticated, logout } from "../utils/auth";
import AuthModal from "./AuthModal";   
import { useNavigate } from "react-router-dom"; // <-- thêm navigate
import styles from "./Navbar.module.css";

const menuData = [
  { name: "Apple", sub: [] },
  { name: "Mac", sub: [] },
  { name: "iPad", sub: [] },
  { name: "iPhone", sub: [] },
  { name: "Watch", sub: [] },
  { name: "AirPods", sub: [] },
  { name: "Phụ Kiện", sub: [] },
];

const Navbar = () => {
  const navigate = useNavigate(); // <-- hook navigate
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState("login");

  const [cartItems, setCartItems] = useState(0);

  const authenticated = isAuthenticated();

  const handleAuthClick = (tab = "login") => {
    if (authenticated) logout();
    else {
      setAuthTab(tab);
      setShowAuthModal(true);
    }
  };

  const handleMouseEnter = (index) => setHoveredItem(index);
  const handleMouseLeave = () => setHoveredItem(null);
  const toggleSearch = () => setShowSearch(!showSearch);
  const closeAuthModal = () => setShowAuthModal(false);

  // Load giỏ hàng từ localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarContainer}>
          <FaApple
            className={styles.logo}
            onClick={() => navigate("/")}
          />
          <div className="flex-1 flex justify-center items-center gap-4 max-w-4xl">
            <ul className={styles.menu}>
              {menuData.map((item, index) => (
                <li key={index} className={styles.menuItem} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                  <span>{item.name} {item.sub.length > 0 && <FiChevronDown className="text-sm opacity-60" />}</span>
                  {hoveredItem === index && item.sub.length > 0 && (
                    <div className={styles.dropdown}>
                      {item.sub.map((subItem, subIndex) => (
                        <div key={subIndex} className={styles.dropdownItem} onClick={() =>
                          navigate(`/${item.name.toLowerCase().replace(/\s+/g, '-')}/${subItem.toLowerCase().replace(/\s+/g, '-')}`)}>
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          {subItem}
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
              <li className={styles.authButton} onClick={() => handleAuthClick("login")}>
                <FiUser /> {authenticated ? "Đăng Xuất" : "Đăng Nhập"}
              </li>
            </ul>

            <div className={styles.icons}>
              <div className="relative">
                <FiSearch className="cursor-pointer" onClick={toggleSearch} />
                {showSearch && (
                  <div className={styles.searchDropdown}>
                    <div className={styles.searchInputContainer}>
                      <FiSearch className="text-gray-400 text-lg" />
                      <input type="text" placeholder="Tìm kiếm sản phẩm..." className={styles.searchInput} />
                      <FiX className="text-gray-400 cursor-pointer" onClick={toggleSearch} />
                    </div>
                  </div>
                )}
              </div>

              {/* Shopping Bag */}
                <div
                  className="relative cursor-pointer"
                  onClick={() => navigate("/cart")} // <-- thêm navigate đến trang giỏ hàng
                >
                  <FiShoppingBag />
                  {cartItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartItems}
                    </span>
                  )}

                  {/* Giữ nguyên dropdown giỏ hàng, form mua sản phẩm */}
                </div>
            </div>
          </div>
        </div>
      </nav>
      <AuthModal isOpen={showAuthModal} onClose={closeAuthModal} initialTab={authTab} />
    </>
  );
};

export default Navbar;
// eslint-disable-next-line react-refresh/only-export-components