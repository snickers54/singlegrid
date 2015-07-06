var gulp = require('gulp');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');
var browserSync = require('browser-sync').create();
var karma = require('karma').server;

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task("babel", function () {
	 return gulp.src('./src/js/*.js')
		.pipe(babel({compact:false}))
		.on('error', console.error.bind(console))
		.pipe(gulp.dest('dest'));
});

 
gulp.task('sass', function () {
	return gulp.src('./src/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('dest'))
		.pipe(browserSync.stream());
});
 

gulp.task('babel:watch', ['babel'], function() {browserSync.reload();})

gulp.task('default', ['browser-sync'], function(){
	gulp.watch('./src/**/*.scss', ['sass']);
	gulp.watch('./src/**/*.js', ['babel:watch']);
});


/**
* Run test once and exit
*/
gulp.task('test', function (done) {
	karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done);
});

/**
* Watch for file changes and re-run tests on each change
*/
gulp.task('tdd', function (done) {
	karma.start({
		configFile: __dirname + '/karma.conf.js'
	}, done);
});