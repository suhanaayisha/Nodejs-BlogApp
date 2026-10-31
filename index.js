require('dotenv').config({ quiet: true });
const express = require('express');
const { config, engine } = require('express-edge'); //for templating
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const { MongoStore } = require('connect-mongo');
const connectFlash = require('connect-flash');
const edge = require('edge.js');
const cloudinary = require('cloudinary').v2;

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

const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/node-blog';
const PORT = process.env.PORT || 4000;

const mongoConnection = mongoose.connect(DB_URI);

app.use(fileUpload());

// cloudinary is optional, without it images are stored in public/posts
if (process.env.CLOUDINARY_NAME) {
    cloudinary.config({
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        cloud_name: process.env.CLOUDINARY_NAME
    });
}

app.use(express.static('public')); // use helps us add functionality to express
app.use(engine);
app.use(expressSession(
    {
        secret: process.env.EXPRESS_SESSION_KEY || 'dev-secret-change-me',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            clientPromise: mongoConnection.then(m => m.connection.getClient())
        })
    }
))
app.use(connectFlash()); // flash needs the session, so it goes after it

app.set('views', `${__dirname}/views`);

app.use((req,res, next) => {
    edge.global('auth',req.session.userId);
    next()
})

app.use(express.json())

app.use(express.urlencoded({extended: true}))



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
app.use((req,res) => res.status(404).render('not-found'));

app.listen(PORT,() => {
    console.log(`listening on port ${PORT}`)
})
