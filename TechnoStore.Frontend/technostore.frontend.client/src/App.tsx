import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import SuccessPage from "./pages/SuccessPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import CheckoutPage from "./pages/CheckoutPage";   // 👈 ДОБАВИЛИ

import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminOrderViewPage from "./pages/AdminOrderViewPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminProductEditPage from "./pages/AdminProductEditPage";

import Header from "./components/Header";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50">
        <Header />

        <main className="flex-1">
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} /> {/* 👈 НОВЫЙ РОУТ */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/success" element={<SuccessPage />} />

            {/* Admin pages (protected) */}
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrdersPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/orders/:id"
              element={
                <AdminRoute>
                  <AdminOrderViewPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProductsPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/products/new"
              element={
                <AdminRoute>
                  <AdminProductEditPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/products/:id"
              element={
                <AdminRoute>
                  <AdminProductEditPage />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
