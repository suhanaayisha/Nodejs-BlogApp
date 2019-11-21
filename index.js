require('dotenv').config();
console.log(process.env.DB_URI);
const express = require('express');
const { config, engine } = require('express-edge'); //for templating
const mongoose = require('mongoose');
const bodyParser = require('body-parser') ;// to collect data from browser
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const connectFlash = require('connect-flash');
const edge = require('edge.js');
const cloudinary = require('cloudinary');

const createPostController = require('./controllers/createPost');
const homePageController = require('./controllers/homePage');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const createUser = require('./controllers/createUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');

const storePost = require('./middleware/storePost');
const auth = require('./middleware/auth');
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated');

const app = new express()

mongoose.connect(process.env.DB_URI);

app.use(connectFlash());
app.use(fileUpload());

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_NAME
});

const mongoStore = connectMongo(expressSession);



app.use(express.static('public')); // use helps us add functionality to express
app.use(engine);
app.use(expressSession(
    {
        secret:process.env.EXPRESS_SESSION_KEY,
        store: new mongoStore({
            mongooseConnection: mongoose.connection
        })
    }
))

app.set('views', `${__dirname}/views`);

app.use('*', (req,res, next) => {
    edge.global('auth',req.session.userId);
    next()
})

app.use(bodyParser.json()) 

app.use(bodyParser.urlencoded({extended: true}))



app.get('/', homePageController);

app.get('/index', homePageController);

app.get('/auth/register',redirectIfAuthenticated, createUser);

app.get('/auth/login',redirectIfAuthenticated, loginController);

app.get('/auth/logout',auth, logoutController);

app.post('/users/register',redirectIfAuthenticated, storeUserController);

app.post('/users/login',redirectIfAuthenticated, loginUserController);

app.get('/post/:id',getPostController);

app.get('/posts/new', auth, createPostController);

app.post('/posts/store',auth, storePost, storePostController);
app.use((req,res) => res.render('not-found'));

app.listen(process.env.PORT,() => {
    console.log(`listening on port ${process.env.PORT}`)
})