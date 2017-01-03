import gulp from 'gulp';

import fs from 'fs';
import path from 'path';

import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import data from 'gulp-data';
import fse from 'fs-extra';
import gitRev from 'git-rev';
import gutil from 'gulp-util';
import marked from 'marked';
import nunjucks from 'gulp-nunjucks';
import sourcemaps from 'gulp-sourcemaps';
import stylus from 'gulp-stylus';
import webserver from 'gulp-webserver';


const buildDirectory = './build';

const stylesheets = [
    './media/stylus/main.styl',
    './media/stylus/home.styl',
    './media/stylus/tabzilla-customizations.styl',
    './media/stylus/fonts.styl',
];

const neededModules = [
    './node_modules/mozilla-tabzilla/**/*',
];

const images = './media/img/*';

const fonts = './media/fonts/*';

const versionFilename = path.join(buildDirectory, 'app/version.json');

// Sanitize Markdown as an added precaution over code reviews and disable GFM
// until we really need it.
marked.setOptions({
    gfm: false,
    tables: false,
    sanitize: true,
});

// Handle endpoints required by Dockerflow
// See https://github.com/mozilla-services/Dockerflow/blob/643b1a26dfef80e9fc0b5a4d356d92d73edd012d/README.md
function _handleDockerflowEndpoints(req, res, next) {
    switch (req.url) {
        case '/__heartbeat__':
        case '/__lbheartbeat__':
            res.writeHead(200);
            res.end('OK');
            break;
        case '/__version__':
            const versionContents = fs.readFileSync(versionFilename);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(versionContents);
            break;
    }

    next();
}

function _log(req, res, next) {
    gutil.log(req.method, req.url, 'HTTP/' + req.httpVersion);
    next();
}


gulp.task('default', ['build']);

gulp.task('build', [
    'build:html',
    'build:css',
    'build:copy-needed-modules',
    'build:copy-images',
    'build:copy-fonts',
    'build:version.json',
]);

gulp.task('build:html', () => {
    const sites = JSON.parse(fs.readFileSync('./sites.json'));

    // Parse Markdown in site descriptions
    for (let site in sites) {
        if (sites.hasOwnProperty(site)) {
            sites[site].description = marked(sites[site].description);
        }
    }

    const context = {
        sites,
    }

    // Nunjucks is being passed the (sanitized) output of the Markdown parser,
    // so it shouldn't escape any HTML.
    gulp.src('./templates/index.html')
        .pipe(data(() => context))
        .pipe(nunjucks.compile({}, {autoescape: false}))
        .pipe(gulp.dest(buildDirectory));
});

gulp.task('build:css', () => {
    gulp.src(stylesheets)
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(autoprefixer())
        .pipe(concat('main.css'))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(buildDirectory, 'media/css')))
});

gulp.task('build:copy-needed-modules', () => {
    gulp.src(neededModules, { base: '.' })
        .pipe(gulp.dest(buildDirectory));
});

gulp.task('build:copy-images', () => {
    gulp.src(images)
        .pipe(gulp.dest(path.join(buildDirectory, path.dirname(images))));
});

gulp.task('build:copy-fonts', () => {
    gulp.src(fonts)
        .pipe(gulp.dest(path.join(buildDirectory, path.dirname(fonts))));
});

gulp.task('build:version.json', () => {
    gitRev.long(commitHash => {
        const version = {
            'source': 'https://github.com/openjck/datacenter',
            'version': process.env.NODE_ENV || '',
            'commit': commitHash,
        };

        fse.outputJson(versionFilename, version);
    });
});

gulp.task('watch', ['build'], () => {
    gulp.watch('./templates/*.html', ['build:html']);
    gulp.watch(stylesheets, ['build:css']);
    gulp.watch(neededModules, ['build:copy-needed-modules']);
    gulp.watch(images, ['build:copy-images']);
    gulp.watch(fonts, ['build:copy-fonts']);
});

gulp.task('serve', ['watch'], () => {
    gulp.src(buildDirectory)
        .pipe(webserver({
            host: '0.0.0.0',
            port: process.env.PORT || 3000,
            middleware: [
                _handleDockerflowEndpoints,
                _log,
            ],
        }));
});
