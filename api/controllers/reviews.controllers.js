var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function (req, res) {

  var hotelId = req.params.hotelId;
  Hotel
    .findById(hotelId)
    .select('reviews')
    .then(function(doc) {
      if(!doc){
        console.log("Hotel id not found in database");
        response.status = 404;
        response.message = {
          "message": "hotel id not found"
        };
      }
      else{
        response.message = doc.reviews? doc.reviews : [];
      }
      res
        .status(response.status)
        .json(response.message)
    })
    .then(null, function (err) {
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

/*
module.exports.reviewsAddOne = function(req, res){
  var db = dbconn.get();
  var collection = db.collection('hotels');
  var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;
  var review = {
    name: req.body.name,
    rating: parseInt(req.body.rating, 10),
    review: req.body.review
  }
  console.log('POST review for hotelId ' + hotelId);

  collection
    .update({_id: ObjectId(hotelId)},{$push: {reviews: review}})
    .then(function (result) {
      var response = {
        status: 200,
        message: []
      }
      if(!result.mathcedCount){
        console.log("Hotel id not found in database");
        response.status = 404;
        response.message = {
          "message": "hotel id not found"
        };
      }
      else{
        response.status = 200;
        response.message = {"message" :"success add"}
      }
    })
    .then(null, function (err) {
      console.log("Error finding hotel");
      resvar ctrlReviews  = require('../controllers/reviews.controllers.js');
        .status(404)
        .json(err);
    })

}

module.exports.reviewsUpdateOne = function(){
  var db = dbconn.get();
  var collection = dvar ctrlReviews  = require('../controllers/reviews.controllers.js');b.collection('hotels');
  var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;
  var review = {
    name: req.body.name,
    rating: parseInt(req.body.rating, 10),
    review: req.body.review
  }var ctrlReviews  = require('../controllers/reviews.controllers.js');
  console.log('POST review for hotelId ' + hotelId);

  collection
    .findOne({_id: ObjectId(hotelId)}, {fields:reviews})
    .then(function (doc) {
      if(doc.reviews && doc.reviews.length > reviewId){
        var setContent = {};
        setContent["reviews."+reviewId] = review;
        return collection
          .uvar ctrlReviews  = require('../controllers/reviews.controllers.js');pdate({_id: ObjectId(hotelId)},{$set: setContent})
          .then(function (result) {
            var response = {
              status: 200,
              message: []
            }
            if(!result.mathcedCount){
              console.log("Hotel id not found in database");
              response.status = 404;
              response.message = {
                "message": "hotel id not found"
              };
            }
            else{
              response.status = 200;
              response.message = {"message" :"success add"}
            }
          })
          .then(null, function (err) {
            console.log("Error finding hotel");
            res
              .status(404)
              .json(err);
          })
      }
      else{
        res
          .status(404)
          .json({"message": "Review ID not found "+reviewId});
      }
    })

}
*/
