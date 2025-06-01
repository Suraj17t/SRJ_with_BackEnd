const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const multer = require("multer");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Post = require("./models/Post.js");
const Message = require("./models/messages.js");
const FriendRequest = require("./models/friendrequests.js");


const sharedsession = require("express-socket.io-session");

const app = express();

// For enabling Messaging
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

// 

// MongoDB Connection
main().then(() => console.log("Connection Successful")).catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

// Middleware Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Session and Flash
// app.use(
//   session({
//     secret: "notagoodsecret",
//     resave: false,
//     saveUninitialized: false,
//   })
// );


// // For enabling Messaging
const sessionMiddleware = session({
  secret: "notagoodsecret",
  resave: false,
  saveUninitialized: false,
});

app.use(sessionMiddleware);

// Socket.IO session sharing
io.use(sharedsession(sessionMiddleware, {
  autoSave: true,
}));


// ^|^ For enabling Messaging => END

app.use(flash());

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set flash and current user globally
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "public/uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// 27/05/2025 => For story uploads
const storyStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "public/stories")),
  filename: (req, file, cb) => cb(null, "story-" + Date.now() + path.extname(file.originalname)),
});
const uploadStory = multer({ storage: storyStorage });
//END=> 27/05/2025 => For story uploads

// Bookmark Schema and Model
const BookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  created_at: { type: Date, default: Date.now }
});
const Bookmark = mongoose.model('Bookmark', BookmarkSchema);

// Authentication Middleware
const getUser = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in first!");
    return res.redirect("/auth");
  }
  next();
};

// Routes
app.get("/", (req, res) => {
  res.send("Root Working");
});

app.get("/auth", (req, res) => {
  res.render("authForm");
});

// Settings Route
app.get('/setting', isLoggedIn, (req, res) => {
  res.render('setting', { user: req.user }); // pass user data if needed
});

//


// Trying to Solve
app.get("/profile/upload", isLoggedIn, (req, res) => {
  // console.log('req.user:', req.user);
  if (!req.user) {
    return res.send("User not found");
  }
  res.render("uploadProfileImage", { user: req.user });
});

// Working => Explore Route

//END =>  Working ================================================

app.get('/explore', isLoggedIn, async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ created_at: -1 })
      .limit(12)
      .populate('author', 'profile_image name location');

    res.render('explore', {
      posts,
      user: req.user // ✅ Pass logged-in user to EJS
    });
  } catch (err) {
    console.error('Error fetching posts for explore:', err);
    res.status(500).send('Server error');
  }
});

// 
// Route to render analytics.ejs
app.get('/analytic', isLoggedIn, async (req, res) => {
  try {
    const posts = await Post.find({});
    const users = await User.find({});

    const avgLikes = posts.reduce((acc, post) => acc + post.no_likes, 0) / posts.length || 0;
    const avgComments = posts.reduce((acc, post) => acc + post.comments, 0) / posts.length || 0;

    const topLikedPosts = [...posts].sort((a, b) => b.no_likes - a.no_likes).slice(0, 5);

    const postFrequency = {};
    posts.forEach(post => {
      const date = post.createdAt.toISOString().slice(0, 10);
      postFrequency[date] = (postFrequency[date] || 0) + 1;
    });

    const userPostMap = {};
    posts.forEach(post => {
      if (post.author) {
        const authorId = post.author.toString();
        userPostMap[authorId] = (userPostMap[authorId] || 0) + 1;
      } else {
        console.warn("Post missing author:", post._id);
      }
    });

    const topUsersByPosts = Object.entries(userPostMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => {
        const user = users.find(u => u._id.toString() === id);
        return { user, count };
      });

    const hashtagMap = {};
    posts.forEach(post => {
      (post.hashtags || []).forEach(tag => {
        hashtagMap[tag] = (hashtagMap[tag] || 0) + 1;
      });
    });

    const topHashtags = Object.entries(hashtagMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    res.render('analytic', {
      posts,
      users,
      avgLikes,
      avgComments,
      topLikedPosts,
      topUsersByPosts,
      postFrequency,
      topHashtags,
    });

  } catch (err) {
    console.error('Error rendering analytics:', err);
    res.status(500).send('Internal Server Error');
  }
});


// 


// 
// 19/05/2025 => Adding API for infinte Scroll ===================================
app.get('/api/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    // Populate author profile_image for each post
    const posts = await Post.find({})
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'profile_image name');

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// END 19/04/2025

// 20/05/2025 => Working Message

app.get("/messages", isLoggedIn, async (req, res) => {
  try {
    const currentUser = "john_doe"; // Replace with actual session user

    const messages = await Message.find({}); // You can filter by user if needed

    // Group messages by sender (simulate chat list)
    const chatMap = {};
    messages.forEach(msg => {
      if (!chatMap[msg.senderName]) {
        chatMap[msg.senderName] = {
          username: msg.senderName,
          userAvatar: msg.profileImage,
          messages: [],
          lastMessage: msg.messageText
        };
      }
      chatMap[msg.senderName].messages.push({
        sender: msg.senderName,
        text: msg.messageText
      });
    });

    const chats = Object.values(chatMap);
    const selectedChat = chats[0] || null;

    res.render("messages", {
      currentUser,
      chats,
      selectedChat,
      user: req.user
    });
 
  } catch (err) {
    console.error("Error loading messages:", err);
    res.status(500).send("Internal Server Error");
  }
});


// 
app.get('/profile/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.send("User not found");

  const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });
  res.render('profiles', { user, posts });
});


app.get('/live-user-search', async (req, res) => {
  const query = req.query.q || '';
  const currentUserId = req.user?._id;

  try {
    // Find users whose name starts with the query (case-insensitive)
    const users = await User.find({ 
      name: new RegExp('^' + query, 'i'),
      _id: { $ne: currentUserId }  // exclude current user here, will add separately
    })
    .limit(5)
    .select('name username profile_image')
    .sort({ name: 1 }); // sort alphabetically ascending

    let results = users;

    // Add current user as first result if their name matches query start
    if (req.user && req.user.name.toLowerCase().startsWith(query.toLowerCase())) {
      results = [{
        _id: req.user._id,
        name: "You",
        username: req.user.username,
        profile_image: req.user.profile_image
      }, ...users];
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// END =>

// Working But Posts are not coming <=
app.get('/profiles/:id', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");

    // Fetch posts created by the user
    const posts = await Post.find({ author: user._id }); // or user: user._id depending on your schema

    res.render('profiles', { user, posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// END => Working But Posts are not coming <=


// Try 2
app.get("/profile/:id", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers")
      .populate("following");

    const posts = await Post.find({ author: user._id });

    res.render("profiles", {
      user,
      posts,
      currentUser: req.user, // <-- this is key
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading profile.");
  }
});


// Try 5 => 
app.post("/send-request/:id", isLoggedIn, async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).send("You cannot send a friend request to yourself.");
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver || !sender) {
      return res.status(404).send("User not found.");
    }

    // Check if already sent/friends
    const alreadySent = await FriendRequest.findOne({
      senderName: sender.name,
      profileImage: sender.profile_image,
    });

    if (
      sender.friends.includes(receiverId) ||
      alreadySent
    ) {
      return res.status(400).send("Already friends or request sent.");
    }

    // Create friend request document
    const newRequest = new FriendRequest({
      reqId: `req-${Date.now()}`, // unique ID for frontend use
      profileImage: sender.profile_image,
      senderName: sender.name,
      MutualFriends: "0", // logic optional
      actionId: `action-${Date.now()}`
    });

    await newRequest.save();

    // Update sender/receiver
    sender.sentRequests.push(receiverId);
    receiver.receivedRequests.push(senderId);

    await sender.save();
    await receiver.save();

    res.redirect("/posts");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending friend request.");
  }
});



app.post("/accept-request/:name", isLoggedIn, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const sender = await User.findOne({ name: req.params.name });

    if (!sender || !currentUser) return res.status(404).send("User not found.");

    // Add each other as friends
    if (!currentUser.friends.includes(sender._id)) currentUser.friends.push(sender._id);
    if (!sender.friends.includes(currentUser._id)) sender.friends.push(currentUser._id);

    // Update following/followers
    if (!currentUser.followers.includes(sender._id)) currentUser.followers.push(sender._id);
    if (!sender.following.includes(currentUser._id)) sender.following.push(currentUser._id);

    // Remove friend request
    currentUser.receivedRequests = currentUser.receivedRequests.filter(id => id.toString() !== sender._id.toString());
    sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== currentUser._id.toString());

    await FriendRequest.deleteOne({ senderName: sender.name });

    await currentUser.save();
    await sender.save();

    res.redirect("/posts?message=Request+accepted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to accept friend request.");
  }
});

app.post("/decline-request/:name", isLoggedIn, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const sender = await User.findOne({ name: req.params.name });

    if (!sender || !currentUser) return res.status(404).send("User not found.");

    // Just remove from request arrays
    currentUser.receivedRequests = currentUser.receivedRequests.filter(id => id.toString() !== sender._id.toString());
    sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== currentUser._id.toString());

    await FriendRequest.deleteOne({ senderName: sender.name });

    await currentUser.save();
    await sender.save();

    res.redirect("/posts?message=Request+declined");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to decline friend request.");
  }
});

app.post("/unfriend/:id", isLoggedIn, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const friend = await User.findById(req.params.id);

    if (!currentUser || !friend) return res.status(404).send("User not found.");

    // Remove each other from friends
    currentUser.friends = currentUser.friends.filter(id => id.toString() !== friend._id.toString());
    friend.friends = friend.friends.filter(id => id.toString() !== currentUser._id.toString());

    // Also update followers/following
    currentUser.followers = currentUser.followers.filter(id => id.toString() !== friend._id.toString());
    friend.following = friend.following.filter(id => id.toString() !== currentUser._id.toString());

    await currentUser.save();
    await friend.save();

    res.redirect("/posts?message=Unfriended+successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to unfriend.");
  }
});


app.post("/cancel-request/:id", isLoggedIn, async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).send("User not found.");
    }

    // Remove from sent and received request arrays
    sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== receiverId);
    receiver.receivedRequests = receiver.receivedRequests.filter(id => id.toString() !== senderId.toString());

    // Delete the FriendRequest document
    await FriendRequest.deleteOne({ senderName: sender.name });

    await sender.save();
    await receiver.save();

    res.redirect("/posts?message=Friend+request+cancelled");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to cancel friend request.");
  }
});

// 24/05/2025 => route for chatting 


// Try 3 => WORKING FINE < ======================================================
// After your other setup code
// io.on("connection", (socket) => {
//   console.log("New socket connection:", socket.id);

//   socket.on("join room", ({ room }) => {
//     socket.join(room);
//     console.log(`Socket ${socket.id} joined room ${room}`);
//   });

//   socket.on("chat message", async ({ room, text, senderId, receiverId }) => {
//     try {
//       // Save to DB
//       const newMessage = new Message({
//         senderId,
//         receiverId,
//         messageText: text
//       });
//       await newMessage.save();

//       // Emit to both users in room
//       io.to(room).emit("chat message", {
//         senderId,
//         receiverId,
//         messageText: text,
//         timestamp: newMessage.timestamp
//       });
//     } catch (err) {
//       console.error("Error handling chat message:", err);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Socket disconnected:", socket.id);
//   });
// });

// app.get("/chat/:friendId", async (req, res) => {
//   const me = req.user;
//   const friendId = req.params.friendId;

//   const friend = await User.findById(friendId);
//   const messages = await Message.find({
//     $or: [
//       { senderId: me._id, receiverId: friendId },
//       { senderId: friendId, receiverId: me._id }
//     ]
//   }).sort({ timestamp: 1 });

//   res.render("chatting", { me, friend, messages });
// });


// END => Try 3 => WORKING FINE < ======================================================


// <= Try 4 <= WORKING GREAT without file upload system => Messaging    
// // app.get("/chat/:friendId", async (req, res) => {
//   const me = req.user;
//   const friendId = req.params.friendId;

//   const friend = await User.findById(friendId);
//   const messages = await Message.find({
//     $or: [
//       { senderId: me._id, receiverId: friendId },
//       { senderId: friendId, receiverId: me._id }
//     ]
//   }).sort({ timestamp: 1 });

//   res.render("chatting", { me, friend, messages });
// });

// // Upload files in Messages
// app.post("/upload-message-file", upload.single("file"), async (req, res) => {
//   const { senderId, receiverId } = req.body;
//   const filePath = `/uploads/messages/${req.file.filename}`;
//   const isImage = req.file.mimetype.startsWith("image");

//   const messageText = isImage
//     ? `<img src="${filePath}" style="max-width:200px" />`
//     : `<a href="${filePath}" download>Download file</a>`;

//   const newMessage = new Message({ senderId, receiverId, messageText });
//   await newMessage.save();

//   res.json({
//     _id: newMessage._id,
//     senderId,
//     receiverId,
//     messageText,
//     timestamp: newMessage.timestamp
//   });
// });


// // END =>  Upload files in Messages


// io.on("connection", (socket) => {
//   console.log("New socket connection:", socket.id);

//   socket.on("join room", ({ room }) => {
//     socket.join(room);
//     console.log(`Socket ${socket.id} joined room ${room}`);
//   });

//   socket.on("chat message", async ({ room, text, senderId, receiverId }) => {
//     try {
//       const newMessage = new Message({ senderId, receiverId, messageText: text });
//       await newMessage.save();

//       io.to(room).emit("chat message", {
//         _id: newMessage._id,
//         senderId,
//         receiverId,
//         messageText: text,
//         timestamp: newMessage.timestamp
//       });
//     } catch (err) {
//       console.error("Error handling chat message:", err);
//     }
//   });

  


//   socket.on("edit message", async ({ _id, messageText }) => {
//     try {
//       const updated = await Message.findByIdAndUpdate(_id, { messageText }, { new: true });
//       if (updated) {
//         io.emit("message updated", { _id, messageText });
//       }
//     } catch (err) {
//       console.error("Error editing message:", err);
//     }
//   });

//   socket.on("delete message", async ({ _id }) => {
//     try {
//       await Message.findByIdAndDelete(_id);
//       io.emit("message deleted", _id);
//     } catch (err) {
//       console.error("Error deleting message:", err);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Socket disconnected:", socket.id);
//   });
// });


// END=> WORKING GREAT without file upload system <= Try 4 => Messaging

// Try 5 => Messaging

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ filePath: "/uploads/" + req.file.filename });
});

app.get("/chat/:friendId", async (req, res) => {
  const me = req.user;
  const friendId = req.params.friendId;

  const friend = await User.findById(friendId);
  const messages = await Message.find({
    $or: [
      { senderId: me._id, receiverId: friendId },
      { senderId: friendId, receiverId: me._id }
    ]
  }).sort({ timestamp: 1 });

  res.render("chatting", { me, friend, messages });
});

// Socket.io
io.on("connection", (socket) => {
  socket.on("join room", ({ room }) => {
    socket.join(room);
  });

  socket.on("chat message", async ({ room, text, senderId, receiverId, file }) => {
    try {
      const messageData = {
        senderId,
        receiverId,
        messageText: text || "",
      };
      if (file) messageData.file = file;

      const newMessage = new Message(messageData);
      await newMessage.save();

      io.to(room).emit("chat message", {
        _id: newMessage._id,
        senderId,
        receiverId,
        messageText: newMessage.messageText,
        timestamp: newMessage.timestamp,
        file: newMessage.file || null
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });

  socket.on("edit message", async ({ _id, messageText }) => {
    try {
      const updated = await Message.findByIdAndUpdate(_id, { messageText }, { new: true });
      if (updated) {
        io.emit("message updated", { _id, messageText });
      }
    } catch (err) {
      console.error("Error editing message:", err);
    }
  });

  socket.on("delete message", async ({ _id }) => {
    try {
      await Message.findByIdAndDelete(_id);
      io.emit("message deleted", _id);
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  });
});

// END => Try 5 => Messaging

// END => 24/05/2025 => Send Friend Request

// END => 22/05/2025 => 


// SIGNUP (uses name as username)

app.post("/signup", async (req, res) => {
  // console.log("Signup Form Data:", req.body);
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, username: email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Signup Successful!");
      res.redirect("/auth");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/auth");
  }
});

app.post("/signin", passport.authenticate("local", {
  failureRedirect: "/auth",
  failureFlash: true
}), (req, res) => {
  req.flash("success", "Welcome back!");
  res.redirect("/posts");
});

app.post("/login", passport.authenticate("local", {
  failureRedirect: "/auth",
  failureFlash: true,
}), (req, res) => {
  req.flash("success", "Welcome back!");
  res.redirect("/posts");
});

app.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully.");
    res.redirect("/auth");
  });
});

function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in first!");
    return res.redirect("/auth");
  }
  next();
}

// 18/4/25 ==================================================

// END 18/4/25 ==============================================

// Function to format the likes count
function formatLikes(n) {
  n = Number(n); // Ensure it's a number
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}


// Try 5 Starting Route 
app.get("/posts", getUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("friends");

    const posts = await Post.find({})
      .sort({ created_at: -1 })
      .populate("author")
      .populate("commentsArray.user");

    const messages = await Message.find({}).sort({ createdAt: -1 });

    const allRequests = await FriendRequest.find({});
    const friendrequests = [];

    for (const reqObj of allRequests) {
      const sender = await User.findOne({ name: reqObj.senderName });
      if (sender && user.receivedRequests.includes(sender._id.toString())) {
        friendrequests.push(reqObj);
      }
    }

    const bookmarks = await Bookmark.find({ userId: user._id });
    const bookmarkedPostIds = new Set(bookmarks.map(bookmark => bookmark.postId.toString()));

    const postsWithBookmarkStatus = posts.map(post => ({
      ...post._doc,
      isBookmarked: bookmarkedPostIds.has(post._id.toString()),
      formattedLikes: formatLikes(post.no_likes || 0)
    }));

    res.render("SocialMedia.ejs", {
      posts: postsWithBookmarkStatus,
      messages,
      friendrequests,
      user,
      friends: user.friends,
      message: req.query.message
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});


// // Try 5 Starting Route


// END => Trying to send FRequests

// END 25/4/25 => of displaying comments in the post =================================================


app.get("/posts/new", isLoggedIn, (req, res) => {
  res.render("new.ejs");
});


app.post("/posts", isLoggedIn, upload.single("imageSource"), async (req, res) => {
  const { caption, hashtags } = req.body;
  const imageFile = req.file ? req.file.filename : null;

  if (!imageFile || !caption) {
    return res.status(400).send("Image and caption are required.");
  }

  const newPost = new Post({
    name: req.user.name,
    imageSource: imageFile,
    profile_image: req.user.profile_image || "default-profile.png",
    location: "India",
    created_at: new Date(),
    no_likes: 0,
    caption,
    hashtags,
    comments: 0,
    author: req.user._id, 
  });

  try {
    await newPost.save();
    res.redirect("/posts");
  } catch (err) {
    res.status(500).send("Failed to save post");
  }
});

// WORKING ======================================================================

// 27/05/2025 => adding Story
app.post("/upload-story", uploadStory.single("story"), async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/login");

  const file = req.file;
  if (!file) return res.redirect("/");

  const storyType = file.mimetype.startsWith("video") ? "video" : "image";

  // Log and update
  console.log("Saving story", { file: file.filename, type: storyType });

  await User.findByIdAndUpdate(req.user._id, {
    story: { file: file.filename, type: storyType }
  });

  res.redirect("/posts");
});



// END => 27/05/2025 => adding Story


// Function to format the likes count
function formatLikes(n) {
  n = Number(n);
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}

app.post("/posts/:id/like", isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const userId = req.user._id.toString();
    const isLiked = post.likedBy.includes(userId);

    if (isLiked) {
      post.likedBy.pull(userId);
      post.no_likes = Math.max(post.no_likes - 1, 0);
    } else {
      post.likedBy.push(userId);
      post.no_likes += 1;
    }

    await post.save();

    const formattedLikeCount = formatLikes(post.no_likes);

    res.json({ success: true, liked: !isLiked, newLikeCount: formattedLikeCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error toggling like' });
  }
});

// END 17/4/25 ====================================

// Try 1 Authorize User to Edit & Delete Post ================================
// --- isPostAuthor middleware ---
const isPostAuthor = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    if (!post.author.equals(req.user._id)) {
      return res.status(403).send("You are not authorized to perform this action");
    }

    next();
  } catch (err) {
    console.error("Authorization error:", err);
    return res.status(500).send("Something went wrong");
  }
};
// EDIT page route
app.get("/posts/:id/edit", isLoggedIn, isPostAuthor, async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("edit", { post });
});

// DELETE post route
app.delete("/posts/:id", isLoggedIn, isPostAuthor, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/posts");
  } catch (err) {
    res.status(500).send("Error deleting post");
  }
});

// END => Try 1 Authorize User to Edit & Delete Post ================================

app.put("/posts/:id", isLoggedIn, upload.single("image"), async (req, res) => {
  const { caption, hashtags } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) return res.send("Post not found");

  post.caption = caption;
  post.hashtags = hashtags;
  if (req.file) post.imageSource = req.file.filename;

  await post.save();
  res.redirect("/posts");
});

app.post("/messages/add", isLoggedIn, async (req, res) => {
  const { profileImage, senderName, IsActive, messageType, messageText, friendrequestId } = req.body;

  try {
    const newMessage = new Message({ profileImage, senderName, IsActive, messageType, messageText });
    await newMessage.save();
    await FriendRequest.findByIdAndDelete(friendrequestId);
    res.redirect("/posts");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.post('/friendrequests/decline', isLoggedIn, async (req, res) => {
  const { friendrequestId } = req.body;

  try {
    const deleted = await FriendRequest.findByIdAndDelete(friendrequestId);
    res.redirect("/posts");
  } catch (error) {
    console.error("Error declining friend request:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post('/posts/:postId/bookmark', getUser, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const existingBookmark = await Bookmark.findOne({ userId, postId });
    if (existingBookmark) {
      return res.status(400).json({ success: false, message: 'Post already bookmarked' });
    }

    const bookmark = new Bookmark({ userId, postId });
    await bookmark.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/posts/:postId/bookmark', getUser, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const result = await Bookmark.findOneAndDelete({ userId, postId });
    if (!result) {
      return res.status(404).json({ success: false, message: 'Bookmark not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Profile image upload form
app.get("/profile/image", isLoggedIn, (req, res) => {
  res.render("uploadProfileImage");
});


app.post("/profile/image", isLoggedIn, upload.single("profile_image"), async (req, res) => {
  try {
    req.user.profile_image = req.file.filename; // Save the filename of the uploaded image
    await req.user.save(); // Save the user with the new profile image
    req.flash("success", "Profile image updated");
    res.redirect("/posts"); // Redirect to the posts page or wherever you want
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to update profile image");
    res.redirect("/profile/image"); // Redirect back to the upload page if an error occurs
  }
});


app.get('/bookmarks', getUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const bookmarks = await Bookmark.find({ userId }).populate('postId');

    const bookmarkedPosts = bookmarks
      .filter(bookmark => bookmark.postId !== null)
      .map(bookmark => ({
        ...bookmark.postId._doc,
        isBookmarked: true
      }));

    res.render('bookmarks', {
      posts: bookmarkedPosts,
      user: req.user
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load bookmarked posts');
    res.redirect('/posts');
  }
});

// Comments route 13:31

// Fetch comments for a post
app.get('/posts/:postId/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate('commentsArray.user', 'name profile_image').exec();
    res.json({ comments: post.commentsArray, currentUserId: req.user._id });
  } catch (err) {
    res.status(500).send("Error fetching comments");
  }
});

// Add a new comment
app.post('/posts/:postId/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const newComment = { 
      user: req.user._id, 
      text: req.body.text, 
      createdAt: new Date()
    };

    post.commentsArray.push(newComment);
    post.comments += 1;
    await post.save();
    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).send("Error posting comment");
  }
});

// Route to edit a comment
app.use('/posts/:postId/comments/:commentId/edit', isLoggedIn, async (req, res) => {
  const { postId, commentId } = req.params;
  const { text } = req.body;

  try {
    // Find the post that contains the comment
    const post = await Post.findById(postId);

    // Check if the comment exists in the post's comment array
    const comment = post.commentsArray.id(commentId);

    // Check if the current user is the author of the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).send('You can only edit your own comments');
    }

    // Update the comment text
    comment.text = text;
    await post.save();

    // Return the updated comment
    res.status(200).json({ message: 'Comment updated successfully', updatedComment: comment });
  } catch (err) {
    res.status(500).send('Error editing comment');
  }
});

// Route for deleting a comment
app.delete('/posts/:postId/comments/:commentId/delete', async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await Post.findById(postId);

    // Find and remove the comment from the commentsArray
    const commentIndex = post.commentsArray.findIndex(c => c._id.toString() === commentId);
    if (commentIndex !== -1) {
      post.commentsArray.splice(commentIndex, 1); // Remove comment
      post.comments -= 1; // Decrease comment count
      await post.save(); // Save the updated post

      res.json({ success: true });
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting comment" });
  }
});

// 20/05/2025 => If SomeOne searches URL of Post

// Put this above any route that might conflict (especially above POST /posts)
app.get('/posts/:id', isLoggedIn, (req, res) => {
  const postId = req.params.id;
  // Redirect the user to /posts and let the client-side JS scroll to the post
  res.redirect(`/posts#post-${postId}`);
});

// 20/05/2025 => If SomeOne searches URL of Post


// END 25/4/25 Comment Section ========================================================================
http.listen(8080, () => {
  console.log("Server Started listening to port 8080");
});



