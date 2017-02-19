var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var sass = require('gulp-sass');

gulp.task('clean', function () {

    return del(['./client']);

});


gulp.task('css', ['clean'], function () {

    return gulp.src('src/**/*.scss')
        .pipe(concat('style.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('client/css'));


});

gulp.task('client-js', ['clean'], function () {

    // combines all the Angular code from /src along with the dual Angular/Node code from /js
    return gulp.src([ 'src/**/*.js', 'js/**/*.js' ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('client/js'));

});


gulp.task('client-html', ['clean'], function () {

    return gulp.src(['src/**/*.html'], { base: './src' })
        .pipe(gulp.dest('client'));

});

gulp.task('images', ['clean'], function () {

    return gulp.src(['src/favicon.ico', 'src/images/*.*'], { base: './src' })
        .pipe(gulp.dest('client'));

});



gulp.task('default', ['client-js', 'client-html', 'css', 'images' ]);
