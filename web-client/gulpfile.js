'use strict';

var gulp  = require('./gulp')([
    'build',
    'vendor',
    'html',
    'less',
    'test'
]);

var serve = require('gulp-serve');

gulp.task('build-all', ['vendor', 'build', 'html', 'less']);

gulp.task('serve-with-node', ['build-all'], serve({
  root: ['./dist'],
  port: process.env.PORT || 8080
}));
