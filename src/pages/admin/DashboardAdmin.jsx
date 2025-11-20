// src/pages/admin/DashboardAdmin.jsx
import React, { useState } from "react";
import { FiUsers, FiLogOut, FiBox, FiShoppingCart } from "react-icons/fi";
import { logout } from "../../utils/auth";
import AdminUsers from "./AdminUsers";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import "./DashboardAdmin.css";

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState("users");
  const [error, setError] = useState("");

  // Dummy data summary
  // const summary = {
  //   users: 120,
  //   products: 45,
  //   orders: 78,
  // };

  return (
    <div className="dashboard-admin">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title"> Admin Dashboard</h2>
        </div>

        <nav className="sidebar-nav">
          <button
            onClick={() => setActiveTab("users")}
            className={`nav-btn ${activeTab === "users" ? "active" : ""}`}
          >
            <FiUsers /> <span>Users</span>
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`nav-btn ${activeTab === "products" ? "active" : ""}`}
          >
            <FiBox /> <span>Products</span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`nav-btn ${activeTab === "orders" ? "active" : ""}`}
          >
            <FiShoppingCart /> <span>Orders</span>
          </button>
        </nav>

        <button className="logout-btn" onClick={logout}>
          <FiLogOut /> <span>Logout</span>
        </button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {error && <div className="error-message">{error}</div>}

        {/* Summary cards */}
        <div className="summary-cards">
          {/* <div className="card">
            <div className="card-title">Users</div>
            <div className="card-number">{summary.users}</div>
          </div>
          <div className="card">
            <div className="card-title">Products</div>
            <div className="card-number">{summary.products}</div>
          </div>
          <div className="card">
            <div className="card-title">Orders</div>
            <div className="card-number">{summary.orders}</div>
          </div> */}
        </div>

        <div className="tab-content">
          {activeTab === "users" && <AdminUsers setError={setError} />}
          {activeTab === "products" && <AdminProducts setError={setError} />}
          {activeTab === "orders" && <AdminOrders setError={setError} />}
        </div>
      </main>
    </div>
  );
}
