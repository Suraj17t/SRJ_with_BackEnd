const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageSource: { type: String, required: true },
    profile_image: { type: String },
    location: { type: String },
    created_at: { type: Date, default: Date.now },
    no_likes: { type: Number, default: 0 },
    caption: { type: String },
    hashtags: { type: [String] },
    comments: { type: Number, default: 0 }, // Storing only the number of comments
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Important
 
  // 💬 Add this:
  commentsArray: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now },
    }
  ],
},
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
