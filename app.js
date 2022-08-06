// required Modules and Packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


// initializations and functions
const app = express();
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// Database config

mongoose.connect("mongodb://localhost:27017/portfolio");

const projectsSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String},
    date: { type: Date, required: true, default: Date.now }
});

const Projects = mongoose.model('project', projectsSchema);

const pro1 = new Projects({
    title: "webScrape",
    description: "scrapes data"
});

app.get("/", (req, res) => {
    res.render("index")

})

// view project blogs

app.get('/projects', (req, res) => {
    Projects.find({}, (err, docs) => {
        if(!err) {
            if(docs) {
                res.send(docs)
            } else {
                console.log("No docs found.")
            }
        } else {
            console.log(err)
        }
    })
})

// make a project blog

app.get('/projects/create',(req, res) => {
    res.render("create-project");
});

app.post ('/projects/create',(req, res) => {
    const title = req.body.title;
    const description = req.body.description;

    const project = new Projects({
        title: title,
        description: description
    });
    project.save((err) => {
        if(!err) {
            console.log("created project");
            res.redirect("/")
        }
    })
});



app.listen(3000, () => {
    console.log("Server running on port 3000");
})