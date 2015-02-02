var gulp = require('gulp');
var zip = require('gulp-zip');
var clean = require('gulp-clean');

gulp.task('make-zip', ['clean-dist'], function()
{
	return gulp.src('src/*')
		.pipe(zip('dist_store.zip'))
		.pipe(gulp.dest('dist'));
});

gulp.task('clean-dist', function()
{
	return gulp.src('./dist', {read: false}).pipe(clean());
});

gulp.task('default', ['clean-dist', 'make-zip']);