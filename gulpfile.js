const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const concat = require('gulp-concat');

gulp.task('copy_assets.static', function() {
  return gulp.src(['node_modules/govuk-frontend/assets/**'])
  .pipe(gulp.dest('lib/assets'));
});
gulp.task('copy_assets.js', function() {
  return gulp.src(['node_modules/govuk-frontend/*.js'])
  .pipe(gulp.dest('lib/js'))
});
gulp.task('copy_assets.pe-charts.app', function() {
  return gulp.src(['node_modules/pe-charts/lib/js/app.js'])
  .pipe(rename("pe-charts.js"))
  .pipe(gulp.dest('lib/js'))
});
gulp.task('copy_assets.pe-charts.table-chart', function() {
  return gulp.src(['node_modules/pe-charts/lib/js/table-chart.js'])
  .pipe(rename("pe-table-chart.js"))
  .pipe(gulp.dest('lib/js'))
});
gulp.task('copy_assets', gulp.series(
  'copy_assets.static',
  'copy_assets.js',
  'copy_assets.pe-charts.app',
  'copy_assets.pe-charts.table-chart'
));

gulp.task('sass.gov', function () {
  return gulp.src('node_modules/govuk-frontend/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('lib/css'));
});

gulp.task('sass.dashboardify', function () {
  return gulp.src('lib/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('lib/css'));
});

gulp.task('concat.js', function() {
    return gulp.src([
        './node_modules/d3/dist/d3.min.js',
        './node_modules/c3/c3.min.js',
        './node_modules/vue/dist/vue.js',
        './node_modules/vue-resource/dist/vue-resource.min.js',
        './lib/js/all.js',
        './lib/js/common.js',
        './lib/js/pe-table-chart.js',
        './lib/js/json-dashboardify.js'
    ])
    .pipe(concat('dist.js'))
    .pipe(gulp.dest('./lib/js'));
});

gulp.task('default', gulp.series('copy_assets', 'sass.gov', 'sass.dashboardify'));