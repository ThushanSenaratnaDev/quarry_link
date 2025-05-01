import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5001");

const ChatWidget = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Failed to load messages", err));

    socket.emit("join_global", currentUser.id);
    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("new_message");
    };
  }, [currentUser.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const msg = {
      senderId: currentUser.id,
      senderName: currentUser.name,
      content,
      timestamp: new Date(),
    };
    socket.emit("global_message", msg);
    setContent("");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "40px",
        zIndex: 1000,
        width: "25%",
      }}
    >
      {isOpen ? (
        <div
          style={{
            width: "100%",
            height: "400px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "0.5rem 1rem",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "92%",
            }}
          >
            <span>Chat with Order Manager</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>

          {/* Chat body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
              width: "100%",
            }}
          >
            {/* Scrollable message area */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                padding: "0.5rem",
                display: "flex",
                flexDirection: "column",
                borderBottom: "1px solid #ccc",
                width: "92%",
              }}
            >
              {messages.map((msg, index) => {
                const isOwnMessage =
                  msg.sender === currentUser.id ||
                  msg.senderId === currentUser.id;

                return (
                  <div
                    key={index}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: isOwnMessage ? "#dcf8c6" : "#f1f0f0",
                        borderRadius: "10px",
                        padding: "8px 12px",
                        maxWidth: "70%",
                        textAlign: "left",
                        marginLeft: isOwnMessage ? "auto" : "0",
                      }}
                    >
                      {!isOwnMessage && (
                        <strong
                          style={{ display: "block", marginBottom: "4px" }}
                        >
                          {msg.senderName}
                        </strong>
                      )}
                      <p style={{ margin: 0 }}>{msg.content}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div
              style={{
                display: "flex",
                padding: "0.5rem",
                gap: "0.5rem",
                width: "92%",
              }}
            >
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type message..."
                style={{ flex: 1, padding: "0.5rem" }}
              />
              <button onClick={sendMessage} disabled={!content.trim()}>
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: "12px 20px",
            borderRadius: "30px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            cursor: "pointer",
          }}
        >
          💬 Chat with Order Manager
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
