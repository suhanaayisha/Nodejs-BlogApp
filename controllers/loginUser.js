const User = require('../database/models/User');
const bcrypt = require('bcrypt');

module.exports = async (req,res) => {

    const {email,password} = req.body;

    const user = await User.findOne({ email });
    if(user && await bcrypt.compare(password, user.password)){
        req.session.userId = user._id
        return res.redirect('/');
    }

    res.redirect('/auth/login')
}
