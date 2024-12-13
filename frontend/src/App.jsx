import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import { useContext } from "react";
import { UserContext } from "./context/userContext";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./pages/admin/dashboard";
import ProductOverView from "./pages/product-overview";
import NewProduct from "./pages/admin/new-product";
import CategoryProduct from "./pages/category-product";
import Cart from "./pages/cart";
import Order from "./pages/order";
import SuccessPayment from "./pages/success-payment";
const App = () => {
  const { currentUser } = useContext(UserContext);
  const PrivetRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivetRoute>
            <Dashboard />
          </PrivetRoute>
        }
      />
      <Route path="/product/:id" element={<ProductOverView />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/add-product" element={<NewProduct />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/category/:category" element={<CategoryProduct />} />
      <Route path="/success" element={<SuccessPayment />} />
      <Route path="/order" element={<Order />} />
    </Routes>
  );
};

export default App;
