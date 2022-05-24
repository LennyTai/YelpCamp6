const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews')
const { reqLogin, validateReview } = require('../middleware');



router.delete('/:rid', reqLogin, catchAsync(reviews.deleteReview));
router.post('/', validateReview, reqLogin, catchAsync(reviews.createReview));
module.exports = router;