require([
    'jquery',
    'pptPreview',
    'modules/preview_side',
    'bootstrap_dropdown'
], function($, PPT, thumPPT) {
    var data = [],
        $wrapper = $('.wrapper'),
        thubmbnails = [],
        type = $('#type').val(),
        cloud_url = $('#cloud_url').val(),
        key_original = $('#key_original').val();

    function getDataUrl() {
        var url = cloud_url + encodeURI(key_original),
            pageInfoUrl = cloud_url + encodeURI(key_original),
            ppt;

        $('spinner').show();

        switch (type) {
            case '1':
            case '2':
                url = url + '?odconv/pdf|odconv/jpg/page/';
                pageInfoUrl = pageInfoUrl + '?odconv/pdf|odconv/jpg/info';
                break;
            case '3':
                url = url + '?odconv/jpg/page/';
                pageInfoUrl = pageInfoUrl + '?odconv/jpg/info';
                break;
        }
        $.get(pageInfoUrl, {}, null, 'json').then(function(res) {
            for (var i = 1; i < res.page_num; i++) {
                data.push(url + i + '/density/150');
                thubmbnails.push(url + i + '|imageView2/1/w/150/h/115/density/40');
            }
            ppt = $('#ppt').MPreviewPPT({
                data: data
            });
            thumPPT.initThumbnail(thubmbnails, ppt);
            initFullScreen(ppt);
        }).always(function() {
            $('.spinner').hide();
        });
    }

    function initFullScreen(ppt) {
        ppt.get(0).PPT.DOM.fullScreen.on('click', function() {
            $wrapper.toggleClass('translate-x');
        });
        // ppt.get(0).PPT.elem.on('keydown',function(evt){
        //     switch(evt.which){
        //         case 37:
        //             ppt.get(0).PPT.__pageJump('down');
        //             break;
        //         case 39:
        //             ppt.get(0).PPT.__pageJump('up');
        //             break;
        //         default:
        //         break;
        //     }
        // })
        ppt.get(0).PPT.DOM.mediaPlay.on('dblclick', function() {
            $wrapper.toggleClass('translate-x');
        });
    }

    getDataUrl();
});
