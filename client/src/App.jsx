import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Header from "./Components/Header";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import PrivateDashboard from "./Components/PrivateDashboard";
import CreateProduct from "./pages/CreateProduct.jsx";
import OnlyAdminPrivateRoute from "./Components/OnlyAdminPrivateRoute.jsx";
import UpdateProductPage from "./pages/UpdateProductPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Search from "./pages/Search.jsx";
import ScrollToTop from "./Components/ScrollToTop.jsx";
import FooterPart from "./Components/FooterPart.jsx";
import Cart from "./pages/Cart.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateDashboard />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/updateProduct/:productId" element={<UpdateProductPage />} />
        </Route>
        <Route path="/product/:slug" element={<ProductPage />} />
      </Routes>
      <FooterPart />
    </BrowserRouter>
  );
}
