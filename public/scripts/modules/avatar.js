define([
    'jquery'
],function($){

    'use strict';
    
    function initUploadAvatar() {
        var $spinnerContainer = $('.spinnerContainer-container'),
            url = '/upload',
            formData = new FormData(),
            $file = $('#avatar');
        $file.on('change',function(evt){
            formData.append('files',evt.target.files[0])
            formData.append('name','avatar');
            $spinnerContainer.show();
            $.ajax({
                url:'/upload/avatar',
                type:'post',
                contentType:false,
                processData:false,
                data:formData
            }).done(function(res){
                $spinnerContainer.hide();
                $('.avatar>img').attr('src',res[0]+'?imageView2/1/w/160/h/160');
            }).fail(function(err){
                $spinnerContainer.hide();
                console.log(err);
            });
        });
    }
    return {
        initAvatar:initUploadAvatar
    };
});