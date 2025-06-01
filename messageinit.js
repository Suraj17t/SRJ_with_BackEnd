const mongoose = require("mongoose");
const Message = require("./models/messages.js");


main().then(() =>{
    console.log("Connection Successful");
})
.catch((err) => console.log(err)); 

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
                                                //   Name of Database
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

let allMessages = [

    {
        profileImage: "Vivek-profile-messages-pic2.jpeg",
        IsActive: "active",

        senderName: "Vivek Dhingra",
        
        messageType: "text-bold",

        messageText: "2 New Messages",
    },
    {
        profileImage: "deep-profile-message3.jpeg",
        IsActive: " ",

        senderName: "Deep Nimia",
        
        messageType: "text-muted",

        messageText: "Bro, I am in Library",
    },
    {
        profileImage: "rahul-profile-message.jpeg",
        IsActive: " ",

        senderName: "Rahul Sharma",
        
        messageType: "text-muted",

        messageText: "bhai Assignment bna liya kya?",
    },
    {
        profileImage: "vegeta-profile-pic1.png",
        IsActive: " ",

        senderName: "Prince Vegeta",
        
        messageType: "text-bold",

        messageText: "3 New Messages",
    },
    {
        profileImage: "amit-profile-pic3.jpeg",
        IsActive: "active",

        senderName: "Amit",
        
        messageType: "text-bold",

        messageText: "Project bna liya?",
    },


];         
        
Message.insertMany(allMessages);