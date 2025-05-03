import React from "react";

const ChatButton = ({ onClick }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "110px",
        right: "20px",
        width: "250px",
        height: "3%",
        padding: "0",
      }}
    >
      <button
        onClick={onClick}
        style={{
          padding: "12px 20px",
          borderRadius: "10px",
          backgroundColor: "#052962",
          color: "white",
          border: "none",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        💬 Chat with Inventory Manager
      </button>
    </div>
  );
};

export default ChatButton;
