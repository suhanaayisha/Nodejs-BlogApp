const User = require('../database/models/User');

module.exports = async (request,response) => {
    try {
        await User.create(request.body);
    } catch (error) {
        let registrationErrors;
        if (error.errors){
            registrationErrors = Object.keys(error.errors).map(key => error.errors[key].message);
        }
        else if(error.code === 11000){
            registrationErrors = "Email already exists";
        }

        request.flash('registrationErrors',registrationErrors);
        request.flash('data',request.body);
        return response.redirect('/auth/register');
    }

    response.redirect('/');
}
