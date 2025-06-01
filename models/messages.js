const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
 
    // profileImage: {
    //   type: String, // stores image file path or filename
    //   required: true
    // },
    // IsActive: {
    //       type: String,
    //       default: " "
    // },
    // senderName: {
    //       type: String,
    //       required: true
    // },
    // messageType: {
    //       type: String,
    //       required: true
    //     },
    // messageText: {
    //   type: String,
    //   default: " ",
    // },

    // Try 2
  // senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // senderName: { type: String, required: true },
  // profileImage: { type: String, required: true },
  // messageType: { type: String, enum: ["text", "image"], required: true },
  // messageText: { type: String, default: " " },
  // isActive: { type: Boolean, default: true },
  // timestamp: { type: Date, default: Date.now }
  
  // Try 3
    room: String,
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  messageText: String,
  timestamp: { type: Date, default: Date.now }

  });
  
  const Message = mongoose.model('Message', messageSchema);
  
  module.exports = Message;
  