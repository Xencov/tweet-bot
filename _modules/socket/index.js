/**
 * File for all the real-time events and socket communication
 * @author Suroor Wijdan
 * */


var TweetBot = require('../tweet-bot');
var tweetBot = new TweetBot();
var previousHashStream = null;

primus.on('connection', function (spark) {
  console.log('A user has connected with :'.blue, spark.id.green);

  spark.on('filter', function(data){
    if(previousHashStream)
      previousHashStream.stop();

    var filteredTweetStream = tweetBot.filter(data.term);
    previousHashStream = filteredTweetStream;
    filteredTweetStream.on('tweet', function(tweet){
      spark.send('hashTweet', tweet);
    });
  });

  spark.on('retweet', function(tweet){
    tweetBot.retweet(tweet.id, function(data){
      spark.send('retweeted', tweet);
    })
  });

  spark.on('favorite', function(tweet){
    tweetBot.favorite(tweet.id, function(data){
      spark.send('favorited', data);
    })
  });

  spark.on('stream', function(){
    var ownStream = tweetBot.ownStream();
    ownStream.on('tweet', function(tweet){
      spark.send('ownStream', tweet);
    });
  });
});

primus.on('disconnection', function (spark) {
  console.log('A user has disconnected with :'.red, spark.id.green);
});