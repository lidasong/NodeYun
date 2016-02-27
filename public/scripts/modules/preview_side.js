define(['jquery', 'EJS', 'jQuery_Lazyload'], function($, EJS) {
    var $ppt = $('#ppt'),
    	$pptThumbnail = $('#ppt-thumbnail');
    function initPPTThumbnail(data,ppt) {
        html = new EJS({
            url: 'views/templates/preview/side.ejs'
        }).render({
            thumbnails: data
        });
        $pptThumbnail.append(html);
        $('img.ppt-thumbnail').lazyload({
            threshold: 200
        });
        initThumbnailClick(ppt);
    }

    function initThumbnailClick(ppt){
    	$pptThumbnail.on('click','li',function(evt){
    		var index=0;
    		$pptThumbnail.find('.active').removeClass('active')
    		$(this).toggleClass('active');
    		index = $(this).index('#ppt-thumbnail li');
    		ppt[0].PPT.pageJump(index);
    	});
    }
    return {
        initThumbnail: initPPTThumbnail
    };
});
