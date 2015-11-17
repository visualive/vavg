/**
 * VisuAlive Web Starter.
 *
 * @package   VisuAlive Web Starter.
 * @author    KUCKLU.
 * @copyright Copyright (c) KUCKLU and VisuAlive.
 * @link      http://visualive.jp/
 * @license   Dual licensed under the MIT License or GNU General Public License v2.0 ( or later ).
 */
"use strict";

var gulp              = require('gulp'),
    $                 = require('gulp-load-plugins')(),
    pngquant          = require('imagemin-pngquant'),
    jpegoptim         = require('imagemin-jpegoptim'),
    svgo              = require('imagemin-svgo'),
    browserSync       = require('browser-sync'),
    browserSyncReload = browserSync.reload,
    runSequence       = require('run-sequence'),
    fs                = require('fs'),
    path              = require('path'),
    yml               = require('js-yaml'),
    settings          = yml.safeLoad(fs.readFileSync('site.yml')),
    rootPath          = __dirname,
    themePath         = __dirname + '/wp-content/themes/' + settings.theme_dir_name,
    sourcePath        = themePath + '/_source',
    assetsPath        = themePath + '/assets',
    sources           = {
        scss    : {
            tmp  : sourcePath + '/.tmp/scss',
            dir  : sourcePath + '/scss/',
            files: sourcePath + '/scss/**/*.scss',
            inc  : 'bower_components/foundation/scss',
            px   : '16px',
            dest : themePath + '/'
        },
        js      : {
            tmp  : sourcePath + '/.tmp/js',
            dir  : sourcePath + '/js/',
            files: [
                rootPath + '/bower_components/fastclick/lib/fastclick.js',
                rootPath + '/bower_components/modernizr/modernizr.js',
                // rootPath + '/bower_components/jQuery.mmenu/dist/js/jquery.mmenu.min.js',
                // rootPath + '/bower_components/shufflejs/dist/jquery.shuffle.min.js',
                // rootPath + '/bower_components/slick-carousel/slick/slick.min.js',
                // rootPath + '/bower_components/jquery.stellar/jquery.stellar.min.js',
                // rootPath + '/bower_components/jquery.mb.ytplayer/dist/jquery.mb.YTPlayer.min.js',
            ],
            ie   : [
                rootPath + '/bower_components/html5shiv/dist/html5shiv.min.js',
                rootPath + '/bower_components/nwmatcher/src/nwmatcher.js',
                rootPath + '/bower_components/selectivizr/selectivizr.js',
                rootPath + '/bower_components/respond/dest/respond.min.js',
                rootPath + '/bower_components/REM-unit-polyfill/js/rem.min.js'
            ],
            dest : assetsPath + '/js/'
        },
        img     : {
            files: sourcePath + '/img/**/*',
            dest : assetsPath + '/img/'
        },
        font    : {
            files: sourcePath + '/font/**/*',
            dest : assetsPath + '/font/'
        },
        archive : {
            files: themePath + '/**',
            dest : rootPath + '/'
        }
    };

if(settings.bootstrap == true) {
    sources.scss.inc = rootPath + '/bower_components/bootstrap-sass/assets/stylesheets';
    sources.scss.px  = '14px';
} else {
    sources.js.files.push(
        rootPath + '/bower_components/foundation/js/foundation/foundation.js'
    );
}

if(settings.underscore == true) {
    sources.js.files.push(
        sourcePath + '/js/customizer.js',
        sourcePath + '/js/navigation.js',
        sourcePath + '/js/skip-link-focus-fix.js'
    );
}

sources.js.files.push(
    sourcePath + '/js/script.js'
);

/**************************
 *****  Scss compile  *****
 **************************/

gulp.task('scss', function () {
    return gulp.src(sources.scss.files)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.newer(sources.scss.tmp))
        .pipe($.cssGlobbing({ extensions: ['.scss'] }))
        .pipe($.sass({
            style          : 'compressed',
            bundleExec     : true,
            require        : ['bourbon', 'neat'],
            precision      : 10,
            includePaths   : sources.scss.inc,
            errLogToConsole: true
        }).on('error', $.sass.logError))
        .pipe($.pixrem({
            rootValue: sources.scss.px,
            replace: true
        }))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9'],
            cascade: false
        }))
        // .pipe($.csscomb())
        .pipe(gulp.dest(sources.scss.tmp))
        .pipe(gulp.dest(sources.scss.dest))
        .pipe($.size({title: 'Style'}))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.cssmin())
        .pipe($.size({title: 'Style:min'}))
        .pipe(gulp.dest(sources.scss.tmp))
        .pipe(gulp.dest(sources.scss.dest))
        .pipe(browserSyncReload({stream: true}));
});


/*************************
 *****  JS optimize  *****
 *************************/
gulp.task('js', function () {
    return gulp.src(sources.js.files)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.newer(sources.js.tmp))
        .pipe($.concat('apps.js'))
        .pipe($.crLfReplace({changeCode: 'LF'}))
        .pipe(gulp.dest(sources.js.tmp))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe($.size({title: 'js'}))
        .pipe(gulp.dest(sources.js.dest))
        .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('js:ie', function () {
    return gulp.src(sources.js.ie)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.concat('ie.js'))
        .pipe($.crLfReplace({changeCode: 'LF'}))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe(gulp.dest(sources.js.dest));
});


/**************************
 *****  Img optimize  *****
 **************************/
gulp.task('img', function () {
    return gulp.src(sources.img.files)
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced : true,
            use        : [
                pngquant({
                    quality: "60-70",
                    speed  : 5
                }),
                jpegoptim({
                    max        : 75,
                    progressive: true
                }),
                svgo()
            ]
        })))
        .pipe(gulp.dest(sources.img.dest))
        .pipe($.size({title: 'img'}))
        .pipe(browserSyncReload({stream: true}));
});


/******************
 *****  Font  *****
 ******************/
gulp.task('font', function () {
    return gulp.src(sources.font.files)
        .pipe(gulp.dest(sources.font.dest));
});


/**********************
 *****  Archives  *****
 **********************/
gulp.task('archive', function () {
    return gulp.src(sources.archive.files, {base: themePath + '/.'})
        .pipe($.ignore.exclude('_source'))
        .pipe($.zip('wp_theme_' + settings.themeDirName + '.zip'))
        .pipe(gulp.dest(rootPath + '/'));
});


/**************************
 *****  Browser sync  *****
 **************************/
gulp.task('browserSync', function () {
    return browserSync.init(null, {
        proxy: settings.hostname,
        notify: false
    });
});
gulp.task('browserSyncReload', function () {
    return browserSyncReload();
});


/*************************
 *****  Cache clear  *****
 *************************/
gulp.task('clear', function () {
    return $.cache.clearAll();
});


/*******************
 *****  Clean  *****
 *******************/
gulp.task('clean', $.shell.task(
    [
        'rm -rf ' + rootPath   + '/*.zip',
        'rm -rf ' + rootPath   + '/.tmp/',
        'rm -rf ' + rootPath   + '/wp_theme_' + settings.themeDirName + '/',
        'rm -rf ' + themePath  + '/*.css',
        'rm -rf ' + assetsPath + '/**/*/.gitkeep',
        'rm -rf ' + assetsPath + '/js/*',
        'rm -rf ' + assetsPath + '/img/*',
        'rm -rf ' + sourcePath + '/.tmp/'
    ]
));


/*******************
 *****  Watch  *****
 *******************/
gulp.task('watch', function () {
    $.watch(sources.scss.files, function () {
        return gulp.start(['scss']);
    });
    $.watch(sources.js.files, function () {
        return gulp.start(['js']);
    });
    $.watch(sources.img.files, function () {
        return gulp.start(['img']);
    });
});


/*********************
 *****  Install  *****
 *********************/
gulp.task('install', ['clear','clean'], function (cb) {
    return runSequence(['scss', 'js', 'js:ie', 'img', 'font'], cb);
});


/********************
 *****  Supply  *****
 ********************/
gulp.task('supply', ['clear','clean'], function (cb) {
    return runSequence(['scss', 'js', 'js:ie', 'img', 'font'], 'archive', cb);
});


/**************************
 *****  Default task  *****
 **************************/
gulp.task('default', ['clear','clean'], function (cb) {
    return runSequence(['scss', 'js', 'js:ie', 'img', 'font'], 'browserSync', 'watch', cb);
});
