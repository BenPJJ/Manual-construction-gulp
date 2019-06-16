const {src, dest, watch, series, parallel} = require('gulp')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const inject = require('gulp-inject')
const browserSync = require('browser-sync').create()
const cssnano = require('gulp-cssnano') // 压缩css
const imagemin = require('gulp-imagemin') // 图片压缩
const concat = require('gulp-concat') // 合并js
const uglify = require('gulp-uglify') // 压缩js
const del = require('del')

// 编译scss
const scss = () => {
    src('src/index.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(cssnano()) // 压缩css
        .pipe(dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
}

// 转译js
const js = async () => {
    src(['src/js/*.js', '!src/js/page.js'])
        .pipe(babel({
            "presets": ['@babel/preset-env']
        }))
        .pipe(uglify()) // 压缩js
        .pipe(dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
}

// img
const images = async () => {
    src('src/img/**')
        .pipe(imagemin({
            optimizationLevel: 5, // 类型：numner，默认：3，取值范围：0-7（优化等级）
            progressive: true, // 类型：boolean，默认：false，无损压缩jpg图片
            interlaced: true, // 类型：boolean，默认：false，隔行扫描gif进行渲染
            multipass: true // 类型：boolean，默认：false，多次优化svg直到完全优化

        }))
        .pipe(dest('dist/img'))
        .pipe(browserSync.reload({
            stream: true
        }))
}

// html动态插入js、css文件
const html = async () => {
    src('src/index.html')
        .pipe(inject(
            src(['dist/js/*.js', 'dist/*css'],  {read: false}),
            {ignorePath: ['dist'], addRootSlash: false} //去除tmp 去除 /
            )
        )
        .pipe(dest('dist/'))
        .pipe(browserSync.reload({
            stream: true
        }))
}

// 打包之前要删除原先的dist文件
const naleDelete = async () => del(['dist'])

// 搭建本地服务器环境
const watchs = async () => {
    watch('src/js/*.js', js),
    watch('src/scss/*.scss', scss),
    watch('src/index.html', html),
    watch('src/img/**', images),
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
}

exports.server = series(naleDelete, html, watchs, parallel(js, scss, images))
    
