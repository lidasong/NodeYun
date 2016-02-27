define([
    'jquery'
], function($) {

    'use strict';

    function initShare() {
        var $btnShare = $('.btn-share');
        $btnShare.on('click', function(evt) {
            var shareUids;
            shareUids = getUids();
            if (!shareUids.length) {
                return;
            }
            $btnShare.attr('disabled',true);
            share(shareUids);
        });
    }

    function getUids() {
        var shareUids = [],
            $files = $('.files'),
            $checkedInput = $files.find('input:checked');
        $checkedInput.each(function() {
            var $checked = $(this);
            shareUids.push($checked.val());
        });
        return shareUids;
    }

    function cancleChecked(){
        var $checkedInput = $('.files').find('input:checked');
        $checkedInput.attr('checked',false);
    }

    function share(shareUids) {
        $.ajax({
            url: '/share',
            type: 'post',
            data: {
                'uIds': shareUids
            }
        }).done(function(resp) {
            shareSuccessTip();
        }).fail(function(err) {
            console.log(err);
            shareFailTip();
        }).always(function(){
            $('.btn-share').attr('disabled',false);
        });
    }

    function shareSuccessTip() {
        $('.tip-share').text('分享成功').fadeIn().delay(2000).fadeOut();
        cancleChecked();
    }

    function shareFailTip() {
        $('.tip-share').text('分享出错,尝试再试一次').fadeIn().delay(2000).fadeOut();
    }

    return {
        initShare: initShare
    };

});
