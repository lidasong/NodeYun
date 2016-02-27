require([
    'jquery',
    'modules/connect/peer-connect'
], function($, peertc) {
    'use strict';
    var peer, connector;
    peer = peertc.initPeertc('mb1000', customPeerEvent());
    connector = peer.connect('pc1000');
    initControlEvent();

    function initControlEvent() {
        var $control = $('.controls');
        $control.on('click', 'div', function(evt) {
            var dir = this.className;
            connector.send(dir);
        });
    }

    function customPeerEvent() {
        var options = {
            'open': onOpen,
            'close': onClose
        };
        return options;
    }

    function onOpen() {
        var $signal = $('.connect-signal'),
        	pingInterval = 100*1000;
        $signal.css('background-color', '#51cf51');
        pingMessage(pingInterval);
    }

    function onClose() {
        var $signal = $('.connect-signal');
        $signal.css('background-color', '#EC3535');
    }

    function pingMessage(interval) {
        setInterval(function() {
            connector.send('ping');
        }, interval || 1000 * 100);
    }

});
