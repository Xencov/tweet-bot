var app = angular.module('TweetBot', []);

app.controller("TweetBotController", function($scope) {
  var primus = new Primus('http://' + window.location.host, {
    reconnect: {
      maxDelay: Infinity,
      minDelay: 500,
      retries: 10
    },
    strategy: ['online', 'timeout', 'disconnect']
  });

  $scope.hashTweets = [];
  $scope.ownTweets = [];
  $scope.reTweets = [];
  $scope.hashtag = '#nodejs';



  primus.on('open', function(){
    primus.send('stream');
    primus.send('filter', {term: $scope.hashtag});
  });

  primus.on('hashTweet', function(tweet){
    $scope.hashTweets.push(tweet);
    $scope.$apply();
    var streamDiv = document.getElementById("hashStream");
    streamDiv.scrollTop = streamDiv.scrollHeight;
    if(tweet.user.followers_count > 1000){
      primus.send('retweet', tweet);
    }
  });
  primus.on('retweeted', function(tweet){
    $scope.reTweets.push(tweet);
    $scope.$apply();
    var streamDiv = document.getElementById("reTweets");
    streamDiv.scrollTop = streamDiv.scrollHeight;
  });
  primus.on('ownStream', function(tweet){
    $scope.ownTweets.push(tweet);
    $scope.$apply();
    var streamDiv = document.getElementById("ownStream");
    streamDiv.scrollTop = streamDiv.scrollHeight;
  });

  $scope.changeHashTag = function(){
    if($scope.hashtag)
      primus.send('filter', {term: $scope.hashtag});
  };

  console.log('Initialized TweetBot with Primus and Node.js Server');
});

