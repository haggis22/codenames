var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var sass = require('gulp-sass');


gulp.task('css', function () {

    return gulp.src('src/css/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('client/css'));


});

gulp.task('client-js', function() {

    return gulp.src([ 'src/app/app.js', 'src/modules/**/*.js' ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('client/js'));

});

gulp.task('default', ['client-js']);
