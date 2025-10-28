// HomePage.jsx - Giữ nguyên placeholder, nhưng thêm một chút content để giống Apple Store hơn (hero section đơn giản)
import Navbar from "../components/Navbar"; // Giả sử import Navbar nếu dùng ở App.jsx

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar sẽ được render ở App.jsx */}
      <main className="pt-16"> {/* Offset cho fixed navbar */}
        <div className="w-full text-center py-24 text-5xl font-bold text-gray-900">
          
        </div>
   
      </main>
    </div>
  );
};

export default HomePage;