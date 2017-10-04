var express = require('express');
var router = express.Router();

var ctrlHotels = require('../controllers/hotels.controllers.js');
var ctrlReviews  = require('../controllers/reviews.controllers.js');
/********************url details*************************

Method |    url               | Action
GET    | api/hotels           |get all/multi hotels
POST   | api/hotels           |create a new hotel
GET    | api/hotels/12345     |get a specifc hotel
PUT    | api/hotels/12345     |update a specifc hotel
EDLETE | api/hotels/12345     |delete a specifc hotel

#header: api/hotels/12345/
GET    | reviews              |get all reviews for a specifc hotel
POST   | reviews              |add review for a specifc hotel
GET    | reviews/54321        |get a specific review for a specifc hotel
PUT    | reviews/54321        |update a sepcific review for a specifc hotel
DELETE | reviews/54321        |delete a specific review for a specifc hotel


********************************************************/
// hotel
router
  .route('/hotels')
  .get(ctrlHotels.hotelsGetAll)
  .post(ctrlHotels.hotelsAddOne);

router
  .route('/hotels/:hotelId')
  .get(ctrlHotels.hotelsGetOne)
  .put(ctrlHotels.hotelsUpdateOne)
  //.delete(ctrlHotels.hotelsDeleteOne);

// review
router
  .route('/hotels/:hotelId/reviews')
  .get(ctrlReviews.reviewsGetAll)
  .post(ctrlReviews.reviewsAddOne);


router
  .route('/hotels/:hotelId/reviews/:reviewId')
  .get(ctrlReviews.reviewsGetOne)
  .put(ctrlReviews.reviewsUpdateOne)
  //.delete(ctrlReviews.reviewsDeleteOne);
/*
// authentication
router
  .route('users/register')
  //.post()
  */
module.exports = router;
