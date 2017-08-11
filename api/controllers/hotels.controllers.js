var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');


var runGeoQuery = function(req, res) {

  var lng = parseFloat(req.query.lng)
  var lat = parseFloat(req.query.lat)

  //
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };

  var geoOptions = {
    spherical: true,
    maxDistance: 2000,
    num: 3
  }

  Hotel
    .geoNear(point, geoOptions, function(err, results, stats) {
      console.log('Geo results', results);
      console.log('Geo status', stats)
      res
        .status(200)
        .json(results)

    });
}
module.exports.hotelsGetAll = function(req, res) {

  console.log('GET the hotels');
  console.log(req.query);

  var offset = 0;
  var count = 5;
  var maxCount = 10;

  if(req.query && req.query.lat && req.query.lng) {
    console.log("run geo search")
    runGeoQuery(req,res)
    return;
  }

  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  }

  if (req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
  }

  if(isNaN(offset) || isNaN(count)) {
    res
      .status(400)
      .json({
        message: "bad request on count or offset"
      })
  }

  if(count > maxCount) {
    res
      .status(400)
      .json({
        message: "Count limit of " + maxCount + " exceeded"
      })
  }

  Hotel
    .find({},{},{skip: offset, limit: count})
    .then(function(docs) {
      console.log("Found hotels", docs.length);
      res
        .status(200)
        .json(docs);
    })
    .then(null, function(err) {
      console.log("Error Found hotels");
      res
        .status(500)
        .json("Error Found Hotels");
    })

};

module.exports.hotelsGetOne = function(req, res) {

  var id = req.params.hotelId;
  console.log('GET hotelId', id);

  Hotel
    .findById(id)
    .then(function(doc) {
      if(!doc){
        res
          .status(404)
          .json({message: "Hotel ID not found"});
      }
      res
        .status(200)
        .json(doc);
    })
    .then(null, function(err) {
      console.log("Error Found hotel");
      res
        .status(500)
        .json("Error Found Hotel");
    })

};
/*
module.exports.hotelsAddOne = function(req, res) {
  console.log("POST new hotel");
  var db = dbconn.get();
  var collection = db.collection('hotels');
  var newHotel;

  if (req.body && req.body.name && req.body.stars) {
    newHotel = req.body;
    newHotel.stars = parseInt(req.body.stars, 10);
    collection.insertOne(newHotel, function(err, response) {
      console.log("Hotel added", response);
      console.log("Hotel added", response.ops);
      res
        .status(201)
        .json(response.ops);
    });
    // console.log(newHotel);
    // res
    //   .status(200)
    //   .json(newHotel);
  } else {
    console.log("Data missing from body");
    res
      .status(400)
      .json({ message : "Required data missing from body" });
  }

};
*/
