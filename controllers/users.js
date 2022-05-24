const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}
module.exports.register = async (req, res, next) => {
    const { user } = req.body;
    try {
        const newUser = new User({ username: user.username, email: user.email });
        const registerUser = await User.register(newUser, user.password)
        req.login(registerUser, err => {
            if (err) {
                return next(err);
            }
        })
        req.flash('success', 'Welcome to Yelp-Camp');
        res.redirect('/campgrounds');
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}
module.exports.login = (req, res) => {
    const urlRedirect = req.session.returnTo || '/campgrounds'
    req.flash('success', 'Welcome back !!!');
    res.redirect(urlRedirect);
}
module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', 'Goodbye');
    res.redirect('/');
}