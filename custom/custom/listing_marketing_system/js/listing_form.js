(function($) {
	Drupal.behaviors.listing_form = {
		attach: function (context, settings) {
			$('#edit-field-lms-listing-address-und-0-value, #edit-field-lms-listing-city-und-0-value, #edit-field-lms-listing-state-und-0-value, #edit-field-lms-listing-zip-und-0-value', context).on('blur', function(){ 
				var address = (0 === $('#edit-field-lms-listing-address-und-0-value').val().length) ? '' : $('#edit-field-lms-listing-address-und-0-value').val() + ', ';
				var city = (0 === $('#edit-field-lms-listing-city-und-0-value').val().length) ? '' : $('#edit-field-lms-listing-city-und-0-value').val() + ', ';
				var state = (0 === $('#edit-field-lms-listing-state-und-0-value').val().length) ? '' : $('#edit-field-lms-listing-state-und-0-value').val() + ', ';
				var zip = (0 === $('#edit-field-lms-listing-zip-und-0-value').val().length) ? '' : $('#edit-field-lms-listing-zip-und-0-value').val();
				var full_address = address + city + state + zip;
				$('#edit-field-lms-gps-coordinates-und-0-address-field').val(full_address);
				$('.geolocation-address-geocode').click();
			});
		}
	};
})(jQuery);
