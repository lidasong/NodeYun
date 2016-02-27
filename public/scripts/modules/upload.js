define([
    'jquery',
    'modules/plupload'
], function($, plup) {

    'use strict';
    function initUpload(cb, options) {
        cb = cb || function() {};
        options = options || {};
        $.extend(options,{
            cb:cb
        });
        plup.initUploader(options);
    }

    return {
        init: initUpload
    };
});
