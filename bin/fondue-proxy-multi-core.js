var cluster = require('cluster');

if (cluster.isMaster) {
  require('os').cpus().forEach(function () {
    cluster.fork();
    console.log("Fondue proxy instance.")
  });
  cluster.on('death', function (worker) {
    console.log('worker ' + worker.pid + ' died');
    cluster.fork();
  });
} else {
  require('./fondue-proxy');
}