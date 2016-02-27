define([
    'jquery',
    'qiniu',
    'plupload'
], function($, Qiniu) {

    'use strict';

    function initUploader(options) {
        var defaultOptions = {
                runtimes: 'html5,flash,html4',
                browse_button: 'pickfiles',
                container: 'upload-file',
                max_file_size: '100mb',
                flash_swf_url: '../libs/plupload/Moxie.swf',
                dragdrop: true,
                // chunk_size: '4mb',
                uptoken_url: '/upload/uptoken',
                domain: $('#cloud-url').val(),
                get_new_uptoken: false,
                auto_start: true,
                unique_names: false,
                save_key: false,
                init: {
                    'FilesAdded': function(up, files) {

                    },
                    'BeforeUpload': function(up, file) {
                        $('.progress').show();
                    },
                    'UploadProgress': function(up, file) {
                        $('.progress').width(this.total.percent + '%');
                    },
                    'UploadComplete': function(up, files) {
                        var filesData = [];
                        $('.progress').hide().width(0);
                        files.forEach(function(file) {
                            if (file.key) {
                                filesData.push(stringifyFile(file));
                            }
                        });
                        if (filesData.length) {
                            syncDatabase({
                                files: filesData
                            }, options.cb);
                        }
                        up.splice();
                    },
                    'FileUploaded': function(up, file, info) {
                        file.key = JSON.parse(info)['key'];
                    },
                    'Error': function(up, err, errTip) {
                        $('.file-err').text(errTip).fadeIn().delay(2000).fadeOut();
                        console.log(err);
                    },
                    'Key': function(up, file) {
                        var key = Date.now() + '/' + file.name;
                        return key
                    }
                }
            };
        $.extend(defaultOptions, options);
        return window.uploader = Qiniu.uploader(defaultOptions);
    }

    function syncDatabase(files, callback) {
        var $transformSpinner = $('.transform-spinner');
        if (!files.files) {
            return;
        }
        $transformSpinner.show();
        $.ajax({
            url: '/upload',
            type: 'post',
            data: files
        }).done(function(resp) {
            callback(resp);
        }).fail(function(err) {
            console.log(err);
            $('.tip-error').fadeIn().delay(2000).fadeOut();
        }).always(function() {
            $transformSpinner.hide();
        });
    }

    function stringifyFile(file) {
        var parentId = $('#parent-id').val(),
        fileData = {
            parent_id: parentId,
            type: file.type,
            file_name: file.name,
            file_size: file.size,
            mime_type: file.type,
            key_original: file.key
        };
        return JSON.stringify(fileData);
    }

    return {
        initUploader: initUploader
    }
});
