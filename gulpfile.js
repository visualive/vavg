/**
 * VAVG Gulpfile.
 *
 * @package   VAVG.
 * @author    KUCKLU.
 * @copyright Copyright (c) KUCKLU and VisuAlive.
 * @link      http://visualive.jp/
 * @license   GNU General Public License version 2.0 later.
 */
"use strict";

var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    imageresize = require('gulp-image-resize'),
    pngquant    = require('imagemin-pngquant'),
    jpegoptim   = require('imagemin-jpegoptim'),
    gifsicle    = require('imagemin-gifsicle'),
    svgo        = require('imagemin-svgo'),
    crLf        = require('gulp-cr-lf-replace'),
    sassInheritance = require('gulp-sass-inheritance'),
    img         = {
        "pngQuality": "60-70",
        "pngSpeed": 5,
        "jpgQuality": 70,
        "jpgProgressive": true,
        "gifInterlaced": false
    },
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    runSequence = require('run-sequence'),
    fs          = require('fs'),
    yml         = require('js-yaml'),
    settings    = yml.safeLoad(fs.readFileSync('site.yml')),
    rootPath    = __dirname + '/wp-content/themes/' + settings.themeDirName,
     // rootPath    = __dirname + '/themes/' + settings.themeDirName,
    sourcePath  = rootPath + '/_sources',
    assetsPath  = rootPath + '/assets',
    sources     = {
        html:        rootPath + '/**/*.html',
        php:         rootPath + '/**/*.php',
        scss:        [sourcePath + '/scss/**/*.scss'],
        scssDir:     sourcePath + '/scss/',
        css:         [rootPath + '/*.css', assetsPath + '/css/*.css', '!' + rootPath + '/*.min.css', '!' + assetsPath + '/css/*.min.css'],
        cssDestDir:  rootPath + '/',
        img:         sourcePath + '/img/**/*.+(jpg|jpeg|png|gif|svg)',
        imgDestDir:  assetsPath + '/img/',
        font:        sourcePath + '/font/**/*',
        fontDestDir: assetsPath + '/font/',
        js:          [
            __dirname + '/bower_components/fastclick/lib/fastclick.js',
            __dirname + '/bower_components/modernizr/modernizr.js',
            //__dirname + '/wp-includes/js/jquery/jquery.js',
            //__dirname + '/bower_components/jquery-legacy/dist/jquery.min.js',
            //__dirname + '/wp-includes/js/jquery/ui/core.min.js',
            //__dirname + '/wp-includes/js/jquery/ui/datepicker.min.js',
            __dirname + '/bower_components/foundation/js/foundation/foundation.js',
            __dirname + '/bower_components/foundation/js/foundation/foundation.offcanvas.js',
            //__dirname + '/bower_components/jQuery.mmenu/dist/js/jquery.mmenu.min.js',
            //__dirname + '/bower_components/shufflejs/dist/jquery.shuffle.min.js',
            __dirname + '/bower_components/slick-carousel/slick/slick.min.js',
            __dirname + '/bower_components/jquery.stellar/jquery.stellar.min.js',
            __dirname + '/bower_components/jquery-unveil/jquery.unveil.min.js',
            //__dirname + '/bower_components/jquery.mb.ytplayer/dist/jquery.mb.YTPlayer.min.js',
            sourcePath + '/js/highlight.js',
            sourcePath + '/js/jquery.ssc.js',
            sourcePath + '/js/script.js'
        ],
        jsIE:        [
            __dirname + '/bower_components/html5shiv/dist/html5shiv.min.js',
            __dirname + '/bower_components/nwmatcher/src/nwmatcher.js',
            __dirname + '/bower_components/selectivizr/selectivizr.js',
            __dirname + '/bower_components/respond/dest/respond.min.js',
            __dirname + '/bower_components/REM-unit-polyfill/js/rem.min.js'
        ],
        jsAdmin:     [
            sourcePath + '/js/admin/*.js'
        ],
        jsDestDir:   assetsPath + '/js/'
    };

/**************************
 ******  Scss build  ******
 **************************/
gulp.task('scss', function(){
    return gulp.src(sources.scss)
        .pipe($.if(global.isWatching, $.cached('scss')))
        .pipe(sassInheritance({dir: sources.scssDir}))
        .pipe($.filter(function (file) {
            return !/\/_/.test(file.path) || !/^_/.test(file.relative);
        }))
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.sass({
            style           : 'compressed',
            bundleExec      : true,
            require         : ['bourbon', 'neat'],
            includePaths    : __dirname + '/bower_components/',
            errLogToConsole : true
        }))
        .pipe($.pleeease({
            autoprefixer   : {browsers: ['last 2 versions', 'ie 8', 'ie 9']},
            opacity        : true,
            filters        : { 'oldIE': true },
            rem            : ["16px", {replace: true}],
            mqpacker       : true,
            import         : true,
            pseudoElements : true,
            sourcemaps     : false,
            next           : false,
            minifier       : false
        }))
        .pipe(gulp.dest(sources.cssDestDir))
        .pipe(reload({stream: true}));
});


/*****************************
 ******  CSS optimaize  ******
 *****************************/
gulp.task('css', function(){
    return gulp.src(sources.css)
        .pipe($.csscomb())
        .pipe(gulp.dest(sources.cssDestDir))
        .pipe($.rename({
            suffix  : '.min',
            extname : '.css'
        }))
        .pipe($.cssmin())
        .pipe(gulp.dest(sources.cssDestDir));
});


/****************************
 ******  JS optimaize  ******
 ****************************/
gulp.task('js', function(){
    return gulp.src(sources.js)
        .pipe($.plumber())
        .pipe($.concat('script.js'))
        .pipe(crLf({changeCode: 'LF'}))
        .pipe(gulp.dest(sources.jsDestDir))
        .pipe($.rename({
            suffix: '.min',
            extname: '.js'
        }))
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe(gulp.dest(sources.jsDestDir))
        .pipe(reload({stream: true, once: true}));
});
gulp.task('jsIE', function(){
    return gulp.src(sources.jsIE)
        .pipe($.plumber())
        .pipe($.concat('ie.js'))
        .pipe(crLf({changeCode: 'LF'}))
        .pipe(gulp.dest(sources.jsDestDir))
        .pipe($.rename({
            suffix: '.min',
            extname: '.js'
        }))
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe(gulp.dest(sources.jsDestDir))
        .pipe(reload({stream: true, once: true}));
});
gulp.task('jsAdmin', function(){
    return gulp.src(sources.jsAdmin)
        .pipe($.plumber())
        .pipe(crLf({changeCode: 'LF'}))
        .pipe(gulp.dest(sources.jsDestDir + 'admin/'))
        .pipe($.rename({
            suffix: '.min',
            extname: '.js'
        }))
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe(gulp.dest(sources.jsDestDir + 'admin/'))
        .pipe(reload({stream: true, once: true}));
});


/****************************
 ******  IMG optimaize ******
 ****************************/
gulp.task("img", function(){
    return gulp.src(sources.img)
        .pipe($.plumber())
        .pipe($.cached('image'))
        .pipe($.imagemin({
            use: [
                pngquant({
                    quality: img.pngQuality,
                    speed: img.pngSpeed
                }),
                jpegoptim({
                    max: img.jpgQuality,
                    progressive: img.jpgProgressive
                }),
                gifsicle({
                    interlaced: img.gifInterlaced
                }),
                svgo()
            ]
        }))
        .pipe(gulp.dest(sources.imgDestDir))
        .pipe(reload({stream: true}));
});
// Not cache.
//gulp.task("imgBuild", function(){
//  return gulp.src(sources.img)
//      .pipe($.plumber())
//      .pipe($.imagemin({
//          use: [
//              pngquant({
//                  quality: img.pngQuality,
//                  speed: img.pngSpeed
//              }),
//              jpegoptim({
//                  max: img.jpgQuality,
//                  progressive: img.jpgProgressive,
//              }),
//              gifsicle({
//                  interlaced: img.gifInterlaced,
//              }),
//              svgo()
//          ]
//      }))
//      .pipe(gulp.dest(sources.imgDestDir));
//});


/*******************
 ******  Font ******
 *******************/
gulp.task('font', function(){
    return gulp.src(sources.font)
        .pipe($.plumber())
        .pipe($.cached('font'))
        .pipe(gulp.dest(sources.fontDestDir))
        .pipe(reload({stream: true, once: true}));
});


/****************************
 ******  Browser sync  ******
 ****************************/
gulp.task('browserSync', function() {
    return browserSync.init(null, {
        proxy: settings.hostname,
        notify: false
    });
});
gulp.task('browserSyncReload', function() {
    return reload();
});


/***************************
 ******  Cache clear  ******
 ***************************/
gulp.task('clear', function () {
    return $.cached.caches = {};
});


/********************
 ******  Clean  *****
 ********************/
gulp.task('clean', $.shell.task(
    [
        'rm -rf ' + sources.cssDestDir + '/*.css',
        'rm -rf ' + assetsPath + '/js/*',
        'rm -rf ' + assetsPath + '/img/*',
        'rm -rf ' + assetsPath + '/font/*'
    ]
));


/*****************************
 ******  Make Directory  *****
 *****************************/
gulp.task('vavg', $.shell.task(
    [
        'mkdir -p ' + rootPath,
        'mkdir -p ' + sourcePath + '/scss',
        'mkdir -p ' + sourcePath + '/js',
        'mkdir -p ' + sourcePath + '/img',
        'mkdir -p ' + sourcePath + '/font',
        'mkdir -p ' + assetsPath + '/js',
        'mkdir -p ' + assetsPath + '/img',
        'mkdir -p ' + assetsPath + '/font',
        'mv -f ' + __dirname + '/_sources/scss ' + sourcePath + '/',
        'mv -f ' + __dirname + '/_sources/js ' + sourcePath + '/',
        'mv -f ' + __dirname + '/_sources/font ' + sourcePath + '/',
        'mv -f ' + __dirname + '/_sources/wordpress-theme/* ' + rootPath + '/',
        'rm -rf ' + __dirname + '/_sources/'
    ]
));


/*********************
 ******  Build  ******
 *********************/
gulp.task('build', function(){
    runSequence('clear');
    return runSequence('clean', ['scss', 'js', 'jsIE', 'jsAdmin', 'img', 'font'], 'css', 'clear' );
});


/*********************
 ******  Watch  ******
 *********************/
gulp.task('setWatch', function() {
    global.isWatching = true;
});

gulp.task('watch', ['setWatch'], function(){
    gulp.watch(sources.scss, ['scss']);
    gulp.watch(sources.js, ['js']);
    gulp.watch(sources.jsAdmin, ['jsAdmin']);
    gulp.watch(sources.img, ['img']);
    gulp.watch(sources.font, ['font']);
    gulp.watch(sources.html, ['browserSyncReload']);
    gulp.watch(sources.php, ['browserSyncReload']);
});


/****************************
 ******  Default task  ******
 ****************************/
gulp.task('default', function(){
    runSequence('clear');
    return runSequence('clean', ['scss', 'js', 'jsIE', 'jsAdmin', 'img', 'font'], 'css', 'browserSync', 'watch');
});
