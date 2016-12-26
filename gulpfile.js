var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var jsx = require('gulp-jsx');
var sass = require('gulp-sass');


gulp.task('default', () =>
    gulp.src('public/src/css/main.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('public/dist/css'))
);

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('build', function() {
  return gulp.src('app/controllers/src/*.js')
	.pipe(jsx({
	  factory: 'React.createClass'
	}))
	.pipe(gulp.dest('app/controllers/dist'));
});
