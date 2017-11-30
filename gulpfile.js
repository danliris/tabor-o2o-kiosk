var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify'),
    cleanCss = require('gulp-clean-css'),
    rev = require('gulp-rev')
    del = require('del');

//region PRD
gulp.task('clean', () => {
    var promises = [];
    del.sync([
        'build/css/**',
        'build/js/**'
    ]);
})

gulp.task('pack-js-prd', () => {
    return gulp.src([
        'app/app.module.js',
        'app/app.constants.js',
        'app/app.filters.js',
        'app/app.directives.js',
        'app/app.routes.js',

        'app/*/module.js',
        'app/*/service.js',
        'app/*/factory.js',
        'app/*/filters.js',
        'app/*/*.js'
    ])
        .pipe(concat('bundle.js'))
        .pipe(minify())
        .pipe(rev())
        .pipe(gulp.dest('build/js'))
        .pipe(rev.manifest('build-reference.json', {
            merge: true
        }))
        .pipe(gulp.dest(''));
});

gulp.task('pack-css-prd', () => {
    return gulp.src([
        'statics/css/theme.css',
        'statics/css/style.*.css',
        'statics/css/print.css'
    ])
        .pipe(concat('style.css'))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest('build/css'))
        .pipe(rev.manifest('build-reference.json', {
            merge: true
        }))
        .pipe(gulp.dest(''));
});

gulp.task('prd', ['clean', 'pack-js-prd', 'pack-css-prd']);
//endregion

//region DEV
gulp.task('pack-js-dev', () => {
    return gulp.src([
        'app/app.module.js',
        'app/app.constants.js',
        'app/app.filters.js',
        'app/app.directives.js',
        'app/app.routes.js',

        'app/*/module.js',
        'app/*/service.js',
        'app/*/factory.js',
        'app/*/filters.js',
        'app/*/*.js'
    ])
        .pipe(concat('bundle.js'))
        .pipe(minify())
        .pipe(gulp.dest('build/js'));
});

gulp.task('pack-css-dev', () => {
    return gulp.src([
        'statics/css/theme.css',
        'statics/css/style.*.css',
        'statics/css/print.css'
    ])
        .pipe(concat('style.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest('build/css'));
});

gulp.task('dev', ['clean', 'pack-js-dev', 'pack-css-dev']);
//endregion

gulp.task('watch', function () {
    gulp.watch('app/**/*.js', ['pack-js-dev']);
    gulp.watch('statics/css/*.css', ['pack-css-dev']);
});

gulp.task('default', ['dev', 'watch']);