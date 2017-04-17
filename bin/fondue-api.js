var http = require("http");
var https = require("https");
var url = require("url");
var request = require("request");
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var fs = require('fs');

var allowCrossDomain = function (req, res, next) {
  res.setHeader("origin", req.headers.origin);
  res.setHeader("Cache-Control", "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0");
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

  //res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(allowCrossDomain);
app.all("*", require("../fondueMiddlewareAPI"));
//app.post("*", function (req, res) {
//  res.send("hello world")
//});

http.createServer(app).listen(9000, function () {
  console.log('Express server listening on port ' + 9000);
});
https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app).listen(9001, function () {
  console.log('Express server listening on port ' + 9001);
});