const mongoose = require("mongoose");
const FriendRequest = require("./models/friendrequests.js");


main().then(() =>{
    console.log("Connection Successful");
})
.catch((err) => console.log(err)); 

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
                                                //   Name of Database
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

let allRequests = [
    // {
    //     reqId: "div1",
    //     profileImage: "hardeep-profile-pic.jpg",
    //     senderName: "Hardeep",
    //     MutualFriends: "8 Mutual Friends",
    //     actionId: "d1" 
    // },
    {
        reqId: "div2",
        profileImage: "a-profile-pic.jpeg",
        senderName: "Akash",
        MutualFriends: "10 Mutual Friends",
        actionId: "d2" 
    },
    {
        reqId: "div3",
        profileImage: "rohit-profile-pic2.jpeg",
        senderName: "Rohit",
        MutualFriends: "2 Mutual Friends",
        actionId: "d3" 
    },
   
];         
        
FriendRequest.insertMany(allRequests);