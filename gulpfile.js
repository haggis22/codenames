var gulp = require('gulp');
var del = require('del');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');


/* Codenames tasks */

gulp.task('clean', function () {

    return del(['./build']);

});

gulp.task('lint', function () {
    // TODO: lint all the client Javascript files as well (ooof)
    return gulp.src(['js/**/*.js', 'server/**/*.js', 'src/**/*js' ])
    // the constructor accepts a path to the jshint configuration file
        .pipe(jshint('./jshint.json'))
        .pipe(jshint.reporter('default'));
});


gulp.task('css', ['clean'], function () {

    return gulp.src('src/**/*.scss')
        .pipe(concat('style.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/client/css'));


});

gulp.task('client-js', ['clean'], function () {

    // combines all the Angular code from /src along with the dual Angular/Node code from /js
    return gulp.src([ 'src/app/app.js', 'src/app/routes.js', 'js/**/*.js', 'src/services/**/*.js', 'src/modules/**/*.js' ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('build/client/js'));

});

gulp.task('server-js', ['clean'], function () {

    // copies all the shared-code js files to the build level. We don't want to concatenate them
    // because we reference them individually with require
    return gulp.src(['js/**/*.js'])
        .pipe(gulp.dest('build/js'));

});


gulp.task('client-html', ['clean'], function () {

    return gulp.src(['src/**/*.html'], { base: './src' })
        .pipe(gulp.dest('build/client'));

});

gulp.task('images', ['clean'], function () {

    return gulp.src(['src/favicon.ico', 'src/images/*.*'], { base: './src' })
        .pipe(gulp.dest('build/client'));

});

// copy all third-party libraries
gulp.task('libs', ['clean'], function () {

    // copies ALL files (will include .js, .css, etc)
    return gulp.src(['lib/**/*'], { base: './lib' })
        .pipe(gulp.dest('build/client/lib'));

});


gulp.task('server', ['clean'], function() {

    // copies all files 
    return gulp.src(['server/**/*'], { base: './server' })
        .pipe(gulp.dest('build/server'));

});

gulp.task('logs', ['clean'], function () {

    return gulp.src(['logs/empty.log'], { base: './logs' })
        .pipe(gulp.dest('build/logs'));

});

gulp.task('node_modules', ['clean'], function () {

    // copies all files 
    return gulp.src(['node_modules/**/*'], { base: './node_modules' })
        .pipe(gulp.dest('build/node-modules'));

});

gulp.task('package', ['clean'], function() {

   return gulp.src(['package.json'])
	.pipe(gulp.dest('build'));

});


gulp.task('build', ['client-js', 'client-html', 'css', 'images', 'libs', 'server', 'server-js', 'package', 'logs' ], function () {

    return gulp.src('.');

});

gulp.task('build-dev', ['build'], function () {

    // do not use a base so that it will just drop them in the server folder
    return gulp.src(['configs/dev/*'])
        .pipe(gulp.dest('build/server'));

});

gulp.task('build-prod', ['build'], function () {

    // do not use a base so that it will just drop them in the server folder
    return gulp.src(['configs/prod/*']);

});

gulp.task('dist-prod', ['build-prod'], function () {

    return gulp.src(['build/**/*'], { base: 'build' })
        .pipe(tar('codenames.tar', { mode: 0755 }))
        .pipe(gzip())
        .pipe(gulp.dest('dist'));

});

gulp.task('default', ['build-dev' ]);
