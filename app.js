if (process.env.NODE_ENV !== "Production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { nextTick } = require('process');
const { runInNewContext } = require('vm');
const ExpressError = require('./utils/ExpressError');
const { STATUS_CODES } = require('http');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')
const session = require('express-session');
const flash = require('connect-flash');
const localStrategy = require('passport-local');
const passport = require('passport');
const User = require('./models/user');


mongoose.connect('mongodb://localhost:27017/yelp-camp3', (() => {
    console.log("connect to DB")
}), (e => {
    console.error(e.message);
}));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
const sessionconfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionconfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => { //used before other middleware
    if (!['/login', '/', '/favicon.ico', '/register', '/logout'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

// app.get('/host', async (req, res) => {
//     const host = new User({ username: 'OSG', email: 'osg@yelp-camp.com' });
//     const registerHost = await User.register(host, 'osg');
//     res.send(registerHost);
// })

app.get('/', (req, res) => {
    res.render('home')
})
// app.get('/makeCampground', (req, res) => {
//     const newCampground = new Campground({
//         title: "My back yield",
//         description: "Cheap & available",
//     });
//     res.send(newCampground);
// })


app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page not found'))
})
app.use((err, req, res, next) => {
    // const { statusCode = 500, message = 'Something went wrong' } = err;
    // res.status(statusCode).send(message);
    const { statusCode = 500 } = err;
    if (!err.message) { err.message = 'Unspecific Errors' }
    res.status(statusCode).render('error', { err })
})
app.listen(3000, () => {
    console.log("Listen to port 3000")
})