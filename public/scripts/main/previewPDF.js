require(['jquery', 'pdfPreview', 'bootstrap_dropdown'], function($, PDF) {
    var data = [],
        type = $('#type').val(),
        cloud_url = $('#cloud_url').val(),
        key_original = $('#key_original').val();
    function getDataUrl() {
        var url = cloud_url + encodeURI(key_original),
            pageInfoUrl = cloud_url + encodeURI(key_original);
            $('spinner').show();
        switch(type){
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
                data.push(url + i + '/density/200');
            }
            $('#doc').MPreview({
                data: data
            });
        }).always(function(){
            $('.spinner').hide();
        });
    }
    getDataUrl();
});
