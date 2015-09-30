
var redis = require('redis');
var redisClient = redis.createClient();

redisClient.on('connect', function () {
  redisClient.flushdb(function (err, didSucceed) {
    console.log(didSucceed); // true
  });
});