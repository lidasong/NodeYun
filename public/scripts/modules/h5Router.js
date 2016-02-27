define([
    'jquery',
    'EJS'
], function($,EJS) {

    'use strict';

    var templateUrl;

    function init(container, templateUrl) {
        var $container = $(container);
        templateUrl = templateUrl;
        $container.on('click', '.router', function(evt) {
            var router = $(this).attr('href');
            evt.preventDefault();
            history.pushState({
                router: router
            }, '', router);
            routerChangeRender(router);
        });
        initH5Router();
    }


    function routerChangeRender(router) {
        var html;
        $.get(router, {
            router: true
        }).done(function(resp) {
            html = new EJS({
                url: templateUrl
            }).render({
                shares: resp
            });
            $('.shares').html(html);
        }).fail(function(err) {
            console.log('err type:', err.error_type);
        });
    }

    function initH5Router() {
        window.addEventListener('popstate', function(evt) {
            var routerUrl = evt.state.router;
            routerChangeRender(routerUrl);
        })
    }
    return {
        initRouter: init
    };
});
