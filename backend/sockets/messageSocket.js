import { saveSocketMessage } from "../controllers/messageController.js";

export const handleChatSocket = (socket, io) => {
  console.log("New client connected via WebSocket");

  socket.on("global_message", async (msg) => {
    try {
      const saved = await saveSocketMessage(msg);
      io.emit("new_message", saved);
    } catch (err) {
      console.error("Failed to save message:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
};
