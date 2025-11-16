import ProductList from "./ProductList";
import Navbar from "../components/Navbar"; 
import IPhoneCategoryNav from "../components/iPhoneCategoryNav";
import AppleFooter from "../components/AppleFooter";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar cố định */}
      <Navbar />

      {/* iPhone Category Navigation */}
      <div className="pt-[5.5rem]">
        <IPhoneCategoryNav />
      </div>

      {/* Product Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ProductList />
        </div>
      </main>

      {/* ⬇️ THÊM FOOTER APPLE Ở ĐÂY */}
      <footer className="bg-[#f5f5f7] text-[#6e6e73] mt-10 border-t">
        <AppleFooter />
      </footer>
    </div>
  );
};

export default HomePage;
