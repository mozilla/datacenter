import gulp from 'gulp';

import fs from 'fs';

import data from 'gulp-data';
import nunjucks from 'gulp-nunjucks';

gulp.task('default', ['build']);

gulp.task('build', ['build:html']);

gulp.task('build:html', () => {
    const context = {
        sites: JSON.parse(fs.readFileSync('./sites.json')),
    }

    gulp.src('templates/index.html')
        .pipe(data(() => context))
        .pipe(nunjucks.compile())
        .pipe(gulp.dest('build'));
});
