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




// Tags schema

const tagsSchema = mongoose.Schema({
    name: {type: String, required: true },
    colorValue: {type: String, default: '#000'}
});

const Tags = mongoose.model('tag', tagsSchema);

// project-blog schema
const projectsSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String},
    date: { type: Date, required: true, default: Date() },
    updateDate: {type: Date},
    tags: [tagsSchema]
});
const Projects = mongoose.model('project', projectsSchema);


// tags-in-project
const tag1 = new Tags({
    name: "TypeScript",
    colorValue: "#000"
});

const pro1 = new Projects({
    title: "webScrape",
    description: "scrapes data",
    tags: [tag1]
});
app.get("/", (req, res) => {
    res.render("index")
    

})




// make a project blog

app.get('/projects/create',(req, res) => {
    Tags.find({}, (err, tags) => {
        if(!err && tags) {
            res.render("create-project", {tags: tags});
        }
    })
});

app.post ('/projects/create',(req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const tagsId = req.body.tags;
    
    Tags.find({_id: {$in: tagsId}}, (err, tags) => {
        if(!err && tags) {
            console.log(tags)
            Projects.create({title: title, description: description, }, (err, doc) => {
                if(!err) {
                    Projects.findOneAndUpdate({_id: doc._id}, {tags: tags},(err, proj) => {
                        if(!err) {
                            
                            res.redirect('/projects')
                        }
                    })
                } else {
                    console.log(err)
                }
            })
        } else {
            console.log(err)
        }
    })
    
});

// View all projects


// options for how to view time
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
                Tags.find({}, (err, tags) => {
                    if (!err && tags) {

                        res.render('project-blog-edit', {project: doc, options: dateOptions, tags: tags});
                    } else {
                        console.log(err)
                    }
                })
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
    const tagsId = req.body.tags;

    Tags.find({_id: {$in: tagsId}}, (err, tags) => {
        if (!err && tags) {
            
            Projects.findByIdAndUpdate(projectId, {title: title, description: description, updateDate: Date(), tags: tags}, (err) => {
        
                if(!err) {
                    console.log("doc updated");
                    res.redirect("/projects/" + projectId);
                } else {
                    console.log(err)
                }
                
            });
        } else {
            console.log(err)
        }
    })
})

// Delete a project


// _____view the post you want to delete______

app.get('/projects/:id/delete', (req, res) => {
    const projectId = req.params.id;

    Projects.findById(projectId, (err, doc) => {
        if (!err) {
            if (doc) {
            res.render('project-blog-delete', {project: doc});
            } else {
                res.send("<h1>Didn't find</h1>");
            }
        } else {
            console.log(err);
        }
    });

});

app.post('/projects/:id/delete', (req, res) => {
    const projectId = req.params.id;

    Projects.findByIdAndDelete(projectId, (err) => {
        if(err) {
            console.log(err);
        } else {
            res.send("Project blog deleted");
        }
    });
    
});

// Test for tags choice

app.get("/choice", (req, res) => {
    Tags.find({}, (err, tags) => {
        if (!err) {
            if(tags) {
                res.render('choice-input-test', {Tags: tags});
            }
            else {
                res.send("No Tags");
            }
        } else {
            console.log(err);
        }
        
    })
});

app.post("/choice", (req, res) => {
    console.log(req.body.tags);
    const selectedTags = req.body.tags;
    
    selectedTags.forEach(tagId => {
        Tags.findOne({_id: tagId}, (err, tag) => {
            console.log(tag)
            Projects.findOneAndUpdate({title: 'crape',"tags._id":{$ne: tag._id}}, { $push: { tags: tag }}, (err) => {
                if (!err) {
                    console.log( tag.name + " added")
                } else {
                    console.log(err)
                }
            });
        })
    });


    res.redirect("/projects/");
    
    
});




// Running server
app.listen(3000, () => {
    console.log("Server running on port 3000");
})