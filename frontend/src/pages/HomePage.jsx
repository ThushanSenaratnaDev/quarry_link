import React from "react";
import Header from "../components/Header";
import HomeBody from "../components/HomeBody";
import Footer from "../components/Footer";
import styles from "../pages/pageCss/HomePage.module.css";

const HomePage = () => {
  return (
    <div className={styles.homePage}>
    <Header />
    <main className={styles.mainContent}>
        <HomeBody />
    </main>
    <Footer />
</div>
  );
};

export default HomePage;