require([
    'jquery',
    'modules/loadmore',
    'modules/upload',
    'modules/file_item',
    'EJS',
    'bootstrap_dropdown',
    'bootstrap_modal'
], function($, loadMore, upload,fileItem,EJS) {
	'use strict';
	
    loadMore.initLoadMore({
        url: '/api/content/others',
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
    upload.init();
    fileItem.init(fileItem.renderFileItem);
});
