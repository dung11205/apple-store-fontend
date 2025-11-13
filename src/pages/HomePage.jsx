// src/pages/HomePage.jsx
import ProductList from "./ProductList";
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar cố định */}
      <Navbar />

      {/* Product Section */}
      <main className="pt-[5.5rem]"> {/* pt tương ứng chiều cao Navbar + 1cm (~5.5rem) */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Product Grid */}
          <ProductList />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
