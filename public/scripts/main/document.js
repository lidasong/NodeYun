require([
    'jquery',
    'modules/loadmore',
    'modules/upload',
    'modules/file_item',
    'EJS',
    // 'modules/s_message',
    'bootstrap_dropdown',
    'bootstrap_modal'
], function($, loadMore, upload,fileItem,EJS, SocketMsg) {
	'use strict';
	
    loadMore.initLoadMore({
        url: '/api/content/docs',
        success: loadMoreDone,
        fail: loadMoreFail
    });

    function loadMoreDone(res) {
        var templateUrl = 'views/templates/file_item.ejs',
            $files = $('.files'),
            html = '';
        console.log(res);
        res.forEach(function(file, index) {
            html += new EJS({
                url: templateUrl
            }).render({
                file: file
            });
        });
        $files.append(html);
    }

    function loadMoreFail(err) {
        console.log(err);
    }

    upload.init(fileItem.renderFileItem,{
        filters:{
            mime_types:[
                { title : 'docs', extensions : "pdf,doc,docx,pptx,ppt,txt,json" }
            ]
        }
    });
    fileItem.init();
    // SocketMsg.initWsSocket();
    
});
