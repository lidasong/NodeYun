define([
	'jquery',
	'EJS'
],function($,EJS){
	
	'use strict';

	var userId = $('#user-id').val(),
		$currentComment;

	function initComment(socket){
		var $shares = $('.shares');
		$shares.on('click.comment','.comment',function(evt){
			var shareId;
			$currentComment = $(this);
			$currentComment.parent().find('.comment-textarea').slideToggle();
			shareId = $currentComment.parents('.share').data('sid');
			getComments($currentComment,shareId);
		});	
        
        $shares.on('click.submit','.btn-comment',function(evt){
        	var $self = $(this),
        		comment = $self.prev().find('textarea').val(),
        		shareId = $self.parents('.share').data('sid'),
        		receiver = $self.parents('.share-info').data('user');
        	if(!comment.trim()){
        		return;
        	}
        	socket.emit('comment',{
        		comment:escapeXss(comment),
        		user_id:userId,
        		share_id:shareId,
        		receiver:receiver
        	});
        });

        $shares.on('keyup.desc','.description',function(evt){
        	if(evt.ctrlKey&&evt.which==13){
        		$(this).next().trigger('click.submit');
        	}
        });
	}

	function initShareComment(socket){
		var $form = $('form.answer');
        $currentComment = $('.divider');
        getComments($currentComment,$form.find('#share-id').val());
        $form.on('submit',function(evt){
        	var $self = $(this),
        		comment = $self.find('#markItUp').val(),
        		shareId = $self.find('#share-id').val(),
        		receiver = $self.find('#receiver-id').val();
        	evt.preventDefault();
        	if(!comment.trim()){
        		return;
        	}
        	socket.emit('comment',{
        		comment:escapeXss(comment),
        		user_id:userId,
        		share_id:shareId,
        		receiver:receiver
        	});
        });

        $form.on('keyup','#markItUp',function(evt){
        	if(evt.ctrlKey&&evt.which==13){
        		$(this).trigger('submit');
        	}
        });
	}

	function escapeXss(espStr) {
		var escapeObject = {
		    '&': '&amp;',
		    '<': '&lt;',
		    '>': '&gt;',
		    '"': '&quot;',
		    "'": '&#x27;',
		    '/': '&#x2F;'
		},
		escapeReg = new RegExp('[' + Object.keys(escapeObject).join('') + ']','g');
	    return espStr.replace(escapeReg,function(match){
	        return escapeObject[match];
	    });
	}

	function renderComment(comments){
        var templateUrl = 'views/templates/comment_item.ejs',
        	html = '';
		comments.s_avatar = $('.avatar').find('img').attr('src');

		html += new EJS({
		    url: templateUrl
		}).render({
		    comments: [comments]
		});
		$currentComment.parent().find('.comment-list').append(html);
		$currentComment.siblings('.comment-textarea').find('textarea').val('');
	}

	function getComments($self,shareId){
		if($self.data('toggle')){
			return;
		}
		$.get('/api/comment/'+shareId).done(function(comments){
	        var templateUrl = 'views/templates/comment_item.ejs',
	        	html = '';
			html += new EJS({
			    url: templateUrl
			}).render({
			    comments: comments
			});
			$self.parent().find('.comment-list').append(html);
			$currentComment.data('toggle',true);
		}).fail(function(err){
			console.log(err);
		});
	}

	return {
		initComment:initComment,
		initShareComment:initShareComment,
		renderComment:renderComment
	}
});