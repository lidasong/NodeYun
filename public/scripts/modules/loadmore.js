define([
    'jquery',
    'jQuery_MouseWheel'
], function($) {

    'use strict';

    var $dom = $('html'),
        $body = $(document.body),
        page = 1,
        numPerPage = 10,
        offset,
        debounce = true;

    function loadMore(options, evt) {
        if (evt.deltaY > 0 || !debounce) {
            return;
        }
        var viewerHeight = $dom.get(0).clientHeight,
            clientHeight = $body.height(),
            scrollTop = $body.scrollTop() || $dom.scrollTop(),
            isIE = !!/Trident|MSIE/.test(navigator.userAgent);
        if (scrollTop + viewerHeight >= clientHeight) {
            debounce = false;
            $.ajax({
                type: 'get',
                url: options.url,
                cache: !isIE,
                data: {
                    page: page
                }
            }).done(function(res) {
                if ($.isEmptyObject(res)) {
                    $('.tip-completed').fadeIn().delay('slow').fadeOut();
                    $dom.off('mousewheel.loadmore');
                    $dom.off('touchmove.loadmore');
                    return;
                }
                options.success.apply(null, [res])
                page++;
            }).fail(options.fail).always(function() {
                debounce = true;
            });
        }
    }

    function initLoadMore(options) {
        $dom.on('mousewheel.loadmore', loadMore.bind(null, options));
        $dom.on('touchmove.loadmore', loadMore.bind(null, options));
    }

    function resetPage(pageNum) {
        page = pageNum;
        return this;
    }

    function reset(options) {
        $dom.off('mousewheel.loadmore');
        $dom.off('touchmove.loadmore');
        initLoadMore(options);
    }

    return {
        initLoadMore: initLoadMore,
        resetPage: resetPage,
        reset:reset
    };
});
