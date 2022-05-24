const mongoose = require('mongoose');
const { descriptors, places } = require('./seedHelpers');
const { users } = require('./seedUsers');
const cities = require('./cities');
const Campground = require('../models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp3', (() => {
    console.log("Connected to DB")
}),
    (e => {
        console.error(e.message)
    }));

const sample = arr => arr[Math.floor(Math.random() * arr.length)];

console.log(places[Math.floor(Math.random() * places.length)]);
const campdb = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const random1k = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const c = new Campground({
            location: `${cities[random1k].city}, ${cities[random1k].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [parseInt(`${cities[random1k].longitude}`), parseInt(`${cities[random1k].latitude}`)]
            },
            images: [{
                url: "https://res.cloudinary.com/dnvypcomv/image/upload/v1651742689/yelpCamp/ffxfopraohj9mbldmcmj.jpg",
                filename: "yelpCamp/ffxfopraohj9mbldmcmj"
            },
            {
                url: "https://res.cloudinary.com/dnvypcomv/image/upload/v1651742690/yelpCamp/hxspcf5rimesibjjvn9a.jpg",
                filename: "yelpCamp/hxspcf5rimesibjjvn9a"
            }],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta, eius ex. Quos doloremque, architecto eius aspernatur cupiditate voluptatem illo, suscipit minus eaque eos optio numquam magnam libero! Quam, ratione odit!',
            price,
            author: `${sample(users)}`,
        })
        await c.save();
    }

}
campdb().then(() => {
    mongoose.connection.close();
})