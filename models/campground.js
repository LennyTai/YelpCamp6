const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;



imageSchema = new Schema({
    url: String,
    filename: String
})
campgroundschema = new Schema({
    title: String,
    price: Number,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [imageSchema],
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})
imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('upload/', 'upload/w_300/');
})
campgroundschema.post('findOneAndDelete', async function (doc) {
    await review.deleteMany({
        _id: {
            $in: doc.reviews
        }
    })

})
// campgroundschema.post.findOneAndDelete,async(function(x){
//     review.remove(
//         id: {$in: x._id}
//     )
// })
const Campground = mongoose.model('Campground', campgroundschema);
module.exports = Campground;