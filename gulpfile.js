var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');


/**
 * Setting up SCSS to css
 */

gulp.task('styles', function() {
    return gulp.src('site/assets/sass/screen.scss')
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('build/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('www/assets/css'))
        .pipe(notify({ message: 'Styles task complete' }));
});


/**
 * Setting up jshint, concat, minification, uglify goodness.
 */

gulp.task('scripts', function() {
    return gulp.src('site/assets/js/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('site.js'))
        .pipe(gulp.dest('build/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('www/assets/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});


/**
 * Image goodness
 */

gulp.task('images', function() {
    return gulp.src('www/assets/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest('www/images'))
        .pipe(notify({ message: 'Images task complete' }));
});



//gulp.task('html', function() {
//    return gulp.src('www/*.html')
//        .pipe(gulp.dest(''))
//        .pipe(livereload(server))
//        .pipe(notify({ message: 'HTML task complete' }));
//});



/**
 * Cleaning up for deploy
 */

gulp.task('clean', function(cb) {
    del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
});


gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});


gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch('site/assets/sass/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('site/assets/js/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('www/assets/images/**/*', ['images']);

//    gulp.watch('www/*.html', ['images']);

    livereload.listen();
    gulp.watch(['build/**']).on('change', livereload.changed);


});
