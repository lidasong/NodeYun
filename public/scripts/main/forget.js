require([
    'jquery',
    'MD5'
], function($) {

    'use strict';

    function resetPassword(){
    	var password  = $('#password').val(),
    		confirm = $('#confirm').val(),
    		resetKey = $('#key').val();
    	$.ajax('/reset', {
    	    type: 'post',
    	    data: {
    	    	password:md5(password),
    	    	confirm:md5(confirm),
    	    	resetKey:resetKey
    	    }
    	}).done(function(res){
    		location.href='/sign_in'
    	}).fail(function(err){
    		$('.msg').text('修改不成功,请重试(>^ω^<)');
    	});
    }

    function sendEmail(){
    	var $msg = $('.msg'),
    		$btnSubmit = $('#sign').find('.btn-submit');
    	$btnSubmit.attr('disabled', 'disabled');
    	$.ajax('/forget', {
    	    type: 'post',
    	    data: $('#sign').serialize(),
    	}).then(function(res) {
    	    if (res.type) {
    	        $msg.text('邮件已发送,请查收');
    	    } else {
    	        $msg.text('邮件未能成功发送,请重试');
    	    }
    	}).catch(function(err){
            $msg.text('邮件未能成功发送,请重试');
        }).always(function() {
    	    $btnSubmit.removeAttr('disabled');
    	});
    }

    $(function() {
        var $btnSubmit = $('#sign').find('.btn-submit'),
            emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            email;
        $btnSubmit.on('click', function(evt) {
            if ($('#key').val()) {
            	resetPassword();
            } else {
                email = $('#email').val();
                if (!emailReg.test(email)) {
                    $('.tip-error').show();
                    return false;
                }
                sendEmail();
            }
            return false;
        });

        $('#email').focus(function(evt) {
            $('.tip-error').hide();
            $btnSubmit.removeAttr('disabled');
        });
    });

});
