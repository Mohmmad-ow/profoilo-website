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

mongoose.connect("mongodb://localhost:27017/portfolioDB");

const projectsSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String},
    date: { type: Date, required: true, default: Date() },
    updateDate: {type: Date}
});
const Projects = mongoose.model('project', projectsSchema);

const pro1 = new Projects({
    title: "webScrape",
    description: "scrapes data"
});

app.get("/", (req, res) => {
    res.render("index")

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

// View all projects

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' , hour: 'numeric', minute: 'numeric'};

app.get('/projects', (req, res) => {
    Projects.find({}, (err, docs) => {
        if(!err) {
            if(docs) {
                res.render('projects-blog', {projects: docs, options: dateOptions})
            } else {
                console.log("No docs found.")
            }
        } else {
            console.log(err)
        }
    })
});

// view the project by id

app.get('/projects/:id', (req, res) => {
    const projectId = req.params.id;

    Projects.findById(projectId, (err, doc) => {
        if (!err) {
            if (doc) {
            res.render('project-blog', {project: doc, options: dateOptions});
            } else {
                res.send("<h1>Didn't find</h1>");
            }
        } else {
            console.log(err);
        }
    });
});

// update


// _____this is to edit the post______
app.get('/projects/:id/edit', (req, res) => {
    const projectId = req.params.id;

    Projects.findById(projectId, (err, doc) => {
        if (!err) {
            if (doc) {
            res.render('project-blog-edit', {project: doc, options: dateOptions});
            } else {
                res.send("<h1>Didn't find</h1>");
            }
        } else {
            console.log(err);
        }
    });

})

// _____this is to update the edited post_____

app.post('/projects/:id/update', (req, res) => {
    const projectId = req.params.id;

    const title = req.body.title;
    const description = req.body.description;

    Projects.findByIdAndUpdate(projectId, {title: title, description: description, updateDate: Date()}, (err) => {

        if(!err) {
            console.log("doc updated");
            // res.redirect("/projects/" + projectId);
        } else {
            console.log(err)
        }
        
    });
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
})