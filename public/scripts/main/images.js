require([
    'jquery',
    'img_view',
    'modules/loadmore',
    'modules/file_item',
    // 'modules/s_message',
    'bootstrap_dropdown'
], function($, ImageView, loadMore, fileItem, SocketMsg) {

    'use strict';

    ImageView.initImgView();

    fileItem.init();

    // SocketMsg.initWsSocket();

    loadMore.initLoadMore({
        url: '/api/content/images',
        success: loadMoreDone,
        fail: loadMoreFail
    });

    function loadMoreDone(imgs) {
        var templateUrl = 'views/templates/img_item.ejs',
            $imgs = $('.img-container'),
            html = '',
            cloudUrl = $('#cloud-url').val();
        for (var time in imgs) {
            html += new EJS({
                url: templateUrl
            }).render({
                images: imgs,
                time: time,
                cloudUrl: cloudUrl
            });
        }
        $imgs.append(html);
    }

    function loadMoreFail(err) {
        console.log(err);
    }
});
