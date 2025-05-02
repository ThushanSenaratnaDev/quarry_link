import React from "react";
import Header from "../components/Header";
import HomeBody from "../components/HomeBody";
import Footer from "../components/Footer";
import "../pages/pageCss/HomePage.css"; // Add a HomePage.css!

const HomePage = () => {
  return (
    <div className="homepage">
      <Header></Header>
      <main className="main-content">
        <HomeBody />
      </main>
      <Footer></Footer>
      
    </div>
  );
};

export default HomePage;