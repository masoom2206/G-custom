(function($, Drupal, drupalSettings){
  'use strict';

  Drupal.behaviors.common = {
    attach: function(context, settings) {
      // Remove UID's onload.
			var $eref = jQuery('#edit-entity-id-0-target-id', context);
      console.log('test1');
      console.log($eref);
			if($eref.val()){
				 remove_uid();
			}
      // Remove TID's onchange.
      //jQuery('body').find('.form-autocomplete').on('autocompleteclose', function() {
      jQuery('body').find('.form-autocomplete').on('autocompleteclose', function() {
         console.log('test');
         remove_uid();
      }).closest('form').submit(function(e){
				// On form submit, set the value back to the stored value with id
				$eref.val($eref.attr('real-value'));
			});
    }
  };
	
	function is_numeric(val){
    return val && /^-?\d+(\.\d+)?$/.test(val + '');
	}

	function remove_uid() {
		var field_autocomplete = jQuery('body').find('.form-autocomplete');
		field_autocomplete.each(function (event, node) {
			var match = '';
			var label = '';
			var val = jQuery(this).val();
			var original_val = val;
			var match = parseInt(val.match(/\d+/),10);
			var newString = val.match(/[a-zA-Z]+/g);
      console.log('match'+match);
      console.log('newString'+newString);
      console.log('length'+newString.length);
			if(newString.length == 4){
				var label = newString[0] +' '+ newString[1];
				newString = newString.splice(2,2);
				label += ' (' + newString.join(', ') + ')';
			} else if(newString.length == 3){
				var label = newString[0] +' '+ newString[1];
				newString = newString.splice(2,1);
				label += ' (' + newString.join(', ') + ')';
			} else if(newString.length == 2){
				var label = newString[0] +' '+ newString[1];
			} else if(newString.length == 1){
				var label = newString[0];
			}else if(newString.length == 6){
        var label = newString[0] +' '+ newString[1];
				newString = newString.splice(3,3);
				label += ' (' + newString.join(', ') + ')';
      }else if(newString.length == 5){
        var label = newString[0] +' '+ newString[1];
				newString = newString.splice(2,3);
				label += ' (' + newString.join(', ') + ')';
      }
			console.log(label);
			if (is_numeric(match)){
				jQuery(this).attr('real-value', original_val.trim());
				if(label !== 'undefined' || label !== ''){
					jQuery(this).val(label.trim());
				}
			}
		});
	}
	
	/* jQuery("#group_content_team-group_membership_add_form").submit(function() {
		var original_val = jQuery('#member-id-autocomplete').val();
		console.log(original_val);
		jQuery("#edit-entity-id-0-target-id").val(original_val);
	}); */
})(jQuery, Drupal, drupalSettings);