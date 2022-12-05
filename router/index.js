const router = require('express').Router();
const passport = require('passport');
const {User, Projects, Tags} = require('../config/database');
const {genPassword} = require('../Utils/passwordVaild')

// options for how to view time
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' , hour: 'numeric', minute: 'numeric'};


router.get("/", (req, res,next) => {
    
    res.render("index");
    
});

router.get('/contact', (req, res, next) => {
    res.render('contact-form');
});


// User auth

// TODO make the user register and user login 
router.get('/register', (req, res, next) => {
    res.render('register.ejs')
})

router.post('/register', (req, res, next) => {
    console.log(req.body)
    const email = req.body.email;
    const password = req.body.password;
    const saltHash = genPassword(password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const firstName = req.body.firstn
    const lastName = req.body.lastn
    console.log(salt, hash)
    User.create({email: email, salt: salt, hash: hash, firstName: firstName, lastName: lastName}).then(user => {
        if (!user) {
            console.log("didn't register the user.")
        } else {
            console.log(`Email: ${user.email}
            salt: ${user.salt}
            hash: ${user.hash}`)
            res.redirect('login')
        }
    })
    .catch(err => console.log(err))

});

router.get('/login', (req, res, next) => {
    res.render('login')
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/login-success' }));

router.get('/login-success', (req, res, next) => {
    res.send('<h1>Logged In successfully</h1>')
})
router.get('/login-failure', (req, res, next) => {
    res.send('<h1>Logged In Unsuccessfully</h1>')
})
// make a project blog

router.get('/projects/create',(req, res, next) => {
    
    Tags.find({}, (err, tags) => {
        if(!err && tags) {
            res.render("create-project", {tags: tags});
        }
    })
});
// fixed this 
/* problem was you needed to make to DB reqs one to create the post and one to update it and now with using the then() promis
  metod i don't need to do that
*/
router.post ('/projects/create',(req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    const blog = req.body.blog;
    const tagsId = req.body.tags;
    console.log("nothing")
    Tags.find({_id: {$in: tagsId}}).then(tags => {
        if (tags) {
            console.log(tags)
            Projects.create({title: title, description: description, blog: blog, tags: tags, author:req.user }, (err, doc) => {
                            if(!err) {
            
                                        res.redirect('/projects')
                                
                            } else {
                                console.log(err)
                            }
                        })
        }
    })
    .catch(err => {
        console.log(err)
    })
    
});




router.get('/projects', (req, res, next) => {
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

router.get('/projects/:id', (req, res, next) => {
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
router.get('/projects/:id/edit', (req, res, next) => {
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

});

// _____this is to update the edited post_____

router.post('/projects/:id/update', (req, res, next) => {
    const projectId = req.params.id;

    const title = req.body.title;
    const description = req.body.description;
    const blog = req.body.blog;
    const tagsId = req.body.tags;

    Tags.find({_id: {$in: tagsId}}, (err, tags) => {
        if (!err && tags) {
            
            Projects.findByIdAndUpdate(projectId, {title: title, description: description,blog: blog, updateDate: Date(), tags: tags}, (err) => {
        
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
});

// Delete a project


// _____view the post you want to delete______

router.get('/projects/:id/delete', (req, res, next) => {
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

router.post('/projects/:id/delete', (req, res, next) => {
    const projectId = req.params.id;

    Projects.findByIdAndDelete(projectId, (err) => {
        if(err) {
            console.log(err);
        } else {
            res.send("Project blog deleted");
        }
    });
    
});


// Tags CRUD section
router.get('/tags', (req, res, next) => {
    Tags.find({}, (err, docs) => {
        if(!err && docs) {
            res.render('all-tags', {tags: docs})
        }
    })
});

// Create tag


router.get('/tags/create', (req, res, next) => {
    res.render('tag-create')
});

router.post('/tags/create', (req, res, next) => {
    const name = req.body.tagName;
    const color = req.body.tagColor;
    Tags.create({name: name,colorValue: color}, (err) => {
        if(!err) {
            res.redirect("/projects/create")
        }
    })
});

// Delete tag
router.post('/tags/:id/delete', (req, res, next) => {
    const tagId = req.params.id;
    Tags.findByIdAndDelete(tagId, (err) => {
        if(!err) {
            console.log('tag deleted')
            res.redirect('/projects/create')
        }
    })
});

module.exports = router