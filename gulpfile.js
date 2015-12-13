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

var gulp              = require("gulp"),
    $                 = require("gulp-load-plugins")(),
    pngquant          = require("imagemin-pngquant"),
    jpegoptim         = require("imagemin-jpegoptim"),
    svgo              = require("imagemin-svgo"),
    browserSync       = require("browser-sync"),
    browserSyncReload = browserSync.reload,
    runSequence       = require("run-sequence"),
    fs                = require("fs"),
    path              = require("path"),
    yml               = require("js-yaml"),
    settings          = yml.safeLoad(fs.readFileSync("site.yml")),
    settingsDefault   = yml.safeLoad(fs.readFileSync("provision/default.yml")),
    rootPath          = __dirname,
    themePath         = "wp-content/themes/" + settings.theme_dir_name;

if ( settings.wp_home == settings.wp_siteurl ) {
    themePath = settings.wp_siteurl + "/" + themePath;
}


var sourcePath        = themePath + "/_source",
    assetsPath        = themePath + "/assets",
    sources           = {
        scss    : {
            tmp  : sourcePath + "/.tmp/scss",
            dir  : sourcePath + "/scss/",
            files: sourcePath + "/scss/**/*.scss",
            inc  : "bower_components/foundation/scss/",
            px   : "16px",
            dest : themePath + "/"
        },
        js      : {
            tmp  : sourcePath + "/.tmp/js",
            dir  : sourcePath + "/js/",
            files: [
                rootPath + "/bower_components/fastclick/lib/fastclick.js",
                rootPath + "/bower_components/modernizr/modernizr.js",
                // rootPath + "/bower_components/jQuery.mmenu/dist/js/jquery.mmenu.min.js",
                // rootPath + "/bower_components/shufflejs/dist/jquery.shuffle.min.js",
                // rootPath + "/bower_components/slick-carousel/slick/slick.min.js",
                // rootPath + "/bower_components/jquery.stellar/jquery.stellar.min.js",
                // rootPath + "/bower_components/jquery.mb.ytplayer/dist/jquery.mb.YTPlayer.min.js",
            ],
            ie   : [
                rootPath + "/bower_components/html5shiv/dist/html5shiv.min.js",
                rootPath + "/bower_components/nwmatcher/src/nwmatcher.js",
                rootPath + "/bower_components/selectivizr/selectivizr.js",
                rootPath + "/bower_components/respond/dest/respond.min.js",
                rootPath + "/bower_components/REM-unit-polyfill/js/rem.min.js"
            ],
            hint : [
                sourcePath + "/js/**/*.js",
                "!" + sourcePath + "/js/**/*.min.js"
            ],
            dest : assetsPath + "/js/"
        },
        img     : {
            files: sourcePath + "/img/**/*",
            dest : assetsPath + "/img/"
        },
        font    : {
            files: sourcePath + "/font/**/*",
            dest : assetsPath + "/font/"
        }
    },
    now               = new Date(),
    formatDate        = function (date, format) {
        if (!format) format = "YYYY-MM-DD hh:mm:ss.SSS";
        format = format.replace(/YYYY/g, date.getFullYear());
        format = format.replace(/MM/g, ("0" + (date.getMonth() + 1)).slice(-2));
        format = format.replace(/DD/g, ("0" + date.getDate()).slice(-2));
        format = format.replace(/hh/g, ("0" + date.getHours()).slice(-2));
        format = format.replace(/mm/g, ("0" + date.getMinutes()).slice(-2));
        format = format.replace(/ss/g, ("0" + date.getSeconds()).slice(-2));
        if (format.match(/S/g)) {
            var milliSeconds = ("00" + date.getMilliseconds()).slice(-3);
            var length = format.match(/S/g).length;
            for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
        }
        return format;
    },
    now               = new Date(),
    date              = formatDate(now, "YYYYMMDDhhmm");

if(settings.bootstrap == true || settings.wp_starter_theme == "sage") {
    sources.scss.inc = "bower_components/bootstrap-sass/assets/stylesheets/";
    sources.scss.px  = "14px";
} else {
    sources.js.files.push(
        rootPath + "/bower_components/foundation/js/foundation/foundation.js"
    );
}

if(settings.underscore == true) {
    sources.js.files.push(
        sourcePath + "/js/customizer.js",
        sourcePath + "/js/navigation.js",
        sourcePath + "/js/skip-link-focus-fix.js"
    );
}

sources.js.files.push(
    sourcePath + "/js/script.js"
);

if (typeof settings.document_root == "undefined" || settings.document_root == "") {
    settings.document_root = settingsDefault.document_root;
}

/**************************
 *****  Scss compile  *****
 **************************/

gulp.task("scss", function () {
    return gulp.src(sources.scss.files)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.newer(sources.scss.tmp))
        .pipe($.cssGlobbing({ extensions: [".scss"] }))
        .pipe($.sass({
            outputStyle    : "expanded",
            precision      : 10,
            includePaths   : [sources.scss.inc],
            errLogToConsole: true
        }))
        .pipe($.pixrem({
            rootValue: sources.scss.px,
            replace: true
        }))
        .pipe($.autoprefixer({
            browsers: ["last 2 versions", "ie 8", "ie 9"],
            cascade: false
        }))
        // .pipe($.csscomb())
        // .pipe(gulp.dest(sources.scss.tmp))
        // .pipe(gulp.dest(sources.scss.dest))
        // .pipe($.size({title: "Style"}))
        // .pipe($.rename({suffix: ".min", extname: ".css"}))
        .pipe($.cssmin())
        .pipe(gulp.dest(sources.scss.tmp))
        .pipe(gulp.dest(sources.scss.dest))
        .pipe($.size({title: "Style:min"}))
        .pipe(browserSyncReload({stream: true}));
});


/*************************
 *****  JS optimize  *****
 *************************/
gulp.task("js", ["js:hint"], function () {
    return gulp.src(sources.js.files)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.newer(sources.js.tmp))
        .pipe($.concat("apps.js"))
        .pipe($.crLfReplace({changeCode: "LF"}))
        .pipe(gulp.dest(sources.js.tmp))
        .pipe($.rename({suffix: ".min"}))
        .pipe($.uglify({preserveComments: "some"}))
        .pipe($.size({title: "js"}))
        .pipe(gulp.dest(sources.js.dest))
        .pipe(browserSyncReload({stream: true}));
});

gulp.task("js:ie", function () {
    return gulp.src(sources.js.ie)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.concat("ie.js"))
        .pipe($.crLfReplace({changeCode: "LF"}))
        .pipe($.rename({suffix: ".min"}))
        .pipe($.uglify({preserveComments: "some"}))
        .pipe(gulp.dest(sources.js.dest))
        .pipe(browserSyncReload({stream: true}));
});

gulp.task("js:hint", function () {
    return gulp.src(sources.js.hint)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
});


/**************************
 *****  Img optimize  *****
 **************************/
gulp.task("img", function () {
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
        .pipe($.size({title: "img"}))
        .pipe(browserSyncReload({stream: true}));
});


/******************
 *****  Font  *****
 ******************/
gulp.task("font", function () {
    return gulp.src(sources.font.files)
        .pipe(gulp.dest(sources.font.dest))
        .pipe(browserSyncReload({stream: true}));
});


/*****************
 *****  PHP  *****
 *****************/
gulp.task("php", function () {
    return gulp.src(themePath + "/**/*.php")
        .pipe(browserSyncReload({stream: true}));
});


/**********************
 *****  Archives  *****
 **********************/
gulp.task("archive", function () {
    return runSequence("backup:db", "backup:core");
});

gulp.task("archive:theme", function () {
    return runSequence("backup:db", "backup:mv", "backup:theme");
});


/***********************
 *****  DB Backup  *****
 ***********************/
gulp.task("backup:db", ["backup:del"], $.shell.task([
    "vagrant ssh -c \"cd " + settings.document_root + " && rm -rf ./backup_db/ && mkdir ./backup_db/ && wp db export ./backup_db/backup_" + date + ".sql && wp export --dir=./backup_db && logout\""
]));

gulp.task("backup:mv", $.shell.task([
    "rm -rf " + themePath + "/backup_db/",
    "mv -f ./backup_db " + themePath + "/"
]));

gulp.task("backup:del", $.shell.task([
    "rm -rf " + themePath + "/backup_db/",
    "rm -rf " + rootPath + "/backup_db/"
]));

gulp.task("backup:theme", function () {
    return gulp.src(themePath + "/**", {base: themePath + "/."})
        .pipe($.ignore.exclude([
            "bower_components{,/**}",
            "node_modules{,/**}",
            "_source{,/**}"
        ]))
        .pipe($.zip("wp_theme_" + settings.theme_dir_name + "_" + date + ".zip"))
        .pipe(gulp.dest(rootPath + "/"));
});

gulp.task("backup:core", function () {
    return gulp.src(rootPath + "/**", {base: rootPath + "/."})
        .pipe($.ignore.exclude([
            "bower_components{,/**}",
            "**/bower_components{,/**}",
            "node_modules{,/**}",
            "**/node_modules{,/**}",
            "provision{,/**}",
            "**/_source{,/**}",
            ".vagrant{,/**}",
            ".DS_Store",
            ".csscomb.json",
            ".editorconfig",
            ".git",
            ".gitignore",
            ".jshintignore",
            ".jshintrc",
            ".svn",
            "*.bak",
            "*.log",
            "*.swp",
            "Desktop.ini",
            "Movefile",
            "README.md",
            "Thumbs.db",
            "Vagrantfile",
            "bower.json",
            "gulpfile.js",
            "package.json",
            "site.yml",
            "wp-config.php",
            "vavg",
            "vavgtest",
            "vavgtest_dev",
            "test.sh"
        ]))
        .pipe($.zip("wp_core_" + settings.theme_dir_name + "_" + date + ".zip"))
        .pipe(gulp.dest(rootPath + "/"));
});

/**************************
 *****  Browser sync  *****
 **************************/
gulp.task("browserSync", function () {
    return browserSync.init({
        proxy: "http://" + settings.hostname
    });
});
gulp.task("browserSyncReloadStream", function () {
    return browserSyncReload({stream: true});
});
gulp.task("browserSyncReloadStreamOnce", function () {
    return browserSyncReload({stream: true, once: true});
});


/*************************
 *****  Cache clear  *****
 *************************/
gulp.task("clear", function () {
    return $.cache.clearAll();
});


/*******************
 *****  Clean  *****
 *******************/
gulp.task("clean", $.shell.task(
    [
        "rm -rf " + rootPath + "/*.zip",
        "rm -rf " + rootPath + "/.tmp/",
        "rm -rf " + rootPath + "/" + themePath  + "/*.css",
        "rm -rf " + rootPath + "/" + assetsPath + "/**/*/.gitkeep",
        "rm -rf " + rootPath + "/" + assetsPath + "/js/*",
        "rm -rf " + rootPath + "/" + assetsPath + "/img/*",
        "rm -rf " + rootPath + "/" + sourcePath + "/.tmp/"
    ]
));


/*******************
 *****  Watch  *****
 *******************/
gulp.task("watch", function () {
    $.watch(sources.scss.files, function () {
        return gulp.start(["scss"]);
    });
    $.watch(sources.js.files, function () {
        return gulp.start(["js"]);
    });
    $.watch(sources.img.files, function () {
        return gulp.start(["img"]);
    });
    $.watch([themePath + "/**/*.php"], function () {
        return gulp.start(["php"]);
    });
});


/*********************
 *****  Install  *****
 *********************/
gulp.task("install", ["clear","clean"], function (cb) {
    return runSequence(["scss", "js", "js:ie", "img", "font"], cb);
});


/********************
 *****  Supply  *****
 ********************/
gulp.task("supply", ["clear","clean"], function (cb) {
    return runSequence(["scss", "js", "js:ie", "img", "font"], "archive", cb);
});

gulp.task("supply:theme", ["clear","clean"], function (cb) {
    return runSequence(["scss", "js", "js:ie", "img", "font"], "archive:theme", cb);
});


/**************************
 *****  Default task  *****
 **************************/
gulp.task("default", ["clear","clean"], function (cb) {
    return runSequence(["scss", "js", "js:ie", "img", "font"], "browserSync", "watch", cb);
});
