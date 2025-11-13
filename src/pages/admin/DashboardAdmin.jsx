// src/pages/admin/DashboardAdmin.jsx
import React, { useState } from "react";
import { FiUsers, FiLogOut } from "react-icons/fi";
import { logout } from "../../utils/auth";
import AdminUsers from "./AdminUsers";
import AdminProducts from "./AdminProducts";

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState("users");
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FiUsers className="text-blue-600" />
            Bảng điều khiển Admin
          </h1>
          <button onClick={logout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            <FiLogOut /> Đăng xuất
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-white rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === "users" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Quản lý Người dùng
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === "products" ? "bg-green-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Quản lý Sản phẩm
            </button>
          </nav>
        </div>

        {/* Render tab content */}
        <div className="space-y-6">
          {activeTab === "users" ? <AdminUsers setError={setError} /> : <AdminProducts setError={setError} />}
        </div>
      </main>
    </div>
  );
}
