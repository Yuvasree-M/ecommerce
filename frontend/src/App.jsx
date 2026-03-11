import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load all pages
const Home = React.lazy(() => import("./pages/Home"));
const ProductList = React.lazy(() => import("./pages/ProductList"));
const Cart = React.lazy(() => import("./pages/Cart"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const Invoice = React.lazy(() => import("./pages/Invoice"));
const Orders = React.lazy(() => import("./pages/Orders"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const ManageProducts = React.lazy(() => import("./pages/ManageProducts"));
const AllOrders = React.lazy(() => import("./pages/AllOrders"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Transaction = React.lazy(() => import("./pages/Transaction"));

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen text-xl font-semibold">
            Loading...
          </div>
        }
      >
        <Routes>

          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route path="/invoice/:id" element={<Invoice />} />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transaction />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/manage-products"
            element={
              <ProtectedRoute adminOnly>
                <ManageProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute adminOnly>
                <ProductList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/all-orders"
            element={
              <ProtectedRoute adminOnly>
                <AllOrders />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Suspense>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;