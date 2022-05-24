const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds')
const { reqLogin, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(reqLogin, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send('image(s) uploaded')
// })

router.get('/new', reqLogin, campgrounds.renderNewForm);
router.route('/:id')
    .put(reqLogin, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .get(catchAsync(campgrounds.showCampground))
    .delete(reqLogin, isAuthor, catchAsync(campgrounds.deleteCampground))


// router.get('/', catchAsync(campgrounds.index));
// router.get('/new', reqLogin, campgrounds.renderNewForm);
router.get('/:id/edit', reqLogin, isAuthor, catchAsync(campgrounds.renderEditForm));
// router.put('/:id', validateCampground, reqLogin, isAuthor, catchAsync(campgrounds.updateCampground));
// router.get('/:id', catchAsync(campgrounds.showCampground));
// router.post('/', validateCampground, reqLogin, catchAsync(campgrounds.createCampground));
// router.delete('/:id', reqLogin, isAuthor, catchAsync(campgrounds.deleteCampground));
module.exports = router;