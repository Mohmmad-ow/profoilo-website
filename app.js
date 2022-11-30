// required Modules and Packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var path = require('path');
require("dotenv").config();

// Importing the DB modules
const {User, Projects, Tags} = require('./config/database')

// initializations and functions
const app = express();
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
// Including tiny into a script file
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Using the routes from the routes js file
const router = require('./router/index.js')

// Database config
const DB_STRING = process.env.DB_STRING_DEV;


mongoose.connect(DB_STRING);





// Running server
app.use('/' , router);

app.listen(process.env.PORT || 3000, () => {

    console.log("Server is not running...")
});

