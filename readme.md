# What is this?
A conversational Slackbot for finding Nicolas Cage Movies. A user requests a movie by mentioning a genre. Dialogflow analyzes the text and uses a cloud function to get data back from TheMovieDB. 

# Stuff I'm Using 
- [Google Cloud Functions](https://cloud.google.com/functions/) 
- [DialogFlow](https://www.Dialogflow.com)
- [TheMovieDB](https://developers.themoviedb.org)
- [TheMovieDB NodeJS Library](https://github.com/impronunciable/moviedb)
- [Serverless Framework](https://www.serverless.com)

# Notes
In Dialogflow, you create an `Agent`. The agent listens to user input and matches those to `Intents`. The intents might reference `Entities`. `Entities` are a type of keyword that the `Intent` tries to match and respond to. I gave each `Intent` an `Action`. Each Agent can only have one `Fulfillment Webhook` that calls a single Cloud Function. In the Cloud Function, there is an `actionHandler` which checks for an `Action` and does the appropriate API call to TheMovieDB. 

It took me a while to realize that Dialogflow is only used to map out a decision tree with conversational language between the user and the bot. I still had to create the `Agent`,`Intents`, and `Entities` in the Dialogflow web interface. The Cloud Function was created with the Serverless Framework for easier deployment, however you still have to use the Google Cloud Console to create a project and enable the Google Cloud Platform APIs. 