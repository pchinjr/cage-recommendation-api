'use strict';
const config = require('./config.json');
const genreList = require('./genreList.json');
const mdb = require('moviedb')(config.MOVIE_DB_KEY);

exports.movieWebhook = (req, res) => {
  // Get the genre parameter from the request
  let genre = req.body.result.parameters['genre'];
  //find genre id
  const arr = genreList.genres;
  let obj = arr.find(function (obj) { return obj.name === genre; });
  let genreId = obj.id;
  // Call the moviedb API
  callMovieApi(genreId).then((output) => {
    // Return the results of the movie API to Dialogflow
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
  }).catch((error) => {
    // If there is an error let the user know
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
  });
};

function callMovieApi (genreId) {
  return new Promise((resolve, reject) => {
    mdb.discoverMovie({ "with_genres": 80, "with_people" : 2963 }, (err, res) => {
      resolve( `You should watch ${res.results[0].title}`);
    })
  });
};