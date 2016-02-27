var require = {
    baseUrl: 'public/scripts',
    waitSeconds: 0,

    paths: {

        // jQuery and plugin
        jquery: 'libs/jquery/dist/jquery.min',

        jQuery_MouseWheel: 'libs/iviewer/jquery.mousewheel',
        jQuery_Lazyload: 'libs/lazyload/jquery.lazyload',
        jQuery_Scroll: 'libs/niceScroll/jquery.nicescroll.min',
        jQuery_ImageViewer:'libs/imageViewer',
        // Bootstrap components
        bootstrap_dropdown: 'libs/bootstrap/js/dropdown',
        bootstrap_modal: 'libs/bootstrap/js/modal',
        bootstrap_tab: 'libs/bootstrap/js/tab',

        //文件上传
        plupload: 'libs/plupload/plupload.full.min',
        qiniu: 'libs/plupload/qiniu',

        //javascript 前端模板
        EJS: 'libs/ejs_production',

        //ppt浏览
        pptPreview: 'libs/preview/MPreviewPPT',

        //pdf浏览
        pdfPreview: 'libs/preview/MPreview',

        //图片预览
        ImageViewer: 'libs/iviewer/jquery.iviewer',

        MD5: 'libs/js-md5/src/md5',


        //视频播放器
        videoJS: 'libs/video/video',

        //音频播放器
        audio5: 'libs/audio5js/audio5',

        //多文件下载插件
        Download: 'libs/download',

        //socket-io
        SocketIO: 'libs/socket.io-1.3.5',

        //社区资源请求
        markitup: 'libs/markitup/jquery.markitup',

        //手机,电脑互联
        peertc: 'libs/peertc-min',

        //reveal ppt
        reveal:'libs/reveal/reveal',
        head:'libs/reveal/head.min'

    },

    shim: {
        jquery: {
            exports: '$'
        },
        jQuery_MouseWheel: {
            deps: ['jquery']
        },
        jQuery_Lazyload: {
            deps: ['jquery']
        },
        jQuery_Scroll: {
            deps: ['jquery']
        },
        bootstrap_dropdown: {
            deps: ['jquery']
        },
        bootstrap_modal: {
            deps: ['jquery']
        },
        bootstrap_tab: {
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
        plupload: {
            deps: ['jquery']
        },
        qiniu: {
            deps: ['plupload'],
            exports: 'Qiniu'
        },
        markitup: {
            deps: ['jquery']
        },
        peertc:{
            deps:['jquery']
        },
        reveal:{
            deps:['head']
        }
    }
};
