/* eslint global-require: 0 */
var gulp = require('gulp');
var connect = require('gulp-connect');
var ghPages = require('@justeat/gulp-gh-pages');
var build = require('./build');

gulp.task('build', function (done) {
  build(done);
});

gulp.task('watch', function (done) {
  gulp.watch(
    ['src/**/*', 'assets/**/*', 'layouts/**/*', 'static/**/*'],
    { ignoreInitial: false },
    build
  );
  done();
});

// FIXME: livereload seems not working
gulp.task('devserver', function (done) {
  connect.server({
    name: 'maptalks examples',
    root: './dist',
    livereload: true,
    port: 20001,
  });
  done();
});

gulp.task('dev', gulp.parallel('watch', 'devserver'));

gulp.task('deploy', function () {
  return gulp.src('dist/examples/**/*').pipe(
    ghPages({
      message: 'Deploy to GitHub pages [ci skip]',
    })
  );
});
