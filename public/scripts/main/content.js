require([
    'jquery',
    'modules/loadmore',
    'modules/upload',
    'modules/file_item',
    'EJS',
    'img_view',
    // 'modules/s_message',
    'modules/audio',
    'bootstrap_dropdown',
    'bootstrap_modal'
], function($, loadMore, upload, fileItem, EJS,ImageView,SocketMsg) {
    'use strict';

    configLoadMore();

    upload.init(fileItem.renderFileItem);

    fileItem.init();

    ImageView.initImgView();

    // SocketMsg.initWsSocket();

    function configLoadMore() {
        var isFolder = $('#parent-id').val() != '';
        if (isFolder) {
            return;
        }
        loadMore.initLoadMore({
            url: '/api/content/all',
            success: loadMoreDone,
            fail: loadMoreFail
        });
    }

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
