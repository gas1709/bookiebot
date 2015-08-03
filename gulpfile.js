var gulp = require('gulp');
var watch = require('gulp-watch');
var run = require('gulp-run');
var nodemon = require('gulp-nodemon');

gulp.task('default', function () {
	nodemon({
		script: 'app.js',
		ext: 'js',
		ignore: ['logs/*', 'node_modules/*', 'spec/*']
	});
});

gulp.task('watch', function () {
	gulp.watch([
		'./**/*.js',
		'!./logs',
		'!./node_modules'
	], ['tests'])
});

gulp.task('tests', function () {
	run('jasmine').exec(function (error) {});
});