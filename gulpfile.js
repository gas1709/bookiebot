var gulp = require('gulp');
var watch = require('gulp-watch');
var jasmine = require('gulp-jasmine');

gulp.task('default', function () {
	gulp.watch([
		'./**/*.js',
		'!./logs',
		'!./node_modules'
	], ['tests'])
});

gulp.task('tests', function () {
	return gulp.src('spec/*.js')
		.pipe(jasmine());
});