define([
	'jquery'
],function($){

	var ImageViewer = function(element){
		var naturalHeight,
			naturalWidth;
		this.$element = $(element);
		this.naturalWidth = element.naturalWidth;
		this.naturalHeight = element.naturalHeight;
		this.$viewerContainer = $('.viewer-container');
		this.$viewerContainer.on('click',this.hide.bind(this));
		this.$element.on('click',this.show.bind(this));
	};

	ImageViewer.prototype.show=function(){
		this.$viewerContainer.empty()
			.css({
				'zIndex':1,
				'height':this.naturalHeight+'px'
			}).append(this.$element.get(0).outerHTML)
			.show().find('img').css({
				'cursor':'zoom-out',
				'maxHeight':'100%'
			});
	};

	ImageViewer.prototype.hide=function(){
		this.$viewerContainer.empty().hide();
	};

	function Plugin(){
		var $viewerContainer = $('<div class="viewer-container"></div>');
		$viewerContainer.css({
			position:'fixed',
			left:0,
			right:0,
			top:0,
			bottom:0,
			margin:'auto',
			'textAlign':'center',
			'maxHeight':'100%',
			'maxWidth':'100%',
			'zIndex':-1
		});
		$viewerContainer.appendTo(document.body);
		return this.each(function(){
			new ImageViewer(this);
		});
	}

	$.fn.viewImage = Plugin;

});