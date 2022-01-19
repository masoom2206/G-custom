	var media_base_url = drupalSettings.media_base_url;
	var uid = drupalSettings.uid;
	var name = drupalSettings.name;
	var email = drupalSettings.email;
	var avatar = drupalSettings.avatar;
	var product_group_url = media_base_url+"/kmds/product-group?_format=json";
	var access_check_api = 'https://api.kaboodlemedia.com/api/v1/';
  var user_id = 1;
  var API_KEY = '';
  var stage = layer = textarea = actionmode = MAX_WIDTH = MAX_HEIGHT = colorPickerDefaultInline = productId = producTypeId = producTypeName = cunit = productName = fileName = fName = '';
	var destroyTr = destroySelectedL = false;
  var design_id = getUrlDesignID();
  get_check_user_access(uid, name, email);

  var H_items = [
    { 'Name': 'File', 'MenuItem': [
      { 'Icon': '&nbsp;', 'Name': 'New Design', 'Shortcut': 'Alt+N', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'New Design from Template...', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'fa fa-save', 'Name': 'Save', 'Shortcut': 'Ctrl+S', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Save As', 'Shortcut': 'Shift+Ctrl+S', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'fa fa-history', 'Name': 'Show Version History', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Import', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': '&nbsp;', 'Name': 'Place Image...', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Link Image...', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Add Fonts...', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}
				]},			
			{ 'Icon': 'fa fa-sign-out', 'Name': 'Export', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': '&nbsp;', 'Name': 'Advanced Export...', 'Shortcut': 'Shift+Ctrl+E', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'PNG Image(.png)', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'JPEG Image(.jpg)', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Scalable Vector Graphics(.svg)', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'PDF Document(.pdf)', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
						{'Icon': '&nbsp;', 'Name': '72 dpi', 'Shortcut': '&nbsp;', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '96 dpi', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '150 dpi', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': '300 dpi', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': 'item-divider', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Advanced Options...', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;'},
					]},
				]},
			{ 'Icon': 'fa fa-print', 'Name': 'Print', 'Shortcut': 'Ctrl+P', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }
		]}, 
    { 'Name': 'Edit', 'MenuItem': [
      { 'Icon': 'fas fa-reply', 'Name': 'Undo', 'Shortcut': 'Ctrl+Z', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'fas fa-share', 'Name': 'Redo', 'Shortcut': 'Shift+Ctrl+Z', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'fa fa-cut', 'Name': 'Cut', 'Shortcut': 'Ctrl+X', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'fa fa-copy', 'Name': 'Copy', 'Shortcut': 'Ctrl+C', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Paste', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': 'fa fa-paste', 'Name': 'Paste', 'Shortcut': 'Ctrl+V', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Paste In Place', 'Shortcut': 'Shift+Ctrl+V', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Paste Inside Selection', 'Shortcut': 'Alt+Shift+Ctrl+V', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Paste Style', 'Shortcut': 'F4', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}
				]},			
			{ 'Icon': '&nbsp;', 'Name': 'Delete', 'Shortcut': 'Del', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Duplicate', 'Shortcut': 'Ctrl+D', 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Edit Selection', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Select All', 'Shortcut': 'Ctrl+A', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Deselect All', 'Shortcut': 'Shift+Ctrl+A', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Invert Selection', 'Shortcut': 'Shift+Ctrl+I', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Select by Font Type', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'fas fa-cog', 'Name': 'Settings...', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }
		]}, 
    { 'Name': 'Modify', 'MenuItem': [
      { 'Icon': '&nbsp;', 'Name': 'Arrange', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': '&nbsp;', 'Name': 'Bring to Front', 'Shortcut': 'Shift+Ctrl+Up', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'km-bring-forward fs-20', 'Name': 'Bring forward', 'Shortcut': 'Ctrl+Up', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'km-bring-backword fs-20', 'Name': 'Send Backward', 'Shortcut': 'Ctrl+Down', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Send to Back', 'Shortcut': 'Shift+Ctrl+Down', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}
				]},
			{ 'Icon': '&nbsp;', 'Name': 'Align', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': '&nbsp;', 'Name': 'Align Left', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Align Center', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Align Right', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Align Top', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Align Middle', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Align Bottom', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Same Width', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Same Height', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Distribute Horizontally', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Distribute Vertically', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Snap to Full Units', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Snap to Half Units', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}
				]},
			{ 'Icon': '&nbsp;', 'Name': 'Transform', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': 'item-divider', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': '&nbsp;', 'Name': 'Rotate 45° Left', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Rotate 90° Left', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Rotate 180° Left', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Rotate 45° Right', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Rotate 90° Right', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Rotate 180° Right', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, {'Icon': 'km-flip fs-26 fa-rotate-270 fa', 'Name': 'Flip Vertical', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': 'km-flip fs-26 fa-flip-horizontal', 'Name': 'Flip Horizontal', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}
				]},
			{ 'Icon': 'fas fa-object-group', 'Name': 'Group Selection', 'Shortcut': 'Ctrl+G', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'km-compound fs-20', 'Name': 'Create Compound', 'Shortcut': 'Ctrl+M', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'fa fa-adjust', 'Name': 'Clip Selection', 'Shortcut': '&nbsp;', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'fas fa-object-group', 'Name': 'Ungroup Selection', 'Shortcut': 'Shift+Ctrl+G', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Mask with Shape', 'Shortcut': 'Ctrl+Shift+M', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'fa fa-crop', 'Name': 'Confirm Cropping', 'Shortcut': '&nbsp;', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Cancel Cropping', 'Shortcut': '&nbsp;', 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Create Coumpound Shape', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': 'km-union fs-24', 'Name': 'Union', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'km-subtract fs-20', 'Name': 'Subtract', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'km-intersect fs-24', 'Name': 'Intersect', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': 'km-difference fs-20', 'Name': 'Difference', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}
				]},
			{ 'Icon': '&nbsp;', 'Name': 'Create Nested Compound', 'Shortcut': 'Ctrl+Alt+M', 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, 
			
			{ 'Icon': '&nbsp;', 'Name': 'Path', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': '&nbsp;', 'Name': 'Join Paths', 'Shortcut': 'Ctrl+J', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Split Path', 'Shortcut': 'Shift+Ctrl+J', 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, {'Icon': 'km-path fs-24', 'Name': 'Convert to Path', 'Shortcut': 'Ctrl+Shift+P', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Convert to raw Path', 'Shortcut': 'Ctrl+Shift+R', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Convert to Outline', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Expand/Shink', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fas fa-braille', 'Name': 'Vectorize Border', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Vectorize Image', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Attach Text to Path', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Detach Text from Path', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Simplify Path', 'Shortcut': 'Ctrl+ALt+S', 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Connect Paths Lines', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Break Curve', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Reverse Order', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;'}
				]},
			{ 'Icon': 'km-symbol fs-20', 'Name': 'Symbol', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': 'km-symbol fs-24', 'Name': 'Create Symbol', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Detach Symbol Instance', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Reset Instance', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;'}
				]},
			{ 'Icon': '&nbsp;', 'Name': 'Flatten', 'Shortcut': 'Ctrl+X', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }
		]}, 
    { 'Name': 'View', 'MenuItem': [
			{'Icon': '&nbsp;', 'Name': 'Original-View', 'Shortcut': 'Ctrl+0', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Fit Selection', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Fit Layer', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Fit All', 'Shortcut': 'Alt+Ctrl+0', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Magnification', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': 'item-divider', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': '&nbsp;', 'Name': '6%', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '12%', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '25%', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '50%', 'Shortcut': 'Ctrl+5', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '66%', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '100%', 'Shortcut': 'Ctrl+1', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '150%', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '200%', 'Shortcut': 'Ctrl+2', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '300%', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '400%', 'Shortcut': 'Ctrl+4', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '800%', 'Shortcut': 'Ctrl+8', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '1600%', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '3200%', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '6400%', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '12800', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '25600%', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Zoom In', 'Shortcut': 'Ctrl++', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Zoom Out', 'Shortcut': 'Ctrl+-', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }
				]},
			{'Icon': '&nbsp;', 'Name': 'Outline View', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' },  {'Icon': '&nbsp;', 'Name': 'Fast View', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Canvas', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': 'item-divider', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': '&nbsp;', 'Name': 'Show Rulers', 'Shortcut': 'Ctrl+Alt+R', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Show Guidelines', 'Shortcut': 'Ctrl+,', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Show Symbol Labels', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Show Grid', 'Shortcut': 'Ctrl+Alt+G', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Show Slices', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Show Effects', 'Shortcut': 'Ctrl+E', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }
				]},
			{'Icon': '&nbsp;', 'Name': 'Snap to', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': 'item-divider', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': '&nbsp;', 'Name': 'Use Snapping', 'Shortcut': 'Shift+F10', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Use Snap Zones', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Grid', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Guide Lines', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Full Pixels', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Anchor Points', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Shapes', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Pages', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }
				]},
			{'Icon': 'fa fa-check', 'Name': 'Show Inspector Panel', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Show Layers Panel', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Show Libraries Panel', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Show Symbol Panels', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'New View', 'Shortcut': 'Ctrl+Alt+N', 'Disabled': '&nbsp;', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, {'Icon': 'far fa-play-circle', 'Name': 'Play/Present', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Toggle Fullscreen', 'Shortcut': 'Alt+Enter', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }
		]},
    { 'Name': 'Help', 'MenuItem': []}
  ];
	
	var toolbar_file = [
		{ 'Icon': 'fa fa-save', 'Id': 'save', 'Name': 'Save', 'Action': 'f.save', 'Disabled': '&nbsp;' }, { 'Icon': 'fas fa-reply', 'Id': 'save', 'Name': 'Undo', 'Action': 'edit.undo', 'Disabled': 'disabled' }, { 'Icon': 'fas fa-share', 'Id': 'save', 'Name': 'Redo', 'Action': 'edit.redo', 'Disabled': 'disabled' }
	];
	var toolbar_view = [
		{ 'iclass': 'zoom-button', 'Icon': 'fa fa-search-plus', 'Name': 'Zoom' }, { 'iclass': '&nbsp;', 'Icon': 'fas fa-expand', 'Name': 'Fit All' }, { 'iclass': 'dropdown', 'Icon': 'fa fa-magnet fa-rotate-180', 'Name': 'Snap', 'MenuDropdownItem': [
			{'Icon': '&nbsp;', 'Name': 'Use Snapping', 'Shortcut': 'Shift+F10', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Use Snap Zones', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Grid', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Guide Lines', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Full Pixels', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Anchor Points', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Shapes', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Pages', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider' }, {'Icon': '&nbsp;', 'Name': 'Show Grid', 'Shortcut': 'Ctrl+Alt+G', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Show Guidelines', 'Shortcut': 'Ctrl+,', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Show Symbol Labels', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }
		]}
	];
	var toolbar_tool = [
		{ 'iclass': 'dropdown', 'Icon': 'fas fa-mouse-pointer', 'Name': 'Select', 'MenuDropdownItem': [
			{'Icon': 'fas fa-mouse-pointer', 'Name': 'Pointer', 'Shortcut': 'V', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'far fa-paper-plane fa-flip-horizontal', 'Name': 'Subselect', 'Shortcut': 'D', 'Disabled': '&nbsp;', 'Divider': 'item-divider' }, {'Icon': 'fa fa-check', 'Name': 'Laso', 'Shortcut': 'O', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Layer', 'Shortcut': 'M', 'Disabled': '&nbsp;', 'Divider': 'item-divider' }, {'Icon': 'fa fa-check', 'Name': 'Slice', 'Shortcut': 'S', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }
		]}, { 'iclass': 'dropdown', 'Icon': 'far fa-square', 'Name': 'Shape', 'MenuDropdownItem': [
			{'Icon': 'km-line fs-15', 'Name': 'Line', 'Shortcut': 'L', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'far fa-square', 'Name': 'Rectangle', 'Shortcut': 'R', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'far fa-circle', 'Name': 'Ellipse', 'Shortcut': 'E', 'Disabled': '&nbsp;', 'Divider': 'item-divider' }, {'Icon': '&nbsp;', 'Name': 'Polygon', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'fa km-triangle fs-26', 'Name': 'Triangle', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'km-star fs-26', 'Name': 'Star', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }
		]}, { 'iclass': 'dropdown', 'Icon': 'far fa-paper-plane fa-rotate-180', 'Name': 'Path', 'MenuDropdownItem': [
			{'Icon': 'fa km-nib fa-rotate-90', 'Name': 'Pen', 'Shortcut': 'P', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-rotate-90 km-pen fs-20', 'Name': 'Freehand', 'Shortcut': 'R', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }
		]}, { 'iclass': 'dropdown', 'Icon': 'fas fa-scalpel-path', 'Name': 'Knife', 'MenuDropdownItem': [
			{'Icon': 'fa', 'Name': 'Knife', 'Shortcut': 'K', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Freehand Shapping', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }
		]},  
		{ 'iclass': '&nbsp;', 'Icon': 'km-text fs-22', 'Name': 'Text' }, { 'iclass': 'dropdown', 'Icon': 'fa fa-image', 'Name': 'Image', 'MenuDropdownItem': [
			{'Icon': '&nbsp;', 'Name': 'Place Image...', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Link Image...', 'Shortcut': null, 'Disabled': 'disabled', 'Divider': '&nbsp;' }
		]},  
	];
	var toolbar_transform = [
		{ 'Icon': 'km-flip fs-26 fa-flip-horizontal', 'Name': 'Flip Horizontal', 'Action': 'transform.flip-horizontal', 'Disabled': 'disabled' }, { 'Icon': 'km-flip fs-26  fa-rotate-270 fa', 'Name': 'Flip Vertical', 'Action': 'transform.flip-vertical', 'Disabled': 'disabled' }, { 'Icon': 'fas fa-undo', 'Name': 'Rotate 90° Left', 'Action': 'transform.rotate-90-left', 'Disabled': 'disabled' }, { 'Icon': 'fas fa-redo', 'Name': 'Rotate 90° Right', 'Action': 'transform.rotate-90-left', 'Disabled': 'disabled' }
	];
	var toolbar_group = [
		{ 'Icon': 'fas fa-object-group', 'Name': 'Group', 'Action': 'modify.group', 'Disabled': 'disabled' }, { 'Icon': 'fas fa-object-group', 'Name': 'Ungroup', 'Action': 'modify.ungroup', 'Disabled': 'disabled' }, { 'Icon': 'km-compound fs-20', 'Name': 'Create Compound Shape', 'Action': 'modify.merge.union', 'Disabled': 'disabled' }, { 'Icon': 'fa fa-adjust', 'Name': 'Clip', 'Action': 'modify.clip', 'Disabled': 'disabled' }
	];
	var toolbar_arrange = [
		{ 'Icon': 'km-bring-forward fs-20', 'Name': 'Bring Forward', 'Action': 'arrange.order.bring-forward', 'Disabled': 'disabled' }, { 'Icon': 'km-bring-backword fs-20', 'Name': 'Send Backward', 'Action': 'arrange.order.send-backward', 'Disabled': 'disabled' }
	];
	var toolbar_action = [
		{ 'Icon': 'km-symbol fs-20', 'Name': 'Create Symbol', 'Action': 'modify.createsymbol', 'Disabled': '&nbsp;' }, { 'Icon': 'km-path fs-24', 'Name': 'Convert to Path', 'Action': 'modify.converttopath', 'Disabled': 'disabled' }, { 'Icon': 'fas fa-braille', 'Name': 'Vectorize Border', 'Action': 'modify.vectorize', 'Disabled': '&nbsp;' }, 
	];
	var talignments = [
		{ 'Name': 'Distribute Horizontally', 'Action': 'arrange.distribute.horizontal', 'Icon': 'fas fa-align-justify fa-rotate-270', 'Divider': '&nbsp;' }, { 'Name': 'Distribute Vertically', 'Action': 'arrange.distribute.vertical', 'Icon': 'fas fa-align-justify', 'Divider': 'divider' }, { 'Name': 'Align Left', 'Action': 'arrange.align.align-left', 'Icon': 'fas fa-align-left' , 'Divider': '&nbsp;' }, { 'Name': 'Align Center', 'Action': 'arrange.align.align-center', 'Icon': 'fas fa-align-center', 'Divider': '&nbsp;' }, { 'Name': 'Align Right', 'Action': 'arrange.align.align-right', 'Icon': 'fas fa-align-right', 'Divider': 'divider' }, { 'Name': 'Align Top', 'Action': 'arrange.align.align-top', 'Icon': 'fas fa-align-right fa-rotate-270' , 'Divider': '&nbsp;' }, { 'Name': 'Align Middle', 'Action': 'arrange.align.align-middle', 'Icon': 'fas fa-align-center fa-rotate-270', 'Divider': '&nbsp;' }, { 'Name': 'Align Bottom', 'Action': 'arrange.align.align-bottom', 'Icon': 'fas fa-align-right fa-rotate-90', 'Divider': '&nbsp;' }
	];
	var Rightproperty = [
		{ 'Name': 'Postion', 'Input_1': 'x', 'Dimension_1': 'x', 'Max_1': '100', 'InputId_1': 'pos-x', 'Input_2': 'y', 'Max_2': '100', 'Dimension_2': 'y', 'InputId_2': 'pos-y', 'Ratio': '&nbsp;' }, { 'Name': 'Size', 'Input_1': 'w', 'Max_1': '4000', 'InputId_1': 'size-width', 'Dimension_1': 'Width', 'Input_2': 'h', 'Max_2': '4000', 'InputId_2': 'size-height', 'Dimension_2': 'Height', 'Ratio': 'fas fa-percent' }, { 'Name': 'Angle', 'Input_1': 'R',  'Max_1': '360',  'InputId_1': 'angle','Dimension_1': 'Ratio', 'Input_2': 'Transform', 'Dimension_2': 'Transform', 'InputId_2': 'transform', 'Ratio': '&nbsp;' }, 
	];
	var Rightproperty_2 = [
		{ 'Name': 'Move', 'Input_1': 'X', 'Value_1': '0', 'Max_1': '100', 'Property_1': 'move-x', 'InputId_1': 'pos-x0', 'Input_2': 'Y', 'Value_2': '0', 'Max_2': '100', 'Property_2': 'move-y', 'InputId_2': 'pos-y0' }, { 'Name': 'Scale', 'Input_1': 'W', 'Value_1': '100', 'Max_1': '4000', 'InputId_1': 'w-100', 'Property_1': 'scale-x', 'Input_2': 'H', 'Max_2': '4000', 'Value_2': '100', 'InputId_2': 'h-100', 'Property_2': 'scale-y' }, { 'Name': 'Rotate', 'Input_1': '↑', 'Value_1': '0', 'Max_1': '360', 'InputId_1': 'rotate', 'Property_1': 'rotate', 'Input_2': '↓', 'Value_2': '0', 'Max_2': '360', 'Property_2': 'reflect', 'InputId_2': 'reflect' }, { 'Name': 'Skew', 'Input_1': 'X', 'Value_1': '0°', 'Max_1': '360', 'InputId_1': 'skew-x','Property_1': 'skew-x', 'Input_2': 'Y', 'Value_2': '0°', 'Property_2': 'skew-y', 'InputId_2': 'skew-y' }, { 'Name': 'Copies', 'Input_1': '&nbsp;', 'Value_1': '0', 'Max_1': '100', 'InputId_1': 'copies', 'Property_1': 'no. of copies' } 
	];
	var Rightproperty_4 = [
		{ 'Label': 'Preset Size', 'Group': [
			{ 'Name': 'Custom Size', 'PresetId': 'preset-size', 'Options': [
				{ 'Name': 'Infinite Canvas', 'Value': 'infinite' },
			]},
			{ 'Name': 'Web/Desktop', 'PresetId': 'preset-web', 'Options': [
				{ 'Name': 'Blog Cover', 'Value': '560x315x72' },
				{ 'Name': 'Blog Graphic', 'Value': '800x1200x72' },
				{ 'Name': 'Website - Small', 'Value': '1024x768x72' },
				{ 'Name': 'Website - Normal', 'Value': '1280x800x72' },
				{ 'Name': 'Website - Medium', 'Value': '1366x768x72' },
				{ 'Name': 'Website - Large', 'Value': '1440x900x72' },
				{ 'Name': 'Website - Huge', 'Value': '1920x1280x72' },
				{ 'Name': 'Full Website', 'Value': '1440x3072x72' },
			]},
			{ 'Name': 'Social Media', 'PresetId': 'preset-social', 'Options': [
				{ 'Name': 'Facebook Cover', 'Value': '851x315x72' },
				{ 'Name': 'Twitter Cover', 'Value': '1500x500x72' },
				{ 'Name': 'YouTube Cover', 'Value': '2560x1440x72' },
				{ 'Name': 'Google+ Cover', 'Value': '1080x608x72' },
				{ 'Name': 'LinkedIn Cover', 'Value': '1440x425x72' },
				{ 'Name': 'Twitch Cover', 'Value': '900x480x72' },
				{ 'Name': 'Twitter Post', 'Value': '1024x512x72' },
				{ 'Name': 'Facebook Post', 'Value': '940x788x72' },
				{ 'Name': 'Facebook App', 'Value': '810x450x72' },
				{ 'Name': 'Facebook Ad', 'Value': '1200x627x72' },
				{ 'Name': 'Instagram Post', 'Value': '1080x1080x72' },
				{ 'Name': 'Tumblr Graphic', 'Value': '540x810x72' },
				{ 'Name': 'Pinterest Pin', 'Value': '735x600x72' },
				{ 'Name': 'Twitch Video', 'Value': '1206x708x72' },
				{ 'Name': 'LinkedIn Banner', 'Value': '646x220x72' },
				{ 'Name': 'Dribbble Shot 400x300', 'Value': '400x300x72' },
				{ 'Name': 'Dribbble Shot 800x600', 'Value': '800x600x72' },
			]},
			{ 'Name': 'Devices', 'PresetId': 'preset-screen', 'Options': [
				{ 'Name': 'iPhone X', 'Value': '375x812x72' },
				{ 'Name': 'iPhone XR', 'Value': '828x1792x72' },
				{ 'Name': 'iPhone XS Max', 'Value': '1242x2688x72' },
				{ 'Name': 'iPhone 6/7/8 Plus', 'Value': '414x736x72' },
				{ 'Name': 'iPhone 6/7/8', 'Value': '375x667x72' },
				{ 'Name': 'iPhone 5/SE', 'Value': '320x568x72' },
				{ 'Name': 'Google Pixel 2/XL', 'Value': '411x731x72' },
				{ 'Name': 'Android mobile', 'Value': '360x640x72' },
				{ 'Name': 'Apple Watch 38 mm', 'Value': '272x340x72' },
				{ 'Name': 'Apple Watch 42 mm', 'Value': '312x390x72' },
				{ 'Name': 'Apple Watch 4 40 mm', 'Value': '324x394x72' },
				{ 'Name': 'Apple Watch 4 44 mm', 'Value': '368x448x72' },
				{ 'Name': 'iPad 3/4/Air/Mini', 'Value': '768x1024x72' },
				{ 'Name': 'iPad Pro 12.9in', 'Value': '1024x1366x72' },
				{ 'Name': 'Nexus 7', 'Value': '600x960x72' },
				{ 'Name': 'Nexus 9', 'Value': '1024x768x72' },
				{ 'Name': 'Nexus 10', 'Value': '1280x800x72' },
				{ 'Name': 'Surface Pro 3', 'Value': '1440x960x72' },
				{ 'Name': 'Surface Pro 4', 'Value': '1368x912x72' },
			]},
			{ 'Name': 'Print on Demand', 'PresetId': 'preset-print', 'Options': [
				{ 'Name': 'Amazon Popsocket', 'Value': '485x485x72' },
				{ 'Name': 'Teepublic T-Shirt', 'Value': '1500x1995x72' },
				{ 'Name': 'Redbubble Standard 2400x3200', 'Value': '2400x3200x72' },
				{ 'Name': 'Redbubble Long 2875x3900', 'Value': '2875x3900x72' },
			]},
		]},
		{ 'Label': 'Rotate Canvas', 'Disabled': 'disabled', 'Property': 'rotate-canvas', 'Icon': 'fs-18 km-rotatecanvas' },
		{ 'Label': 'Trim Canvas', 'Disabled': '&nbsp;', 'Property': 'trim-canvas', 'Icon': 'fs-18 km-trimcanvas' },
		{ 'Label': 'Clip content', 'Disabled': 'disabled', 'Property': 'clip-content', 'Icon': 'fs-18 km-clipcanvas' }
	];
	var Rightproperty_5 = [
		{ 'Name': 'Left', 'Property': 'ml' },
		{ 'Name': 'Top', 'Property': 'mt' },
		{ 'Name': 'Right', 'Property': 'mr' },
		{ 'Name': 'Bottom', 'Property': 'mb' },
	];
	
	var Rightproperty_7 = [
	 { 'Name': 'FFamily', 'Options': [
			{ 'Name': 'Abel' },
			{ 'Name': 'Abril Fatface' },
			{ 'Name': 'Alegreya' },
			{ 'Name': 'Alice' },
			{ 'Name': 'Amaranth' },
			{ 'Name': 'Amatic SC' },
			{ 'Name': 'Baloo' },
			{ 'Name': 'Cantarell' },
			{ 'Name': 'Cherry Cream Soda' },
			{ 'Name': 'Corben' },
			{ 'Name': 'Coustard Ultra' },
			{ 'Name': 'Dancing Script' },
			{ 'Name': 'Dosis' },
			{ 'Name': 'Droit Serif' },
			{ 'Name': 'EB Garamond' },
			{ 'Name': 'Elsie' },
			{ 'Name': 'Fjalla One' },
			{ 'Name': 'Grand Hotel' },
			{ 'Name': 'Josefin Sans' },
			{ 'Name': 'Lato' },
			{ 'Name': 'Leckerli One' },
			{ 'Name': 'Libre Baskerville' },
			{ 'Name': 'Lora' },
			{ 'Name': 'Medula One' },
			{ 'Name': 'Merriweather' },
			{ 'Name': 'Montserrat' },
			{ 'Name': 'Muli' },
			{ 'Name': 'Nobile' },
			{ 'Name': 'Noto Sans' },
			{ 'Name': 'Open Sans' },
			{ 'Name': 'Open Sans Condensed' },
			{ 'Name': 'Oswald' },
			{ 'Name': 'Palanquin' },
			{ 'Name': 'Philosopher' },
			{ 'Name': 'Playfair Display' },
			{ 'Name': 'Poppins' },
			{ 'Name': 'PT Sans' },
			{ 'Name': 'PT Sans Narrow' },
			{ 'Name': 'Quattrocento Sans' },
			{ 'Name': 'Raleway' },
			{ 'Name': 'Roboto' },
			{ 'Name': 'Roboto Condensed' },
			{ 'Name': 'Roboto Slab' },
			{ 'Name': 'Roboto Thin' },
			{ 'Name': 'Sansita' },
			{ 'Name': 'Six Caps' },
			{ 'Name': 'Source Sans Pro' },
			{ 'Name': 'Space Mono' },
			{ 'Name': 'Spirax' },
			{ 'Name': 'Vollkorn' },
			{ 'Name': 'Wendy One' },		
		]}, { 'Name': 'FStyle', 'Options': [
			{ 'Name': 'Light', 'Value': '300#N' },
			{ 'Name': 'Light Italic', 'Value': '300#I' },
			{ 'Name': 'Regular', 'Value': '400#N' },
			{ 'Name': 'Regular Italic', 'Value': '400#I' },
			{ 'Name': 'Semi-Bold', 'Value': '600#N' },
			{ 'Name': 'Semi-Bold Italic', 'Value': '600#I' },
			{ 'Name': 'Bold', 'Value': '700#N' },
			{ 'Name': 'Bold Italic', 'Value': '700#I' },
			{ 'Name': 'Extra-Bold', 'Value': '800#N' },
			{ 'Name': 'Extra-Bold Italic', 'Value': '800#I' },
		]}, { 'Name': 'FSize', 'Options': [
			{ 'Name': '6 px', 'Value': '6' },
			{ 'Name': '7 px', 'Value': '7' },
			{ 'Name': '8 px', 'Value': '8' },
			{ 'Name': '9 px', 'Value': '9' },
			{ 'Name': '10 px', 'Value': '10' },
			{ 'Name': '11 px', 'Value': '11' },
			{ 'Name': '12 px', 'Value': '12' },
			{ 'Name': '14 px', 'Value': '14' },
			{ 'Name': '18 px', 'Value': '18' },
			{ 'Name': '21 px', 'Value': '21' },
			{ 'Name': '24 px', 'Value': '24' },
			{ 'Name': '36 px', 'Value': '36' },
			{ 'Name': '48 px', 'Value': '48' },
			{ 'Name': '60 px', 'Value': '66' },
			{ 'Name': '72 px', 'Value': '72' },
		]}, { 'Name': 'Decoration', 'Items': [
			{ 'Name': 'Bold', 'Id': 'text-bold', 'Icon': 'fas fa-bold' },
			{ 'Name': 'Italic', 'Id': 'text-itallic', 'Icon': 'fas fa-italic' },
			{ 'Name': 'Underline', 'Id': 'text-underline', 'Icon': 'fas fa-underline' },
			{ 'Name': 'Strikethrough', 'Id': 'text-strikethrough', 'Icon': 'fas fa-strikethrough' },
		]}, { 'Name': 'Alignments', 'Items': [
			{ 'Name': 'Align Left', 'Value': 'left', 'Id': 'align-left', 'Icon': 'fas fa-align-left' },
			{ 'Name': 'Align Center', 'Value': 'center', 'Id': 'align-center', 'Icon': 'fas fa-align-center' },
			{ 'Name': 'Align Right', 'Value': 'right', 'Id': 'align-right', 'Icon': 'fas fa-align-right' },
			{ 'Name': 'Align Justify', 'Value': 'justify', 'Id': 'align-justify', 'Icon': 'fas fa-align-center fa-rotate-270' },
		]}, { 'Name': 'Vertical', 'Items': [
			{ 'Name': 'Align Top', 'Value': 'top', 'Id': 'align-top', 'Icon': 'fas fa-align-right fa-rotate-270' },
			{ 'Name': 'Align Middle', 'Value': 'middle', 'Id': 'align-center', 'Icon': 'fas fa-align-center fa-rotate-270' },
			{ 'Name': 'Align Bottom', 'Value': 'bottom', 'Id': 'align-right', 'Icon': 'fas fa-align-right fa-rotate-90' },
		]}, { 'Name': 'Spacing', 'Items': [
			{ 'Name': 'Char', 'Id': 'char-spacing', 'Min': '0', 'Value': '0' },
			{ 'Name': 'Word', 'Id': 'word-spacing', 'Min': '0', 'Value': '0' },
			{ 'Name': 'Line', 'Id': 'line-spacing', 'Min': '1', 'Value': '100' },
		]}, { 'Name': 'Sizing', 'Items': [
			{ 'Name': 'Width', 'Button_1': 'Auto', 'Class_1': 'sizing-width', 'Class_2': 'sizing-width', 'Button_2': 'Fix', 'Id_1': 'width-auto', 'Id_2': 'width-fix' },
			{ 'Name': 'Height', 'Button_1': 'Auto', 'Class_1': 'sizing-height', 'Class_2': 'sizing-height', 'Button_2': 'Fix', 'Id_1': 'height-auto', 'Id_2': 'height-fix' },
		]}, { 'Name': 'Script', 'Options': [
			{ 'Name': 'Left-to-right', 'Value': '0', 'Id': 'left-to-right' },
			{ 'Name': 'Right-to-left', 'Value': '180', 'Id': 'right-to-left' },
			{ 'Name': 'Top-to-bottom', 'Value': '-90', 'Id': 'top-to-bottom' },
		]}, 
	];
  
  setTimeout(function() {
    $('body').removeClass('loading');
    $('#main').css('display', 'block');
  }, 3000);
  setTimeout(function() {
    var de = new De();
    $('body').append(de);
		var checkTitle = $('#header .tabs .tab.g-active .title').text();
		checkTitle = checkTitle.includes('*');
		if(checkTitle === false){
			$('button#save').attr('disabled', 'disabled');
			$('.g-menu .g-menu-bottom #save_caption').parent('.g-menu-item').addClass('g-disabled');
		}		
  }, 3200);
  setTimeout(function() {
    var canvas = document.getElementsByTagName("canvas")[0];
    stage.container().style.background = $('#km-chosen-color').val();
    canvas.style.background = $('#km-chosen-color').val();  
    stage.draw();
    if (design_id == '') {
     $('#modal').modal('show');
    }
  }, 3500);

	if($('.k-dialog-container').length == 0){
		$('body').append($('<div />', {'class': 'k-dialog-container'}));		
    callProductModal();
	}
	
	$("#modal").on("hidden.bs.modal", function(e) {
		if($('#header .tabs .tab.g-active').length === 0){
			$("<div></div>").addClass("tab g-active").append($("<span></span>").addClass("title c-pointer").attr('design', 'untitled').attr('onclick', 'FntemplateSwitch(this)').append('Untitled*')).append($("<span/>", {'class': 'close c-pointer', 'designid': 'untitled', 'onclick': 'FntemplateClose(this)', 'html': '✕'})).appendTo('#header .tabs');
			document.title = 'Untitled | KaboodleMedia';
		}
		if(producTypeId !== ''){
			var getactiveTerm = media_base_url+'/termdata/'+ producTypeId +'?_format=json';
			$.getJSON( getactiveTerm, function( getactiveicon ) {
				$('#item-'+producTypeId).find('.product-icon').attr('src', getactiveicon[0].icon);
			});
			$('.k-dialog-container .modal-footer').html('');
			$('.k-dialog-container .modal-footer').css('padding', '35px');
			$('#nav-tab a[href="#nav-224"]').tab('show');
		}
	});
	
  function checkDesign() {
		var field = 'd';
		var url = window.location.href;
		if(url.indexOf('?' + field + '=') != -1){
			return true;
		} else {
			return false;
		}
	}
  
  function callProductModal(){
    var modalc = new modalContent();
    var modalb = new modalBox(modalc);
    $('.k-dialog-container').append(modalb);
    $('.k-dialog-container .modal-footer').css('padding', '35px');
  }
  
  function keyUpbtn(){
    if(($('#elem-width').val() === '') || ($('#elem-height').val() === '')){
      $('.btn-primary').attr('disabled', 'disabled');
    } else {
      $('.btn-primary').removeAttr('disabled');
    }
  }
  function keyDownbtn(){
    if(($('#elem-width').val() === '') || ($('#elem-height').val() === '')){
      $('.btn-primary').attr('disabled', 'disabled');
    } else {
      $('.btn-primary').removeAttr('disabled');
    }
  }
  
  function browseImg(){
		$('#imgupload').trigger('click');
	}
  function tooltipfn(){
    $('[data-toggle="tooltip"]').tooltip({placement : 'bottom'});
  }
	
	function elemAttr(id, style){
		this.id = id;
		this.styleattribute = style;
	}
	function getAction(id, action){
		this.id = id;
		this.action = action;
	}
	function setProperties(id, value){
		this.id = id;
		this.value = value;
	}
	
	String.prototype.trunc = String.prototype.trunc ||
	function(n){
		return (this.length > n) ? this.substr(0, n-1) + '...' : this;
	};
	
	if(producTypeId !== ''){
    console.log('tools-1');
		getProductName(producTypeId);
	}
  	
	elemAttr.prototype.keyAction = function(ev){
		$('#'+this.id).keypress(function(event){
			var sl = stage.find('.selectedLayer');
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if(keycode == 13 && this.id == 'canvas-width'){
				$('#panels').width($(this).val());
				stage.width($(this).val());
			}
			if(keycode == 13 && this.id == 'canvas-height'){
				$('#panels').height($(this).val());
				stage.height($(this).val());
			}
      if(keycode == 13 && this.id == 'char-spacing'){
				FnSpacing(this.id);
			}			
			stage.draw();
		});
	}
	getAction.prototype.menuAction = function(){
		return $('#'+this.id).attr('data-action', this.action);
	}
	setProperties.prototype.properties = function(){
		return $('#'+this.id).val(this.value);
	}
	
	/**
	 * return Product active Icons
	 */
  function getActiveicon(e){
    var id = e.id;
    var tid = $('#'+id).data('tid');
    $('.product-item').each(function(event) {
      $(this).removeClass('active');
      var inactive_ids = $(this).attr('id');
      $('#'+inactive_ids).each(function() {
        var inactive_tid = $(this).data('tid');
        var inactive_id = $(this).attr('id');
        var getinactiveTerm = media_base_url+'/termdata/'+ inactive_tid +'?_format=json';
        $.getJSON( getinactiveTerm, function( inactiveicon ) {
          $('#'+inactive_id+ ' .product-icon').attr('src', inactiveicon[0].icon);
        });
      });
    });
    
    $('#'+id).addClass('active');
    if($('#'+id).hasClass('active')) {
      var getactiveTerm = media_base_url+'/termdata/'+ tid +'?_format=json';
      $.getJSON( getactiveTerm, function( getactiveicon ) {
        $('#'+id).find('.product-icon').attr('src', getactiveicon[0].activeicon);
      });
      //set modal footer for new tab onclick product item
      var product_group = $('#'+id).data('group');
      if(product_group == 223) {
        var max = '22';
        var title = 'Value must be less then or equal to 22.';
        var measurement = 'inches';
      } else {
        var max = '4000';
        var title = 'Value must be less then or equal to 4000.';
        var measurement = 'pixels';
      }
      var elems = InputElems(max, measurement, title);
      var $footerelem = $('.k-dialog-container .modal-footer').html(
        $('<div/>', {"class": "d-none d-flex align-items-center", "id": "create-design"}).html(elems)
      );
      $('#create-design').removeClass('d-none');
      $('.modal-footer').css('padding', '1rem');
    }
  }
	
	/**
	 * A Global Modal Box
	 */
  function modalBox (modalcontent, title_msg = null) {
    var $elem = $('body div.k-dialog-container');
    $elem.append(
      $('<div/>', {'class': 'modal fade align-items-center', 'id': 'modal'}).append(
        $('<div/>', {'class': 'modal-dialog'}).append(
          $('<div/>', {'class': 'modal-content'}).append(
            $('<div/>', {'class': 'modal-header d-none'}).append(
              $('<h4/>', {'class': 'modal-title', text: title_msg})
            )
          ).append(
            $('<div/>', {'class': 'modal-body'})
          ).append(
          $('<div/>', {'class': 'modal-footer'})
          )
        )
      )
    );  
  }
	
	/**
	 * return Modal Body elements
	 */
  function modalContent () {
    var url_query = window.location.search.substring(1);
    var temp_id = 224;
    if(url_query){
      var vars = url_query.split("&");
      for (var i=0; i<vars.length; i++) {
        var pair = vars[i].split("=");
        if(pair[0] == 'template'){
          temp_id = pair[1];
        }
      }
    }
    $.getJSON( product_group_url, function( data ) { //products
      var products = [];
      var productitems = [];
      var allelemitems = [];
      $.each( data, function( key, val ) { 
        //if(val.name == 'Social Media'){
        if(val.tid == temp_id){
          var $class = 'active';
          var $iclass = 'show active';
          var $area = true;
        } else {
          var $class = $iclass = '';
          var $area = false;
        }
        products.push('<a id="nav-' + val.tid + '-tab" class="nav-item nav-link '+ $class +'" data-toggle="tab" href="#nav-' + val.tid +'" role="tab" aria-controls="nav-' + val.tid +'" aria-selected='+$area+'>' + val.name + '</a>'); 

        // product items
        var product_item_url = media_base_url+'/kmds/product-type/'+val.tid+'?_format=json';
        $.getJSON( product_item_url, function( dataitems ) {          
          var myArray = dataitems;
          var groups = {};
          for (var i = 0; i < myArray.length; i++) {
            var groupName = myArray[i].group;
            if (!groups[groupName]) {
              groups[groupName] = [];
            }
            groups[groupName].push({name: myArray[i].name, tid: myArray[i].tid, icon: myArray[i].icon});
          }
          myArray = [];
          for (groupName in groups) {
            myArray.push({group: groupName, items: groups[groupName]});
          }         
          $.each( myArray, function( ikey, ival ) {
            ival.items.sort((a, b) => a.name.localeCompare(b.name));
            var p_item = ival.items.map((nitem, nkey) => {            
              return '<div id="item-' + nitem.tid +'" data-tid='+ nitem.tid +' data-name="'+ nitem.name +'" data-group='+ ival.group +' class="product-item" onclick="getActiveicon(this)"><img class="product-icon" src="'+ nitem.icon +'" alt="'+ nitem.name +'" title="'+ nitem.name +'"/></div>';
            });
            
            allelemitems.push($('<div/>', {
              "class": 'tab-pane fade '+ $iclass +'',
              "id": 'nav-' + ival.group,
              "role": "tabpanel",
              "aria-labelledby": 'nav-' + ival.group + '-tab',
              "html": p_item,
              })
            );
          });
          return $('.tab-content.tab-group').append(allelemitems);        
        });
      });
      var $elem = $('.k-dialog-container .modal-body').append(
        $('<nav/>', {"class": "custom-nav-layout"}).append(
          $('<div/>', {
            "class": "nav nav-tabs nav-fill",
            "id": "nav-tab",
            "role": "tablist",
            "html": products,
          })
        )
      ).append(
        $('<div/>', {"class": "tab-content tab-group d-flex justify-content-center"})
      ); 
      
      //unset modal footer of old tab on switch tab
      $(".nav > .nav-item").on("shown.bs.tab", function(e) {
        $('.k-dialog-container .modal-footer').html('');
        $('.k-dialog-container .modal-footer').css('padding', '35px');
      });

      var $output = $elem;
      return $output;
    });
  }
	
  /**
	 * return Modal form elements
	 */
  function InputElems(max, measurement, title) {
     return $('<ul/>', {'class': 'd-flex'})
      .append(
        $('<li/>').append(
          $('<input/>', {'type': 'number', 'min': 0, 'max': max, 'maxlength': 2, 'class': 'dcreate-elem pl-2', 'name': 'width', 'title': '', 'data-toggle':'tooltip', 'data-placement': 'bottom', 'id': 'elem-width', 'placeholder': 'width', 'onmouseover': "tooltipfn(this)", 'onkeyup': "keyUpbtn()", 'onkeydown': "keyDownbtn()", 'oninput':"(this.value > "+max+") ? this.title = '" + title + "' : this.value"})
        )
      ).append(
        $('<li/>', {'class': 'elem-separator', 'text': 'x'})
      ).append(
        $('<li/>').append(
          $('<input/>', {'type': 'number', 'min': 0, 'max': max, 'maxlength': 2, 'data-toggle':'tooltip', 'data-placement': 'bottom', 'title': '', 'class': 'dcreate-elem pl-2', 'name': 'height', 'id': 'elem-height', 'placeholder': 'height', 'onkeyup': "keyUpbtn()", 'onkeydown': "keyDownbtn()", 'onmouseover': "tooltipfn(this)", 'oninput':"(this.value > "+max+") ? this.title = '" + title + "' : this.value" }) 
        )
      ).append(
        $('<li/>').append(
          /* $('<select/>', {'class': 'select-elem pl-2 ml-4', 'name': 'measurement', 'id': 'elem-measurement'}).append($('<option/>', {'value': 'in', 'text': 'in'})).append($('<option/>', {'value': 'px', 'text': 'px'})
          ) */
          $('<input/>', {'class': 'select-elem pl-2 ml-4', 'name': 'measurement', 'id': 'elem-measurement', 'value': measurement, 'disabled': 'disabled'})
        )
      )
      .append(
        $('<li/>', {'class': 'elem-separator'})
      ).append(
        $('<li/>').append(
          $('<button/>', {'id': 'dcreate', 'onclick': 'newCanvasLayer(this)', 'class': 'btn btn-primary', text: 'CREATE NEW DESIGN', 'disabled': 'disabled'})
        )
      );
  }
  
	/**
	 * return Designer tool container structure
	 */
  function De() {

    De.prototype._info = null, De.prototype._footer = null, De.prototype._header = null, De.prototype._toolbar = null, De.prototype._panels = null, De.prototype._leftSidebars = null, De.prototype._rightSidebars = null, De.prototype._windows = null,  De.prototype._user = null;

    De.prototype.getHeader = function() {
        return this._header
    }, De.prototype.getInfo = function() {
        return this._info
    }, De.prototype.getToolbar = function() {
        return this._toolbar
    }, De.prototype.getPanels = function() {
        return this._panels
    }, De.prototype.getLeftSidebars = function() {
        return this._leftSidebars
    }, De.prototype.getRightSidebars = function() {
        return this._rightSidebars
    }, De.prototype.getWindows = function() {
        return this._windows
    };
    
    this._container = $("<div></div>").attr("id", "mainframe").attr('class', 'd-flex').insertAfter('#main');
    //var i = this._frame = $("<div></div>").appendTo(this._mainframe);
    var d = $("<div></div>").attr("id", "header").appendTo(this._container);
    this._header = new getMenuBar();
    var p = $("<div></div>").attr("id", "toolbar").appendTo(this._container);
    this._toolbar = new ToolBar();
    var m = $("<div></div>").attr("id", "left-sidebar").appendTo(this._container);
    this._leftSidebars = new LeftSidebars();
    var g = $("<div></div>").attr("id", "canvas-container").appendTo(this._container);
    var j = $("<div></div>").attr("id", "panels").appendTo(g);
    this._panels = new canvasInit();

    var f = $("<div></div>").attr("id", "right-sidebar").appendTo(this._container);
    this._rightSidebars = new RightSidebars();
    var h = $("<div></div>").attr("id", "footer").appendTo(this._container);
    this._footer = "footer"; 
  }
  
	/**
	 * return Header Menu
	 */
  function getMenuBar (){
		getFileName(); //update template name		
    $("<div></div>").addClass("section menu").append($("<nav></nav>").addClass("g-menu-bar").append($("<ul></ul>").addClass("g-menu g-menu-root"))).appendTo('#header')
		
		$("<div></div>").addClass("section windows").append($("<div></div>").addClass("tabs").append($("<div></div>").addClass("tab g-active").append($("<span></span>").addClass("title c-pointer").attr('design', 'untitled').attr('onclick', 'FntemplateSwitch(this)').append('Untitled*')).append($("<span/>", {'class': 'close c-pointer', 'designid': 'untitled', 'onclick': 'FntemplateClose(this)', 'html': '✕'})))).appendTo('#header')
		
		$("<div></div>").addClass("section login user").append(
			$('<img class="avatar" src="'+ avatar +'" alt='+ name +' title='+ name +'/>')	
		).appendTo('#header')		
    
    $.each(H_items, function (index, dataMenu) {
      var menuBuilder = [];
      menuBuilder.push('<li class="g-menu-item"><span class="g-menu-item-caption">' + dataMenu.Name + '</span>');

      if (dataMenu.MenuItem.length > 0) {
        menuBuilder.push('<ul class="g-menu g-menu-bottom">');
        $.each(dataMenu.MenuItem, function (i, dataSubmenu) {
					if(dataSubmenu.Shortcut == null){
						var shortcutf = '';
					}else {
						var shortcutf = dataSubmenu.Shortcut;
					}
					var arr = [];
					var Itemname = '';
          arr = dataSubmenu.Name.split(' ')
          for (var i = 0; i<=arr.length; i++) {
           var Itemname = arr.join("_").toLowerCase().replace('...','')
          }
          menuBuilder.push('<li class="g-menu-item '+ dataSubmenu.Tail +' '+ dataSubmenu.Disabled +' '+ dataSubmenu.Divider +'"><span class="g-menu-item-icon"><i class="'+ dataSubmenu.Icon +'"></i></span><span id="' + Itemname + '_caption" class="g-menu-item-caption">' + dataSubmenu.Name + '</span><span class="g-menu-item-shortcut">'+ shortcutf +'</span></><span class="g-menu-item-tail '+ dataSubmenu.Tail +'"></span>');
					if(dataSubmenu.Tail == 'has-tail'){
						menuBuilder.push('<ul class="g-menu g-menu-right">');
						$.each(dataSubmenu.MenuTailItem, function (ii, dataTailmenu) {
							if(dataTailmenu.Name == 'Place Image...'){
								var input_browse = '<input type="file" id="imgupload" style="display:none" accept="image/*" multiple/>';
								var fncallback = 'onclick="browseImg()"';
								var datatitle = 'Image';
							} else {
								var input_browse = fncallback = datatitle = '';								
							}
							if(dataTailmenu.Shortcut == null){
								var shortcutt = '';
							}else {
								var shortcutt = dataTailmenu.Shortcut;
							}
							var arrm = [];
							var Itemnamem = '';
							arrm = dataTailmenu.Name.split(' ')
							for (var i = 0; i<=arrm.length; i++) {
							 var Itemnamem = arrm.join("_").toLowerCase().replace('...','')
							}
							menuBuilder.push('<li class="g-menu-item '+ dataSubmenu.Tail +' '+ dataTailmenu.Disabled +' '+ dataTailmenu.Divider +'"><span class="g-menu-item-icon"><i class="'+ dataTailmenu.Icon +'"></i></span><span data-title='+ datatitle +' '+ fncallback +' id="' + Itemnamem + '" class="g-menu-item-caption">' + dataTailmenu.Name + '</span>'+ input_browse +'<span class="g-menu-item-shortcut">'+ shortcutt +'</span></><span class="g-menu-item-tail '+ dataTailmenu.Tail +'"></span>');
							if(dataTailmenu.Tail == 'has-tail'){
								menuBuilder.push('<ul class="g-menu g-menu-right">');
								$.each(dataTailmenu.MenuTailItem, function (iii, dataTailmenuLast) {
									if(dataTailmenuLast.Shortcut == null){
										var shortcutl = '';
									}else {
										var shortcutl = dataTailmenuLast.Shortcut;
									}
									var arrl = [];
									var Itemnamel = '';
									arrl = dataTailmenuLast.Name.split(' ')
									for (var i = 0; i<=arrl.length; i++) {
									 var Itemnamel = arrl.join("_").toLowerCase().replace('...','')
									}
									menuBuilder.push('<li class="g-menu-item '+ dataTailmenuLast.Tail +' '+ dataTailmenuLast.Disabled +' '+ dataTailmenuLast.Divider +'"><span class="g-menu-item-icon"><i class="'+ dataTailmenuLast.Icon +'"></i></span><span id="' + Itemnamel + '" class="g-menu-item-caption">' + dataTailmenuLast.Name + '</span><span class="g-menu-item-shortcut">'+ shortcutl +'</span></><span class="g-menu-item-tail '+ dataTailmenuLast.Tail +'"></span>');
									
									menuBuilder.push('</li>');
								})
								menuBuilder.push('</ul>');
							}							
							menuBuilder.push('</li>');
						})
						menuBuilder.push('</ul>');
					}
					menuBuilder.push('</li>');
        });
        menuBuilder.push('</ul>');
      }

      menuBuilder.push('</li>');

      $('.g-menu-root').append(menuBuilder.join(''));
    });
		
    $('.g-menu-item-tail.has-tail').each(function (event){
			$(this).append('<i class="fa fa-caret-right"></i>');
		}); 
		
		$('.g-menu:not(.g-menu-root) > .g-menu-item > .g-menu-item-caption').each(function(event){
			var nf = new getAction('new_design_caption', 'f.new')
			var fs = new getAction('save_caption', 'f.save')
			var fss = new getAction('save_as_caption', 'f.saveas')
			var ft = new getAction('new_design_from_template_caption', 'f.new.ft')
			nf.menuAction();			
			fs.menuAction();						
			fss.menuAction();						
			ft.menuAction();			
						
			$(this).on('click', function(){ 
				this._actions = $(this).data('action')
				switch (this._actions) {
					case 'f.new':						
            $('#modal').modal('show');						
						break;
					case 'f.new.ft':
							openSaveTemplateModal();
						break;
					case 'f.save':
					  var t = checkDesign();
						if (t === false) {
              openSaveTemplateModal();
						} else {
							kmdsToolSettingSave();
						}
						break;
					case 'f.saveas':
						openSaveTemplateModal();
						design_id = getUrlDesignID();
						if(design_id !== ''){
							var gettitle = $('#header .tabs .tab.g-active .title').text();
							gettitle = gettitle.split('*')[0];
							$('#template-name').val(gettitle);
						}
						break;
					case 'f.open.l':

						break;
				}
			})
		});
  }
		
	/**
	 * return Header Menu
	 */
	function ToolBar (){		
		var toolBarBuilder = [];	
		
		// Toolbar File
		toolBarBuilder.push('<div class="section t-section file-section">')
		$.each(toolbar_file, function (i, toolBarmenu_file) {
			toolBarBuilder.push('<div class="toolbar-button"><button data-action="' + toolBarmenu_file.Action + '" id="' + toolBarmenu_file.Id + '" class="action-button" onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom" data-title="' + toolBarmenu_file.Name + '" ' + toolBarmenu_file.Disabled + '><i class="' + toolBarmenu_file.Icon + '"></i></button></div>')
		})
		toolBarBuilder.push('</div>');
		
		// Toolbar View
		toolBarBuilder.push('<div class="section t-section view-section">')
		$.each(toolbar_view, function (ii, toolBarmenu_view) {
			if(toolBarmenu_view.iclass == 'zoom-button'){
				var left_btn = '<button class="left-attached attached-button" style="width: 15px;">-</button>';
				var right_btn = '<button class="right-attached attached-button" style="width: 15px;">+</button>';
				var caption = '<span class="caption">100%</span>';
			} else {
				var left_btn = '';
				var right_btn = '';
				var caption = '';
			}
			if(toolBarmenu_view.iclass == 'dropdown'){
				var dropdown = '<button class="dropdown-button"><i class="fa fa-caret-down"></i></button>';
			}	else {
				var dropdown = '';
			}
			toolBarBuilder.push('<div class="toolbar-button '+ toolBarmenu_view.iclass +'">'+ left_btn +'<button onmouseover="tooltipfn(this)" class="action-button" data-toggle="tooltip" data-placement="bottom" data-title="' + toolBarmenu_view.Name + '"><i class="' + toolBarmenu_view.Icon + '"></i>'+ caption +'</button>'+ right_btn +''+ dropdown)
			if(toolBarmenu_view.iclass == 'dropdown'){
				toolBarBuilder.push('<ul class="g-menu g-menu-bottom fixed">');
				$.each(toolBarmenu_view.MenuDropdownItem, function (ix, DropdownItem) {					
					if(DropdownItem.Shortcut == null){
						var shortcutl = '';
					}else {
						var shortcutl = DropdownItem.Shortcut;
					}
					var arrl = [];
					var Itemnamel = '';
					arrl = DropdownItem.Name.split(' ')
					for (var i = 0; i<=arrl.length; i++) {
					  var Itemnamel = arrl.join("_").toLowerCase().replace('...','')
					}
					toolBarBuilder.push('<li class="g-menu-item '+ DropdownItem.Disabled +' '+ DropdownItem.Divider +'"><span class="g-menu-item-icon"><i class="'+ DropdownItem.Icon +'"></i></span><span class="'+ Itemnamel +'" id="' + Itemnamel + '_tool" class="g-menu-item-caption">' + DropdownItem.Name + '</span><span class="g-menu-item-shortcut">'+ shortcutl +'</span>');
					
					toolBarBuilder.push('</li>');
				})
				toolBarBuilder.push('</ul>');			
			}
		toolBarBuilder.push('</div>');
		})
		toolBarBuilder.push('</div>');
		
		// Toolbar Tools
		toolBarBuilder.push('<div class="section t-section tool-section">')
		$.each(toolbar_tool, function (iii, toolBarmenu_tool) {
			if(toolBarmenu_tool.iclass == 'dropdown'){
				var dropdown = '<button class="dropdown-button"><i class="fa fa-caret-down"></i></button>';
			} else {
				var dropdown = '';
			}
			if(toolBarmenu_tool.Name == 'Image'){
				var fncallback1 = 'onclick="browseImg()"';
			} else if(toolBarmenu_tool.Name == 'Text'){
				var fncallback1 = 'onclick="addtextallow(this)"';
			} else {
				var fncallback1 = '';								
			}
			toolBarBuilder.push('<div class="toolbar-button toolbar-'+ toolBarmenu_tool.Name +' '+ toolBarmenu_tool.iclass +'"><button class="action-button"  '+ fncallback1 +' onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom" data-title="' + toolBarmenu_tool.Name + '"><i class="' + toolBarmenu_tool.Icon + '"></i></button>'+ dropdown)
			if(toolBarmenu_tool.iclass == 'dropdown'){
				toolBarBuilder.push('<ul class="g-menu g-menu-bottom fixed">');
				$.each(toolBarmenu_tool.MenuDropdownItem, function (x, DropdownItemtool) {
					if(DropdownItemtool.Name == 'Place Image...'){
						var fncallback = 'onclick="browseImg()"';
						var datatitle = 'Image';
					} else {
						var fncallback = datatitle = '';								
					}
					if(DropdownItemtool.Shortcut == null){
						var shortcut = '';
					}else {
						var shortcut = DropdownItemtool.Shortcut;
					}
					var arrl = [];
					var Itemnamel = '';
					arrl = DropdownItemtool.Name.split(' ')
					for (var i = 0; i<=arrl.length; i++) {
					 var Itemnamel = arrl.join("_").toLowerCase().replace('...','')
					}
					toolBarBuilder.push('<li class="g-menu-item '+ DropdownItemtool.Disabled +' '+ DropdownItemtool.Divider +'"><span class="g-menu-item-icon"><i class="'+ DropdownItemtool.Icon +'"></i></span><span data-title="' + datatitle + '" '+ fncallback +' id="' + Itemnamel + '_tool" class="g-menu-item-caption">' + DropdownItemtool.Name + '</span><span class="g-menu-item-shortcut">'+ shortcut +'</span>');
					
					toolBarBuilder.push('</li>');
				})
				toolBarBuilder.push('</ul>');			
			}
		toolBarBuilder.push('</div>');
		})
		toolBarBuilder.push('</div>');
		
		// Toolbar Transform
		toolBarBuilder.push('<div class="section t-section transform-section">')
		$.each(toolbar_transform, function (iv, toolBarmenu_transform) {
			toolBarBuilder.push('<div class="toolbar-button" data-action="' + toolBarmenu_transform.Action + '"><button onmouseover="tooltipfn(this)" class="action-button" data-toggle="tooltip" data-placement="bottom" data-title="' + toolBarmenu_transform.Name + '" ' + toolBarmenu_transform.Disabled + '><i class="' + toolBarmenu_transform.Icon + '"></i></button></div>')
		})
		toolBarBuilder.push('</div>');
		
		// Toolbar Group
		toolBarBuilder.push('<div class="section t-section transform-section">')
		$.each(toolbar_group, function (v, toolBarmenu_group) {
			toolBarBuilder.push('<div class="toolbar-button" data-action="' + toolBarmenu_group.Action + '"><button onmouseover="tooltipfn(this)" class="action-button" data-toggle="tooltip" data-placement="bottom" data-title="' + toolBarmenu_group.Name + '" ' + toolBarmenu_group.Disabled + '><i class="' + toolBarmenu_group.Icon + '"></i></button></div>')
		})
		toolBarBuilder.push('</div>');
		
		// Toolbar Arrange
		toolBarBuilder.push('<div class="section t-section transform-section">')
		$.each(toolbar_arrange, function (vi, toolBarmenu_arrange) {
			toolBarBuilder.push('<div class="toolbar-button" data-action="' + toolBarmenu_arrange.Action + '"><button onmouseover="tooltipfn(this)" class="action-button" data-toggle="tooltip" data-placement="bottom" data-title="' + toolBarmenu_arrange.Name + '" ' + toolBarmenu_arrange.Disabled + '><i class="' + toolBarmenu_arrange.Icon + '"></i></button></div>')
		})
		toolBarBuilder.push('</div>');
		
		// Toolbar Action
		toolBarBuilder.push('<div class="section t-section action-section">')
		$.each(toolbar_action, function (vii, toolBarmenu_action) {
			toolBarBuilder.push('<div class="toolbar-button" data-action="' + toolBarmenu_action.Action + '"><button onmouseover="tooltipfn(this)" class="action-button" data-toggle="tooltip" data-placement="bottom" data-title="' + toolBarmenu_action.Name + '" ' + toolBarmenu_action.Disabled + '><i class="' + toolBarmenu_action.Icon + '"></i></button></div>')
		})
		toolBarBuilder.push('</div>');

		$('#toolbar').append(toolBarBuilder.join(''));
		$('.dropdown').each(function(event){
			$(this).on('click', function(){
				$("ul.g-menu.g-menu-bottom.fixed").each(function(event){
					$(this).hide();
				})
				$(this).children('ul.g-menu.g-menu-bottom.fixed').css('display', 'inline-block')
			})
			$(document).on("click", function(event){
        var $trigger = $(".toolbar-button.dropdown");
        if($trigger !== event.target && !$trigger.has(event.target).length){
          $("ul.g-menu.g-menu-bottom.fixed").hide();
          $('#toolbar button.action-button.g-active').removeClass('g-active');
        }          
			});
		});
		
		$('#toolbar .toolbar-button .action-button').each(function(event){
			var fss = new getAction('save', 'f.save');
			fss.menuAction();						
			$(this).on('click', function(){
				this._actions = $(this).data('action');
				switch (this._actions) {
					case 'f.save':
						var t = checkDesign();
						if (t === false) {
							openSaveTemplateModal();
						} else {
							kmdsToolSettingSave();
						}
						break;
					case 'f.open.l':

						break;
				}
			})		
		});
	}

	/**
	 * return Left Sidebar
	 */
	function LeftSidebars (){	
    var LsidebarBarBuilder = [];
		var initialpid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		var $selector = LsidebarBarBuilder.push('<div class="sidebar-selector d-flex"><div class="sidebar-option text-uppercase d-flex justify-content-center align-items-center  sidebar-layers active c-pointer">Layers</div><div class="sidebar-option text-uppercase d-flex justify-content-center align-items-center sidebar-library c-pointer">Resources</div><div class="sidebar-option text-uppercase d-flex justify-content-center align-items-center sidebar-symbols c-pointer">Assets</div></div>');
		
		var $layers_pagesContainer = LsidebarBarBuilder.push('<div class="sidebar-container sidebar-layers align-items-stretch flex-column multiple"><div id="accordionDiv" class="toolbar accordion justify-content-between align-items-center"><label>Pages</label><button class="g-accordion page" data-toggle="collapse" data-target="#pages-container" aria-expanded="true" aria-controls="pages-container"></button><div class="g-accordion-ghost"></div><label class="g-switch" data-toggle="tooltip" data-placement="bottom "data-title="Toggle Single / Multipage Mode" style="margin-right: 5px;"><input type="checkbox" data-property="multipage-switch"><div></div></label><button id="delete-page" data-toggle="tooltip" data-placement="bottom" data-title="Delete Active Page"><i class="fas fa-trash-alt"></i></button><button id="create-new" data-toggle="tooltip" data-placement="bottom" data-title="Create New Page"><i class="far fa-plus-square"></i></button></div><div id="pages-container" class="collapse show pages-container" aria-labelledby="accordionDiv"><div id="pages" class="g-page-panel pages"><div id="page-'+initialpid+'" class="d-flex page-row initial-page g-active align-items-center"><span class="d-flex page-title-group align-items-center"><span class="page-icon far fa-file"></span><span class="page-title">Page 1</span></span><span onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom" data-title="Toggle Locker" class="page-action c-pointer fas fa-unlock-alt fa fa-flip-horizontal"></span><span onmouseover="tooltipfn(this)" data-title="Toggle Visibility" data-toggle="tooltip" data-placement="bottom" class="page-action c-pointer fas fa-eye"></span></div></div></div><div id="page-layer-divider"><hr><div></div></div>');
		
		var $layers_layersContainer = LsidebarBarBuilder.push('<div class="toolbar justify-content-between align-items-center layer-toolbar"><label class="flex-grow">Layers</label><button id="delete-layer" data-toggle="tooltip" data-placement="bottom" data-title="Delete Layer or Item"><span class="fas fa-trash-alt"></span></button><button id="create-new-layer" data-toggle="tooltip" data-placement="bottom" data-title="New Layer"><span class="far fa-plus-square"></span></button></div><div class="layers-container"><div id="layers" class="layers g-layer-panel"></div></div><hr></div>');
		
		var $libraryContainer = LsidebarBarBuilder.push('<div class="sidebar-container sidebar-library multiple" style="display:none;">library</div>');
		
		var $symbolsContainer = LsidebarBarBuilder.push('<div class="sidebar-container sidebar-symbols multiple" style="display:none;">symbols</div>');
						
		LsidebarBarBuilder.push($selector)
		
	  $('#left-sidebar').append(LsidebarBarBuilder.join(''));
		//Layers, Resources, assets tab actions
		$('#left-sidebar .sidebar-option').each(function(e){
			$(this).on('click', function(){
				$('#left-sidebar .sidebar-option.active').each(function(e){
					$(this).removeClass('active')
				})
				$(this).addClass('active')
				if($(this).hasClass('sidebar-layers')){
					$('.sidebar-container.sidebar-layers').css('display', 'flex')
					$('.sidebar-container.sidebar-library').css('display', 'none')
					$('.sidebar-container.sidebar-symbols').css('display', 'none')
				}if($(this).hasClass('sidebar-library')){
					$('.sidebar-container.sidebar-library').css('display', 'flex')
					$('.sidebar-container.sidebar-layers').css('display', 'none')
					$('.sidebar-container.sidebar-symbols').css('display', 'none')
				}if($(this).hasClass('sidebar-symbols')){
					$('.sidebar-container.sidebar-symbols').css('display', 'flex')
					$('.sidebar-container.sidebar-library').css('display', 'none')
					$('.sidebar-container.sidebar-layers').css('display', 'none')
				}
			})
		});	
		// Delete Page row
    $('button#delete-page').on('click', function(e){
			$('.page-row').each(function(){				
				if($(this).hasClass('g-active')){
					if($('.page-row').length > 1) {
						$(this).remove();
					}else {
						$('button#delete-page').css('cursor', 'default')
					}
					$('.page-row:last-child').addClass('g-active');
				}
			})
		})
		// Add new Page row
		var counter = 1;			
    $('button#create-new').on('click', function(e){
			 //counter++;
			$('.page-row').each(function(){
				$(this).removeClass('g-active');
			})
			if($('.page-row').length < 2) {
				counter = 2;
			}else {
				counter++;
			}
			var pid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			var page_html =  $("<div></div>").attr("class", "d-flex page-row align-items-center g-active").attr('id', 'page-'+pid)
			.append(
				$("<span></span>").attr("class", "d-flex page-title-group align-items-center")
				.append($("<span></span>").attr("class", "page-icon far fa-file"))
				.append($("<span></span>").attr("class", "page-title").text('Page '+ counter +''))
			).append(
			  $('<span/>', {
					"class": "page-action c-pointer fas fa-unlock-alt fa fa-flip-horizontal",
					"data-title": "Toggle Locker",
					"data-placement": "bottom",
					"data-toggle": "tooltip",
					"onmouseover": "tooltipfn(this)",
				})
			).append(
			  $('<span/>', {
					"class": "page-action c-pointer fas fa-eye",
					"data-title": "Toggle Visibility",
					"data-placement": "bottom",
					"data-toggle": "tooltip",
					"onmouseover": "tooltipfn(this)",
				})
			)
			$('#pages').append(page_html);
		})
		//Page tools action
		$('.page-action.fa-unlock-alt').each(function(){
			$(this).on('click', function(){
				$(this).removeClass('fa-unlock-alt');
				$(this).addClass('fa-lock');
			})
		})
		$('.page-action.fa-lock').each(function(){
			$(this).on('click', function(){
				$(this).removeClass('fa-lock');
				$(this).addClass('fa-unlock-alt');
			})
		})
		$('.page-action.fa-eye').each(function(){
			$(this).on('click', function(){
				$(this).removeClass('fas fa-eye');
				$(this).addClass('far fa-eye-slash');
			})
		})
		$('.page-action.fa-eye-slash').each(function(){
			$(this).on('click', function(){
				$(this).removeClass('far fa-eye-slash');
				$(this).addClass('fas fa-eye');
			})
		})
		
		// Delete Page row
		$('button#delete-layer').on('click', function(e){
			e.preventDefault();
			if( $('.layer-row.g-active').length === 1 ){
				var layerId = $('.layer-row.g-active').attr('id');
				if(layerId !== 'undefined'){
					$('#'+layerId).remove();
					removeTextarea();					
					var selectedLayerStage = stage.find('#'+layerId);
					if(selectedLayerStage == '') { 
						$('.layer-row:first-child').addClass('g-active');
						return;
					} else {
						//stage.find('#'+layerId).remove();
						selectedLayerStage[0].remove();
						stage.find('Transformer').destroy(); // make it hide when doing undo
						layer.draw();
						$('.layer-row:first-child').addClass('g-active');
						var fr = $('.layer-row.g-active').attr('id');
						var s = stage.find('#'+fr);
						if(s == '') {
							return;
						} else {
							if(s[0].hasName('text')){
								makeTextResizeable(s[0]);
							} else {
								Fntransformer(s[0]);
							}
							layer.draw();
						}
					}				
				}
			}
			
		});
		// Add new Layer row
		var count_layer = 0;			
    $('button#create-new-layer').on('click', function(e){
			//count_layer++;
			$('.layer-row').each(function(){
				$(this).removeClass('g-active');
			});
			if($('.layer-row').length == 0) {
				count_layer = 0;
			}else {
				count_layer++;
			}
			var lid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			var layer_html =  $("<div></div>").attr("class", "d-flex layer-row align-items-center g-active").attr('id', 'layer-'+lid).attr('onclick', 'layerClick(this)')
			.append(
				$("<span></span>").attr("class", "d-flex layer-title-group align-items-center")
				.append($("<span></span>").attr("class", "layer-icon fas fa-folder"))
				.append($("<span></span>").attr("class", "layer-title").text('Layer '+ count_layer +''))
			).append(
			  $('<span/>', {
					"class": "layer-action c-pointer fas fa-unlock-alt fa fa-flip-horizontal",
					"data-title": "Toggle Locker",
					"data-placement": "bottom",
					"data-toggle": "tooltip",
					"onmouseover": "tooltipfn(this)",
				})
			).append(
			  $('<span/>', {
					"class": "layer-action c-pointer fas fa-eye",
					"data-title": "Layer Visibility",
					"data-placement": "bottom",
					"data-toggle": "tooltip",
					"onmouseover": "tooltipfn(this)",
				})
			)
			.append(
			  $('<span/>', {
					"class": "layer-action c-pointer far fa-dot-circle",
					"data-title": "Toggle Outline",
					"data-placement": "bottom",
					"data-toggle": "tooltip",
					"onmouseover": "tooltipfn(this)",
				})
			)
			.append(
			  $('<span/>', {
					"class": "layer-action c-pointer layer-color g-pattern-chooser-simplified",
					"data-title": "Toggle Outline",
					"data-placement": "bottom",
					"data-toggle": "tooltip",
					"onmouseover": "tooltipfn(this)",
				}).append(
					$('<span/>', {
						"class": "layer-action c-pointer layer-color g-pattern-chooser-simplified",
					}).append(
						$('<span/>', {
							"class": "preview",
							"draggable": true,
							"style": {'height': '100%', 'background': 'linear-gradient(rgb(0, 168, 255), rgb(0, 168, 255)), url(&quot;data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IndoaXRlIi8+PHJlY3Qgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI0NEQ0RDRCIvPjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNDRENEQ0QiLz48L3N2Zz4=&quot;)'},
						})
					)
				)
			)
			$('#layers').prepend(layer_html);
		});
	}
	
	/**
	 * return Right Sidebar
	 */
	function RightSidebars (){	
    var RsidebarBarBuilder = [];

		var $toolbarPanel_1 = [];
		var $toolbarPanel_2 = [];
		var $toolbarPanel_3 = [];
		var $propertyPanel_1 = [];
		var $propertyPanel_2 = [];
		var $propertyPanel_3 = [];
		var $propertyPanel_4 = [];
		var $propertyPanel_5 = [];
		var $propertyPanel_6 = [];
		var $propertyPanel_7 = [];
		
		//$propertyPanel_1
		$toolbarPanel_1.push('<div class="toolbar main-toolbar justify-content-between align-items-center" style="display:none;">')
		$.each(talignments, function (a, alignment) {
			$toolbarPanel_1.push('<button onmouseover="tooltipfn(this)" class="fs-18" data-action="' + alignment.Action + '" data-toggle="tooltip" data-placement="bottom" data-title="' + alignment.Name + '"><i class="' + alignment.Icon + '"></i></button><span class="' + alignment.Divider + '"></span>')
		})
		$toolbarPanel_1.push('</div>');
		$toolbarPanel_1 = $toolbarPanel_1.join('');		
		$propertyPanel_1.push('<div class="properties-panel main-toolbar" style="display:none;">')
		$.each(Rightproperty, function (r, Rproperty) {
			if(Rproperty.Ratio != ''){
				var $cont = '<div class="content align-items-center d-flex fs-8" style="height:22px;"><span class=' + Rproperty.Ratio + ' onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom" data-title="Keep Ratio" data-ratio="no" style="text-align: center; cursor: pointer;"></span></div>';
				var cClass = 'column';
			} else {
				var $cont = '&nbsp;';
				var cClass = 'column p-0';
			}
			if(Rproperty.Input_2 == 'Transform'){
				var input2 = '<button id='+ Rproperty.InputId_2 +' onclick="updateSelectedLayerTransform()" class="transform-button">'+Rproperty.Input_2+'</button>';
			} else {
				var input2 = '<div><span class="g-input-label">' + Rproperty.Input_2 + '</span><input id='+ Rproperty.InputId_2 +' type="number" data-dimension=' + Rproperty.Dimension_2 + ' class="w-100" style="padding-left: 20px;"></div>';
			}
			$propertyPanel_1.push('<div class="g-property-row"><label><span class="vertical-align">'+ Rproperty.Name +'</span></label><div class="columns d-flex"><div class="column d-flex flex-column align-items-center" style="width: 44%;"><div class="content w-100"><div><span class="g-input-label">' + Rproperty.Input_1 + '</span><input id='+ Rproperty.InputId_1 +' type="number" min=0 data-dimension=' + Rproperty.Dimension_1 + ' class="w-100" style="padding-left: 20px;"></div></div></div><div class='+ cClass +' style="width: 12%;">'+ $cont +'</div><div class="column d-flex flex-column align-items-center" style="width: 44%;"><div class="content w-100">'+ input2 +'</div></div></div></div>')
		})		
		$propertyPanel_1.push('</div>')
		$propertyPanel_1 = $propertyPanel_1.join('');
		
		//$propertyPanel_2
		$toolbarPanel_2.push('<div class="toolbar transform justify-content-between align-items-center" style="display:none;"><label>Transform</label><button data-action="stroke-settings" data-title="Advanced settings"><span class="gravit-icon-settings"></span></button></div>')		
		$propertyPanel_2.push('<div class="properties-panel transform" style="display:none;">')
		$.each(Rightproperty_2, function (r, Rproperty_2) {
			if (Rproperty_2.Name == 'Copies') {
				var $hr = '<hr>';
				var input2 = '<div class="column p-0" style="width: 44%;"><div class="d-flex w-100 justify-content-center"><div data-property="pivot" class="g-pivot align-self-center"><div class="borderline"></div><div class="side" data-side="tl"></div><div class="side" data-side="tc"></div><div class="side" data-side="tr"></div><div class="side g-active" data-side="rc"></div><div class="side" data-side="br"></div><div class="side" data-side="bc"></div><div class="side" data-side="bl"></div><div class="side" data-side="lc"></div><div class="side" data-side="cc"></div></div></div></div>';
			} else {
				var $hr = '';
				var input2 = '<div class="column d-flex flex-column align-items-center" style="width: 44%;"><div class="content w-100"><div><span class="g-input-label">' + Rproperty_2.Input_2 + '</span><input id='+ Rproperty_2.InputId_2 +' value='+ Rproperty_2.Value_2 +' type="number" min=0 max='+ Rproperty_2.Max_2 +' data-property=' + Rproperty_2.Property_2 + ' class="w-100" style="padding-left: 20px;"></div></div></div>';
			}
			$propertyPanel_2.push($hr+'<div class="g-property-row"><label><span class="vertical-align">'+ Rproperty_2.Name +'</span></label><div class="columns d-flex"><div class="column d-flex flex-column align-items-center" style="width: 44%;"><div class="content w-100"><div><span class="g-input-label">' + Rproperty_2.Input_1 + '</span><input id='+ Rproperty_2.InputId_1 +' value='+ Rproperty_2.Value_1 +' type="number" min=0 max='+ Rproperty_2.Max_1 +' data-property=' + Rproperty_2.Property_1 + ' class="w-100" style="padding-left: 20px;"></div></div></div><div class="content p-0" style="width: 12%;">&nbsp;</div>'+ input2 +'</div></div>')
		})
		$propertyPanel_2.push('<div class="g-property-row"><label><span class="vertical-align"></span></label><div class="columns d-flex"><div class="content w-100"><button class="transform-button w-100" style="margin-top: 5px;">Apply</button></div></label></div></div><br>')
		$propertyPanel_2.push('</div>')
		$propertyPanel_2 = $propertyPanel_2.join('');

		//$propertyPanel_3
		var activepage = $('.page-row.g-active .page-title').text();
		$propertyPanel_3.push('<div class="toolbar justify-content-between align-items-center page-toolbar"><label>Page ('+ activepage +')</label></div>')
		
		var color = '<div class="column w-25"><div class="content"><div class="g-color-picker text-center"><span id="km-colorpicker" onclick="FncolorPicker(this)" data-title="km-chosen-color" class="km-colorpick fs-22"></span></div></div><input class="d-none" value="#fff" id="km-chosen-color"></div>';

		var w = '<div class="column w-25"><div class="content"><div><span class="g-input-label">W</span><input type="number" value="886" min=0 data-property="w" id="canvas-width" class="w-100" style="padding-left: 20px;"></div></div></div>';

		var h = '<div class="column w-25"><div class="content"><div><span class="g-input-label">H</span><input type="number" value="'+ window.innerHeight +'" min=0 data-property="h" id="canvas-height" class="w-100" style="padding-left: 20px;"></div></div></div>';

		var opacity = '<label class="column w-25"><div class="content"><input value="100%" type="text" data-property="bop"></div></label>';

		$propertyPanel_3.push('<div class="properties-panel page-properties-panel"><div data-property-row="canvas-size" class="g-property-row text-center"><div class="columns d-flex m-0">'+ color +' '+ w +' '+ h +' '+ opacity +' </div><div class="labels mt-1 ml-0 text-center"><label  class="w-25 mt-2"><span>Color</span></label><label class="w-25"><span>Width</span></label><label class="w-25"><span>Height</span></label><label  class="w-25"><span>Opacity</span></label></div>')
		
		$propertyPanel_3.push('</div><hr>')
		$propertyPanel_3 = $propertyPanel_3.join('');
		
		//$propertyPanel_4
		$propertyPanel_4.push('<div class="g-property-row"><div class="columns ml-0 d-flex"><div class="column d-flex flex-row align-items-center w-25"><div class="content"><span>Page Size</span></div></div>')		
		$.each(Rightproperty_4, function (r4, Rproperty_4) {
			if (Rproperty_4.Label == 'Preset Size') {
				var options = [];
				var width = '30%';
				$.each(Rproperty_4.Group, function (po, presetgroup) {
					options.push('<optgroup label="'+ presetgroup.Name +'">')
					$.each(presetgroup.Options, function (po, presetoption) {
						options.push('<option data-preset-id='+ presetgroup.PresetId +' value='+ presetoption.Value +'>'+ presetoption.Name +'</option>')
					})	
					options.push('</optgroup>');
				})
				options = options.join('');
				var $label = '<select data-property="preset-size" class="w-100">'+ options +'</select>';
			} else {
				var width = '15%';
				var $label = '<button data-property="'+ Rproperty_4.Property +'" onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom" data-title="'+ Rproperty_4.Label +'" '+ Rproperty_4.Disabled +'><span class="'+ Rproperty_4.Icon +'"></span></button>';
			}
			$propertyPanel_4.push('<label class="column d-flex flex-row align-items-center" style="width: '+ width +';"><div class="content">'+ $label +'</div></label>')
		})
		$propertyPanel_4.push('</div></div><hr>')
		$propertyPanel_4.push('<div class="g-property-row"><div class="columns ml-0 d-flex"><div class="column d-flex flex-row align-items-center w-25"><div class="content"><span>Bleed</span></div></div><label class="column w-25"><div class="content"><input value="0" type="number" min=0 max=100 data-property="bleed"></div></label></div></div><hr>')
		$propertyPanel_4 = $propertyPanel_4.join('');
		
		//$propertyPanel_5
		$propertyPanel_5.push('<div class="g-property-row"><div class="columns ml-0 d-flex"><div class="column d-flex flex-row align-items-center w-25"><div class="content"><span>Margin</span></div></div>')
		$.each(Rightproperty_5, function (r5, Rproperty_5) {
			$propertyPanel_5.push('<label class="column d-flex flex-row align-items-center" style="width: 18%;"><div class="content"><input value="0" type="number" data-property="'+ Rproperty_5.Property +'"></div></label>')
		})
		$propertyPanel_5.push('</div>')
		$propertyPanel_5.push('<div class="labels mt-1"><label class="w-25">&nbsp;</label>')
		$.each(Rightproperty_5, function (r5l, Label) {
			$propertyPanel_5.push('<label style="width: 15%;"><span>'+ Label.Name +'</span></label>')
		})
		$propertyPanel_5.push('</div></div><br>')
		$propertyPanel_5 = $propertyPanel_5.join('');
		
		//$propertyPanel_6
		$propertyPanel_6.push('<div class="toolbar justify-content-between align-items-center" style=""><label>Document</label></div><div class="properties-panel"><div class="g-property-row"><div class="columns ml-0 d-flex"><div class="column d-flex flex-row align-items-center w-25"><div class="content"><span>Unit</span></div></div><label class="column d-flex flex-row align-items-center w-75"><div class="content"><select data-property="measurements"><option value="in">Inches</option><option value="px">Pixels</option></select></div></label></div></div><hr><div class="g-property-row"><div class="columns ml-0 d-flex"><div class="column d-flex flex-row align-items-center w-25"><div class="content"><span>DPI</span></div></div><div class="column d-flex flex-row align-items-center w-75"><div class="content"><input type="number" value="72" min=72 max=300></div></div></div></div><hr>')		
		$propertyPanel_6.push('</div></div>')
		$propertyPanel_6 = $propertyPanel_6.join('');
		
		//$propertyPanel_3
	 	$toolbarPanel_3.push('<div class="toolbar appearance-toolbar justify-content-between align-items-center" style="display:none;"><label>Appearance</label><button data-action="stroke-settings" data-title="Advanced settings"><span class="icon-settings"></span></button></div>')		
		$propertyPanel_7.push('<div class="properties-panel appearance-properties-panel"><div class="appearance-property-panel text-properties-panel" style="display:none;">')
		var $ffamily = $FStylelabel = $Fsizelabel = $hr = $scriptLabel = '';
		var decoration = [];
		var alignments = [];
		var vertical = [];
		var spacing = [];
		var sizing = [];
		var acolor = '<div class="column w-25"><div class="content"><div class="g-pattern-chooser text-center d-flex flex-column"><span id="text-colorpicker" onclick="FncolorPicker(this)" data-title="text-chosen-color" class="km-colorpick fs-22"></span><span class="mt-38">Color</span></div></div><input class="d-none" value="#000" id="text-chosen-color"></div>';
		$scaleonresize = '<div class="g-property-row"><div class="columns d-flex ml-2"><div class="column d-flex auto-grow"><div class="content d-flex"><label><input type="checkbox" id="scaleonresize"/><label class="checkb" for="scaleonresize"></label><span class="ml-2">Scale font on resizing</span></label></div></div></div></div>';
		
		$.each(Rightproperty_7, function (rp7, Rproperty_7) {		
			if(Rproperty_7.Name == 'FFamily'){
				var FFamily = [];
					$.each(Rproperty_7.Options, function (rp1, family) {
						if(family.Name == 'Open Sans'){var selected = 'selected';} else {var selected = '';}
						FFamily.push("<option style='font-family:"+ family.Name +"' value='"+ family.Name +"' "+ selected +">"+ family.Name +"</option>")
					})	
				FFamily = FFamily.join('');
				$ffamily = '<div class="column d-flex flex-row align-items-center" style="width:70%;"><div class="content"><select data-property="preset-font-family" class="w-100" onchange="textUpdatefFamily(this)" id="ffamily">'+ FFamily +'</select></div></div>';
			}
			if(Rproperty_7.Name == 'FStyle'){
				var FStyle = [];
					$.each(Rproperty_7.Options, function (rp2, fstyle) {
						if(fstyle.Value == '400#N'){var selected = 'selected';} else {var selected = '';}
						/* var optId = fstyle.Name;
						optId = optId.split(' ').map(function (s, i) {
							return i && s.length ? s.toLowerCase() : s.toLowerCase();
						}).join('-'); */
						FStyle.push('<option value='+ fstyle.Value +' '+ selected +'>'+ fstyle.Name +'</option>')
					})	
				FStyle = FStyle.join('');
				$FStylelabel = '<div class="column d-flex flex-row align-items-center" style="width:70%;"><select data-property="preset-font-style" class="w-100" onchange="textUpdatefStyle(this)" id="fstyle">'+ FStyle +'</select></div>';
			}
			if(Rproperty_7.Name == 'FSize'){
				var FSize = [];
					$.each(Rproperty_7.Options, function (rp3, fsize) {
						if(fsize.Value == 21){var selected = 'selected';} else {var selected = '';}
						FSize.push('<option value='+ fsize.Value +' '+ selected +'>'+ fsize.Name +'</option>')
					})	
				FSize = FSize.join('');
				$Fsizelabel = '<div class="column d-flex flex-row align-items-center w-25"><select data-property="preset-font-style" class="w-100" id="fsize" onchange="textUpdatefSize(this)">'+ FSize +'</select></div>';
			}
			
		  if(Rproperty_7.Name == 'Decoration'){
				$hr = '<hr>';				
				$.each(Rproperty_7.Items, function (rp4, ritems) {
					if(ritems.Name == 'Bold' || ritems.Name == 'Italic') {
						var oc = '';
					} else {
						var oc = 'onclick="applyTextDecoration(this)"';
					}
					decoration.push('<div class="column d-flex flex-row align-items-center w-23"><div class="content"><button '+ oc +' id="'+ ritems.Id +'" data-property="'+ ritems.Id +'" onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom" data-title="'+ ritems.Name +'"><span class="'+ ritems.Icon +'"></span></button></div></div>')
				})
				decoration = decoration.join('');
			}
			
			if(Rproperty_7.Name == 'Alignments'){
				$.each(Rproperty_7.Items, function (rp5, aitems) {
					if(aitems.Name == 'Align Left'){
						var activeclass = 'g-active';
					} else {
						var activeclass = '';
					}
					alignments.push('<div class="column d-flex flex-row align-items-center w-23"><div class="content"><button onclick="TextAlignment(this)" value="'+ aitems.Value +'" id="'+ aitems.Id +'" class="'+ activeclass +' align" data-property="'+ aitems.Id +'" onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom" data-title="'+ aitems.Name +'"><span class="'+ aitems.Icon +'"></span></button></div></div>')
				})
				alignments = alignments.join('');
			}
			
			if(Rproperty_7.Name == 'Vertical'){
				$.each(Rproperty_7.Items, function (rp6, vitems) {
					if(vitems.Name == 'Align Top'){
						var activeclass = 'g-active';
					} else {
						var activeclass = '';
					}
					vertical.push('<div class="column d-flex flex-row align-items-center w-23"><div class="content"><button onclick="TextAlignment(this)" value="'+ vitems.Value +'" id="'+ vitems.Id +'" class="'+ activeclass +' valign" data-property="'+ vitems.Id +'" onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom" data-title="'+ vitems.Name +'"><span class="'+ vitems.Icon +'"></span></button></div></div>')
				})
				vertical = vertical.join('');
			}
			
			if(Rproperty_7.Name == 'Spacing'){
				$.each(Rproperty_7.Items, function (rp7, sitems) {
					if(sitems.Name == 'Line'){
						var percent = '<button class="percent-style">%</button>';
						var width = 'w-30';
					} else {
						var percent = '';
						var width = 'w-25';
					}
					spacing.push('<div class="column d-flex flex-row align-items-center '+ width +'"><div class="content"><input value="'+ sitems.Value +'" id="'+ sitems.Id +'" min='+ sitems.Min +' type="number" data-property="'+ sitems.Id +'" data-title="'+ sitems.Name +'"/>'+ percent +'</div></div>')
				})
				spacing = spacing.join('');
			}
			
			if(Rproperty_7.Name == 'Sizing'){
				sizing.push('<div class="columns ml-0 d-flex">')
				$.each(Rproperty_7.Items, function (rp8, siitems) {
					if(siitems.Button_1 == 'Fix' || siitems.Button_2 == 'Fix'){
						var selected = 'g-active';
					} else{
						var selected = '';
					}
					sizing.push('<div class="column d-flex flex-row align-items-center w-45"><div class="content d-flex"><button onclick="FnSizing(this)" class="w-100 g-group-start '+ siitems.Class_1 +'" id="'+ siitems.Id_1 +'">'+ siitems.Button_1 +'</button><button onclick="FnSizing(this)" id="'+ siitems.Id_2 +'" class="w-100 g-group-end '+ siitems.Class_2 +' '+ selected +'">'+ siitems.Button_2 +'</button></div></div>')
				})
				sizing.push('</div>')
				sizing.push('<div class="labels"><label class="text-center w-50"><span>Width</span></label><label class="text-center w-50"><span>Height</span></label></div>')
				sizing = sizing.join('');
			} 
			
			if(Rproperty_7.Name == 'Script'){
				var Script = [];
					$.each(Rproperty_7.Options, function (rp9, scitems) {
						if(scitems.Name == 'Left-to-right'){var selected = 'selected';} else {var selected = '';}
						Script.push('<option '+selected+' value='+ scitems.Value +'>'+ scitems.Name +'</option>')
					})	
				Script = Script.join('');
				$scriptLabel = '<div class="column d-flex flex-row align-items-center w-50"><select onchange="FnRotation(this)" class="w-100" id="script">'+ Script +'</select></div>';
			}	
		})
		
		$propertyPanel_7.push('<div class="g-property-row text-center"><div class="columns d-flex m-0">'+ acolor +' '+$ffamily+'</div></div>')
		$propertyPanel_7.push('<div class="g-property-row text-center"><div class="columns d-flex">'+ $FStylelabel +' '+ $Fsizelabel +' </div><div class="labels mt-1 text-center"><label style="width:70%;"><span style="font-size: 10px;">Weight</span></label><label class="w-25"><span style="font-size: 10px;">Size</span></label></div></div>')
		$propertyPanel_7.push($hr+'<div class="g-property-row"><label class="ml-2"><span class="vertical-align">Decoration</span></label><div class="columns decoration ml-0 d-flex">'+ decoration +'</div></div>'+$hr)
		$propertyPanel_7.push('<div class="g-property-row"><label class="ml-2"><span class="vertical-align">Alignments</span></label><div class="columns alignments ml-0 d-flex">'+ alignments +'</div></div>')
		$propertyPanel_7.push('<div class="g-property-row"><label class="ml-2"><span class="vertical-align">Vertical</span></label><div class="columns alignments ml-0 d-flex">'+ vertical +'</div></div>')
		$propertyPanel_7.push('<div class="g-property-row"><label class="ml-2"><span class="vertical-align">Spacing</span></label><div class="columns spacing ml-0 d-flex">'+ spacing +'</div></div>')
		$propertyPanel_7.push('<div class="g-property-row"><label class="ml-2"><span class="vertical-align">Sizing</span></label>'+ sizing +'</div>')
		$propertyPanel_7.push('<div class="g-property-row"><label class="ml-2"><span class="vertical-align">Script</span></label><div class="columns script ml-0 d-flex">'+ $scriptLabel +'</div></div>')
		$propertyPanel_7.push($scaleonresize)
			
		$propertyPanel_7.push('</div></div>')
		$propertyPanel_7 = $propertyPanel_7.join('');
		
		RsidebarBarBuilder.push('<div class="sidebar-container sidebar-inspector d-flex flex-column"><div class="panels flex-grow">'+ $toolbarPanel_1 +' '+ $propertyPanel_1 +' '+ $toolbarPanel_2 +' '+ $propertyPanel_2 +' '+ $propertyPanel_3 +' '+ $propertyPanel_4 +' '+ $propertyPanel_5 +' '+ $propertyPanel_6 +' '+ $toolbarPanel_3 +' '+ $propertyPanel_7 +'</div></div>');

	  $('#right-sidebar').append(RsidebarBarBuilder.join(''));
		
		var ew = new elemAttr('canvas-width', 'width');
		ew.keyAction();
		var eh = new elemAttr('canvas-height', 'height');
		eh.keyAction();
		
		$('#right-sidebar .text-properties-panel .alignments button').each(function(){
			$(this).on('click touch', function(e){
				e.preventDefault();
				e.stopPropagation();
				if($(this).hasClass('align')){
					$('#right-sidebar .text-properties-panel .alignments button.align').removeClass('g-active');
				}else if($(this).hasClass('valign')){
					$('#right-sidebar .text-properties-panel .alignments button.valign').removeClass('g-active');  
				}
				$(this).toggleClass('g-active');
			})
		});
		$('#right-sidebar .text-properties-panel button.sizing-width').each(function(){
			$(this).on('click touch', function(e){
				e.preventDefault();
				e.stopPropagation();
				$('#right-sidebar .text-properties-panel button.sizing-width').removeClass('g-active');
				$(this).toggleClass('g-active');
			})
		});
		$('#right-sidebar .text-properties-panel button.sizing-height').each(function(){
			$(this).on('click touch', function(e){
				e.preventDefault();
				e.stopPropagation();
				$('#right-sidebar .text-properties-panel button.sizing-height').removeClass('g-active');
				$(this).toggleClass('g-active');
			})
		});
		$('#right-sidebar .text-properties-panel .decoration button').each(function(){
			$(this).on('click touch', function(e){
				e.preventDefault();
				e.stopPropagation();
				$(this).toggleClass('g-active');				
			})
		});
    
    var cs = new elemAttr('char-spacing', null);
		cs.keyAction();
		
		$('#text-bold').on('click', function(){
			var fstyle = document.getElementById('fstyle');
			if($(this).hasClass('g-active')){
				var bn = fstyle.querySelectorAll('option[value="700#N"]');
				if (bn.length === 1) {
					fstyle.selectedIndex = bn[0].index;
				}
				if($('#text-itallic').hasClass('g-active')){
					var bi = fstyle.querySelectorAll('option[value="700#I"]');
					if (bi.length === 1) {
						fstyle.selectedIndex = bi[0].index;
					}
				}
			} else {
				var n = fstyle.querySelectorAll('option[value="400#N"]');
				if (n.length === 1) {
					fstyle.selectedIndex = n[0].index;
				}
				if($('#text-itallic').hasClass('g-active')){
					var ni = fstyle.querySelectorAll('option[value="400#I"]');
					if (ni.length === 1) {
						fstyle.selectedIndex = ni[0].index;
					}
				}
			}
			//var element = document.getElementById('fstyle');
			var event = new Event('change');
			fstyle.dispatchEvent(event);
		});
		$('#text-itallic').on('click', function(){
			var fstyle1 = document.getElementById('fstyle');
			if($(this).hasClass('g-active')){
				var ni = fstyle1.querySelectorAll('option[value="400#I"]');
				if (ni.length === 1) {
					fstyle1.selectedIndex = ni[0].index;
				}
				if($('#text-bold').hasClass('g-active')){
					var bi = fstyle1.querySelectorAll('option[value="700#I"]');
					if (bi.length === 1) {
						fstyle1.selectedIndex = bi[0].index;
					}
				}
			} else {
				var n = fstyle1.querySelectorAll('option[value="400#N"]');
				if (n.length === 1) {
					fstyle1.selectedIndex = n[0].index;
				}
				if($('#text-bold').hasClass('g-active')){
					var n = fstyle1.querySelectorAll('option[value="700#N"]');
					if (n.length === 1) {
						fstyle1.selectedIndex = n[0].index;
					}
				}
			}			
			var event = new Event('change');
			fstyle1.dispatchEvent(event);
		});
	}
	
	function pageClick(e){ 
		$('.page-row.g-active').removeClass('g-active');
		$(e).addClass('g-active');
	}
	
	function layerClick(e){ 
		$('.layer-row.g-active').removeClass('g-active');
		stage.find('Transformer').destroy();
		$(e).addClass('g-active');
		var layerId = $('.layer-row.g-active').attr('id');
		var selectedLayerStage = stage.find('#'+layerId);
		if(selectedLayerStage != ''){
			if(selectedLayerStage[0].hasName('selectedLayer') === false){
				selectedLayerStage[0].addName('selectedLayer');
			}
			if(selectedLayerStage[0].hasName('text') === true){
				makeTextResizeable(selectedLayerStage[0]);
			} else {
			Fntransformer(selectedLayerStage[0]);
			}
      layer.draw();      
		}
	}
	
	/**
	 * return Window/canvas Panel
	 */
	function newCanvasLayer () {
		if(producTypeName !== ''){
			$('#header .tabs .tab.g-active').removeClass('g-active');

			$("<div></div>").addClass("tab g-active").append($("<span></span>").addClass("title c-pointer").attr('design', 'untitled').attr('onclick', 'FntemplateSwitch(this)').append('Untitled*')).append($("<span/>", {'class': 'close c-pointer', 'designid': 'untitled', 'onclick': 'FntemplateClose(this)', 'html': '✕'})).appendTo('#header .tabs');
			var Docurl = window.location.href;
			var t = checkDesign();
			if(t === true){
				Docurl = Docurl.split('?')[0];
				window.history.pushState("object or string", 'title', Docurl );
			}
			document.title = 'Untitled | KaboodleMedia';
		}
		if($('#elem-measurement').val() === 'pixels'){
			cunit = 'px';
		} else {
			cunit = 'in';
		}
		productName = $('.nav-item.nav-link.active').text();
		productId = $('.product-item.active').attr('data-group');
		producTypeId = $('.product-item.active').attr('data-tid');
		producTypeName = $('.product-item.active').attr('data-name');
		this.width = $('#elem-width').val();
		this.height = $('#elem-height').val();
		this.unit = $('#elem-measurement').val();
		$('#canvas-width').val(this.width);     			
		$('#canvas-height').val(this.height);   		
		$('#panels').width(this.width);     			
		$('#panels').height(this.height);
		stage.width(this.width);
		stage.height(this.height);
		stage.draw();
		$('#modal').modal('hide');
		console.log('producTypeId - '+ producTypeId);
		console.log('producTypeName - '+ producTypeName);
		console.log('productId - '+ productId);
		console.log('productName - '+ productName);
		if(producTypeId !== ''){
      console.log('tools-2');
			getProductName(producTypeId);
		}
	}
	
	function FntemplateSwitch(e){	
		$('#header .tabs .tab.g-active').removeClass('g-active');
		$(e).parent('.tab').addClass('g-active');
		var DocDesign = $(e).attr('design');
		var Doctitle = $(e).text();
		Doctitle = Doctitle.split('*')[0];
		document.title = Doctitle+' | KaboodleMedia';
		if(DocDesign === 'untitled' || typeof DocDesign === 'undefined'){
			//alert(1);
		} else if(DocDesign !== 'untitled' || typeof DocDesign !== 'undefined'){
			queryString.push('d', DocDesign);
			//canvas.loadFromJSON(saved_template_json, canvas.renderAll.bind(canvas), function(o, object) {});
		}		
	}
	
	function FntemplateClose(e){
		var Docurl = window.location.href;
		var Doctitle = $('#header .tabs .tab.g-active .title').text();
		Doctitle = Doctitle.split('*')[0];
		var designId = $(e).attr('designid');
		var tablength = $('#header .tabs .tab').length;
		//alert('designId - ' + designId);
		if((designId === 'untitled' || typeof designId === 'undefined') && tablength === 1){
			//alert(11);
			$('#header .tabs .tab').remove();
			document.title = 'Untitled | KaboodleMedia';
			$('#modal').modal('show');
			//reset canvas
		} else if((designId !== 'untitled' || typeof designId !== 'undefined') && tablength === 1){
			//alert(2);
			Docurl = Docurl.split('?')[0];
			window.history.pushState("object or string", 'title', Docurl );
			document.title = 'Untitled | KaboodleMedia';
			$('#header .tabs .tab').remove();
			$('#modal').modal('show');
			//reset canvas
		} else if((designId === 'untitled' || typeof designId === 'undefined') && tablength > 1){
			$(e).parent('.tab').prev('.tab').addClass('g-active');
			var s = $(e).parent('.tab').prev('.tab').children('span.title').attr('design');
			var st = $(e).parent('.tab').prev('.tab').children('span.title').text();
			$(e).parent('.tab').remove();
			if(s !== 'untitled' || typeof s !== 'undefined'){
				queryString.push('d', s);
				document.title = st+' | KaboodleMedia';
				//reload canvas
			}
		} else if((designId !== 'untitled' || typeof designId !== 'undefined') && tablength > 1){
			$(e).parent('.tab').prev('.tab').addClass('g-active');
			var s = $(e).parent('.tab').prev('.tab').children('span.title').attr('design');
			var st = $(e).parent('.tab').prev('.tab').children('span.title').text();
			$(e).parent('.tab').remove();
			if(s !== 'untitled' || typeof s !== 'undefined'){
				queryString.push('d', s);
				document.title = st+' | KaboodleMedia';
				//reload canvas
			}
		}
	}
	
	function FncolorPicker(e){
		var id = $(e).attr('data-title');
		$('#right-sidebar .sidebar-inspector').addClass('sidebar-overlay');
    $('#'+e.id).css('background', $('#'+id).val());    
    colorPickerDefaultInline = new ColorPicker.Default('#'+id, {
      inline: true,
    });
    colorPickerDefaultInline.on('change', function(color) {
      //console.log(color.hex);
      $('#'+e.id).css('background', color.hex);    
      if(e.id === 'text-colorpicker'){
        if($('#drawtext').length === 1){
          textarea.style.color = color.hex;					
        }
        var node = stage.find('.selectedLayer')[0];
        if(typeof node === 'undefined') return;			
        node.fill(color.hex);
        layer.draw();
        destroyTr = true;     
      } else if(e.id === 'km-colorpicker'){
        $('#'+e.id).css('background', color.hex);
        var canvas = document.getElementsByTagName("canvas")[0];
        stage.container().style.background = color.hex;
        canvas.style.background = color.hex;  
        stage.draw();
        // do the struff here
      }
    });
	}
	
	function addtextallow(data) {
		$( ".konvajs-content" ).removeClass( "g-cursor-select" );
		$( ".konvajs-content" ).addClass( "g-cursor-cross" );
		$('.toolbar.main-toolbar').addClass('d-flex');
		$('.properties-panel.main-toolbar').addClass('d-block');
		$('.toolbar.page-toolbar').removeClass('d-flex').addClass('d-none');
		$('.properties-panel.page-properties-panel').removeClass('d-block').addClass('d-none');
		$('.toolbar.appearance-toolbar').addClass('d-flex');
		$('.properties-panel.appearance-properties-panel .text-properties-panel').addClass('d-block');
		actionmode = "addtext";
	}
	
	function updateSelectedLayerTransform(){
		var node = stage.find('.selectedLayer')[0];
		if(typeof node === 'undefined') return;
		var px = $('#pos-x').val();
		var py = $('#pos-y').val();
		var pw = $('#size-width').val();
		var ph = $('#size-height').val();
		var pa = $('#angle').val();
		//node.rotation(pa);
		rotateAroundCenter(node, pa);
		node.absolutePosition({
			x: px,
			y: py
		});

		var box = node.getClientRect({
			skipTransform: true,
			relativeTo: layer
		});
		
		var scale = [
			pw / (box.width),
			ph / (box.height)
		];

		node.width(node.width() * scale[0]);
		node.height(node.height() * scale[1]);
		
		layer.draw();
		if(node.hasName('text') === true){
			makeTextResizeable(node);			
		} else {
			Fntransformer(node);
		}
		updateProperties(node);
		//destroyTr = true;
	}
  
	//New tranformer object for all except Text tool
  function Fntransformer(node){
    var tr = new Konva.Transformer({
      node: node,
      anchorStroke: '#fff',
      anchorFill: '#2880E6',
      borderStroke: '#2880E6',
      anchorCornerRadius: 50,
      borderStrokeWidth: 1,
      anchorStrokeWidth: 2,
      anchorSize: 10,			
      padding: 2,			
    });
    layer.add(tr);
  }
	
	//New transformer object for Text tool
	function makeTextResizeable(textNode){
		stage.find('Transformer').destroy();
		var tr = new Konva.Transformer({
			anchorStroke: '#fff',
      anchorFill: '#2880E6',
      borderStroke: '#2880E6',
      anchorCornerRadius: 50,
      borderStrokeWidth: 1,
      anchorStrokeWidth: 2,
      anchorSize: 10,
      padding: 2,
			boundBoxFunc: function (oldBoundBox, newBoundBox) {
				if (newBoundBox.width > MAX_WIDTH || newBoundBox.width < textNode.fontSize()) {
					return oldBoundBox;
				} else if (newBoundBox.height < textNode.fontSize()) {
					return oldBoundBox;
				}
				return newBoundBox
			}
		});
		layer.add(tr);
		tr.attachTo(textNode);

		if(document.getElementById("scaleonresize").checked === true){
			tr.on('transform', function() {
				$('#width-auto').removeClass('g-active');
				$('#height-auto').removeClass('g-active');
				textNode.wrap('word');
				$('#width-fix').addClass('g-active');
				$('#height-fix').addClass('g-active');
				textNode.setAttrs({
					width: textNode.width() * textNode.scaleX(),
					height: textNode.height() * textNode.scaleY(),
					scaleX: textNode.scaleX(),
					scaleY: textNode.scaleY()
				});
				
				textarea.style.width = textNode.width() + 'px';					
				textarea.style.height = textNode.height() + 'px';
			});
		}else{
			tr.on('transform', function() {
				$('#width-auto').removeClass('g-active');
				$('#height-auto').removeClass('g-active');
				textNode.wrap('word');
				$('#width-fix').addClass('g-active');
				$('#height-fix').addClass('g-active');
				textNode.setAttrs({
					width: textNode.width() * textNode.scaleX(),
					height: textNode.height() * textNode.scaleY(),
					scaleX: 1,
					scaleY: 1,
				});
				textarea.style.width = textNode.width() + 'px';					
				textarea.style.height = textNode.height() + 'px';
			});
		}
	}
	 
	function canvasInit () {		
		var posStart;
		var posNow;
		var mode = '';
		var droppedFiles = false;
		var uploadedFiles = false;
		var data_title = '';
		
		MAX_WIDTH = $('#canvas-width').val();
		MAX_HEIGHT = $('#canvas-height').val();	
		$('#panels').width(886);     			
		$('#panels').height(window.innerHeight); 			
		stage = new Konva.Stage({
			container: 'panels',
			width: 886,//window.innerWidth,
      height: window.innerHeight
		});
		layer = new Konva.Layer();
		stage.add(layer);			
		
		var r2 = new Konva.Text({text: 'Your text here', x: 0, y: 0, fontSize: 0})  
		r2.listening(false); // stop r2 catching our mouse events.
		layer.add(r2)
		layer.draw();			

		var con = stage.container();
    
		stage.on('dragmove', function(e) {
			stage.container().style.cursor = 'move';
			updateProperties(e.target);			     
		});
		
		stage.on('mouseover', function(e) {
			var target = e.target;
			var type = target.getType();
      if (actionmode == '') {
        if (type === 'Stage') {
          stage.container().style.cursor = 'default';
          $( ".konvajs-content" ).addClass( "g-cursor-select" );
        } else if(type === 'Shape') {
          if(target.hasName('selectedLayer')) {
            stage.container().style.cursor = 'move';
            $( ".konvajs-content" ).removeClass( "g-cursor-select" );            
          }
        } else {return;}
      }
			if (actionmode == 'addtext') {
				if (target === stage) {
					stage.find('Transformer').destroy();
					layer.draw();
					return;
				} 
				// do nothing if clicked NOT on our shapes
				if (!target.hasName('text')) {
					return;
				}
				
				stage.find('Transformer').destroy();

				var tr = new Konva.Transformer({
					//borderStroke: '#2880E6',
					//borderStrokeWidth: 0.5,
					drawBorder: true,
					rotateEnabled: false,
					resizeEnabled: false,
					enabledAnchors: [],
					padding: 2,
				});
				layer.add(tr);
				tr.attachTo(target);
				layer.draw();
			}
		});
		
		stage.on('click', function(e) {		
			var targ = e.target;
			var type = targ.getType();
      var targetId = targ.id();
			// if click on empty area - remove all transformers
			if (type === 'Stage') {
        stage.container().style.cursor = 'default';
        $( ".konvajs-content" ).addClass( "g-cursor-select" );			
				$('.layer-row.g-active').removeClass('g-active');	
				if(destroyTr === true){
					stage.find('Transformer').destroy();
					$('.toolbar.main-toolbar').removeClass('d-flex');
					$('.properties-panel.main-toolbar').removeClass('d-block');
					$('.toolbar.page-toolbar').removeClass('d-none').addClass('d-flex');
					$('.properties-panel.page-properties-panel').removeClass('d-none').addClass('d-block');
					$('.toolbar.appearance-toolbar').removeClass('d-flex');
					$('.properties-panel.appearance-properties-panel .text-properties-panel').removeClass('d-block');
				}
				if(destroySelectedL === true){
					stage.find('.selectedLayer').removeName('selectedLayer');
				}
				layer.draw();
				//console.log(stage.find('.text'));
				return;
			}
			if (type === 'Shape') {
        //$('body').css('top', scrolltop+ 'px');        
				destroyTr = false;		
				stage.find('.selectedLayer').removeName('selectedLayer');
        if(targ.hasName('selectedLayer') === false){
          targ.addName('selectedLayer');
        }
        $( ".konvajs-content" ).removeClass( "g-cursor-select" );
				stage.container().style.cursor = 'move';
				$('.layer-row.g-active').removeClass('g-active');
				$('#'+e.target.attrs.id).addClass('g-active');
				
				con.tabIndex = 1;
				con.focus();				
				if(targ.hasName('selectedLayer')){
					con.addEventListener('keydown', function(event) {
						if (event.keyCode === 46 || event.keyCode === 8) {
							$('#'+targetId).remove();
							stage.find('.selectedLayer')[0].remove();
							stage.find('Transformer').destroy();
							layer.draw();
						} else {
							return;
						}
						event.preventDefault();
					});
				}
			}
			
			targ.on('transform', function() { 
        updateProperties(this);
      });
			
			// remove old transformers
			// TODO: we can skip it if current rect is already selected
			if(destroyTr === false){
				if(targ.hasName('text') === true){
					makeTextResizeable(targ);
				} else{				
					stage.find('Transformer').destroy();
					Fntransformer(targ);
				}
			}
			layer.draw();
			updateProperties(targ);
			if (targ.hasName('selectedLayer') === true && destroyTr === false) {
				$('.toolbar.main-toolbar').addClass('d-flex');
				$('.properties-panel.main-toolbar').addClass('d-block');
				$('.toolbar.page-toolbar').removeClass('d-flex').addClass('d-none');
				$('.properties-panel.page-properties-panel').removeClass('d-block').addClass('d-none');
				$('.toolbar.appearance-toolbar').addClass('d-flex');
				if (targ.hasName('text') === true){
					$('.properties-panel.appearance-properties-panel .text-properties-panel').addClass('d-block');
				}
			}
      console.log(stage.find('.text'));
			console.log(targ);
		});
		
		stage.addEventListener('mousemove', function(e) {
			if (actionmode == 'addtext') {
				if (mode === 'drawing'){
					var poss = stage.getPointerPosition();
					updateDrag({x: poss.x, y: poss.y})
				}
			}
		});

		stage.addEventListener('mouseup', function(e) {
			var t = checkDesign();
      if(t === true){
				var gettitle = $('#header .tabs .tab.g-active .title').text();
        //console.log(gettitle);
        gettitle = gettitle.split('*')[0];
        //console.log(gettitle);
				$('#header .tabs .tab.g-active .title').text(gettitle+'*');
				$('button#save').removeAttr('disabled');
				$('.g-menu .g-menu-bottom #save_caption').parent('.g-menu-item').removeClass('g-disabled');
			}
			if (actionmode == 'addtext') {
				destroyTr = false;
				stage.find('.selectedLayer').removeName('selectedLayer');
        $( ".konvajs-content" ).addClass( "g-cursor-select" );
        $( ".konvajs-content" ).removeClass( "g-cursor-cross" );
        actionmode = '';
        mode = '';
        r2.visible(false);
        // get pre selected fonts properties and apply on drawing text
        var fs = document.getElementById("fsize");
        var ff = document.getElementById("ffamily");
        var fst = document.getElementById("fstyle");
        var sc = document.getElementById("script");
        var rotation = sc.options[sc.selectedIndex].value;
        var fontFamily = ff.options[ff.selectedIndex].value;
        var fontSize = fs.options[fs.selectedIndex].value;
        var fstyle = fst.options[fst.selectedIndex].value;
        var fontweight = fstyle.split('#')[0];
        if(fstyle.split('#')[1] == 'N'){
          var fontStyle = 'normal ' + fontweight;
        }if(fstyle.split('#')[1] == 'I'){
          var fontStyle = 'italic ' + fontweight;
        }
				var align = $('.align.g-active').val();
				var valign = $('.valign.g-active').val();
				var color = $('#text-chosen-color').val();
				//var letterSpacing = $('#char-spacing').val();
        textNode = new Konva.Text({
          text: 'Your text here',
          x: r2.x(), 
          y: r2.y(), 
          width: r2.width(),
          height: r2.height(),
          fontSize: fontSize,
          fontStyle: fontStyle,
          fontFamily: fontFamily,
          align: align,
          verticalAlign: valign,
          fill: color,
          name: 'text selectedLayer',
          draggable: true
        });
        layer.add(textNode);
        textNode.id("layer-"+textNode._id+"");
        textNode.hide();
        layer.draw();
        draw_text(textNode);
				$('#drawtext').attr('contenteditable', true);
				createSelection(textarea, 0, 14);
        add_layer(textNode.id(), 'Text');
				if($('#drawtext').length === 1 && actionmode == '' && e.target !== stage){
					$('button.action-button.g-active').removeClass('g-active');
				}
			}										
		});
			
		stage.addEventListener('mousedown', function(e) {
      if($('#right-sidebar .sidebar-overlay').length === 1){
        colorPickerDefaultInline.destroy();
        $('.sidebar-container.sidebar-inspector').removeClass('sidebar-overlay');
        destroyTr = true;
      }
			if (actionmode == 'addtext') {
				mode = 'drawing';
        var pos = stage.getPointerPosition();
        startDrag({x: pos.x, y: pos.y})		
				$('.toolbar.main-toolbar').addClass('d-flex');
				$('.properties-panel.main-toolbar').addClass('d-block');
				$('.toolbar.page-toolbar').removeClass('d-flex').addClass('d-none');
				$('.properties-panel.page-properties-panel').removeClass('d-block').addClass('d-none');
				$('.toolbar.appearance-toolbar').addClass('d-flex');
				$('.properties-panel.appearance-properties-panel .text-properties-panel').addClass('d-block');
			}
			if($('#drawtext').length === 1 && e.target !== stage){
				if(textNode.hasName('selectedLayer') === false){
					textNode.addName('selectedLayer');
				}
				stage.find('.selectedLayer')[0].text(textarea.value);
				makeTextResizeable(stage.find('.selectedLayer')[0]);
				removeTextarea();
				destroyTr = true;
				destroySelectedL = true;
			}
      if(stage.find('.selectedLayer')[0] !== 'undefined' && e.target !== stage){
        destroyTr = true;
				//destroySelectedL = true;
      }
		});	
		
		function tranform(etarget) {
			// if click on empty area - remove all transformers
			if (etarget === stage) {
				stage.find('Transformer').destroy();
				layer1.draw();
				return;
			}
			// do nothing if clicked NOT on our rectangles
			if (!etarget.hasName('text')) {
				return;
			}
			// remove old transformers
			// TODO: we can skip it if current rect is already selected
			//stage.find('Transformer').destroy();

			// create new transformer
			makeTextResizeable(etarget);
			layer.draw();
		}
		
		function startDrag(posIn){
			posStart = {x: posIn.x, y: posIn.y};
			posNow = {x: posIn.x, y: posIn.y};
		}

		function updateDrag(posIn){ 
			posNow = {x: posIn.x, y: posIn.y};
			var posRect = reverse(posStart,posNow);
			r2.visible(true);  
			r2.x(posRect.x1);
			r2.y(posRect.y1);
			r2.width(posRect.x2 - posRect.x1);
			r2.height(posRect.y2 - posRect.y1);
			var tr = new Konva.Transformer({
				borderStroke: '#2880E6',
				borderStrokeWidth: 1,
				rotateEnabled: false,
				resizeEnabled: false,
			  enabledAnchors: [],
			});
			layer.add(tr);
			tr.attachTo(r2);
			layer.draw();
			updateProperties(r2);
		}
		
		function reverse(r1, r2){
			var r1x = r1.x, r1y = r1.y, r2x = r2.x,  r2y = r2.y, d;
			if (r1x > r2x ){
				d = Math.abs(r1x - r2x);
				r1x = r2x; r2x = r1x + d;
			}
			if (r1y > r2y ){
				d = Math.abs(r1y - r2y);
				r1y = r2y; r2y = r1y + d;
			}
				return ({x1: r1x, y1: r1y, x2: r2x, y2: r2y}); // return the corrected rect.     
		}
		
		$('#toolbar .toolbar-button .g-menu-item-caption, #toolbar .toolbar-button button.action-button').each(function(){
			$(this).on('click touch', function(){
				tool = $(this).attr('id');
			});
		});
		//toolbar button click		
		$('#toolbar .toolbar-button button.action-button').each(function(){
			$(this).on('click touch', function(e){
				e.preventDefault();
				e.stopPropagation();
				$('#toolbar .toolbar-button button.action-button').removeClass('g-active');
				$(this).addClass('g-active');				
			});
		});
		
		function draw_text(textNode) {
			if($('#drawtext').length === 0){
				var textPosition = textNode.getAbsolutePosition();        
				var textPosition1 = textNode.getClientRect();        
				var stageBox = stage.getContainer().getBoundingClientRect();
				//console.log(textPosition);
				//console.log(textPosition1);
				//console.log(stageBox);
				//console.log(stageBox);
				var areaPosition = {
					x: textPosition.x + stageBox.left,
					y: textPosition.y + stageBox.top
				};
				var fs = textNode.fontStyle().split(' ')[0]
				var fw = textNode.fontStyle().split(' ')[1]

				// create textarea and style it
				textarea = document.createElement('textarea');
				document.body.appendChild(textarea);
				textarea.style.left = areaPosition.x + 'px';
				textarea.style.top = areaPosition.y + 'px';
				textarea.style.width = textNode.width() + 'px';
				textarea.style.height = textNode.height() + 'px';
				textarea.style.position = 'absolute';
				textarea.value = textNode.attrs.text;
				textarea.id = 'drawtext';
				textarea.style.lineHeight = textNode.lineHeight();
				textarea.style.fontSize = textNode.fontSize() + 'px';
				textarea.style.fontWeight = fw;
				textarea.style.fontStyle = fs;
				textarea.style.fontFamily = textNode.fontFamily();
				textarea.style.textAlign = textNode.align();
				textarea.style.verticalAlign = textNode.verticalAlign();
				textarea.style.color = textNode.fill();	
				textarea.style.border = '1px solid #2880E6';
				textarea.style.borderRadius = 0;
				textarea.style.letterSpacing = textNode.letterSpacing() + 'px';
				textarea.style.padding = textNode.padding() + 'px';
				textarea.style.margin = '0px';
				textarea.style.overflow = 'hidden';
				textarea.style.background = 'none';
				textarea.style.outline = 'none';
				textarea.style.resize = 'none';
				textarea.style.zIndex = 15;				
				
				var rotation = textNode.rotation();
				var transform = '';
				if (rotation) {
					transform += 'rotateZ(' + Math.round(rotation) + 'deg)';
				}

				var px = 0;
				// also we need to slightly move textarea on firefox
				// because it jumps a bit
				var isFirefox =
					navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
				if (isFirefox) {
					px += 2 + Math.round(textNode.fontSize() / 20);
				}
				transform += 'translateY(-' + px + 'px)';

				textarea.style.transform = transform;
				textarea.focus();	
				textarea.addEventListener('keydown', function(e) {					
					// hide on enter
					if (e.keyCode === 27) {
						removeTextarea();
					}
					if (e.keyCode === 13 && !e.shiftKey) {
						textNode.text(textarea.value);
						textNode.show();
						layer.draw();
						document.body.removeChild(textarea);
						$('button.action-button.g-active').removeClass('g-active');
						updateProperties(textNode);
					}
				});
			}
		}
		
		stage.on('dblclick', (e) => {
			e.cancelBubble = true;
			var target = e.target;
			if(!target.hasName('text')){return;}			
			if (target !== stage && $('#drawtext').length == 1) {
				removeTextarea();
			}
			if (target !== stage && $('#drawtext').length == 0) {
				if(target.hasName('selectedLayer') === false){
					target.addName('selectedLayer');
				}
				target.hide();
				stage.find('Transformer').destroy();	
				layer.draw();
				draw_text(target);
			}
		});
	
		//Image Drag/drop
		con.addEventListener('dragover', function(e) {
			e.preventDefault(); // !important
		});
		con.addEventListener('drop', function(e) {
			data_title = $('button.action-button.g-active').attr('data-title');
			if(data_title != 'Text'){
				$('canvas').addClass('dropping');	
			}
			$('.layer-row.g-active').removeClass('g-active');
			$('.toolbar.main-toolbar').addClass('d-flex');
			$('.properties-panel.main-toolbar').addClass('d-block');
			$('.toolbar.appearance-toolbar').addClass('d-flex');
			$('.properties-panel.appearance-properties-panel .image-properties-panel').addClass('d-block');
			e.preventDefault();
			droppedFiles = e.dataTransfer.files;
			$.each( droppedFiles, function(i, file) {		
				ImageProcessFn(file);
			});
		});
		con.addEventListener('dropend', function(e) {
			$('canvas').removeClass('droppiing');
		});
		
		$('#imgupload').on('change', function(e){
			$('.layer-row.g-active').removeClass('g-active');
			$('.toolbar.main-toolbar').addClass('d-flex');
			$('.properties-panel.main-toolbar').addClass('d-block');
			$('.toolbar.appearance-toolbar').addClass('d-flex');
			$('.properties-panel.appearance-properties-panel .image-properties-panel').addClass('d-block');
			const len = e.target.files.length;
			uploadedFiles = e.target.files;
			if(len > 0){
				$.each( uploadedFiles, function(i, file) {	
					ImageProcessFn(file);
				});
			}
		});
	}
	
	function removeTextarea() {
		if($('#drawtext').length === 1 ) {
			stage.find('.text').show();
			layer.draw();
			$('#drawtext').remove();
		}
	}
	
	function updateProperties(target){
		var width = target.attrs.width * target.scaleX();
		var height = target.attrs.height * target.scaleY();
		var rotation = target.rotation();
		var prop_x = new setProperties('pos-x', Math.round(target.attrs.x));
		var prop_y = new setProperties('pos-y', Math.round(target.attrs.y));
		var prop_w = new setProperties('size-width', Math.round(width));
		var prop_h = new setProperties('size-height', Math.round(height));
		var prop_angle = new setProperties('angle', Math.round(rotation));
		prop_x.properties();				
		prop_y.properties();
		prop_w.properties();				
		prop_h.properties();  
		prop_angle.properties();
	}
	
	function add_layer(layer_id, basename) {	
		var data_title = $('button.action-button.g-active').attr('data-title');
		if(data_title == 'Text'){
			var layer_text_html =  $("<div></div>").attr("class", "d-flex layer-row text  align-items-center g-active").attr('id', layer_id).attr('onclick', 'layerClick(this)')
			.append(
				$("<span></span>").attr("class", "d-flex layer-title-group align-items-center")
				.append($("<span></span>").attr("class", "layer-icon km-text fs-22"))
				.append($("<span></span>").attr("class", "layer-title").text(basename))
			).append(
				$('<span/>', {
					"class": "layer-action c-pointer fas fa-unlock-alt fa fa-flip-horizontal",
					"data-title": "Toggle Locker",
					"data-placement": "bottom",
					"data-toggle": "tooltip",
					"onmouseover": "tooltipfn(this)",
				})
			).append(
				$('<span/>', {
					"class": "layer-action c-pointer fas fa-eye",
					"data-title": "Layer Visibility",
					"data-placement": "bottom",
					"data-toggle": "tooltip",
					"onmouseover": "tooltipfn(this)",
				})
			)
			$('#layers').prepend(layer_text_html);
		}
		
		if(data_title == 'Image' || $('canvas').hasClass('dropping')){
			var layer_image_html =  $("<div></div>").attr("class", "d-flex layer-row image  align-items-center g-active").attr('id', layer_id).attr('onclick', 'layerClick(this)')
			.append(
				$("<span></span>").attr("class", "d-flex layer-title-group align-items-center")
				.append($("<span></span>").attr("class", "layer-icon fa fa-image"))
				.append($("<span></span>").attr("class", "layer-title").text(basename.trunc(24)))
			).append(
				$('<span/>', {
					"class": "layer-action c-pointer fas fa-unlock-alt fa fa-flip-horizontal",
					"data-title": "Toggle Locker",
					"data-placement": "bottom",
					"data-toggle": "tooltip",
					"onmouseover": "tooltipfn(this)",
				})
			).append(
				$('<span/>', {
					"class": "layer-action c-pointer fas fa-eye",
					"data-title": "Layer Visibility",
					"data-placement": "bottom",
					"data-toggle": "tooltip",
					"onmouseover": "tooltipfn(this)",
				})
			)
			$('#layers').prepend(layer_image_html);
		}
	}

	function createSelection(field, start, end) {
		if( field.createTextRange ) {
			var selRange = field.createTextRange();
			selRange.collapse(true);
			selRange.moveStart('character', start);
			selRange.moveEnd('character', end);
			selRange.select();
		} else if( field.setSelectionRange ) {
			field.setSelectionRange(start, end);
		} else if( field.selectionStart ) {
			field.selectionStart = start;
			field.selectionEnd = end;
		}
		field.focus();
	}
	
	function textUpdatefFamily(e){
		var node = stage.find('.selectedLayer')[0];
		var fontf = e.options[e.selectedIndex].value;
		if($('#drawtext').length === 1){
			textarea.style.fontFamily = fontf;
		}
		if(typeof node === 'undefined'){return;}
		node.fontFamily(fontf);
		FitTextOnTransform(node);
	}
	
	function textUpdatefStyle(e) {
		var node = stage.find('.selectedLayer')[0];
    var fs = '';
    var fonts = e.options[e.selectedIndex].value;
    var fweight = fonts.split('#')[0];
    var fstyle = fonts.split('#')[1];
    if(fweight == 700){
      $('#text-bold').addClass('g-active');
    } else {$('#text-bold').removeClass('g-active');}
		if(fstyle == 'N'){
      fs = 'normal ';
    }if(fstyle == 'I'){
      fs = 'italic ';
			$('#text-itallic').addClass('g-active');
    } else {$('#text-itallic').removeClass('g-active');}
		if($('#drawtext').length === 1){
			var start = textarea.selectionStart;
			// obtain the index of the last selected character
			var finish = textarea.selectionEnd;
			// obtain the selected text
			var sel = textarea.value.substring(start, finish);
			console.log(sel);
			if(sel != ''){
				var t = document.execCommand(fs, false, null);
				console.log(t);
				var tf = document.execCommand(fweight, false, null);						
				console.log(tf);
			} else {				
				//textarea.style.fontStyle = fs;
				//textarea.style.fontWeight = fweight;
			}
			stage.find('Transformer').destroy();
		}
    if(typeof node === 'undefined') return;
    node.fontStyle(fs + fweight);
    FitTextOnTransform(node);
	}
	
	function applyTextDecoration(e){
		var node = stage.find('.selectedLayer')[0];
		if($('#drawtext').length === 1){
			if(e.id === 'text-underline'){
				if(!$(e).hasClass('g-active')){
					textarea.style.textDecoration = 'underline';
					$('button#text-strikethrough').removeClass('g-active');
				} else {
					textarea.style.textDecoration = 'none';
				}
			}
		
			if(e.id === 'text-strikethrough'){
				if(!$(e).hasClass('g-active')){
					textarea.style.textDecoration = 'line-through';
					$('button#text-underline').removeClass('g-active');
				} else {
					textarea.style.textDecoration = 'none';
				}			
			}
			stage.find('Transformer').destroy();
		}
		if(typeof node === 'undefined') return;
		if(e.id === 'text-underline'){
			if(!$(e).hasClass('g-active')){
				node.textDecoration('underline');
				$('button#text-strikethrough').removeClass('g-active');
			} else {
				node.textDecoration('none');
			}
		}
		
		if(e.id === 'text-strikethrough'){
			if(!$(e).hasClass('g-active')){
				node.textDecoration('line-through');
				$('button#text-underline').removeClass('g-active');
			} else {
				node.textDecoration('');
			}			
		}	
		
		makeTextResizeable(node);
		layer.draw();
		//destroyTr = true;
	}
	
	function TextAlignment(e){
		var node = stage.find('.selectedLayer')[0];
    var ta = e.value;
		if($(e).hasClass('align')){
			if($('#drawtext').length === 1){
				textarea.style.textAlign = ta;
				stage.find('Transformer').destroy();
			}
			if(typeof node === 'undefined') return;
			node.align(ta);
		}
		if($(e).hasClass('valign')){
			if($('#drawtext').length === 1){
				textarea.style.verticalAlign = ta;
				stage.find('Transformer').destroy();
			}
			if(typeof node === 'undefined') {return;}
			node.verticalAlign(ta);
		}
    FitTextOnTransform(node);
	}
	
	function FnSizing(e){
		var node = stage.find('.selectedLayer')[0];
		if(typeof node === 'undefined') return;
		if(e.id === 'width-auto'){
			node.wrap('none');
			node.width(Math.round(node.getTextWidth()) + 15);
		}
		if(e.id === 'height-auto'){
			node.wrap('none');
			node.height(node.getTextHeight());
		}
		FitTextOnTransform(node);
		updateProperties(node);
	}

	// will work for shapes with top-left origin, like rectangle
	function rotateAroundCenter(node, rotation) {
		var rotatePoint = ({ x, y }, rad) => {
			var rcos = Math.cos(rad);
			var rsin = Math.sin(rad);
			return { x: x * rcos - y * rsin, y: y * rcos + x * rsin };
		};
		//current rotation origin (0, 0) relative to desired origin - center (node.width()/2, node.height()/2)
		const topLeft = { x: -node.width() / 2, y: -node.height() / 2 };
		const current = rotatePoint(topLeft, Konva.getAngle(node.rotation()));
		const rotated = rotatePoint(topLeft, Konva.getAngle(rotation));
		const dx = rotated.x - current.x,
			dy = rotated.y - current.y;

		node.rotation(rotation);
		node.x(Math.round(node.x() + dx));
		node.y(Math.round(node.y() + dy));
		layer.draw();
		updateProperties(node);
	}
	
	function FnRotation(e){
		var node = stage.find('.selectedLayer')[0];
		var rotation = e.options[e.selectedIndex].value;
		if(typeof node === 'undefined') return;
    rotateAroundCenter(node, rotation);
		layer.draw();
		console.log(node);
		updateProperties(node);
	}
  
  function FnSpacing(id){
    var node = stage.find('.selectedLayer')[0];
    if(id === 'char-spacing'){
      if($('#drawtext').length === 1){
				textarea.style.letterSpacing = $('#'+id).val();
				stage.find('Transformer').destroy();
			}
			if(typeof node === 'undefined') return;
      node.letterSpacing($('#'+id).val());
    }
    else if(id === 'word-spacing'){
      
    }
    else if(id === 'line-spacing'){
      
    }
    FitTextOnTransform(node);
  }
	
	function textUpdatefSize(e) {
		var node = stage.find('.selectedLayer')[0];
    var fonts = e.options[e.selectedIndex].value;
		if($('#drawtext').length === 1){
			textarea.style.fontSize = fonts + 'px';
			stage.find('Transformer').destroy();
		}
    if(typeof node === 'undefined') return;
    node.fontSize(fonts);
    FitTextOnTransform(node);
	}
	
	function FitTextOnTransform(node){
		makeTextResizeable(node);
    updateProperties(node);
		// get text bounding rectangle
		var box = node.getClientRect({relativeTo: layer});
		//caculate scales
		var scale = [
			node.width() / (box.width),
			node.height() / (box.height)
		];
		node.setAttrs({
			scaleX: scale[0],
			scaleY: scale[1]
		});
		layer.draw();
		//destroyTr = true;
	}
	
	function ImageProcessFn(file) {
		var reader = new FileReader();
		var filename = file.name;
		var ext = filename.substring(filename.lastIndexOf('.'));
		var basename = filename.split(ext);
		reader.addEventListener("load", function () {
			var imgwidth = imgheight = '';
			const img = new Image();
			var imgsrc = reader.result;
			img.src = imgsrc;
			img.onload = function(){
				imgwidth = this.width;
				imgheight = this.height;
			};
			//stage.setPointersPositions(target);
			Konva.Image.fromURL(imgsrc, function(image) {				
				//image.position(stage.getPointerPosition());
				image.x(50);
				image.y(50);
				image.width(imgwidth);
				image.height(imgheight);
				image.scale(0.5);
				layer.add(image);
				image.setAttr('source', imgsrc);
				image.setAttr('width', imgwidth);
				image.setAttr('height', imgheight);
				image.setAttr('name', basename[0]);
				image.setAttr('scale', 0.5);
				image.draggable(true);			
				Fntransformer(image);				
				image.id("layer-"+image._id+"");
				layer.draw();	
				stage.find('.selectedLayer').removeName('selectedLayer');
				if(image.hasName('selectedLayer') === false){
					image.addName('selectedLayer');
				}
				updateProperties(image);
				add_layer(image.id(), basename[0]);
				$('canvas').removeClass('dropping');
				$('button.action-button.g-active').removeClass('g-active');
			});
		}, false);
		
		if (file) {
			reader.readAsDataURL(file);
		}
	}
	
	function getFileName(){
		var d = checkDesign();
		if(d === true){			
			var design_id = getUrlDesignID();	
			$('#header .tabs .tab.g-active .title').attr('design', design_id);
      $('#header .tabs .tab.g-active .close').attr('designid', design_id);			
			var settings = {
				"url": access_check_api + "design/" + design_id,
				"method": "GET",
				"timeout": 0,
				"headers": {
					"Authorization": "bearer " + API_KEY,
					},
				};

				$.ajax(settings).done(function (response) {
					const promise1 = new Promise(function(resolve, reject) {
						resolve(response);
					}).then(function(data) {
            $('#header .tabs .tab.g-active .title').text(data.name);
						producTypeId = data.type_tid;
						producTypeName = data.folder_name;
						productId = data.group_tid;
						productName = data.group_name;
            console.log('tools-3');
						getProductName(data.type_tid);
						return fileName = data.name;
					});
				});
		}
	}

	function kmdsToolSettingSave() {
		var fileName = $('#template-name').val();			
		if(fileName === ''){
			if($('.g-dialog-container').length === 0){		
				FnNewFolderModal();
				FnDefaultModal('Please enter a template title.');
			}			
		} else {
			var folderName = $('.nfolder.nav-link.active').attr('data-tab-title');
			var primaryfolder = $('.nfolder.nav-link.active').hasClass('primaryfolder');
			if(primaryfolder === true){
				if(folderName === producTypeName){
					var group = 'primaryfolder';
					var template_tid = ''; 
				} else {
					var group = 'subfolder';
					var template_tid = producTypeName; //template_tid is for parent folder reference
				}
			}
			design_id = getUrlDesignID();
			var cwidth = $('canvas').width();
			var cheight = $('canvas').height();
			var data = {"name": fileName, "_name": fileName, "user_id":uid, "user":name, "group_tid": productId, "type_tid":producTypeId, "group_name":productName, "folder_name":folderName, "template_tid":template_tid, "template_group":group, "type_name": producTypeName, "width": cwidth, "height":cheight, "measurement":cunit};
			var json = stage.toJSON();
			//console.log(data);
			var dataURL = stage.toDataURL();
			FnDismisModal();
			create_save_update_design(design_id, data, json, dataURL);
			$('#header .tabs .tab.g-active .title').text(fileName);
			$('#template-name').val(fileName);
			document.title = fileName+' | KaboodleMedia';
			$('button#save').attr('disabled', 'disabled');
			$('.g-menu .g-menu-bottom #save_caption').parent('.g-menu-item').addClass('g-disabled');
		}
	}

	/****API code start******/
	function create_save_update_design(design_id_s, data_json_S, json_s, dataURL_s) {
		if (design_id_s == null || design_id_s == '') {
			var settings = {
				"url": access_check_api + "design",
				"method": "POST",
				"timeout": 0,
				"headers": {
					"Authorization": "bearer " + API_KEY,
				},
				"data": data_json_S
			};
			$.ajax(settings).done(function (response) {
				// ....
			}).then(
				function  fulfillHandler(data) {
					console.log(data)
					queryString.push('d', data._id);
					$('#header .tabs .tab.g-active .title').attr('design', data._id);
					$('#header .tabs .tab.g-active .close').attr('designid', data._id);
					desing_json_save_file(data._id, json_s, dataURL_s);        
				},
				function rejectHandler(jqXHR, textStatus, errorThrown) {
					// ...
				}
			).catch(function errorHandler(error) {
				// ...
			});
		}
		else {
			//for update the records
			var settings = {
				"url":access_check_api + "design/" + design_id_s,
				"method": "PUT",
				"timeout": 0,
				"headers": {
					"Authorization": "bearer " + API_KEY,
					"Content-Type": "application/x-www-form-urlencoded"
				},
				"data": data_json_S
			};
			$.ajax(settings).done(function (response) {
				console.log(response);
				//alert('save');
			}).then(
				function  fulfillHandler(data) {
					console.log(data)
					queryString.push('d', data._id);
					desing_json_save_file(design_id_s, json_s, dataURL_s);        
				},
				function rejectHandler(jqXHR, textStatus, errorThrown) {
					// ...
				}
			).catch(function errorHandler(error) {
				// ...
			});
		}  
	}

	function get_check_user_access(user_id, username = '', email = '') {
		var settings = {
			"url": access_check_api + "user_access_check",
			"method": "POST",
			"timeout": 0,
			"headers": {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			 "data": {user_id: user_id, username: username, email: email}
		};
		$.ajax(settings).done(function (response) {
			API_KEY = response;
		}).then(
			function fulfillHandler(data) {
				var $hiddenInput = $("<input/>",{type:"hidden",id: "api_key",value:data});
				$hiddenInput.appendTo('body');
				design_id = getUrlDesignID();
				if (design_id != '') {
					var settings = {
						"url": access_check_api + "designjson/" + design_id,
						"method": "GET",
						"timeout": 0,
						"headers": {
							"Authorization": "bearer " + API_KEY,
							},
						};

						$.ajax(settings).done(function (response) {
							//  ....
						}).then(
							 function  fulfillHandler(datajson) {
									//var jsonurl = $s3Client->getObjectUrl('my-bucket', 'my-key');
									var datajsonparse =  JSON.parse(datajson.design);

									console.log(datajsonparse);
									setTimeout(function() {
										if (datajsonparse != '') {
											// create node using json string
											//var stage = new Konva.Stage({container: 'panels'});
											stage = Konva.Node.create(datajsonparse, 'panels');
											stage.draw();
											$('#panels').width(stage.width());
											$('#panels').height(stage.height());
											$('#canvas-width').val(stage.width());
											$('#canvas-height').val(stage.height());
											console.log(stage);
											stage.find('Image').forEach((imageNode) => {
													var src = imageNode.getAttr('source');
													var image = new Image();
													image.onload = () => {
															imageNode.image(image);
															imageNode.getLayer().batchDraw();
													}
													image.src = src;
											});
										}
										$( "#overlay" ).remove();
									}, 3700); 
								},
								function rejectHandler(jqXHR, textStatus, errorThrown) {
									// ...
								}
						 ).catch(function errorHandler(error) {
						// ...
						 });
					//alert('get json');
				}
				
			},
			function rejectHandler(jqXHR, textStatus, errorThrown) {
				// ...
			}
		).catch(function errorHandler(error) {
			// ...
		});
	}

	function get_design_data(design_id) {
		var settings = {
		"url": access_check_api + "design/" + design_id,
		"method": "GET",
		"timeout": 0,
		"headers": {
			"Authorization": "bearer " + API_KEY,
			},
		};

		$.ajax(settings).done(function (response) {
			//  ....
		}).then(
			 function  fulfillHandler(data) {
					console.log(data);
					return data;
				},
				function rejectHandler(jqXHR, textStatus, errorThrown) {
					// ...
				}
		 ).catch(function errorHandler(error) {
		// ...
		 });
	}

	// 
	function save_update_design(design_id, data_json = '') {
		if (design_id == null || design_id == '') {
			var settings = {
				"url": access_check_api + "design",
				"method": "POST",
				"timeout": 0,
				"headers": {
					"Authorization": "bearer " + API_KEY,
				},
				"data": data_json
			};
			$.ajax(settings).done(function (response) {
				// ....
			}).then(
				function  fulfillHandler(data) {
					console.log(data)
					queryString.push('d', data._id);
				},
				function rejectHandler(jqXHR, textStatus, errorThrown) {
					// ...
				}
			).catch(function errorHandler(error) {
				// ...
			});
		}
		else {
			//for update the records
			var settings = {
				"url":access_check_api + "design/" + design_id,
				"method": "PUT",
				"timeout": 0,
				"headers": {
					"Authorization": "bearer " + API_KEY,
					"Content-Type": "application/x-www-form-urlencoded"
				},
				"data": data_json
			};
			$.ajax(settings).done(function (response) {
				console.log(response);
				//alert('save');
			});
		}
	}

	function desing_json_save_file(f_design_id, f_json, img_data) {
		var settings = {
			"url": access_check_api + "design/" + f_design_id + "/urls",
			"method": "PUT",
			"timeout": 0,
			"headers": {
				"Authorization": "bearer " + API_KEY
			},
		};

		$.ajax(settings).done(function (response) {
			console.log(response);
		}).then(
			 function  fulfillHandler(data_url) {
					var settings = {
						"url": data_url.url,
						"method": "PUT",
						"timeout": 0,
						"headers": {
							"Content-Type": "application/json"
						},
						"data": JSON.stringify(f_json),
					};

					$.ajax(settings).done(function (response) {
						console.log('file save response');
						console.log(response);
						console.log(data_url.url_s);
					});
					var settings = {
						"url": data_url.url_t,
						"method": "PUT",
						"timeout": 0,
						"headers": {
							"Content-Type": "application/json"
						},
						"data": JSON.stringify(img_data),
					};

					$.ajax(settings).done(function (response) {
						console.log('image save response');
						console.log(response);
						console.log(data_url.url_t_s);
					});
					var data_u_u = {'url' : data_url.url_s, 'url_t': data_url.url_t_s};
					update_design_url(f_design_id, data_u_u);
				},
				function rejectHandler(jqXHR, textStatus, errorThrown) {
					// ...
				}
		 ).catch(function errorHandler(error) {
		// ...
		 });
		
	}

	function update_design_url(u_design_id, u_data_json) {
				var settings = {
				"url":access_check_api + "design/" + u_design_id,
				"method": "PUT",
				"timeout": 0,
				"headers": {
					"Authorization": "bearer " + API_KEY,
					"Content-Type": "application/x-www-form-urlencoded"
				},
				"data": u_data_json
			};
			$.ajax(settings).done(function (response) {
				console.log(response);
				//alert('save updated');
			});
		
	}

	(function () {
		'use strict';
		var queryString = {};

		queryString.parse = function (str) {
			if (typeof str !== 'string') {
				return {};
			}

			str = str.trim().replace(/^\?/, '');

			if (!str) {
				return {};
			}

			return str.trim().split('&').reduce(function (ret, param) {
				var parts = param.replace(/\+/g, ' ').split('=');
				var key = parts[0];
				var val = parts[1];

				key = decodeURIComponent(key);
				val = val === undefined ? null : decodeURIComponent(val);

				if (!ret.hasOwnProperty(key)) {
						ret[key] = val;
				} else if (Array.isArray(ret[key])) {
						ret[key].push(val);
				} else {
						ret[key] = [ret[key], val];
				}

				return ret;
			}, {});
		};

		queryString.stringify = function (obj) {
			return obj ? Object.keys(obj).map(function (key) {
				var val = obj[key];

				if (Array.isArray(val)) {
					return val.map(function (val2) {
						return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
					}).join('&');
				}

				return encodeURIComponent(key) + '=' + encodeURIComponent(val);
			}).join('&') : '';
		};

		queryString.push = function (key, new_value) {
			var params = queryString.parse(location.search);
			params[key] = new_value;
			var new_params_string = queryString.stringify(params)
			history.pushState({}, "", window.location.pathname + '?' + new_params_string);
		}

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = queryString;
		} else {
			window.queryString = queryString;
		}
	})();


	function getUrlDesignID() {
		var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    if(vars['d']) {
      return vars['d'];
    }
    else {
      return '';
    }
	}

	/*
	// later restore an image from "source" attribute
	const stage = Konva.Node.create(json, 'container');
	stage.find('Image').forEach(imageNode => {
		const nativeImage = new window.Image();
		nativeImage.onload = () => {
			imageNode.image(nativeImage);
			imageNode.getLayer().batchDraw();
		}
		nativeImage.src = imageNode.getAttr('source');
	})
	*/