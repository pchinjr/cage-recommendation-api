'use strict';
const http = require('http');
const host = 'api.themoviedb.org/3';
const movieDbApiKey = '[YOUR_API_KEY]';
exports.movieWebhook = (req, res) => {
  // Get the city and date from the request
  let genre = req.body.result.parameters['genre'];
  // Call the weather API
  callMovieApi(genre).then((output) => {
    // Return the results of the weather API to Dialogflow
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
    // Create the path for the HTTP request to get the weather
    let path = '/discover/movie?api_key=' + movieDbApiKey + '&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=80&with_people=2963';
    console.log('API Request: ' + host + path);
    // Make the HTTP request to get the weather
    http.get({host: host, path: path}, (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        let response = JSON.parse(body);
        let movieTitle = response.results[0].title;
        // Create response
        let output = 'You should watch ${movieTitle}';
        // Resolve the promise with the output text
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        reject(error);
      });
    });
  });
}