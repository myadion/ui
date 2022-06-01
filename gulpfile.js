const { src, dest, watch, series, parallel } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const del = require('del')

function clean(){
    return del('dist')
}

function build_sass(){
    return src(['src/sass/**/*.scss'], {sourcemaps: true})
        .pipe(sass())
        .pipe(dest('dist/assets/css', {sourcemaps: '.'}))
}

function build_html(){
    return src(['src/html/**/*.html'])
        .pipe(dest('dist'))
}

function build_images(){
    return src(['src/img/**/*.png'], ['src/img/**/*.jpg'])
        .pipe(dest('dist/assets/img'))
}

function build_svg(){
    return src(['src/svg/**/*.svg'])
        .pipe(dest('dist/assets/svg'))
}

function watch_sass(){
    watch(['src/sass/*.scss'], build_sass)
}

exports.default = series(
    clean, 
    parallel(
        build_sass,
        build_html,
        build_images,
        build_svg
    ),
    watch_sass
)