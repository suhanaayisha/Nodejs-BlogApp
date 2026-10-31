const User = require('../database/models/User');
const bcrypt = require('bcrypt');

module.exports = async (req,res) => {

    const {email,password} = req.body;

    const user = await User.findOne({ email });
    if(user && await bcrypt.compare(password, user.password)){
        const returnTo = req.session.returnTo || '/';
        delete req.session.returnTo;
        req.session.userId = user._id
        return res.redirect(returnTo);
    }

    req.flash('loginErrors', 'Incorrect email or password');
    req.flash('data', { email });
    res.redirect('/auth/login')
}
