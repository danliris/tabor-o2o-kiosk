var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify'),
    cleanCss = require('gulp-clean-css'),
    image = require('gulp-image'),
    rev = require('gulp-rev'),
    del = require('del');

gulp.task('clean', () => {
    var promises = [];
    del.sync([
        'build/css/**',
        'build/js/**',
        'build/images/**',
    ]);
})

scriptSrc = (mode) => {
    var src = [
        'app/app.module.js',
        'app/app.filters.js',
        'app/app.directives.js',
        'app/app.routes.js',

        'app/*/module.js',
        'app/*/service.js',
        'app/*/factory.js',
        'app/*/filters.js',
        'app/*/*.js'
    ];

    if (mode == 'DEV') {
        src = src.concat([
            'app/app.constants.js',
            'app/app-firebase.config.js',
        ]);
    }
    else if (mode == 'PRD') {
        src = src.concat([
            'app/app.constants.prd.js',
            'app/app-firebase.config.prd.js',
        ]);
    }
    return src;
};

styleSrc = (mode) => {
    var src = [
        'statics/css/theme.css',
        'statics/css/style.*.css',
        'statics/css/print.css'
    ];
    if (mode == 'DEV') {
        src = src.concat([

        ]);
    }

    if (mode == 'PRD') {
        src = src.concat([

        ]);
    }

    return src;
};

imageSrc = () => {
    return [
        'statics/images/**'
    ];
};

gulp.task('pack-img', () => {
    return gulp.src(imageSrc())
        .pipe(image())
        .pipe(gulp.dest('build/images'));
});

//region PRD
gulp.task('pack-js-prd', () => {
    return gulp.src(scriptSrc('PRD'))
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
    return gulp.src(styleSrc('PRD'))
        .pipe(concat('style.css'))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest('build/css'))
        .pipe(rev.manifest('build-reference.json', {
            merge: true
        }))
        .pipe(gulp.dest(''));
});

gulp.task('prd', ['clean', 'pack-js-prd', 'pack-css-prd', 'pack-img']);
//endregion

//region DEV
gulp.task('pack-js-dev', () => {
    return gulp.src(scriptSrc('DEV'))
        .pipe(concat('bundle.js'))
        .pipe(minify())
        .pipe(gulp.dest('build/js'));
});

gulp.task('pack-css-dev', () => {
    return gulp.src(styleSrc('DEV'))
        .pipe(concat('style.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest('build/css'));
});

gulp.task('dev', ['clean', 'pack-js-dev', 'pack-css-dev', 'pack-img']);
//endregion

gulp.task('watch', function () {
    gulp.watch('app/**/*.js', ['pack-js-dev']);
    gulp.watch('statics/css/*.css', ['pack-css-dev']);
});

gulp.task('default', ['dev', 'watch']);