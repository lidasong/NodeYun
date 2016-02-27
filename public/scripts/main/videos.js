require([
    'jquery',
    'modules/loadmore',
    'modules/upload',
    'modules/file_item',
    'EJS',
    'modules/video',
    // 'modules/s_message',
    'bootstrap_dropdown',
    'bootstrap_modal'
], function($, loadMore, upload, fileItem, EJS, Video, SocketMsg) {

    'use strict';

    loadMore.initLoadMore({
        url: '/api/content/videos',
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

    upload.init(fileItem.renderFileItem);

    fileItem.init();

    Video.initVideo();

    // SocketMsg.initWsSocket();

});
