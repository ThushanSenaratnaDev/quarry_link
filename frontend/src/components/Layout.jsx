import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./Layout.css"; // Make sure to create Layout.css

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;