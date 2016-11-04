import gulp from 'gulp';

import fs from 'fs';

import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import data from 'gulp-data';
import nunjucks from 'gulp-nunjucks';
import sourcemaps from 'gulp-sourcemaps';
import stylus from 'gulp-stylus';


const stylesheets = [
    './media/stylus/main.styl',
    './media/stylus/site-listing.styl',
    './media/stylus/tabzilla-customizations.styl',
];

const neededModules = [
    './node_modules/mozilla-tabzilla/**/*',
];

gulp.task('default', ['build', 'copy:needed-modules']);

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
        .pipe(autoprefixer())
        .pipe(concat('main.css'))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/media/css'))
});

gulp.task('copy:needed-modules', () => {
    gulp.src(neededModules, { base: '.' })
        .pipe(gulp.dest('./build'));
});

gulp.task('watch', ['default'], () => {
    gulp.watch('./templates/*.html', ['build:html']);
    gulp.watch(stylesheets, ['build:css']);
    gulp.watch(neededModules, ['copy:needed-modules']);
});
