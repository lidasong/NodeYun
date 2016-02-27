require([
	'jquery',
	'MD5',
	'bootstrap_dropdown'
],function($,MD5){
	$(function(){
		var emailReg =  /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
			password,
			email;
		$('#sign').on('submit',function(){
			email = $(this).find('#email').val();
			if(!emailReg.test(email)){
				$('.tip-error').show();
				return false;
			}
			password = $(this).find('#password').val();
			$(this).find('#password').val(md5(password));
			return true;
		});
		$('#email').focus(function(evt){
			$('.tip-error').hide();
		});
	});
});

