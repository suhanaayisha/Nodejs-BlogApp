const User = require('../database/models/User');

module.exports = (request,response) => {
    

    User.create(request.body, (error, user) => {
        if(error){

            let registrationErrors;
            if (error.errors){
                registrationErrors = Object.keys(error.errors).map(key => error.errors[key].message);
            }
            else if(error.errmsg){
                registrationErrors = "Email already exists";
            }
            
            request.flash('registrationErrors',registrationErrors);
            request.flash('data',request.body);
            return response.redirect('/auth/register');
            
        }
        else{
            response.redirect('/');
        }
  
    
})
}