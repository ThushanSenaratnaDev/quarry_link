import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./ChatBox.css";

const socket = io("http://localhost:5001"); // backend URL

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const message = { text: input, time: new Date().toLocaleTimeString() };
      socket.emit("sendMessage", message);
      setMessages((prev) => [...prev, message]);
      setInput("");
    }
  };

  return (
    <div className="chat-box">
      <h4>Live Chat</h4>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.time}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
