var gulp = require('gulp');
var watch = require('gulp-watch');
var run = require('gulp-run');

gulp.task('default', function () {
	gulp.watch([
		'./**/*.js',
		'!./logs',
		'!./node_modules'
	], ['tests'])
});

gulp.task('tests', function () {
	run('jasmine').exec(function (error) {
		console.log("Your tests failed");
	});
});