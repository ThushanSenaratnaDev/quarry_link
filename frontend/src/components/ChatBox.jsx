import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5001");

const ChatBox = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    // Fetch old messages from the backend
    fetch("http://localhost:5001/api/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Failed to load messages", err));

    // Socket logic
    socket.emit("join_global", currentUser.id);
    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("new_message");
    };
  }, [currentUser.id]);

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
      style={{ border: "1px solid gray", padding: "1rem", marginTop: "1rem" }}
    >
      <h4>Global Chat</h4>
      <div
        style={{
          height: "200px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "0.5rem" }}>
            <strong>{msg.senderName}</strong>
            <p style={{ margin: "0.25rem 0" }}>{msg.content}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type message..."
      />
      <button onClick={sendMessage} disabled={!content.trim()}>
        Send
      </button>
    </div>
  );
};

export default ChatBox;
