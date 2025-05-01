import Message from "../models/Message.js";

// Get all chat messages
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }); // Oldest first
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages" });
  }
};

export const saveSocketMessage = async ({
  senderId,
  senderName,
  content,
  timestamp,
}) => {
  const message = new Message({
    sender: senderId,
    senderName,
    content,
    timestamp: timestamp || new Date(),
  });
  return await message.save();
};
