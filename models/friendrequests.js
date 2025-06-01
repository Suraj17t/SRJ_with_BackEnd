const mongoose = require("mongoose");

const friendRequestSchema = new mongoose.Schema({
  reqId: {
    type: String, // e.g., "div1", a custom frontend element ID
  },  
  profileImage: {
    type: String, // e.g., "/uploads/hardeep-profile-pic.jpg"
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  MutualFriends: {
    type: String
  },
  actionId: {
    type: String
  }
});

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

module.exports = FriendRequest;
