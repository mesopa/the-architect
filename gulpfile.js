
// -----------------
// Project Variables
// -----------------

const { src, dest, series, parallel, watch } = require('gulp');

const sass         = require('gulp-sass'),
      minifyCSS    = require('gulp-clean-css'),
      rename       = require('gulp-rename'),
      concat       = require('gulp-concat'),
      uglify       = require('gulp-uglify'),
      htmlmin      = require('gulp-htmlmin'),
      inlinesource = require('gulp-inline-source'),
      del          = require('del'),
      
      connect      = require('gulp-connect');

const theme_name   = 'the-architect',
      theme_suffix = '';

const base_path  = '',
      source     = base_path + '_dev',
      dist       = base_path + 'docs',
      temp       = base_path + '_dev/tmp',
      paths      = {
        vendor_js:   [
          'node_modules/jquery/dist/jquery.min.js',
          source + '/javascript/js-cloudimage-responsive.min.js',
        ],
        vendor_css:  [
          'node_modules/normalize.css/normalize.css',
          'node_modules/milligram/dist/milligram.min.css',
          source + '/css/js-cloudimage-responsive.min.css',
        ],
        vendor_css_AMP: [
          'node_modules/milligram/dist/milligram.min.css',
        ],
        js:   [
          source + '/javascript/' + theme_name + '-javascript.js',
        ],
        sass: [
          source + '/scss/' + theme_name + '-styles.scss',
          source + '/scss/' + theme_name + '-styles-fonts.scss',
        ],
        sass_AMP: [
          source + '/scss/' + theme_name + '-styles.scss',
          source + '/scss/' + theme_name + '-styles-fonts.scss',
        ]
      };

// -------------
// Project Tasks
// -------------

// Local Server
function connectServer() {
  connect.server({
    root: dist,
    livereload: true
  });
};

// -- CLEAN 'dist' --
function cleanDist() {
  return del( dist + '/*' );
};

// -- CLEAN 'tmp' --
function cleanTmp() {
  return del( temp + '/*' );
};

// -- ASSETS --
function assets() {
  return src( source + '/assets/**/**/**/*' )
    .pipe( dest( dist + '/assets/' ) );
};

// -- Font Awesome   --
function fontAwesome() {
  return src( 'node_modules/@fortawesome/fontawesome-free/webfonts/*' )
    .pipe( dest( dist + '/assets/fonts/font-awesome/' ) );
};

// -- JS     --
function js() {
  return src( paths.js )
    .pipe( concat( theme_name + theme_suffix + '.js' ) )
    .pipe( uglify())
    .pipe( rename({
      suffix: '.min'
    }))
    .pipe( dest( temp + '/compiled-js' ) );
};

// -- PWA Progressive APP --
function pwa() {
  return src( source + '/pwa/*' )
    .pipe( dest( dist ));
};

// -- SASS   --
function sassStyles() {
  return src( paths.sass )
    .pipe( sass())
    .pipe( minifyCSS({
        level: {1: {specialComments: 0}}
      }))
    .pipe( rename({
      suffix: '.min'
    }))
    .pipe( dest( temp + '/compiled-css' ) )
    .pipe( dest( dist + '/assets/css' ) );
};

// -- Vendor JS    --
function vendorJs() {
  return src( paths.vendor_js )
    .pipe( concat( theme_name + theme_suffix + '-vendor' + '.js' ) )
    .pipe( uglify())
    .pipe( rename({
      suffix: '.min'
    }))
    .pipe( dest( temp + '/compiled-js' ) );
};

// -- Vendor CSS   --
function vendorCss() {
  return src( paths.vendor_css )
    .pipe( concat( theme_name + theme_suffix + '-vendor' + '.css' ) )
    .pipe( minifyCSS({
      level: {1: {specialComments: 0}}
    }))
    .pipe( rename({
      suffix: '.min'
    }))
    .pipe( dest( temp + '/compiled-css' ) );
};

// -- Inline CSS   --
function inlineCss() {
  return src( source + '/html/*' )
     .pipe( inlinesource() )
     .pipe( htmlmin({
       collapseWhitespace: true
      }))
     .pipe( dest( dist ) )
     .pipe( connect.reload() );
};

// -- Concat JS   --
function concatJs () {
  return src([
    temp + '/compiled-js/the-architect-vendor.min.js',
    temp + '/compiled-js/the-architect.min.js',
  ])
  .pipe( concat('the-architect-all.min.js') )
  .pipe( dest( dist + '/assets/js' ) )
  .pipe( connect.reload() );
};

// -- WATCH          --
function watchFiles() {
  watch( source + '/html/*', inlineCss );
  watch( source + '/javascript/*', series(js, vendorJs, concatJs) );
  watch( source + '/scss/*', series(sassStyles, vendorCss, inlineCss) );
};

// ------------------------------
// -- Project `default` Gulp Task
// ------------------------------

exports.default = series(
  cleanDist,
  cleanTmp,
  assets,
  pwa,
  fontAwesome,
  js,
  vendorJs,
  concatJs,
  sassStyles,
  vendorCss,
  inlineCss,
  parallel(
    watchFiles,
    connectServer,
  ),
);