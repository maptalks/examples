/* eslint global-require: 0 */
var gulp = require('gulp');
var connect = require('gulp-connect-ex');
var ghPages = require('@justeat/gulp-gh-pages');
var build = require('./build');

gulp.task('build', function(done) {
  build(done);
});

gulp.task('watch', ['build'], function() {
  gulp.watch(
    ['src/**/*', 'assets/**/*', 'layouts/**/*', 'static/**/*'],
    ['build']
  );
});

gulp.task('connect', ['watch'], function() {
  connect.server({
    name: 'maptalks examples',
    base: '/examples',
    root: './dist',
    livereload: true,
    port: 20001
  });
});

gulp.task('deploy', function() {
  return gulp.src('dist/**/*').pipe(
    ghPages({
      message: 'Deploy to GitHub pages [ci skip]'
    })
  );
});

gulp.task('default', ['connect']);
