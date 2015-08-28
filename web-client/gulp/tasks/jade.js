var config  = require('../config.js');
var paths   = config.paths;
var jade    = require('gulp-jade');

module.exports = function(gulp) {

  return function() {
    return gulp.src(paths.jade.src)
      .pipe(jade({pretty: true}))
      .pipe(gulp.dest(paths.jade.dest));
  };
};
