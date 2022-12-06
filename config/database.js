const mongoose = require('mongoose')


// user schema
const UserSchema = mongoose.Schema({
    email: {type: String, required: true},
    salt: {type: String, required: true},
    hash: {type: String, required: true},
    firstName: String,
    lastName: String,
    date: { type: Date, required: true, default: Date() },
    updateDate: {type: Date, default: Date()},
    isAdmin: {type: Boolean, default: false},
    isBlogger: {type: Boolean, default: true}

})

const User = mongoose.model('User', UserSchema)

// Tag schema
const tagsSchema = mongoose.Schema({
    name: {type: String, required: true },
    colorValue: {type: String, default: '#000'}
});

const Tags = mongoose.model('tag', tagsSchema);

// project-blog schema
const projectsSchema = mongoose.Schema({
    author: {type: UserSchema},
    title: { type: String, required: true },
    description: { type: String},
    blog: {type: String},
    date: { type: Date, required: true, default: Date() },
    updateDate: {type: Date, default: Date()},
    tags: [tagsSchema]
});
const Projects = mongoose.model('project', projectsSchema);

module.exports = {
    User, Tags, Projects
}