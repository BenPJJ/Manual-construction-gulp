# gulp4

gulp是一个工具，常用于执行前端任务，如：

- web服务器
- 保存文件时自动重新加载浏览器
- 使用sass 或 less 等预处理器
- 优化css、js和图像等资源

# 1. 创建项目

``` shell
|-Manual-construction-gulp
```

# 2. 搭建gulp

> 全局安装：npm i gulp-cli --global

> 验证：gulp -v

# 3. 初始化项目

> npm init -y
>
> 安装gulp：npm i gulp -D

# 4. gulp的使用

## 创建gulpfile.js文件

> 在项目根目录下创建一个名为gulpfile.js的文件，gulpfile.js是gulp项目的配置文件

## 运行gulp

> gulp <任务名称>，**如果有不需要编译的文件，只需要在文件前加下划线**

## gulp工作流程

``` js
- gulp.src() 先通过gulp.src()方法获取到想要处理的文件，并返回文件流
- pipe 然后文件流通过pipe方法导入到gulp的插件中
- 经过插件处理后的文件流再通过pipe方法导入到gulp.dest()方法中
- gulp.dest() 最后通过gulp.dest()方法把流中的内容写入到文件中
```

> 文件流 => 文件在内存中的状态

## API

### 创建任务

``` js
gulp.task('build', () => {
    ...
})
```

### 匹配要处理的文件

``` js
gulp.src(globs[, options])
// options 有3个属性buffer，read，base
```

#### 语法

- globs：文件匹配模式（类似正则表达式），用来匹配文件路径（包括文件名）

#### globs的匹配规则

gulp内部使用了node-glob模块来实现其文件匹配功能，我们可以使用下面这些特殊的字符来匹配我们想要的文件：

##### 单匹配模式

| 匹配符 |        code         | 匹配                              | 不匹配             | 备注                                         |
| :----: | :-----------------: | --------------------------------- | ------------------ | -------------------------------------------- |
|   *    |          *          | a.b，x.y，abc，abc/               | a/b.js             | 匹配0-多 个字符，不匹配 /，除非 / 出现在末尾 |
|        |        `*.*`        | a.b，x.y                          | abc                | 匹配所有带后缀的文件                         |
|        |     `*/*/*.js`      | a/b/c.js，x/y/z.js                | a/b.js，a/b/c/d.js | 匹配固定层级目录                             |
|  `**`  |        `**`         | abc，a/b，a/b.js，a/b/c，a/b/c.js |                    | 匹配所有的目录和文件                         |
|        |      `**/*.js`      | a.js，a/b.js，a/b/c.js            |                    | 匹配所有目录下的.js文件                      |
|        |      `a/**/z`       | a/z，a/b/z，a/b/c/z，a/b/c/d/z    |                    |                                              |
|        |       a/**b/z       | a/b/z，a/nb/z                     | a/c/nb/z           | `**` 单独出现才能匹配多级目录                |
|   ?    |        ?.js         | a.js，b.js，c.js                  |                    | 匹配一个字符，不匹配 /                       |
|        |         a??         | a.b，abc                          | ab/                | 占位符与字符搭配使用                         |
|   []   |      [abc].js       | a.js，b.js，c.js                  | ab.js，xyz.js      | 整个[]只匹配一个字符                         |
|        | [^abc].js [!abc].js | x.js，y.js                        | a.js，b.js，c.js   | 排除匹配字符                                 |

##### 多匹配模式（同时使用多种匹配）

###### 类正则

|              表达式               |                   备注                   |
| :-------------------------------: | :--------------------------------------: |
| !(pattern \| pattern \| pattern） | 匹配任何与括号中给定的任一模式都不匹配的 |
| ?(pattern \| pattern \| pattern)  |     匹配括号中给定的任一模式0次或1次     |
| +(pattern \| pattern \| pattern)  |     匹配括号中给定的任一模式至少1次      |
| *(pattern \| pattern \| pattern)  |    匹配括号中给定的任一模式0次或多次     |
|  @(pattern \| pattern\|pattern)   |       匹配括号中给定的任一模式1次        |

###### 数组

- 使用数组匹配多模式

> `gulp.src(['js/*.js', 'css/*css', '*.html'])`

- 使用数组 + 排除模式

  排除模式不能出现在数组的第一个元素中

> `glup.src(['*.js', '!b*js'])` // 匹配所有js文件，但排除掉以b开头的js文件
>
> gulp.src(['!b*.js',*.js]) // 不排除任何文件，因为排除模式不能出现在数组的第一个元素中

###### 展开模式

以 `{}` 作为定界符，根据它里面的内容，会展开为多个模式， 
最后匹配的结果为所有展开的模式相加起来得到的结果 ! 

1. a{b, c}d 展开为：abc，acd 
2. a{b,}c 展开为：abc，ac 
3. a{0..3}c 展开为：a0c，a1c，a2c 
4. a{b, c{d, e}f}g 展开为：abg，acdfg，acefg 
5. a{b, c}d{e, f}g 展开为：abdeg，acdeg，abdeg，abdfg

### 输出文件

> 把文件流中的内容输出到指定目录

``` js
gulp.dest(path[, options])
```

### 监听文件修改，并执行相应任务

``` js
gulp.watch(glob[, opts], tasks)
gulp.watch(glob[, opts], cb)
```

# 5. 编译less 和 sass

## less

> 安装：npm i gulp-less -D

```js
const {src, dest} = require('gulp')
const less = require('gulp-less')

var less = async () => {
    src('src/*.less')
    	.pipe(less())
    	.pipe(dest('dist/css'))
}

exports.less = less
```

**运行`gulp less`**

## sass

> 安装：npm i gulp-sass -D

```js
const {src, dest} = require('gulp')
const sass = require('gulp-sass')

const scss = async () => {
    src('src/index.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(dest('dist/'))
}

exports.scss = scss
```

**运行`gulp scss`**

> outputStyle 配置参数：
>
> 1. nested（默认）
> 2. expanded 展开
> 3. compact 单行
> 4. compressed 压缩

# 6. 编译js es6\7 转es5

这里要安装对应版本：https://github.com/babel/gulp-babel

``` js
# babel7
$ npm i gulp-babel @babel/core @babel/preset-env -D
# babel6
$ npm i gulp-babel@7 babel-core bael-preset-env -D
```

``` js
const {src, dest} = require('gulp')
const babel = require('gulp-babel')

const js = async () => {
    src(['src/js/*.js', '!src/js/page.js'])
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(dest('dist/js'))
}

exports.js = js
```

**运行`gulp js`**

> gulp-concat，gulp-rename的使用
>
> 安装：
>
> npm i gulp-concat -D // 合并
>
> npm i gulp-rename -D // 重命名

``` js
const gulp = require('gulp')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')

gulp.task('merge', () => {
    gulp.src(['./src/js/*.js', '!./src/js/{all, all.min}.js'])
    // 合并
    .pipe(concat('all.js'))
    // 压缩
    .pipe(uglify({compress: true}))
    // 重命名
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./src/js'))
})
```

# 7. 压缩图片

> 安装：npm i gulp-imagemin -D

``` js
const {src, dest} = require('gulp')
const imagemin = require('gulp-imagemin')

const images = async () => {
    src('src/img/**')
        .pipe(imagemin({
            optimizationLevel: 5, // 类型：numner，默认：3，取值范围：0-7（优化等级）
            progressive: true, // 类型：boolean，默认：false，无损压缩jpg图片
            interlaced: true, // 类型：boolean，默认：false，隔行扫描gif进行渲染
            multipass: true // 类型：boolean，默认：false，多次优化svg直到完全优化

        }))
        .pipe(dest('dist/img'))
}

exports.images = images
```

**运行`gulp images`**

>imagemin配置参数：
>
>1. optimizationLevel 类型：numner，默认：3，取值范围：0-7（优化等级）
>2. progressive 类型：boolean，默认：false，无损压缩jpg图片
>3. interlaced 类型：boolean，默认：false，隔行扫描gif进行渲染
>4. multipass 类型：boolean，默认：false，多次优化svg直到完全优化

# 8. html动态插入css、js文件

> 安装：npm i gulp-inject -D

**告诉gulp js文件从何处插入** ，这一步很重要，要不然就没有效果了

``` html
<!-- inject:css -->
<!-- endinject -->
</head>

</body>
<!-- inject:js -->
<!-- endinject -->
</html>
```

``` js
const {src, dest} = require('gulp')
const inject = require('gulp-inject')

const html = async () => {
    src('src/index.html')
        .pipe(inject(
            src(['dist/js/*.js' 'dist/*css'],  {read: false}),
            {ignorePath: ['dist'], addRootSlash: false} //去除tmp 去除 /
            )
        )
        .pipe(dest('dist/'))
}

exports.html = html
```

**运行`gulp html`**

> inject配置参数：
>
> src(['dist/js/*.js'],  {read: false})
>
> {ignorePath: ['dist'], addRootSlash: false} //去除tmp 去除 /

# 9. 搭建本地服务器环境

> 安装：npm i browser-sync -D

运行文件根目录为临时文件dist

``` js
const browserSync = require('browser-sync').create()

const watchs = async () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
}

exports.watchs = watchs
```

**运行`gulp watchs`**

# 10. 监听文件

修改后手动刷新

``` js
const {src, dest, watch} = require('gulp')

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

exports.watchs = watchs
```

**运行`gulp watchs`**

f5手动刷新很麻烦,更改之前的scss,js等函数,利用browser-sync实现更改自动刷新

``` js
const scss = () => {
    src('src/index.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(dest('dist/'))
        .pipe(browserSync.reload({
            stream: true
        }))
}
# 同理
```

**运行`gulp watchs`**

更改src下的文件，你会发现浏览器已经成功自动刷新了

**推荐把众多函数exports成一句**

> series() 顺序执行
>
> parallel() 并发运行

``` js
exports.server = series(html, watchs, parallel(js, scss, images))
```

把html和watchs放在parallel前面，要不然不执行parallel放在前面就不执行后面的了

# 11. 打包压缩发布

``` js
# 线上项目为了提高访问速度，我们需要压缩以及合并文件
安装：gulp-cssnano gulp-imagemin gulp-concat gulp-uglify
```

> 安装：
>
> npm i gulp-cssnano -D // 压缩css
>
> npm i gulp-imagemin -D // 图片压缩
>
> npm i gulp-concat -D // 合并js
>
> npm i gulp-uglify -D // 压缩js

``` js
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
```

打包之前要删除原先的dist文件

> 安装：npm i del -D

``` js
const del = require('del')

const naleDelete = async () => del(['dist'])

exports.server = series(naleDelete, html, watchs, parallel(js, scss, images))
```

**运行`gulp server`**