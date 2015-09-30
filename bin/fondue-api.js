var http = require("http");
var https = require("https");
var url = require("url");
var request = require("request");
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var fs = require('fs');

app.use(bodyParser.json());
app.all("*", require("../fondueMiddlewareServer"));
//app.all("*", function(req, res){
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