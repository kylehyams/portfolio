'use strict';

var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require ('gulp-ruby-sass');
var cp          = require('child_process');
var concat      = require('gulp-concat');
var imagemin    = require('gulp-imagemin');
//var pngquant    = require('imagemin-pngquant');

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['jekyll-build', 'compileSass', 'concatScripts'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile scss files
 */
gulp.task('compileSass', function () {
    gulp.src('_sass/main.scss')
        //.on('error', browserSync.notify)
        .pipe(gulp.dest('css'))
        .pipe(gulp.dest('_site/css/'))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Concatenate js files
 */
 gulp.task('concatScripts', function() {
    gulp.src('_js/picturefill.js')
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('js'))
        .pipe(gulp.dest('_site/js'))
        .pipe(browserSync.reload({stream:true}));
 });

/**
 * Watch scss files for changes & recompile
 * Watch js files & concatenate
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(['_sass/libraries/bourbon/*.scss', '_sass/libraries/neat/*.scss', '_sass/libraries/base/*.scss', '_sass/*.scss'], ['compileSass']);
    gulp.watch('_js/*.js', ['concatScripts', 'jekyll-rebuild']);
    gulp.watch(['*.html', '_includes/*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass, concatenate js files,
 * compile the jekyll site, launch BrowserSync, watch files, and minify images.
 */
gulp.task('default', ['browser-sync', 'watch'], function() {
    return gulp.src('assets/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            //use: [pngquant()]
        }))
        .pipe(gulp.dest('_site/assets/images'));
});
