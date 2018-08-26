
// -----------------
// Project Variables
// -----------------

const gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      prefixer     = require('gulp-autoprefixer'),
      minifyCSS    = require('gulp-clean-css'),
      rename       = require('gulp-rename'),
      concat       = require('gulp-concat'),
      uglify       = require('gulp-uglify'),
      htmlmin      = require('gulp-htmlmin'),
      replace      = require('gulp-replace'),
      inlinesource = require('gulp-inline-source'),
      del          = require('del'),
      
      connect      = require('gulp-connect');

const theme_name   = 'the-architect',
      theme_suffix = '';

const base_path  = '',
      src        = base_path + '_dev',
      dist       = base_path + 'docs',
      temp       = base_path + '_dev/tmp',
      paths      = {
        vendor_js:   [
          'node_modules/jquery/dist/jquery.min.js',
          src + '/javascript/cloudimage.io-responsive.js',
        ],
        vendor_css:  [
          'node_modules/normalize.css/normalize.css',
          'node_modules/milligram/dist/milligram.min.css',
        ],
        vendor_css_AMP: [
          'node_modules/milligram/dist/milligram.min.css',
        ],
        js:   [
          src + '/javascript/' + theme_name + '-javascript.js',
        ],
        sass: [
          src + '/scss/' + theme_name + '-styles.scss',
          src + '/scss/' + theme_name + '-styles-fonts.scss',
        ],
        sass_AMP: [
          src + '/scss/' + theme_name + '-styles.scss',
          src + '/scss/' + theme_name + '-styles-fonts.scss',
        ]
      };

// -------------
// Project Tasks
// -------------

// Local Server
gulp.task('connect', () => {
  connect.server({
    root: dist,
    livereload: true
  });
});

// -- CLEAN 'dist' --
gulp.task('clean-dist', () => {
  return del( dist + '/*' );
});

// -- CLEAN 'tmp' --
gulp.task('clean-tmp', () => {
  return del( temp + '/*' );
});

// -- ASSETS --
gulp.task('assets', () => {
  return gulp.src( src + '/assets/**/**/**/*' )
    .pipe( gulp.dest( dist + '/assets/' ) );
});

// -- Font Awesome   --
gulp.task('font-awesome', () => {
  return gulp.src( 'node_modules/@fortawesome/fontawesome-free/webfonts/*' )
    .pipe( gulp.dest( dist + '/assets/fonts/font-awesome/' ) );
});

// -- JS     --
gulp.task('js', () => {
  return gulp.src( paths.js )
    .pipe( concat( theme_name + theme_suffix + '.js' ) )
    .pipe( uglify())
    .pipe( rename({
      suffix: '.min'
    }))
    .pipe( gulp.dest( temp + '/compiled-js' ) );
});

// -- PWA Progressive APP --
gulp.task('pwa', () => {
  return gulp.src( src + '/pwa/*' )
    .pipe( gulp.dest( dist ));
});

// -- SASS   --
gulp.task('sass', () => {
  return gulp.src( paths.sass )
    .pipe( sass())
    .pipe( prefixer({
      browsers: [
        'last 2 versions',
        '> 1%',
        'opera 12.1',
        'bb 10',
        'android 4'
        ]
      }))
    .pipe( minifyCSS({
        level: {1: {specialComments: 0}}
      }))
    .pipe( rename({
      suffix: '.min'
    }))
    .pipe( gulp.dest( temp + '/compiled-css' ) )
    .pipe( gulp.dest( dist + '/assets/css' ) );
});

// -- Vendor JS    --
gulp.task('vendor-js', () => {
  return gulp.src( paths.vendor_js )
    .pipe( concat( theme_name + theme_suffix + '-vendor' + '.js' ) )
    .pipe( uglify())
    .pipe( rename({
      suffix: '.min'
    }))
    .pipe( gulp.dest( temp + '/compiled-js' ) );
});

// -- Vendor CSS   --
gulp.task('vendor-css', () => {
  return gulp.src( paths.vendor_css )
    .pipe( concat( theme_name + theme_suffix + '-vendor' + '.css' ) )
    .pipe( minifyCSS({
      level: {1: {specialComments: 0}}
    }))
    .pipe( rename({
      suffix: '.min'
    }))
    .pipe( gulp.dest( temp + '/compiled-css' ) );
});

// -- Inline CSS   --
gulp.task('inline-css', ['sass', 'vendor-css'], ()=> {
  return gulp.src( src + '/html/*' )
     .pipe( inlinesource() )
     .pipe( htmlmin({
       collapseWhitespace: true
      }))
     .pipe( gulp.dest( dist ) )
     .pipe( connect.reload() );
});

// -- Concat JS   --
gulp.task('concat-js', ['js', 'vendor-js'], () => {
  return gulp.src([
    temp + '/compiled-js/the-architect-vendor.min.js',
    temp + '/compiled-js/the-architect.min.js',
    temp + '/compiled-js/cloudimage.io-responsive.js'
  ])
  .pipe( concat('the-architect-all.min.js') )
  .pipe( gulp.dest( dist + '/assets/js' ) )
  .pipe( connect.reload() );
});

// -- WATCH          --
gulp.task('watch', () => {
  gulp.watch( src + '/html/*', ['inline-css'] );
  gulp.watch( src + '/javascript/*', ['concat-js'] );
  gulp.watch( src + '/scss/*', ['inline-css'] );
});

// ------------------------------
// -- Project `default` Gulp Task
// ------------------------------

gulp.task(
  'default', ['clean-dist', 'clean-tmp'], () => {
    gulp.start(
      'connect',
      'assets',
      'pwa',
      'font-awesome',
      'concat-js',
      'inline-css',
      'watch'
    )
  });