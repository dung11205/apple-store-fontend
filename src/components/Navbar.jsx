// components/Navbar.jsx - Cập nhật để dùng modal thay vì redirect
import { useState } from "react";
import { FiSearch, FiShoppingBag, FiChevronDown, FiUser } from "react-icons/fi";
import { FaApple } from "react-icons/fa";
import { isAuthenticated, logout } from "../utils/auth";
import AuthModal from "./AuthModal"; // Import modal mới

const menuData = [
  { name: "Cửa Hàng", sub: ["App Store", "Apple Arcade", "Apple Music", "Apple TV+"] },
  { name: "Mac", sub: ["MacBook Air", "MacBook Pro", "iMac", "Mac mini", "Mac Studio"] },
  { name: "iPad", sub: ["iPad Pro", "iPad Air", "iPad (10th gen)", "iPad mini"] },
  { name: "iPhone", sub: ["iPhone 16", "iPhone 15", "iPhone 14", "iPhone SE"] },
  { name: "Watch", sub: ["Apple Watch Series 10", "Apple Watch Ultra 2", "Apple Watch SE"] },
  { name: "AirPods", sub: ["AirPods Pro 2", "AirPods 4", "AirPods Max"] },
  { name: "Phụ Kiện", sub: ["Cases & Protection", "Chargers & Cables", "Apple Pencil", "Keyboards"] },
  { name: "Hỗ Trợ", sub: ["Apple Support", "Community", "Repair", "Education"] },
];

const Navbar = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false); // State cho modal
  const [authTab, setAuthTab] = useState("login"); // Tab mặc định
  const authenticated = isAuthenticated();

  const handleAuthClick = (tab = "login") => {
    if (authenticated) {
      logout();
    } else {
      setAuthTab(tab);
      setShowAuthModal(true);
    }
  };

  const handleMouseEnter = (index) => setHoveredItem(index);
  const handleMouseLeave = () => setHoveredItem(null);

  const toggleSearch = () => setShowSearch(!showSearch);

  const closeAuthModal = () => setShowAuthModal(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-lg"> {/* z-40 để modal z-50 ở trên */}
        <div className="max-w-6xl mx-auto h-20 flex items-center justify-between px-4">
          {/* Logo - Bự hơn */}
          <FaApple
            className="text-4xl text-black cursor-pointer hover:scale-110 transition-transform duration-300 ease-out"
            onClick={() => (window.location.href = "/")}
          />

          {/* Wrapper cho menu + auth + icons gần nhau, centered */}
          <div className="flex-1 flex justify-center items-center gap-2 max-w-4xl">
            {/* Menu */}
            <ul className="flex items-center gap-12 text-base font-medium text-gray-800 list-none relative">
              {menuData.map((item, index) => (
                <li
                  key={index}
                  className="relative group cursor-pointer whitespace-nowrap"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <span className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-gray-100 transition-all duration-300 ease-out group-hover:scale-105">
                    {item.name}
                    {item.sub.length > 0 && <FiChevronDown className="text-sm opacity-60 group-hover:rotate-180 transition-transform duration-300" />}
                  </span>

                  {/* Dropdown - Đẹp hơn với animation */}
                  {hoveredItem === index && item.sub.length > 0 && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 px-6 opacity-0 animate-slideDown z-20 overflow-hidden">
                      {item.sub.map((subItem, subIndex) => (
                        <div
                          key={subIndex}
                          className="py-3 text-base text-gray-700 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-all duration-200 rounded-xl flex items-center gap-3"
                          onClick={() => (window.location.href = `/${item.name.toLowerCase()}/${subItem.toLowerCase().replace(/\s+/g, '-')}`)}
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          {subItem}
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}

              {/* Auth - Click để mở modal */}
              <li
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleAuthClick("login")}
              >
                <span className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-300 ease-out hover:scale-105 text-base font-medium text-gray-800">
                  <FiUser className="text-lg" />
                  {authenticated ? "Đăng Xuất" : "Đăng Nhập"}
                </span>
              </li>
            </ul>

            {/* Icons & Search - Gần menu, không đẩy ra ngoài */}
            <div className="flex items-center gap-4 text-2xl text-gray-700 relative">
              {/* Search với dropdown */}
              <div className="relative">
                <FiSearch 
                  className="cursor-pointer hover:scale-110 transition-transform duration-300 ease-out" 
                  onClick={toggleSearch}
                />
                {showSearch && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 px-4 z-20 animate-slideDown">
                    <div className="flex items-center gap-2 mb-2">
                      <FiSearch className="text-gray-400 text-lg" />
                      <input 
                        type="text" 
                        placeholder="Tìm kiếm sản phẩm..." 
                        className="flex-1 outline-none text-sm text-gray-700"
                      />
                      <FiX className="text-gray-400 cursor-pointer hover:text-black" onClick={toggleSearch} />
                    </div>
                    <ul className="space-y-1">
                      <li className="py-2 px-2 text-sm text-gray-600 hover:bg-blue-50 rounded cursor-pointer">iPhone 16</li>
                      <li className="py-2 px-2 text-sm text-gray-600 hover:bg-blue-50 rounded cursor-pointer">MacBook Pro</li>
                      <li className="py-2 px-2 text-sm text-gray-600 hover:bg-blue-50 rounded cursor-pointer">Apple Watch</li>
                    </ul>
                  </div>
                )}
              </div>
              <FiShoppingBag className="cursor-pointer hover:scale-110 transition-transform duration-300 ease-out relative">
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">3</span>
              </FiShoppingBag>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal Auth */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={closeAuthModal} 
        initialTab={authTab} 
      />
    </>
  );
};

export default Navbar;