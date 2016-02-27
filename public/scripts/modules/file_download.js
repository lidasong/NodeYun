define([
    'jquery',
    'Download'
], function($, Download) {

    'use strict';

    function initDownload() {
        var $btnDownload = $('.btn-download');
        $btnDownload.on('click', function(evt) {
            var keys = getDownloadKeys();
            if (!keys.length) {
                return;
            } else {
                // keys.forEach(function(key){
                //     var alink = document.createElement('a');
                //     alink.href = key.url + '?attname='+key.name;
                //     alink.className='link';
                //     document.body.appendChild(alink);
                //     alink.click();
                //     alink.remove();
                    
                // });
                Download(keys);
            }
        });
    }

    function getDownloadKeys() {
        var $files = $('.files'),
            cloudUrl = $('#cloud-url').val(),
            keys = [],
            $checkedInput = $files.find('input:checked');
        $checkedInput.each(function() {
            var $check = $(this);
            keys.push({
                url: cloudUrl + $check.data('key'),
                name: $check.next().find('span').text()
            });
        });
        return keys;
    }

    return {
        initDownload: initDownload
    };

});
