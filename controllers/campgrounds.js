const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoder = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoder({ accessToken: mbxToken });



module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', { campgrounds })
};
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await (Campground.findById(id))
    res.render('campgrounds/edit', { campground });
}
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // console.log(id);
    const cmpgrd = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true })
    cmpgrd.images.push(...img)
    await cmpgrd.save();
    if (req.body.deleteImg) {
        for (let imge of req.body.deleteImg) {
            await cloudinary.uploader.destroy(imge);
        }
        await cmpgrd.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImg } } } })
    }


    req.flash('success', 'Successfully update Campground');
    res.redirect(`/campgrounds/${cmpgrd._id}`);
}
module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(campground);
    if (!campground) {
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}
module.exports.createCampground = async (req, res, next) => {
    // const { campground } = req.body;
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    // res.send(geoData.body.features[0].geometry.coordinates)
    const campgrounds = new Campground(req.body.campground);
    campgrounds.geometry = geoData.body.features[0].geometry;
    campgrounds.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campgrounds.author = req.user._id;
    await campgrounds.save();
    console.log(campgrounds);
    req.flash('success', 'Successfully created new Campground');
    res.redirect(`/campgrounds/${campgrounds._id}`);
}
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully delete Campground');
    res.redirect('/campgrounds');
}