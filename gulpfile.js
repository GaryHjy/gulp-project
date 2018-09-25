// 引入gulp及一系列插件
const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const pump = require('pump');
const babel = require('gulp-babel');
const browserSync = require('browser-sync');

/**
 *	copy文件夹或文件到生产环境
 * @param {String} input [目标文件|文件夹]
 * @param {String} output	[输出]
 * @param {String} type		[类型:file,可不填默认为文件夹]
 */
function copy(input,output,type){
	if(type==='file'){
		gulp.src(input)
		.pipe(gulp.dest(output));
	}else{
		gulp.src([input+'/*',input+'/*/**'])
		.pipe(gulp.dest(output));
	}
}

// 编译css  sass->css
gulp.task('buildsass',()=>{
    gulp.src(['./src/sass/*.scss'])
    .pipe(sass({outputStyle:'compact'}).on('error',sass.logError))
    .pipe(gulp.dest('./src/css/'))
});
// 开发环境->生产环境
gulp.task('build',cb=>{
    pump([
		// 匹配文件
		gulp.src(['./src/js/*.js','!./src/js/require.js']),
		// es6=>es5
		babel({
            presets: ['es2015']
        }),
		// 压缩
		uglify(),
		// 输出到硬盘
		gulp.dest(path.join(__dirname,'/dist/js/'))
	],cb);
	// 移动文件、文件夹到生产环境
	copy('./src/api','./dist/api');
	copy('./src/css','./dist/css');
	copy('./src/lib','./dist/lib');
	copy('./src/img','./dist/img');
	copy('./src/js/require.js','./dist/js','file');
});

// 启动一个自动刷新的服务器
gulp.task('devServer',()=>{
    browserSync({
        port:23333,
        proxy:'http://localhost:8080',
        // 监听文件修改
        files:['./src/**/*html','./src/css/*.css']
    });
    //监听样式修改自动编译
    gulp.watch('./src/sass/*.scss',['buildsass']);
});