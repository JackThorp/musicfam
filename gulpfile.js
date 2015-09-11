'use strict';
var nodemon = require('gulp-nodemon');
var gulp    = require('gulp');

gulp.task('public', function() {
  return gulp.src('web-client/dist/**/*')
    .pipe(gulp.dest('api/public'));
})

gulp.task('run-server', function() {
    nodemon({
      script: 'api/bin/www.coffee',
      watch: 'api/src',
      env: { 'NODE_ENV': 'development' }
    })
})

gulp.task('watch', function() {
  gulp.watch('web-client/dist/**/*', ['public']);
});

gulp.task('default', ['public', 'watch', 'run-server']);
