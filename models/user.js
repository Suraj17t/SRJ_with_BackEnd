// const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema = new mongoose.Schema({
//   name: String,
//   username: String,
//   profile_image: { type: String, default: "default-profile.png" }, 
//   // Changed to add friend Request System
//   sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   receivedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  
//   // Changed to add friend Request System 
//   //Changed for increasing/decreasing followers/following 
//   followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
//   //Changed for increasing/decreasing followers/following
// });

// userSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("User", userSchema);

// Try 2
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  profile_image: { type: String, default: "default-profile.png" },
   story: {
    file: { type: String },
    type: { type: String },
  },
  sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  receivedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.models.User || mongoose.model("User", userSchema);

// END => Try 2