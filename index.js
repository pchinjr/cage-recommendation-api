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
    let action = req.body.result.action;
    let parameters = req.body.result.parameters;
    let contexts = req.body.result.contexts;
    //create handlers for actions 
    const actionHandlers = {
      'input.genre' : () => {
        let genreId = genreDict[parameters.genre];
        mdb.discoverMovie({ "with_genres": genreId, "with_people" : 2963 }, (err, res) => {
          if (err) {
            reject(err)
          };
          const random = Math.floor(Math.random()*res.results.length)
          const movie = res.results[random];
          const contextOutput = [{
            'name': 'costars',
            'lifespan' : 5,
            'parameters' : {
              'movieId' : movie.id
            }
          }]; 
          resolve( buildResponse(`You should watch ${movie.title} http://image.tmdb.org/t/p/w185${movie.poster_path}`, contextOutput) );
        });
      },
      'input.costars' : () => {
        var movieId = contexts.find( context => context.name === 'costars').parameters.movieId
        mdb.movieCredits({ "id": movieId }, (err, res) => {
         if(err) {
           reject(err)
         };
         const cast = res.cast;
         var notCageCast = cast
         .filter( el => { return el.name !== 'Nicolas Cage'} )
         .map( el => el.name )
         .reduce( (memo, value, index, array) => { 
           //first item
           if(index === 0) {
             return value
           }
           //last item
           if(index === array.length-1) {
             return `${memo}, and ${value}`;
           }
           //default
           return `${memo}, ${value}` }, '');

         resolve( buildResponse(`The cast includes ${notCageCast}`) );
        })
      }
    }
   
    //run the proper action handler
    actionHandlers[action]();
  
    function buildResponse(responseToUser, contextOutput) {
      return { 
        'speech' : responseToUser,
        'displayText' : responseToUser,
        'contextOut' : contextOutput,
      }
    }  
  });
};