var config = require('../config.js');
var paths  = config.paths;

module.exports = function(gulp) {
  return function() {
    return gulp.src(paths.jquery.src)
      .pipe(gulp.dest(paths.jquery.dest));
  }
}
