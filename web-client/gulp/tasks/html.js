var config  = require('../config.js');
var paths   = config.paths;

module.exports = function(gulp) {

  return function() {
    return gulp.src(paths.html.src)
      .pipe(gulp.dest(paths.html.dest));
  };
};
