// required Modules and Packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var path = require('path');
require("dotenv").config();


// express session
const session = require('express-session')
const MongoStore = require('connect-mongo')

// User auth with passport
const passport = require('passport')
const passportLocal = require('passport-local')


// Import passport Config'
require('./config/passport');

// initializations and functions
const app = express();
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
// Including tiny into a script file
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Using the routes from the routes js file
const {router, checkMiddleWare} = require('./router/index.js')

// Database config
const DB_STRING = process.env.DB_STRING_DEV;
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(DB_STRING, dbOptions);

// Session config
const Store = MongoStore.create({mongoUrl: DB_STRING, mongoOptions: dbOptions})

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: Store,
    cookie: {
        maxAge: 30 * 1000 * 24  * 60 * 60 /* This would be a month till it expires */
    }
}))

// passport config

app.use(passport.initialize())
app.use(passport.session())

app.use(checkMiddleWare)
// Running server
app.use('/' , router);

app.listen(process.env.PORT || 3000, () => {

    console.log("Server is not running...")
});

