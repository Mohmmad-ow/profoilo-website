const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.status('401').json({msg: "You are not authenticated! be sure yo sign in or sign up"})
    }
};

const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        next()
    } else {
        res.send(403).json({msg: "You are not an Admin!"})
    }
};

module.exports = {
    isAdmin,
    isAuth
};