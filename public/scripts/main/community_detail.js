require([
    'jquery',
    'EJS',
    'modules/markItUpSet',
    'markitup',
    'bootstrap_dropdown',
    'jQuery_ImageViewer'
], function($, EJS, Settings) {

    'use strict';

    $('#markItUp').markItUp(Settings);

    initAnswer();

    $('.content img').viewImage();

    function initAnswer() {
        $('.answer').on('submit', function(evt) {
            var data = $(this).serialize();
            evt.preventDefault();
            sendCommunity(data);
        });
    }

    function sendCommunity(data) {
        var comId = $('#com-id').val(),
            $submit = $('#submit');
        $submit.attr('disabled', true);

        $.ajax({
            url: '/community/' + comId,
            type: 'post',
            data: data
        }).done(function(answerHTML) {
            renderAnswer(answerHTML);
            $('#markItUp').val('');
        }).fail(function(err) {
            console.log(err);
        }).always(function() {
            $submit.attr('disabled', false);
        });
    }

    function renderAnswer(answer) {
        var $answerList = $('.answer-list>ul');
        $answerList.append(answer);
    }
});
