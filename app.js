import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { log } from "async";


const app = express();
const port = 3000;


app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/healthCareDB", {useNewUrlParser: true});

const post_schema = new mongoose.Schema(
    {
      id: Number,
      title: String,
      content: String,
      author: String,
    }
  )

const Post = mongoose.model("Post", post_schema);

const post_1 = new Post(
    {
        title: "Wisdom Under the Oak Tre",
        content: "Once upon a time in a quiet village, there lived an elderly lady named Mrs. Thompson. She was known for her remarkable wisdom and kindness. Mrs. Thompson would often sit by the old oak tree, sharing her tales of the past with anyone who cared to listen. Her stories were like a treasure trove of knowledge, and the villagers cherished her presence",
        author: "Lillian Smith",
    }
)

const post_2 = new Post(
    {
        title: "Blossoms of Memories",
        content:
          "In a small cottage nestled at the edge of the woods, an elderly man named Mr. Jenkins spent his days. He had a passion for gardening and spent countless hours tending to his vibrant flower garden. Mr. Jenkins often told stories of his travels around the world, sharing his adventures with a twinkle in his eye, captivating the hearts of those who gathered around him",
        author: "Harold Johnson",
    }
)

const post_3 = new Post(
    {
        title: "Grandma Rose's Sweet Tales",
        content:
          "On a sunny porch overlooking a serene lake, Grandma Rose spent her days. She was known far and wide for her delectable homemade apple pies. People came from all around to taste her culinary creations and listen to her stories. Grandma Rose's stories were filled with warmth and laughter, leaving everyone with a sense of nostalgia and joy.",
        author: "Evelyn Davis",
    }
)

const defaultItem = [post_1, post_2, post_3];

app.get("/", (req, res) => {
    try{
        res.render("main_page.ejs")
    }catch (error) {
        res.status(500).json({ message: "Error render to main page" });
    }
})


app.get("/resources", (req, res) => {
    try{
        res.render("resources.ejs")
    }catch (error) {
        res.status(500).json({ message: "Error render to resources page" });
    }
})


app.get("/community", (req, res) => {
    Post.find({})
    .then((foundPosts) =>
    {
        if(foundPosts.length === 0)
        {
            Post.insertMany(defaultItem).then((defaultItems) =>{
                console.log("Inserted items", defaultItems);
              }).catch((err) => {
                console.error("Error updating document:", err);
              });
            res.redirect("community.ejs");
        }
        else
        {
            res.render("community.ejs", {posts: foundPosts})
        }        
    })

})

app.get("/intro", (req, res) => {
    try{
        res.render("contact.ejs")
    }catch (error) {
        res.status(500).json({ message: "Error render to contact page" });
    }
})

app.get("/create-post", (req, res) => {
    res.render("add_new_post.ejs");
  });
  
app.post("/create-post", (req, res) => {
    const new_title = req.body.title
    const new_content = req.body.content
    const new_author = req.body.author

    const newPost = new Post(
        {
            title: new_title,
            content: new_content,
            author: new_author
        });

    newPost.save();
    res.redirect("community");
});
  

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});
