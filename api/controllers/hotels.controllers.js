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
        .json({message: err});
    })

};

var _splitArray = function(input) {
  var output;
  if(input && input.length > 0) {
    output = input.split(";");
  } else {
    output = [];
  }
  return output;
}

module.exports.hotelsAddOne = function(req, res) {
  console.log("POST new hotel");
  Hotel
    .create({
      name: req.body.name,
      description: req.body.description,
      stars: parseInt(req.body.stars, 10),
      services: _splitArray(req.body.services),
      photos: _splitArray(req.body.photos),
      currency: req.body.currency,
      location: {
        address: req.body.address,
        coordinates: [
          parseFloat(req.body.lng),
          parseFloat(req.body.lat)
        ]
      }
    }, function(err, hotel) {
      if(err) {
        console.log("Error creating hotel");
        res
          .status(400)
          .json(err);
      } else {
        console.log("Hotel created", hotel);
        res
          .status(201)
          .json(hotel);
      }
    })

};

module.exports.hotelsUpdateOne = function(req, res) {
  var id = req.params.hotelId;
  console.log('GET hotelId', id);

  Hotel
    .findById(id)
    .select("-reviews -rooms")
    .exec(function(err, doc) {
      if(err){
        res
          .status(500)
          .json(err);
      }
      else if(!doc){
        res
          .status(404)
          .json({message: "Hotel ID not found"});
      } else {
        doc.name = req.body.name,
        doc.description = req.body.description,
        doc.stars = parseInt(req.body.stars, 10),
        doc.services = _splitArray(req.body.services),
        doc.photos = _splitArray(req.body.photos),
        doc.currency = req.body.currency,
        doc.location = {
          address: req.body.address,
          coordinates: [
            parseFloat(req.body.lng),
            parseFloat(req.body.lat)
          ]
        }
        doc.save(function(err, hotelUpdated) {
          if(err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(200)
              .json(hotelUpdated);
          }
        })
      }
    })
}
