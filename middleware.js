const res = require("express/lib/response")
const Campground = require('./models/campground');
const Review = require('./models/review')
const { campgroundSchema } = require('./schema');
const ExpressError = require('./utils/ExpressError');
const { reviewSchema } = require('./schema.js');

module.exports.reqLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // console.log(req.path, req.originalUrl);
        // req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must login to access')
        res.redirect('/login');
    }
    else {
        next();
    }
}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You need to be author of this Campground to do that !!!')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, rid } = req.params;
    const review = await Review.findById(rid);
    if (!review.author[0].equals(req.user._id)) {
        req.flash('error', 'You need to be author of this review to do that !!!')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    }
    else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    }
    else {
        next();
    }
}