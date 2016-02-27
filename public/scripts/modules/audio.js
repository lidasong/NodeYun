define([
    'jquery',
    'audio5'
], function($, Audio) {
    'use strict';

    var cloudUrl = $('#cloud-url').val(),
        audioPlayer;

    init();

    function init() {

        audioPlayer = initAudio();

        initAudioEvent(audioPlayer);
        initEvent(audioPlayer);
        initMusicBtnEvent();
    }

    function initAudio() {
        return new Audio({
            use_flash: false,
            throw_errors: false,
            format_time: false,
            volume: .9
        });
    }

    function initEvent(player) {
        $('.files').on('click.audio', '.audio', function(evt) {
            var key,audioName;
            evt.preventDefault();
            if($(this).hasClass('active')){
                audioPlayer.play();
                $('.music').show().find('.btn-play').hide().end().find('.btn-pause').show();
                return;
            }
            audioName = $(this).find('span').text();
            $('.music-name').text(audioName);
            $('.audio').removeClass('active');
            key = $(this).addClass('active').attr('href');
            $('.music').show();
            //audio5js bug修复
            player.playing = false;
            player.load(cloudUrl + key);
        });
    }

    function initAudioEvent(player) {
        player.on('load', function() {
            player.play();
            $('.music').find('.time').text(formatTime(player.duration));
        });
        player.on('ended', function() {
            next();
        });
        player.on('timeupdate', function(position, duration) {
            var percent = position / duration * 100 + '%';
            $('.bar-played').width(percent);
        });
        player.on('error',function(){
            next();
        });
    }


    function next() {
        var $next = $('.audio.active');
        if (!$next.parents('.file').next('.file').length) {
            return;
        }
        $next = $next.removeClass('active').
        parents('.file').next();
        if(!$next.has('.audio').length)
            return;
        $('.music-name').text($next.find('span').text());
        audioPlayer.playing = false;

        audioPlayer.load(cloudUrl + $next.find('.audio').addClass('active').attr('href'));
    }

    function prev() {
        var $prev = $('.audio.active');
        if (!$prev.parents('.file').prev('.file').length) {
            return;
        }
        $prev = $prev.removeClass('active').
        parents('.file').prev();

        if(!$prev.has('.audio').length)
            return;
        
        $('.music-name').text($prev.find('span').text());

        audioPlayer.playing = false;

        audioPlayer.load(cloudUrl + $prev.find('.audio').addClass('active').attr('href'));
    }

    function initMusicBtnEvent() {
        var $barProgress = $('.bar-progress'),
            $volume = $('.bar-sound');

        $barProgress.on('click.progress', function(evt) {
            var offsetX = $(this).offset().left,
                progressX = evt.clientX,
                positionX = progressX - offsetX,
                playBarWidth = $('.bar-progress').width(),
                audioBarWidth = $('.bar-sound-val').width();
            audioPlayer.seek(positionX / playBarWidth * audioPlayer.duration);;
        });

        $volume.on('click.volume', function(evt) {
            var offsetX = $(this).offset().left,
                volumeX = evt.clientX,
                positionX = volumeX - offsetX,
                volumeBarWidth = $volume.width(),
                percent = positionX / volumeBarWidth,
                isMute = $('.volume').data('mute');
            if(isMute){
            	$('.volume > .fa').toggleClass('fa-volume-off fa-volume-up')
            	.data('mute',false);
            }    
            $('.bar-sound-val').width(percent * 100 + '%');
            audioPlayer.volume(percent);
        });

        $('.btn-prev').on('click.prev', function() {
            prev();
        });
        $('.btn-next').on('click.prev', function() {
            next();
        });
        $('.btn-pause').on('click.pause', function() {
            $(this).hide();
            $('.btn-play').show();
            audioPlayer.pause();
        });
        $('.btn-play').on('click.play', function() {
            $(this).hide();
            $('.btn-pause').show();
            audioPlayer.play();
        });
        $('.music-down').on('click.down', function() {
            $('.music').slideUp();
        });

        //静音按钮
        $('.volume').on('click',function(evt){
        	var isMute = $(this).data('mute');
        	if(isMute){
        		audioPlayer.volume(0.9);
		    	$('.bar-sound-val').width('90%');
    	    	$(this).data('mute',false).find('.fa').toggleClass('fa-volume-off fa-volume-up');
        	}else{
    			audioPlayer.volume(0);
    	    	$('.bar-sound-val').width(0);
    	    	$(this).data('mute',true).find('.fa').toggleClass('fa-volume-off fa-volume-up');
        	}
        });
    }

    function formatTime(seconds) {
        var hours = parseInt(seconds / 3600, 10) % 24;
        var minutes = parseInt(seconds / 60, 10) % 60;
        var secs = parseInt(seconds % 60, 10);
        var result, fragment = (minutes < 10 ? "0" + minutes : minutes) + ":" + (secs < 10 ? "0" + secs : secs);
        if (hours > 0) {
            result = (hours < 10 ? "0" + hours : hours) + ":" + fragment;
        } else {
            result = fragment;
        }
        return result;
    }

});
