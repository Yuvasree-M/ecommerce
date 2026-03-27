import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";
import ScrollToTop from "./components/ScrollToTop";
import HomeRedirect from "./components/HomeRedirect";

/* -------- Lazy Loaded Pages -------- */

const Home = React.lazy(() => import("./pages/Home"));
const ProductList = React.lazy(() => import("./pages/ProductList"));
const Cart = React.lazy(() => import("./pages/Cart"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const Invoice = React.lazy(() => import("./pages/Invoice"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Transaction = React.lazy(() => import("./pages/Transaction"));

const Profile = React.lazy(() => import("./pages/Profile"));

const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const ManageProducts = React.lazy(() => import("./pages/ManageProducts"));
const AllOrders = React.lazy(() => import("./pages/AllOrders"));

const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Contact = React.lazy(() => import("./components/home/Contact"));
const Testimonials = React.lazy(() => import("./components/home/Testimonials"));

/* -------- App -------- */

function App() {
  return (
    <BrowserRouter>

      <ScrollToTop />
      <Navbar />

      <Suspense fallback={<Loader />}>
        <Routes>

          {/* -------- Public Routes -------- */}

          {/* Redirects logged-in users away from landing page */}
          <Route path="/" element={<HomeRedirect />} />

          <Route path="/products" element={<ProductList />} />
            <Route path="/contact" element={<Contact />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* -------- Protected User Routes -------- */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

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

          <Route
            path="/invoice/:id"
            element={
              <ProtectedRoute>
                <Invoice />
              </ProtectedRoute>
            }
          />

          {/* -------- Admin Routes -------- */}

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