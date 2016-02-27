var gulp = require('gulp'),
	notify = require('gulp-notify'),
	plumber = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	amdOptimize = require('amd-optimize');

	less = require('gulp-less');
var gulp = require("gulp");
var uglify = require("gulp-uglify");
var requirejsOptimize = require('gulp-requirejs-optimize');
var concat = require('gulp-concat');
var miniCSS = require('gulp-minify-css');


gulp.task('less',function(){
	gulp.src(['styles/less/*.less','styles/less/**/*.less'])
		.pipe(plumber({errorHandler:notify.onError('Error:<%= error.message %>')}))
		//less
		.pipe(less())
		.pipe(gulp.dest('styles/css'))
		//autoprefixer
		.pipe(autoprefixer({
			browsers:['> 5%'],
			cascade:false
		}))
		.pipe(gulp.dest('styles/css'));
});

gulp.task('minicss',function(){
    gulp.src([
        './styles/css/*.css'
        ]).pipe(miniCSS())
        .pipe(gulp.dest('./styles/production'));
});

gulp.task('concat',function(){
    gulp.src([
        './styles/css/videos.css',
        './styles/css/video-js.css'
    ]).pipe(concat('videos.css')).pipe(miniCSS())
    .pipe(gulp.dest('./styles/production'));
});

gulp.task('watch-less',function(){
	gulp.watch('styles/less/**/*.less',['less']);
});

gulp.task('autoprefixer',function(){
	gulp.src('styles/css/**/*.css')
		.pipe(autoprefixer({
			browsers:['> 5%'],
			cascade:false
		}))
		.pipe(gulp.dest('styles/css'));
});



















config = {
    baseUrl: './scripts/main',
    // waitSeconds: 0,

    paths: {
        // jQuery and plugin

        jquery: '../../libs/jquery/dist/jquery.min',

        // Bootstrap components
        bootstrap_dropdown: '../../libs/bootstrap/js/dropdown',
        bootstrap_modal: '../../libs/bootstrap/js/modal',
        bootstrap_tab: '../../libs/bootstrap/js/tab',

        //文件上传
        plupload:'../libs/plupload/plupload.full.min',
        qiniu:'../libs/plupload/qiniu',

        //javascript 前端模板
        EJS: '../libs/ejs_production',

        //ppt浏览
        pptPreview: '../../libs/preview/MPreviewPPT',

        //pdf浏览
        pdfPreview: '../../libs/preview/MPreview',

        jQuery_MouseWheel: '../../libs/iviewer/jquery.mousewheel',
        //图片预览
        ImageViewer: '../../libs/iviewer/jquery.iviewer',

        MD5: '../../libs/js-md5/src/md5',

        jQuery_Lazyload: '../libs/lazyload/jquery.lazyload',

        //视频播放器
        videoJS: '../libs/video/video',

        //音频播放器
        audio5:'../libs/audio5js/audio5',

        //多文件下载插件
        Download:'../libs/download',

        //socket-io
        SocketIO:'../libs/socket.io-1.3.5'

    },

    shim: {
        jquery: {
            exports: '$'
        },
        bootstrap_dropdown: {
            deps: ['jquery']
        },
        bootstrap_modal: {
            deps: ['jquery']
        },
        bootstrap_tab:{
            deps:['jquery']
        },
        jQuery_MouseWheel: {
            deps: ['jquery']
        },
        jQuery_Lazyload: {
            deps: ['jquery']
        },
        pptPreview: {
            deps: ['jQuery_MouseWheel'],
            exports: 'PPT'
        },
        pdfPreview: {
            deps: ['jQuery_MouseWheel'],
            exports: 'PDF'
        },
        ImageViewer: {
            deps: ['jQuery_MouseWheel']
        },
        MD5: {
            exports: 'MD5'
        },
        EJS: {
            exports: 'EJS'
        },
        plupload:{
            deps:['jquery']
        },
        qiniu:{
            deps:['plupload'],
            exports:'Qiniu'
        }
    }
};
// gulp.task("requirejs", function () {
//         return gulp.src('./scripts/main/home.js')
//         .pipe(amdOptimize(config))  
//         .pipe(gulp.dest('./scripts/production'));
// });
gulp.task("amd", function () {
        return gulp.src('./scripts/main/home.js')
        .pipe(requirejsOptimize(config))  
        .pipe(gulp.dest('./scripts/production'));
});