var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('make-zip', function()
{
	return gulp.src('src/*')
		.pipe(zip('dist_store.zip'))
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['make-zip']);