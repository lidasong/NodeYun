define([
	'jquery',
	'peertc',
    'modules/constant',
],function($,Peertc,Const){
	'use strict';

	var peertc,connector;
	function initPeertc(peerId,options){
		peertc = Peertc(Const.connect,peerId);
		initPeertcEvent(peertc,options);
		return peertc;
	}

	function initPeertcEvent(peertc,options){
		var peertcEvents = {
			'open':onOpen,
			'close':onClose,
			'message':onMessage,
			'error':onError
		};
		if(options)
			$.extend(peertcEvents,options);
		for(var event in peertcEvents){
			peertc.on(event,peertcEvents[event]);
		}
	}
	
	function onOpen(connectId){
		connector = peertc.connectors[connectId];
		return connector;
	}

	function onClose(connectId){
	}

	function onMessage(data,from){
		console.log('datachannel:',data);
	}

	function onError(err){
		console.error(err);
	}
	return {
		initPeertc:initPeertc
	}
});