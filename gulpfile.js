var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');


gulp.task('client-js', function() {

    return gulp.src([ 'src/app/app.js', 'src/modules/**/*.js' ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('client/js'));

});

gulp.task('default', ['client-js']);
