require([
    'jquery',
    'modules/video',
    'img_view',
    'modules/file_download',
    'modules/comment',
    'modules/s_message',
    'modules/markItUpSet',
    'markitup',
    'modules/audio',
    'bootstrap_dropdown',
], function($, Video, ImageView, fileDownload,Comment,SocketMsg,Settings) {

    'use strict';

    Video.initVideo();

    ImageView.initImgView();

    fileDownload.initDownload();

    $('#markItUp').markItUp(Settings);

    var socket = SocketMsg.initWsSocket();

    Comment.initShareComment(socket);
});
