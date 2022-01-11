// npm install jshint gulp-jshint gulp-concat gulp-uglify gulp-rename gulp-uglifycss gulp-htmlmin gulp-uncss gulp-compass gulp-rev-append --save-dev

// Include gulp
var gulp = require('gulp');

// Include Plugins
var jshint = require('gulp-jshint');
var uncss = require('gulp-uncss');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var compass = require('gulp-compass'); //alternatively use sass: var sass = require('gulp-sass');
var rev = require('gulp-rev-append');

// Compile Sass, remove unused classes and minify CSS
gulp.task('css', function() {
    return gulp.src('scss/**/*.scss')
        .pipe(compass({ // Compile with Compass
          config_file: './config.rb',
          css: 'css',
          sass: 'scss'
        }))
        .on('error', swallowError)
        .pipe(gulp.dest('./css'))
        .pipe(uncss({ // Remove unwanted css
          html: ['index.html'], // add all pages that use this stylesheet
          ignore: ['.js', '.blur', /^\.mfp/] // Don't remove dynamically inserted classes
        }))
        .pipe(gulp.dest('./css'))
        .pipe(uglifycss({ // Minify CSS
          "max-line-len": 80
        }))
        .pipe(gulp.dest('./css'));
});

// Compress HTML file
gulp.task('html', function() {
  return gulp.src('index.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeCommentsFromCDATA: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(rename('index-compressed.html'))
    .pipe(gulp.dest('./'))
});

// Lint JS
gulp.task('lint', function() {
    return gulp.src('js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('js', function() {
    return gulp.src('js/**/*.js')
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

// Concatenate & Minify JS
gulp.task('rev', function() {
  gulp.src('./index.html')
    .pipe(rev())
    .pipe(gulp.dest('.'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('scss/*.scss', ['css', 'rev']);
    gulp.watch('js/**/*.js', ['js', 'rev']); //'lint',
    gulp.watch('*.html', ['html']);      
});

// Default Task
gulp.task('default', ['css', 'js', 'rev', 'html', 'watch']); //'lint',

function swallowError (error) {
  console.log(error.toString());
  this.emit('end');
}