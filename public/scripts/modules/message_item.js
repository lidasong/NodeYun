define([
	'jquery'
],function($){
	'use strict';

	function initTabEvent(){
		var $tabs = $('.nav-tabs');
		$tabs.on('click.tab','.tab',function(evt){
			var type;
			if($(this).find('.badge').text()){
				type = $(this).data('type');
				clearUnread(type);
			}else{
				return;
			}
		});
	}

	function loadEvent(){
		var $activeTab = $('.nav-tabs').find('.active'),
			type;
		if($activeTab.find('.badge').text()){
			type = $activeTab.data('type');
			clearUnread(type);
		}
	}

	function clearUnread(type){
		$.ajax({
			url:'/messages',
			type:'post',
			data:{
				type:type
			}
		}).done(function(resp){
			console.log(resp);
		}).fail(function(err){
			console.log(err);
		});
	}

	function initMsgTab(){
		loadEvent();
		initTabEvent();
	}

	return {
		initMsgTab:initMsgTab
	};
});