var Twit = require('twit');

function TweetBot() {
  this.twit = new Twit({
    consumer_key: 'CONSUMER_KEY_HERE',
    consumer_secret: 'CONSUMER_SECRET_HERE',
    access_token: 'ACCESS_TOKEN_HERE',
    access_token_secret: 'ACCESS_TOKEN_SECRET_HERE'
  });

  this.filter = function (term) {
    var stream = this.twit.stream('statuses/filter', {track: term, language: 'en'});
    console.log('Started twitter stream for the term '.blue, term.toString().green);
    return stream;
  };

  this.retweet = function(tweetId, callback){
    this.twit.post('statuses/retweet/:id', { id: tweetId }, function (err, data, response) {
      if(!err){
        console.log('Retweeted the tweet with id '.blue, tweetId.toString().green);
        callback(data);
      }
    })
  };

  this.favorite = function(tweetId, callback){
    this.twit.post('favorites/create/:id', {id: tweetId}, function(err, data, response){
      if(!err){
        console.log('Favorited the tweet with id '.blue, tweetId.toString().green);
        callback(data);
      }
    });
  };

  this.ownStream = function(){
    var stream = this.twit.stream('user');
    console.log('Started twitter stream for authenticated user '.blue);
    return stream;
  };
}

module.exports = TweetBot;