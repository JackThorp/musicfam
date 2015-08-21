var path    = require('path');
var kServer   = require('karma').Server;
var conf  = require('../config.js');

module.exports = function(gulp) {

  var karmaPath = path.join(process.cwd(), conf.__testdir,  'karma.conf.js');

  return function(done) {

    var server = new kServer({
      configFile: karmaPath,       
      singleRun: true
    }, done);

    server.start();
  }
};
