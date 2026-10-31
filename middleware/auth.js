const User = require('../database/models/User');

// remembers where the user was going, so login can send them back there
const sendToLogin = (req, res) => {
    req.session.returnTo = req.originalUrl;
    req.flash('loginErrors', 'Please log in to share a recipe');
    return res.redirect('/auth/login');
}

module.exports = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.userId);
        if(!user){
            return sendToLogin(req, res);
        }
    } catch (error) {
        return sendToLogin(req, res);
    }

    next();
}
