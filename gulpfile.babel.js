import gulp from 'gulp';

import fs from 'fs';

import concat from 'gulp-concat';
import data from 'gulp-data';
import nunjucks from 'gulp-nunjucks';
import sourcemaps from 'gulp-sourcemaps';
import stylus from 'gulp-stylus';


const stylesheets = [
    './media/stylus/main.styl',
    './media/stylus/site-listing.styl',
];

gulp.task('default', ['build']);

gulp.task('build', ['build:html', 'build:css']);

gulp.task('build:html', () => {
    const context = {
        sites: JSON.parse(fs.readFileSync('./sites.json')),
    }

    gulp.src('./templates/index.html')
        .pipe(data(() => context))
        .pipe(nunjucks.compile())
        .pipe(gulp.dest('./build'));
});

gulp.task('build:css', () => {
    gulp.src(stylesheets)
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(concat('main.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/css'))
});

gulp.task('watch', ['build'], () => {
    gulp.watch('./templates/*.html', ['build:html']);
    gulp.watch(stylesheets, ['build:css']);
});
