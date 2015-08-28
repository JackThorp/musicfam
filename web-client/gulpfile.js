'use strict';

var serve = require('gulp-serve');
var conf  = require('./gulp/config.js');
var paths = conf.paths;
var gulp  = require('./gulp')([
    'build',
    'vendor',
    'jade',
    'less',
    'test'
]);


gulp.task('build-all', ['vendor', 'build', 'jade', 'less']);

gulp.task('serve-with-node', ['build-all'], serve({
  root: ['./dist'],
  port: process.env.PORT || 8080
}));

gulp.task('watch', function() {
  gulp.watch(paths.js.watch, ['build']);
  gulp.watch(paths.jade.watch, ['jade']);
  gulp.watch(paths.less.watch, ['less']);
});

gulp.task('default', ['watch', 'serve-with-node']);
