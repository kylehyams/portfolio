'use strict';

var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    cp          = require('child_process'),
    sass        = require('gulp-sass'),
    maps        = require('gulp-sourcemaps'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant');

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
gulp.task('browser-sync', ['compileSass', 'concatScripts', 'minifyScripts', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile scss files and create a source map
 */
gulp.task('compileSass', function() {
    gulp.src('_sass/main.scss')
        .on('error', browserSync.notify)
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write('./'))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Concatenate js files
 */
 gulp.task('concatScripts', function() {
    gulp.src([
            '_js/picturefill.js'
        ])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('js'))
        .pipe(browserSync.reload({stream:true}));
 });

 /**
 * Minify and rename concatenated js file
 */
 gulp.task('minifyScripts', function() {
    gulp.src('js/scripts.js')
        .pipe(uglify())
        .pipe(rename('scripts.min.js'))
        .pipe(gulp.dest('js'))
        .pipe(browserSync.reload({stream:true}));
 });

/**
 * Watch scss files for changes & recompile
 * Watch js files & concatenate
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(['_sass/libraries/bourbon/*.scss', '_sass/libraries/neat/*.scss', '_sass/libraries/base/*.scss', '_sass/*.scss'], ['compileSass', 'jekyll-rebuild']);
    gulp.watch('_js/*.js', ['concatScripts', 'minifyScripts', 'jekyll-rebuild']);
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
            use: [pngquant()]
        }))
        .pipe(gulp.dest('_site/assets/images'));
});
