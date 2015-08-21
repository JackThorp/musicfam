'use strict';

var gulp  = require('./gulp')([
    'build',
    'vendor',
    'html',
    'test'
]);

var serve = require('gulp-serve');

gulp.task('build-all', ['vendor', 'build', 'html']);

gulp.task('serve-with-node', ['build-all'], serve({
  root: ['./dist'],
  port: process.env.PORT || 8080
}));
