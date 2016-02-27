require([
    'jquery',
    'modules/loadmore',
    'modules/upload',
    'modules/file_item',
    'EJS',
    // 'modules/s_message',
    'modules/audio',
    'bootstrap_dropdown',
    'bootstrap_modal'
], function($, loadMore, upload, fileItem, EJS, SocketMsg) {
    'use strict';
    
    upload.init(fileItem.renderFileItem,{
        filters:{
            mime_types:[
                { title : 'audios', extensions : "mkv,mpeg,mp4,ogg,mp3" }
            ]
        }
    });

    fileItem.init();
    
    // SocketMsg.initWsSocket();

    loadMore.initLoadMore({
        url: '/api/content/audios',
        success: loadMoreDone,
        fail: loadMoreFail
    });

    function loadMoreDone(res) {
        var templateUrl = 'views/templates/file_item.ejs',
            $files = $('.files'),
            html = '';
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
    

});
