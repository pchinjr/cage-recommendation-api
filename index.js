'use strict';
const config = require('./config.json');
const http = require('http');

exports.movieWebhook = (req, res) => {
  // Get the genre from the request
  let genre = req.body.result.parameters['genre'];

  //find genre id from request 
  
  // Call the moviedb API
  callMovieApi(genre).then((output) => {
    // Return the results of the movie API to Dialogflow
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
  }).catch((error) => {
    // If there is an error let the user know
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
  });
};

function callMovieApi (genre) {
  return new Promise((resolve, reject) => {
    
    var options = {
      "method": "GET",
      "hostname": "api.themoviedb.org",
      "port": null,
      "path": `/3/discover/movie?api_key=${config.MOVIE_DB_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=80&with_people=2963`,
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "d88c8b42-9f0e-6308-d6cc-124386cca508"
      }
    };
    var req = http.request(options, function (res) {
      var chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function () {
        var body = Buffer.concat(chunks);
        var jason = JSON.parse(body);
        var output = jason.results[0].title;
        resolve(output);
      });
    });
    req.end();

  });
}
