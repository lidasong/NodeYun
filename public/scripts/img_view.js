define([
    'jquery',
    'EJS',
    'ImageViewer'
], function($, EJS) {

    'use strict';

    var iviewer,
        baseUrl = $('#cloud-url').val();

    function initThumbnails() {
        $('.thumbnail').each(function() {
            $(this).find('img').attr('src', $(this).data('src'));
        });
    }

    function renderThumbnail($parentImg) {
        var imgs = [],
            html;
        $parentImg.find('.image').each(function(img, index) {
            imgs.push({
                key_original: $(this).data('src')
            });
        });
        html = new EJS({
            url: 'views/templates/thumbnails.ejs'
        }).render({
            imgs: imgs
        });
        $('.thumb-wrap').children('.thumbnails').remove().end().append(html);
    }

    function initLoad(src) {
        $("#viewer").iviewer({
            src: src,
            initCallback: function() {
                iviewer = this;
            },
            ui_disabled: true,
            zoom_max: 200,
            onStartLoad: function() {
                $('.spinner').show();
                this.img_object.object.css('opacity', 0);
            },
            onFinishLoad: function() {
                $('.spinner').hide();
                this.img_object.object.css('opacity', 1);

            },
            // onZoom: function() {
            //     var percent = Math.round(100 * this.img_object.display_height / this.img_object.orig_height);
            //     $('.zoom').text(percent).fadeIn(function() {
            //         $('.zoom').fadeOut(1000);
            //     });
            // }
        });
    }

    function init() {
        initThumbnailEvent();

        initControlEvent();

        initImgWrapper();

    }

    function initThumbnailEvent() {
        $('.thumb-wrap').on('click', '.thumbnail', function(evt) {
            var $self = $(this),
                original_src = $self.data('src'),
                targetIndex = $self.index(),
                left = parseInt($('.thumbnails').css('left')),
                currentIndex = $('.thumbnails').data('target');
            iviewer.loadImage(original_src);
            $('.thumbnails').css('left', left + (currentIndex - targetIndex) * 84 + 'px').data('target', targetIndex);
        });
        $('.thumbnail-toggle').click(function(evt) {
            var hasClosed = $(this).hasClass('closed');
            if (hasClosed) {
                $(this).removeClass('closed').parent().css('bottom', 0);
            } else {
                $(this).addClass('closed').parent().css('bottom', '-86px');
            }
        });
    }

    function initControlEvent() {
        $('.controll-right').on('click', function(evt) {
            var left = parseInt($('.thumbnails').css('left')),
                currentIndex = $('.thumbnails').data('target'),
                original_src = $('.thumbnail').eq(currentIndex + 1).data('src');
            if (currentIndex >= $('.thumbnail').length - 1) {
                return;
            }
            $('.thumbnails').animate({
                'left': left - 84 + 'px'
            }, function() {
                iviewer.loadImage(original_src);
            }).data('target', currentIndex + 1);
        });
        $('.controll-left').on('click', function(evt) {
            var left = parseInt($('.thumbnails').css('left')),
                currentIndex = $('.thumbnails').data('target'),
                original_src = $('.thumbnail').eq(currentIndex - 1).data('src');
            if (currentIndex <= 0) {
                return;
            }
            $('.thumbnails').animate({
                'left': left + 84 + 'px'
            }, function() {
                iviewer.loadImage(original_src);
            }).data('target', currentIndex - 1);
        });
    }

    function initImgWrapper() {
        $('.wrapper-close').click(function(evt) {
            $('body').css('overflow','auto');
            $(this).parent().hide();
        });

        $('.files').on('click', '.select', function(evt) {
            evt.stopPropagation();
        });

        $('.files').on('click', '.image', function(evt) {
            var index = $(this).parent().find('.image').index(this),
                src = $(this).data('src');
            evt.preventDefault();

            $('.wrapper').show();
            //禁止滚动，避免滚动加载
            $('body').css('overflow','hidden');

            renderThumbnail($(this).parent());
            if (!iviewer)
                initLoad(baseUrl + src);
            else {
                iviewer.loadImage(baseUrl + src);
            }
            var left = parseInt($('.thumbnails').css('left')),
                currentIndex = $('.thumbnails').data('target');
            $('.thumbnails').css('left', left + (currentIndex - index) * 84 + 'px').data('target', index);
            $('.thumbnails').data('target', index);
        });
    }

    return {
        initImgView: init
    };
});
