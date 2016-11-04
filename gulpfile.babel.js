import gulp from 'gulp';

import fs from 'fs';

import data from 'gulp-data';
import nunjucks from 'gulp-nunjucks';
import sourcemaps from 'gulp-sourcemaps';
import stylus from 'gulp-stylus';

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
    gulp.src('./media/stylus/*.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/css'))
});
