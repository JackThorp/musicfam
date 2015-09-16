'use strict';

var serve = require('gulp-serve');
var conf  = require('./gulp/config.js');
var paths = conf.paths;
var gulp  = require('./gulp')([
    'build',
    'vendor',
    'html',
    'jade-ract',
    'less',
    'test',
    'jquery',
    'bootstrap',
    'fonts'
]);


gulp.task('build-all', ['jade-ract', 'vendor', 'jquery', 'bootstrap', 'build', 'html', 'less', 'fonts']);

gulp.task('serve-with-node', ['build-all'], serve({
  root: ['./dist'],
  port: process.env.PORT || 8080
}));

gulp.task('watch', ['build-all'], function() {
  gulp.watch(paths.js.watch, ['build']);
  gulp.watch(paths.ract.watch, ['build']); // Couldn't find a nicer way to make build run after jade-ract.
  gulp.watch(paths.jade.watch, ['jade-ract']);
  gulp.watch(paths.html.watch, ['html']);
  gulp.watch(paths.less.watch, ['less']);
});

gulp.task('default', ['watch', 'serve-with-node']);

