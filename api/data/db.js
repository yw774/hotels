var mongoose = require('mongoose');
var dburl = "mongodb://localhost:27017/udemy";

mongoose.connect(dburl);

mongoose.connection.on('connected', function(){
  console.log('mongoose connected to '+ dburl);
});
mongoose.connection.on('disconnected', function(){
  console.log('mongoose disconnected' );
});
mongoose.connection.on('error', function(err){
  console.log('mongoose connected err '+ err);
});

process.on('SIGINT', function(){
  mongoose.connection.close(function(){
    console.log("Mongo disconnected through app termination");
    process.exit(0);
  })
})

process.on('SIGTERM', function(){
  mongoose.connection.close(function(){
    console.log("Mongo disconnected through app termination");
    process.exit(0);
  })
})

process.once('SIGUSR2', function(){
  mongoose.connection.close(function(){
    console.log("Mongo disconnected through app termination");
    process.kill(process.pid, 'SIGUSR2');
  })
})

// Bring in schemas and models
require('./hotels.model.js')
