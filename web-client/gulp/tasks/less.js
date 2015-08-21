var less  = require('gulp-less');
var conf  = require('../config.js');
var paths = conf.paths;

module.exports = function(gulp) {

  return function() {
    return gulp.src(paths.less.src)
      .pipe(less({compress: true}))
      .pipe(gulp.dest(paths.less.dest));

  }
};
