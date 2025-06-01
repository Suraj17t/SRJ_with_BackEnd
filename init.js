const mongoose = require("mongoose");
const Post = require("./models/Post.js");


main().then(() =>{
    console.log("Connection Successful");
})
.catch((err) => console.log(err)); 

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
                                                //   Name of Database
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

let allPosts = [

    {
            name: "Chris Hemsworth",
            imageSource: "ChrisH.jpg",
            profile_image: "Chris-profile-pic.jpeg",
            location: "New York",
            created_at: new Date(),
            no_likes: 188,
            caption: "! NEW ! Extraction 2 coming in cinemas June 16.",
            hashtags: "#Extraction 2",
            comments: 40,
    },
    {
            name: "Robert Downy Jr",
            imageSource: "tony.jpg",
            profile_image: "Rdj-profile-pic.jpeg",
            location: "Amsterdam",
            created_at: new Date(),
            no_likes:  130,
            caption: "Taking innovation to new heights with the latest Stark Industries missile launch. Ready to redefine defense technology..",
            hashtags: "#ILoveYou3000 #StarkIndustries",
            comments: 950,
    },
    {
            name: "Virat kohli",
            imageSource: "kholi.jpg",
            profile_image: "kholi-profile-pic.jpeg",
            location: "India",
            created_at: new Date(),
            no_likes: 28000,
            caption: "Master Stroke Maker.",
            hashtags: "#Record_Breaker",
            comments: 9900,
    },
    {
            name: "Ellyse Perry",
            imageSource: "ellyse-post2.jpeg",
            profile_image: "ellyse-profile-pic.jpeg",
            location: "Wahroonga Australia",
            created_at: new Date(),
            no_likes: 245,
            caption: "Ee Sala Cup Namdu!",
            hashtags: "#RCB",
            comments: 120,
    },
    {
            name: "Android 18",
            imageSource: "andriod_18-post.jpg",
            profile_image: "android18-profile-pic.jpeg",
            location: "Paris",
            created_at: new Date(),
            no_likes: 2345,
            caption: "From rivals to allies, our journey together never ceases to amaze! 🚀. ",
            hashtags: "#Android18 #Android18 #DragonBallZ",
            comments: 30,
    },
    {
            name: "Deep Nimia",
            imageSource: "deep-post2.jpeg",
            profile_image: "deep-profile-pic1.jpeg",
            location: "Mdu Rohtak",
            created_at: new Date(),
            no_likes: 530,
            caption: "Chillin with the squad, making memories that'll last a lifetime.🌟 ",
            hashtags: "#FriendshipGoals #GoodTimes #MakingMemories",
            comments: 190,
    },
];         

Post.insertMany(allPosts);

