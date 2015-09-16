var config = require('../config.js');
var paths  = config.paths;

module.exports = function(gulp) {
  return function() {
    return gulp.src(paths.bootstrap.src)
      .pipe(gulp.dest(paths.bootstrap.dest));
  }
}
