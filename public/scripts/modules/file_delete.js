define([
    'jquery'
], function($) {

    'use strict';

    function initDelete() {
        var $btnDelete = $('.btn-delete');
        $btnDelete.on('click', function(evt) {
            var data;
            data = getAjaxData();
            deleteFile(data);
            $(this).attr('disabled',true);
        });
    }

    function deleteFile(data) {
        $.ajax({
            url: '/upload',
            type: 'delete',
            data: data
        }).done(function(resp) {
            successRemove();
        }).fail(function(err) {
            console.log(err);
        }).always(function(){
            $('.btn-delete').attr('disabled',false);
        });
    }

    function successRemove() {
        var $files = $('.files'),
            $checkedInput = $files.find('input:checked');
        $checkedInput.parents('.file').remove();
    }

    function getAjaxData() {
        var $files = $('.files'),
            deleteUids = [],
            keys = [],
            folder = [],
            $checkedInput = $files.find('input:checked');
        $checkedInput.each(function() {
            var $checked = $(this);
            if($checked.next().hasClass('folder')){
                folder.push($checked.val());
                return ;
            }
            deleteUids.push($checked.val());
            keys.push($checked.data('key'));
        });
        return {
            uIds: deleteUids,
            keys: keys,
            folder:folder
        };
    }

    return {
        initDelete: initDelete
    };

});
