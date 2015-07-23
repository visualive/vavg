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
	sourcePath  = rootPath + '/_sources',
	assetsPath  = rootPath + '/assets',
	sources     = {
		html:        rootPath + '/**/*.html',
		php:         rootPath + '/**/*.php',
		scss:        [sourcePath + '/scss/**/*.scss', '!' + sourcePath + '/scss/_temp/**/*.scss'],
		scssDir:     sourcePath + '/scss/',
		css:         [rootPath + '/*.css', '!' + rootPath + '/*.min.css'],
		cssDestDir:  rootPath + '/',
		img:         sourcePath + '/img/**/*.+(jpg|jpeg|png|gif|svg)',
		imgDestDir:  assetsPath + '/img/',
		font:        sourcePath + '/font/**/*',
		fontDestDir: assetsPath + '/font/',
		js:          [
			__dirname + '/bower_components/fastclick/lib/fastclick.js',
			__dirname + '/bower_components/modernizr/modernizr.js',
			//__dirname + '/bower_components/foundation/js/foundation/foundation.js',
			__dirname + '/bower_components/jQuery.mmenu/dist/js/jquery.mmenu.min.js',
			__dirname + '/bower_components/shufflejs/dist/jquery.shuffle.min.js',
			__dirname + '/bower_components/slick-carousel/slick/slick.min.js',
			__dirname + '/bower_components/jquery.stellar/jquery.stellar.min.js',
			__dirname + '/bower_components/jquery.mb.ytplayer/dist/jquery.mb.YTPlayer.min.js',
			//sourcePath + '/js/jquery.heightLine.min.js'
			sourcePath + '/js/**/*.js'
		],
		jsIE:        [
			__dirname + '/bower_components/html5shiv/dist/html5shiv.min.js',
			__dirname + '/bower_components/nwmatcher/src/nwmatcher.js',
			__dirname + '/bower_components/selectivizr/selectivizr.js',
			__dirname + '/bower_components/respond/dest/respond.min.js',
			__dirname + '/bower_components/REM-unit-polyfill/js/rem.min.js'
		],
		jsDestDir:   assetsPath + '/js/'
	};

/**************************
 ******  Scss build  ******
 **************************/
gulp.task('scss', function(){
	return gulp.src(sources.scss)
		.pipe($.plumber())
		.pipe($.compass({
			config_file: 'config.rb',
			comments:    false,
			import_path: __dirname + '/bower_components/foundation/scss/',
			css:         sources.cssDestDir,
			sass:        sources.scssDir
		}))
		.pipe($.csscomb())
		.pipe($.pleeease({
			autoprefixer: {browsers: ['last 2 versions', 'ie 8', 'ie 9']},
			opacity: true,
			filters: { 'oldIE': true },
			rem: ["16px", {replace: true}],
			mqpacker: true,
			import: true,
			pseudoElements: true,
			sourcemaps: false,
			next: false,
			minifier: true
		}))
		.pipe(gulp.dest(sources.cssDestDir))
		.pipe(reload({stream: true}));
});

/****************************
 ******  JS optimaize  ******
 ****************************/
gulp.task('js', function(){
	return gulp.src(sources.js)
		.pipe($.plumber())
		.pipe($.concat('script.min.js'))
		.pipe($.uglify({preserveComments: 'some'}))
		.pipe(gulp.dest(sources.jsDestDir))
		.pipe(reload({stream: true, once: true}));
});
gulp.task('jsIE', function(){
	return gulp.src(sources.jsIE)
		.pipe($.plumber())
		.pipe($.concat('ie.min.js'))
		.pipe($.uglify({preserveComments: 'some'}))
		.pipe(gulp.dest(sources.jsDestDir))
		.pipe(reload({stream: true, once: true}));
});

/****************************
 ******  IMG optimaize ******
 ****************************/
gulp.task("img", function(){
	return gulp.src(sources.img)
		.pipe($.plumber())
		.pipe($.cache($.imagemin({
			use: [
				pngquant({
					quality: img.pngQuality,
					speed: img.pngSpeed
				}),
				jpegoptim({
					max: img.jpgQuality,
					progressive: img.jpgProgressive,
				}),
				gifsicle({
					interlaced: img.gifInterlaced,
				}),
				svgo()
			]
		})))
		.pipe(gulp.dest(sources.imgDestDir))
		.pipe(reload({stream: true}));
});
// Not cache.
gulp.task("imgBuild", function(){
	return gulp.src(sources.img)
		.pipe($.plumber())
		.pipe($.imagemin({
			use: [
				pngquant({
					quality: img.pngQuality,
					speed: img.pngSpeed
				}),
				jpegoptim({
					max: img.jpgQuality,
					progressive: img.jpgProgressive,
				}),
				gifsicle({
					interlaced: img.gifInterlaced,
				}),
				svgo()
			]
		}))
		.pipe(gulp.dest(sources.imgDestDir));
});

/*******************
 ******  Font ******
 *******************/
gulp.task('font', function(){
	return gulp.src(sources.font)
		.pipe($.plumber())
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
gulp.task('clear', function ( i_done ) {
	return $.cache.clearAll( i_done );
});

/********************
 ******  Clean  *****
 ********************/
gulp.task('clean', $.shell.task(
	[
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
	return runSequence('clear', 'clean', ['scss', 'js', 'jsIE', 'imgBuild', 'font'] );
});

/*********************
 ******  Watch  ******
 *********************/
gulp.task('watch', function(){
	gulp.watch(sources.scss, ['scss']);
	gulp.watch(sources.js, ['js']);
	gulp.watch(sources.img, ['img']);
	gulp.watch(sources.font, ['font']);
	gulp.watch(sources.html, ['browserSyncReload']);
	gulp.watch(sources.php, ['browserSyncReload']);
});

/****************************
 ******  Default task  ******
 ****************************/
gulp.task('default', function(){
	return runSequence('clear', 'clean', ['scss', 'js', 'jsIE', 'imgBuild', 'font'], 'browserSync', 'watch');
});
