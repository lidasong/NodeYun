require([
	'jquery',
	'modules/connect/peer-connect',
	'reveal'
],function($,peertc){
	'use strict';

    var peer = peertc.initPeertc('pc1000');
    
    initMove();
    
	Reveal.initialize({
	    controls: false,
	    progress: true,
	    history: true,
	    center: true,

	    theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
	    transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/concave/zoom/linear/fade/none

	});

	function initMove(){
		peer.on('message',function(data,from){
			switch(data){
				case 'up':
					Reveal.up();
				break;
				case 'down':
					Reveal.down();
				break;
				case 'left':
					Reveal.left();
				break;
				case 'right':
					Reveal.right();
				break;
				default:
				break;
			}
		});
	}
});