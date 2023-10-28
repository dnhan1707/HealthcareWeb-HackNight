import express from "express";
import bodyParser from "body-parser";


const app = express();
const port = 3000;


app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    try{
        res.render("main_page.ejs")
    }catch (error) {
        res.status(500).json({ message: "Error render to main page" });
    }
})


app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});
