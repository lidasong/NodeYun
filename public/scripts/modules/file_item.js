define([
    'jquery',
    'modules/file_delete',
    'modules/file_download',
    'modules/file_share',
    'EJS'
], function($, fileDelete, fileDownload, fileShare, EJS) {

    'use strict';

    function initFolderCreate() {
        var $btnCreateFolder = $('.btn-create'),
            userId = $('#user-id').val(),
            parentId = $('#parent-id').val();
        $btnCreateFolder.on('click.create', function(evt) {
            var folder;
            folder = {
                file_name: '新文件夹',
                owner_id: userId,
                parent_id: parentId
            };
            createFolder(folder);
        });
    }

    function createFolder(folderData) {
        var templateUrl = 'views/templates/file_item.ejs';
            $.ajax({
                url: '/api/file/folder',
                type: 'post',
                data: folderData
            }).done(function(result) {
                var $firstFile = $('.files li:first-child'),
                    fileItem;
                result.mod_time = new Date();
                fileItem = new EJS({
                    url: templateUrl
                }).render({
                    file: result
                });
                $firstFile.after(fileItem);
            }).fail(function(err) {
                console.log(err);
            });
    }

    function initFileEidt() {
        var userId = $('#user-id').val(),
            $files = $('.files');
        $files.on('click.edit', '.file-edit', function(evt) {
            $(this).parent().hide().next().show().focus();
        }).on('keyup.text', '.file-text', function(evt) {
            if (evt.which ==13) {
                updateFileName($(this));
            }
        })
    }

    function updateFileName($file){
        var u_id = $file.parents('.file').data('uid'),
            fileName = $file.val();
        $.ajax({
            url: '/api/file/' + u_id,
            type: 'put',
            data: {
                file_name: fileName
            }
        }).done(function(res) {
            $file.hide().prev().show().find('a span').text(fileName);
        }).fail(function(err) {
            console.log(err);
        });
    }

    function init() {
        initFileEidt();
        initFolderCreate();
        fileDelete.initDelete();
        fileDownload.initDownload();
        fileShare.initShare();
    }

    function renderFileItem(results) {
        var templateUrl = '/views/templates/file_item.ejs',
            $firstFile = $('.files li:first-child'),
            html = '';
        if(!Array.isArray(results)){
            $('.tip-error').show().delay(2000).hide();
            return;
        }
        results.forEach(function(file, index) {
            file.mod_time = new Date();
            html += new EJS({
                url: templateUrl
            }).render({
                file: file
            });
        });
        $firstFile.after(html);
    }
    return {
        init: init,
        renderFileItem: renderFileItem
    };
});
