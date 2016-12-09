// 这行命令告知 Node 去 node_modules 中查找 gulp 包
// 先局部查找，找不到就去全局环境中查找
var gulp = require('gulp');

var less = require('gulp-less');

var browserSync = require('browser-sync');

var cache = require('gulp-cache');

var del = require('del');


// less任务：编译样式表
gulp.task('less', function(){
    return gulp.src('app/less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// browserSync任务：自动监测文件变化并刷新浏览器
gulp.task('browserSync', function() {
    browserSync({
        server: {
            // 指定根目录 app
            baseDir: 'app'
        },
    })
});

// clean任务： 清理旧文件
gulp.task('clean', function(callback) {
    del('app/css/*');
    return cache.clearAll(callback);
});










