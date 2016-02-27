define([
    'jquery',
    'videoJS'
], function($, Video) {
    'use strict';

    var $videoOverlay = $('.video-overlay'),
        cloudUrl = $('#cloud-url').val();


    function initOverlay() {
        $videoOverlay.click(function() {
            var video;
            video = Video.getPlayers()['video'];
            video.pause();
            $(this).hide();
            $(video.el_).hide();
        });
    }

    function initVideo() {
        var video;
        video = Video.getPlayers()['video'];
        
        $('.files').on('click.video', '.video', function(evt) {
            var targetUrl = this.getAttribute('href');
            evt.preventDefault();
            video.src([{
                type: "video/mp4",
                src: cloudUrl + targetUrl
            }, {
                type: 'video/ogg',
                src: cloudUrl + targetUrl
            }, {
                type: 'video/webm',
                src: cloudUrl + targetUrl
            }]).autoplay(true);
            $videoOverlay.show();
            $(video.el_).show();
        });
    }

    function init(){
        initOverlay();
        initVideo();
    }

    return {
        initVideo:init
    };

});
