// const http = require("http").createServer(app);
// const io = require("socket.io")(http);
// const Message = require("./models/Message"); // your Message model
// const User    = require("./models/User");
// // Socket.IO setup
// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("chat message", (msg) => {
//     socket.broadcast.emit("chat message", msg);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

// // Replace app.listen() with:
// http.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });

// Try 2
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const session = require("express-session");
const sharedSession = require("express-socket.io-session");

const Message = require("./models/Message");
const User = require("./models/User");

const expressSession = session({
  secret: "your-secret",
  resave: false,
  saveUninitialized: false,
});

app.use(expressSession);

// Share session with Socket.IO
io.use(sharedSession(expressSession, {
  autoSave: true
}));

io.on("connection", (socket) => {
  console.log("Socket connected");

  socket.on("join room", async ({ room }) => {
    socket.join(room);
  });

  socket.on("chat message", async ({ room, text }) => {
    const [a, b] = room.split("--");
    const senderId = socket.handshake.session.passport?.user;
    if (!senderId) return;

    const receiverId = (senderId === a) ? b : a;
    const sender = await User.findById(senderId);

    const msg = await Message.create({
      senderId,
      receiverId,
      senderName: sender.name,
      profileImage: sender.profile_image,
      messageText: text,
      messageType: "text"
    });

    io.to(room).emit("chat message", {
      _id: msg._id,
      senderId: msg.senderId.toString(),
      senderName: msg.senderName,
      profileImage: msg.profileImage,
      messageText: msg.messageText,
      timestamp: msg.timestamp
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
});

http.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
