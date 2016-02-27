require([
    'modules/message_item',
    'modules/loadmore',
    'EJS',
    'bootstrap_tab',
    'bootstrap_dropdown'
], function(message, loadMore, EJS) {

    'use strict';

    var tabType = $('.tab.active').data('type'),
        tabNames = [
            'follow',
            'comment',
            'reply'
        ];

    function initTabEvent() {
        var $navTabs = $('.nav-tabs');
        $navTabs.on('click', '.tab', function(evt) {
            var pageNum = parseInt($(this).data('page'));
            tabType = $(this).data('type');
            loadMore.resetPage(pageNum)
                .reset({
                    url: '/messages/' + tabType,
                    success: loadMoreDone,
                    fail: loadMoreFail
                });
        });
    }

    loadMore.initLoadMore({
        url: '/messages/' + tabType,
        success: loadMoreDone,
        fail: loadMoreFail
    });

    function loadMoreDone(res) {
        var templateUrl = 'views/templates/message/' + tabNames[tabType],
            $msgList = $('.tab-pane.active>.msgs'),
            html = '',
            pageNum = parseInt($('.tab.active').data('page')),
            renderData = {};
        renderData[tabNames[tabType] + 'Msg'] = res;
        renderData['msgTypes'] = {
            0: '关注了你',
            1: '评论了你的分享',
            2: '赞了你的分享'
        };

        $('.tab.active').data('page', ++pageNum)

        html += new EJS({
            url: templateUrl
        }).render(renderData);

        $msgList.append(html);
    }

    function loadMoreFail(err) {
        console.log(err);
    }

    initTabEvent();

    message.initMsgTab();
});
