'use strict';
const config = require('./config.json');
const genreDict = require('./genreDict');
const mdb = require('moviedb')(config.MOVIE_DB_KEY);

exports.movieWebhook = (req, res) => {
  processRequest(req).then((output) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(output);
  }).catch((error) => {
    // If there is an error let the user know
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
  });
};

function processRequest(req) {
  return new Promise( (resolve, reject) => {
    let action = req.result.action;
    let parameters = req.result.parameters;
  
    //create handlers for actions 
    const actionHandlers = {
      'input.genre' : () => {
        let genreId = genreDict[ parameters.genre ]; //?
        mdb.discoverMovie({ "with_genres": genreId, "with_people" : 2963 }, (err, res) => {
          if (err) {
            reject(err)
          };
          const movie = res.results[0]
          resolve( buildResponse(`You should watch ${movie.title} http://image.tmdb.org/t/p/w185${movie.poster_path}`) )//?
        });
      },
    }
  
    //run the proper action handler
    actionHandlers[action]();
  
    function buildResponse(responseToUser) {
      return { 
        speech : responseToUser,
        displayText : responseToUser
      }
    }  
  });
};