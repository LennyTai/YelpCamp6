const joi = require('joi');

module.exports.campgroundSchema = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        description: joi.string().required(),
        location: joi.string().required(),
        // image: joi.string().required()
    }).required(),
    deleteImg: joi.array()
})
module.exports.reviewSchema = joi.object({
    review: joi.object().required(),
    rating: joi.number().required,
    body: joi.string().required
}).required()