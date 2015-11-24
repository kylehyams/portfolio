'use strict';

/* var gulp = require('gulp');

gulp.task("hello", function() {
	console.log("Hello!");
});

gulp.task("default", ["hello"], function() {
	console.log("This is the default task! Yeah!");
}); */

var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
// var sass        = require ('gulp-ruby-sass');
var cp          = require('child_process');

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
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    gulp.src('_sass/main.scss')
        .pipe(sass({
            // includePaths: ['./_sass'],
            onError: browserSync.notify
        }))
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css'));
});

/**
 * Compile Sass to CSS with gulp-ruby-sass
 */
// gulp.task('sass', function () {
//     return sass('./css/**/*.scss')
//     .on('error', browserSync.notify)
//     .pipe(gulp.dest('./_site/css'))
//     .pipe(browserSync.reload({stream:true}));
// });

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(['_sass/libraries/bourbon/*.scss', '_sass/libraries/neat/*.scss', '_sass/libraries/base/*.scss', 'css/*.scss'], ['sass']);
    gulp.watch(['*.html', '_includes/*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
