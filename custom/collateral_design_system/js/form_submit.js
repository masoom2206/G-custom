/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function($) {
  Drupal.ajax.prototype.commands.afterAjaxCallbackExample = function(ajax, response, status) {
    //Now this is a tag's class outside of my form that I like to change/update
				var uploader = $('#edit-image-file').pluploadQueue();
				var uploader2 = $('#edit-image-file2').pluploadQueue();
				uploader.splice();
				uploader.refresh();
				uploader2.splice();
				uploader2.refresh();
				$('.plupload_buttons').show();
				$("#property-ads-form")[0].reset();
				$("#property-ads-form-pdf")[0].reset();
				$('#custom-canvas-confirm-popup').css('display', 'none');
				$('#custom-canvas-confirm-popup2').css('display', 'none');
				$('.page-setting-contents :input').attr('disabled', false);
				$('#canvas-wrapper-main').css('display', 'block');
  };
}(jQuery));

(function ($) {
	$(document).ready(function() {
		$("#property-ads-form #edit-submit").prop('disabled', true);
		var uploader = $('#edit-image-file').pluploadQueue();
			uploader.bind('UploadComplete', function() {
				$("#property-ads-form #edit-submit").prop('disabled', false);
		});
		$("#property-ads-form-pdf #edit-submit--2").prop('disabled', true);
		var uploader2 = $('#edit-image-file2').pluploadQueue();
			uploader2.bind('UploadComplete', function() {
				$("#property-ads-form-pdf #edit-submit--2").prop('disabled', false);
		});
	});
	
}(jQuery));

