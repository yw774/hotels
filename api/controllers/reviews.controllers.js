var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function (req, res) {

  var hotelId = req.params.hotelId;
  console.log(hotelId);
  Hotel
    .findById(hotelId)
    .select('reviews')
    .then(function(doc) {
      var response = {
        status: 200,
        message: []
      }
      if(!doc){
        console.log("Hotel id not found in database");
        response.status = 404;
        response.message = {
          "message": "hotel id not found"
        };
      }
      else{
        response.status = 200;
        response.message = doc.reviews? doc.reviews : [];
      }
      res
        .status(response.status)
        .json(response.message)
    })
    .then(null, function (err) {
      console.log(err);
      res
        .status(500)
        .json("Error finding hotel");
    })
}

module.exports.reviewsGetOne = function (req, res) {

  var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;
  Hotel
    .findById(hotelId)
    .select('reviews')
    .then(function (doc) {
      var response = {
        status: 200,
        message: []
      }
      if(!doc){
        console.log("Hotel id not found in database");
        response.status = 404;
        response.message = {
          "message": "hotel id not found"
        };
      }
      else{
        response.message = doc.reviews.id(reviewId);
        if (!response.message) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      res
        .status(response.status)
        .json(response.message)
    })
    .then(null, function (err) {
      res
        .status(500)
        .json(err);
    });

}

var _addReview = function(req, res, hotel) {
  hotel.reviews.push({
    name: req.body.name,
    rating: parseInt(req.body.rating, 10),
    review: req.body.review
  })
  hotel.save(function(err, hotelUpdated) {
    if (err) {
      res
        .status(500)
        .json(err);
    } else {
      res
        .status(201)
        .json(hotelUpdated.reviews[hotelUpdated.reviews.length-1])
    }
  });
}

module.exports.reviewsAddOne = function(req, res) {
  var hotelId = req.params.hotelId;
  console.log("add new review")
  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function (err, doc) {
      var response = {
        status: 200,
        message: []
      }
      if(err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("Hotel id not found in database");
        response.status = 404;
        response.message = {
          "message": "hotel id not found"
        };
      }
      if(doc) {
        _addReview(req, res, doc);
      } else {
        res
          .status(response.status)
          .json(response.message)
      }
    });

}

module.exports.reviewsUpdateOne = function(){
  var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;
  console.log("add new review")
  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function (err, doc) {
      var response = {
        status: 200,
        message: []
      }
      if(err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("Hotel id not found in database");
        response.status = 404;
        response.message = {
          "message": "hotel id not found"
        };
      }
      if(doc) {
        var review = doc.reviews.id(reviewId);
        if (!review) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        } else {
          doc.reviews.name = req.body.name;
          doc.reviews.rating = parseInt(req.body.rating, 10),
          doc.reviews.review = req.body.review

        }
      } else {
        res
          .status(response.status)
          .json(response.message)
      }
    });

}
