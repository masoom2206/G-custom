	//working on ruler
	var media_base_url = drupalSettings.media_base_url;
	var uid = drupalSettings.uid;
	var name = drupalSettings.name;
	var email = drupalSettings.email;
	var adminRole = drupalSettings.adminRole;
	var avatar = drupalSettings.avatar;
 	var leftW = 250;
	var rightW = 300;
	var navH = 60;
	var headerH = 36;
	var toolbarH = 37;
  var newpage = 0;
	var cWidth = window.innerWidth - leftW - rightW;
	var cheight = window.innerHeight;
  var visiblewidth = $(window).width();
	var visibleheight = $(window).scrollTop() + $(window).height() / 2.5;
	var pageWidth = cWidth;
  //console.log("pageWidth 1 ="+pageWidth);
	var pageHeight = window.innerHeight - navH - headerH - toolbarH;
	var product_group_url = media_base_url+"/kmds/product-group?_format=json";
	//var access_check_api = 'https://api.kaboodlemedia.com/api/v1/';
	var access_check_api = drupalSettings.access_check_api;
	var access_api_key = drupalSettings.api_key;
  var user_id = 1;
  var API_KEY = '';
  var stage = layer = textarea = actionmode = MAX_WIDTH = MAX_HEIGHT = productId = producTypeId = producTypeName = cunit = productName = fileName = pageGroup = presetName = presetVal = '';
	var destroyTr = destroySelectedL = pLayerhover = savedDesignFlag = multipageToggle = PageSelection = pageLocked = ObjinterSection = openingTemplate = pageAdded = rulerApplied = layoutExist = false;
	var isMoving = false;
	var ableToClone = false;
	var zoomInTool = false;
	var copiedObject = '';
	var lastClickedTool = '';
	var copiedObjects = [];
	var loadPageArr = [];
  var design_id = getUrlDesignID();
  var textSample, rect, isDown, origX, origY, activePage, activePageObj, activeLayer, activeLayerTitle, parentlayerOrder;
  var kitchensink = { };
  var ixx = 0;
  var iyy = 0;
  var cs = 0;
  var ruler = true;
  var handSelected = false;
  var movec = false;
  var toolGroup = false;
  var toolUnGroup = false;
  var drawmode = false;
  var CtrlPressed = false;
  var ShifPressed = false;
  get_check_user_access(uid, name, email);
  //Load font then call get_check_user_access() function
  //kmdsFontsLoad();
  var activeLayerID = '';
  var dragHoverID = '';
  var dragOutID = '';
	var z = [25, 50, 100, 150, 200, 300, 400, 800];
  var topRulerZoom = 0;
  var leftRulerZoom = 0;
  var handPanStartX = 0;
  var handPanStartY = 0;
  var handPanDifX = 0;
  var handPanDifTop = 0;
  var handPanDifY = 0;
  var handPanDifLeft = 0;
  var lastSelectedLayer;
  var triggerGroup;
  var groupClicked = false;
  var leftmargin = 0;
  var topmargin = 0;
  var childLayerSelected = false;
  var createGroup = false;
  var leftmargin = 0;
  var topmargin = 0;
  var layerReording = false;
  var redoing = false;
	var undoBtn = redoBtn = undo_caption = redo_caption = ''; //currentState = previousState = '';
	var _config = {
		canvasState             : [],
		currentStateIndex       : -1,
		undoStatus              : false,
		redoStatus              : false,
		undoFinishedStatus      : 1,
		redoFinishedStatus      : 1,
		updatedProperty         : '',
		updatedPropertyValue    : '',
	};
  var templateAddedTags = [];
  var templateAddedDescriptions = '';
  var pageUnit = 'px';
  smartGuideStatus = 1;

  var H_items = [
    { 'Name': 'File', 'MenuItem': [
      { 'Icon': '&nbsp;', 'Name': 'New Design', 'Shortcut': 'Alt+N', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'fa fa-save', 'Name': 'Save', 'Shortcut': 'Ctrl+S', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Save as', 'Shortcut': 'Shift+Ctrl+S', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'fa fa-history', 'Name': 'Show Version History', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Import', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': '&nbsp;', 'Name': 'Place Image...', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Link Image...', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Add Fonts...', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}
				]},			
			{ 'Icon': 'fa fa-sign-out', 'Name': 'Export', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': '&nbsp;', 'dataValue': 'advancedExport', 'dataPro': 'export', 'Id': 'export_advanced', 'Name': 'Advanced Export...', 'Shortcut': 'Shift+Ctrl+E', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'dataValue': 'ExportPng', 'dataPro': 'export', 'Id': 'export_png_image', 'Name': 'PNG Image(.png)', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'dataValue': 'ExportJpeg', 'dataPro': 'export', 'Id': 'export_jpeg_image', 'Name': 'JPEG Image (.jpeg)', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'dataValue': 'ExportSvg', 'dataPro': 'export', 'Id': 'export_svg_image', 'Name': 'Scalable Vector Graphics(.svg)', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'dataValue': 'ExportPdf', 'dataPro': 'export', 'Id': 'export_pdf', 'Name': 'PDF Document(.pdf)', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
						{'Icon': '&nbsp;', 'Name': '72 dpi', 'Shortcut': '&nbsp;', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '96 dpi', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': '150 dpi', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': '300 dpi', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': 'item-divider', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Advanced Options...', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;'},
					]},
				]},
			{ 'Icon': 'fa fa-print', 'Name': 'Print', 'Shortcut': 'Ctrl+P', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }
		]}, 
    { 'Name': 'Edit', 'MenuItem': [
      { 'Icon': 'fas fa-reply', 'Name': 'Undo', 'Action': 'edit.undo', 'Shortcut': 'Ctrl+Z', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'fas fa-share', 'Name': 'Redo', 'Action': 'edit.redo', 'Shortcut': 'Shift+Ctrl+Z', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'fa fa-cut', 'Name': 'Cut', 'Shortcut': 'Ctrl+X', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'fa fa-copy', 'Name': 'Copy', 'Shortcut': 'Ctrl+C', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Paste', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': 'fa fa-paste', 'Name': 'Paste', 'Shortcut': 'Ctrl+V', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Paste In Place', 'Shortcut': 'Shift+Ctrl+V', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Paste Inside Selection', 'Shortcut': 'Alt+Shift+Ctrl+V', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Paste Style', 'Shortcut': 'F4', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}
				]},			
			{ 'Icon': '&nbsp;', 'Name': 'Delete', 'Shortcut': 'Del', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Duplicate', 'Shortcut': 'Ctrl+D', 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Edit Selection', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Select All', 'Shortcut': 'Ctrl+A', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Deselect All', 'Shortcut': 'Shift+Ctrl+A', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Invert Selection', 'Shortcut': 'Shift+Ctrl+I', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Select by Font Type', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'fas fa-cog', 'Name': 'Settings...', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }
		]}, 
    { 'Name': 'Modify', 'MenuItem': [
      { 'Icon': '&nbsp;', 'Name': 'Arrange', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': '&nbsp;', 'Name': 'Bring to Front', 'dataValue': 'bringToFront', 'dataPro': 'bring',  'Shortcut': 'Shift+Ctrl+Up', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'km-bring-forward fs-20', 'Name': 'Bring forward', 'dataValue': 'bringForward', 'dataPro': 'bring', 'Shortcut': 'Ctrl+Up', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'km-bring-backword fs-20', 'Name': 'Send Backward', 'dataValue': 'sendBackwards', 'dataPro': 'bring', 'Shortcut': 'Ctrl+Down', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Send to Back', 'dataValue': 'sendToBack', 'dataPro': 'bring', 'Shortcut': 'Shift+Ctrl+Down', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}
				]},
			{ 'Icon': '&nbsp;', 'Name': 'Align', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': '&nbsp;', 'Name': 'Align Left', 'dataValue': 'hl', 'dataPro': 'textAlign', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Align Center', 'dataValue': 'hc', 'dataPro': 'textAlign', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Align Right', 'dataValue': 'hr', 'dataPro': 'textAlign', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Align Top', 'dataValue': 'vt', 'dataPro': 'textAlign', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Align Middle', 'dataValue': 'vm', 'dataPro': 'textAlign', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Align Bottom', 'dataValue': 'vb', 'dataPro': 'textAlign', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Same Width', 'dataValue': '', 'dataPro': '', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Same Height', 'dataValue': '', 'dataPro': '', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Distribute Horizontally', 'dataValue': 'dh', 'dataPro': 'textAlign', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Distribute Vertically', 'dataValue': 'dv', 'dataPro': 'textAlign', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Snap to Full Units', 'dataValue': '', 'dataPro': '', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Snap to Half Units', 'dataValue': '', 'dataPro': '', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}
				]},
			{ 'Icon': '&nbsp;', 'Name': 'Transform', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': 'item-divider', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': '&nbsp;', 'Name': 'Rotate 45° Left', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;', 'Type' : 'rotate', 'Typevalue' : '-45' }, {'Icon': '&nbsp;', 'Name': 'Rotate 90° Left', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;', 'Type' : 'rotate', 'Typevalue' : '-90'}, {'Icon': '&nbsp;', 'Name': 'Rotate 180° Left', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;', 'Type' : 'rotate', 'Typevalue' : '-180'}, {'Icon': '&nbsp;', 'Name': 'Rotate 45° Right', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;', 'Type' : 'rotate', 'Typevalue' : '45'}, {'Icon': '&nbsp;', 'Name': 'Rotate 90° Right', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;', 'Type' : 'rotate', 'Typevalue' : '90' }, {'Icon': '&nbsp;', 'Name': 'Rotate 180° Right', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;', 'Type' : 'rotate', 'Typevalue' : '180' }, {'Icon': 'km-flip fs-26 fa-rotate-270 fa', 'Name': 'Flip Vertical', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;', 'Type' : 'fllip', 'Typevalue' : "'flipY'"}, {'Icon': 'km-flip fs-26 fa-flip-horizontal', 'Name': 'Flip Horizontal', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;', 'Type' : 'fllip', 'Typevalue' : "'flipX'"}
				]},
			{ 'Icon': 'far fa-object-group', 'Name': 'Group Selection', 'Shortcut': 'Ctrl+G', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'km-compound fs-20', 'Name': 'Create Compound', 'Shortcut': 'Ctrl+M', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'fa fa-adjust', 'Name': 'Clip Selection', 'Shortcut': '&nbsp;', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'far fa-object-group fa-rotate-180', 'Name': 'Ungroup Selection', 'Shortcut': 'Shift+Ctrl+G', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Mask with Shape', 'Shortcut': 'Ctrl+Shift+M', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': 'fa fa-crop', 'Name': 'Confirm Cropping', 'Shortcut': '&nbsp;', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Cancel Cropping', 'Shortcut': '&nbsp;', 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, { 'Icon': '&nbsp;', 'Name': 'Create Coumpound Shape', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': 'km-union fs-24', 'Name': 'Union', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'km-subtract fs-20', 'Name': 'Subtract', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'km-intersect fs-24', 'Name': 'Intersect', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': 'km-difference fs-20', 'Name': 'Difference', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}
				]},
			{ 'Icon': '&nbsp;', 'Name': 'Create Nested Compound', 'Shortcut': 'Ctrl+Alt+M', 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, 
			
			{ 'Icon': '&nbsp;', 'Name': 'Path', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': '&nbsp;', 'Name': 'Join Paths', 'Shortcut': 'Ctrl+J', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Split Path', 'Shortcut': 'Shift+Ctrl+J', 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, {'Icon': 'km-path fs-24', 'Name': 'Convert to Path', 'Shortcut': 'Ctrl+Shift+P', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Convert to raw Path', 'Shortcut': 'Ctrl+Shift+R', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Convert to Outline', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Expand/Shink', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fas fa-braille', 'Name': 'Vectorize Border', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Vectorize Image', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Attach Text to Path', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Detach Text from Path', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Simplify Path', 'Shortcut': 'Ctrl+ALt+S', 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Connect Paths Lines', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Break Curve', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;'}, {'Icon': '&nbsp;', 'Name': 'Reverse Order', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;'}
				]},
			{ 'Icon': 'km-symbol fs-20', 'Name': 'Symbol', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': 'km-symbol fs-24', 'Name': 'Create Symbol', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Detach Symbol Instance', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Reset Instance', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider', 'Tail': '&nbsp;'}
				]},
			{ 'Icon': '&nbsp;', 'Name': 'Flatten', 'Shortcut': 'Ctrl+X', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }
		]}, 
    { 'Name': 'View', 'MenuItem': [
			{'Icon': '&nbsp;', 'Name': 'Original-View', 'Shortcut': 'Ctrl+0', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Fit Selection', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Fit Layer', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Fit All', 'Shortcut': 'Alt+Ctrl+0', 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Magnification', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': 'item-divider', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': '&nbsp;', 'Name': '25%', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;', 'dataView': 'zoomInList', 'dataValue': '25' }, {'Icon': '&nbsp;', 'Name': '50%', 'Shortcut': 'Ctrl+5', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;', 'dataView': 'zoomInList', 'dataValue': '50' }, {'Icon': '&nbsp;', 'Name': '100%', 'Shortcut': 'Ctrl+1', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;', 'dataView': 'zoomInList', 'dataValue': '100' }, {'Icon': '&nbsp;', 'Name': '150%', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;', 'dataView': 'zoomInList', 'dataValue': '150' }, {'Icon': '&nbsp;', 'Name': '200%', 'Shortcut': 'Ctrl+2', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;', 'dataView': 'zoomInList', 'dataValue': '200' }, {'Icon': '&nbsp;', 'Name': '300%', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;', 'dataView': 'zoomInList', 'dataValue': '300' }, {'Icon': '&nbsp;', 'Name': '400%', 'Shortcut': 'Ctrl+4', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;', 'dataView': 'zoomInList', 'dataValue': '400' }, {'Icon': '&nbsp;', 'Name': '800%', 'Shortcut': 'Ctrl+8', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;', 'dataView': 'zoomInList', 'dataValue': '800' }
				]},
			{'Icon': '&nbsp;', 'Name': 'Outline View', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' },  {'Icon': '&nbsp;', 'Name': 'Fast View', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Canvas', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': 'item-divider', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': 'fa fa-check', 'Class': 'optionEnabled', 'Name': 'Show Rulers', 'Shortcut': 'Ctrl+Alt+R', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Class': 'optionEnabled', 'Name': 'Show Guidelines', 'Shortcut': 'Ctrl+,', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Class': 'optionEnabled', 'Name': 'Show Symbol Labels', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Class': '', 'Name': 'Show Grid', 'Shortcut': 'Ctrl+Alt+G', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Class': 'optionEnabled', 'Name': 'Show Slices', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Class': 'optionEnabled', 'Name': 'Show Effects', 'Shortcut': 'Ctrl+E', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }
				]},
			{'Icon': '&nbsp;', 'Name': 'Snap to', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': 'item-divider', 'Tail': 'has-tail', 'MenuTailItem': [
					{'Icon': '&nbsp;', 'Name': 'Use Snapping', 'Shortcut': 'Shift+F10', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Use Snap Zones', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Grid', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Guide Lines', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Pixel', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Anchor Points', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Shapes', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Pages', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }
				]},
			{'Icon': 'fa fa-check', 'Name': 'Show Inspector Panel', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Show Layers Panel', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Show Libraries Panel', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Show Symbol Panels', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'New View', 'Shortcut': 'Ctrl+Alt+N', 'Disabled': '&nbsp;', 'Divider': 'item-divider', 'Tail': '&nbsp;' }, {'Icon': 'far fa-play-circle', 'Name': 'Play/Present', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }, {'Icon': '&nbsp;', 'Name': 'Toggle Fullscreen', 'Shortcut': 'Alt+Enter', 'Disabled': '&nbsp;', 'Divider': '&nbsp;', 'Tail': '&nbsp;' }
		]},
    { 'Name': 'Help', 'MenuItem': []}
  ];
	
	var toolbar_file = [
		{ 'Icon': 'fa fa-save', 'Id': 'save', 'Cursor': 'PSelect', 'Name': 'Save', 'Action': 'f.save', 'Disabled': '&nbsp;' }, { 'Icon': 'fas fa-reply', 'Id': 'undo', 'Cursor': 'PSelect', 'Name': 'Undo', 'Action': 'edit.undo', 'Disabled': 'disabled' }, { 'Icon': 'fas fa-share', 'Id': 'redo', 'Cursor': 'PSelect', 'Name': 'Redo', 'Action': 'edit.redo', 'Disabled': 'disabled' }
	];
	var toolbar_view = [
		{ 'iclass': 'zoom-button', 'Icon': 'fa fa-search-plus', 'Id': 'zoomb', 'bclass': 'dropdown', 'buttonClass': '&nbsp;', 'dataView': '&nbsp;', 'Cursor': 'PSelect', 'Name': 'Zoom', 'MenuDropdownItem': [
			{'Icon': '&nbsp;',  'Cursor': 'PSelect', 'Name': 'Original-View', 'buttonClass': 'tool-view', 'dataView': 'zoomReset', 'Shortcut': 'Ctrl+0', 'Disabled': '&nbsp;', 'Divider': 'item-divider' }, {'Icon': '&nbsp;', 'Cursor': 'PSelect', 'Name': '25%',  'buttonClass': 'tool-view', 'dataView': 'zoomInList', 'dataValue': '25', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': '&nbsp;', 'Cursor': 'PSelect', 'Name': '50%', 'buttonClass': 'tool-view', 'dataView': 'zoomInList', 'dataValue': '50', 'Shortcut': 'Ctrl+5', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': '&nbsp;', 'Cursor': 'PSelect', 'Name': '100%', 'buttonClass': 'tool-view', 'dataView': 'zoomInList', 'dataValue': '100', 'Shortcut': 'Ctrl+1', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': '&nbsp;', 'Cursor': 'PSelect', 'Name': '150%', 'buttonClass': 'tool-view', 'dataView': 'zoomInList', 'dataValue': '150', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': '&nbsp;', 'Cursor': 'PSelect', 'Name': '200%', 'buttonClass': 'tool-view', 'dataView': 'zoomInList', 'dataValue': '200', 'Shortcut': 'Ctrl+2', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': '&nbsp;', 'Cursor': 'PSelect', 'Name': '300%', 'buttonClass': 'tool-view', 'dataView': 'zoomInList', 'dataValue': '300', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': '&nbsp;', 'Cursor': 'PSelect', 'Name': '400%', 'buttonClass': 'tool-view', 'dataView': 'zoomInList', 'dataValue': '400', 'Shortcut': 'Ctrl+4', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': '&nbsp;', 'Cursor': 'PSelect', 'Name': '800%', 'buttonClass': 'tool-view', 'dataView': 'zoomInList', 'dataValue': '800', 'Shortcut': 'Ctrl+8', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }
		]}, { 'iclass': '&nbsp;', 'Id': 'fit-all', 'buttonClass': 'tool-view km-expand', 'dataView': 'fitpage', 'Icon': '&nbsp;', 'Cursor': 'PSelect', 'Name': 'Fit All' }, { 'iclass': 'dropdown', 'Id': 'handtool', 'buttonClass': 'tool-view', 'dataView': 'handPan', 'Icon': 'far fa-hand-paper', 'Cursor': 'PHandpan', 'Name': 'View', 'MenuDropdownItem': [
			{'Icon': 'far fa-hand-paper fs-16', 'buttonClass pan-tool': 'tool-view', 'dataView': 'handPan', 'Cursor': 'PHandpan', 'Name': 'Pan', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'fas fa-search-plus fs-16', 'buttonClass': 'tool-view zoom-tool', 'dataView': 'zoommenu', 'Cursor': 'PZoom', 'Name': 'Zoom', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }
		]}, { 'iclass': 'dropdown', 'Id': 'snaptool', 'buttonClass': 'tool-view', 'dataView': 'snap', 'Icon': 'fa fa-magnet fa-rotate-180', 'Cursor': 'PSelect', 'Name': 'Snap', 'MenuDropdownItem': [
			{'Icon': '&nbsp;', 'Cursor': 'PSelect', 'Name': 'Use Snapping', 'Shortcut': 'Shift+F10', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': '&nbsp;', 'Cursor': 'PSelect', 'Name': 'Use Snap Zones', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Cursor': 'PSelect', 'Name': 'Snap to Grid', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Cursor': 'PSelect', 'Name': 'Snap to Guide Lines', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Name': 'Snap to Pixel', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Cursor': 'PSelect', 'Name': 'Snap to Anchor Points', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Cursor': 'PSelect', 'Name': 'Snap to Shapes', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Cursor': 'PSelect', 'Name': 'Snap to Pages', 'Shortcut': null, 'Disabled': 'g-disabled', 'Divider': 'item-divider' }, {'Icon': '&nbsp;', 'Cursor': 'PSelect', 'Name': 'Show Grid', 'Shortcut': 'Ctrl+Alt+G', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Cursor': 'PSelect', 'Name': 'Show Guidelines', 'Shortcut': 'Ctrl+,', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Cursor': 'PSelect', 'Name': 'Show Symbol Labels', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }
		]}
	];
	var toolbar_tool = [
		{ 'iclass': 'dropdown', 'Icon': 'fas fa-mouse-pointer', 'Cursor': 'PSelect', 'Name': 'Select', 'MenuDropdownItem': [
			{'Icon': 'fas fa-mouse-pointer', 'Cursor': 'PSelect', 'Name': 'Pointer', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'far fa-paper-plane fa-flip-horizontal', 'Cursor': 'PSelect', 'Name': 'Subselect', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': 'item-divider' }, {'Icon': 'fa fa-check', 'Cursor': 'PSelect', 'Name': 'Laso', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-check', 'Cursor': 'PSelect', 'Name': 'Layer', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': 'item-divider' }, {'Icon': 'fa fa-check', 'Cursor': 'PSelect', 'Name': 'Slice', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }
		]}, { 'iclass': 'dropdown', 'Icon': 'far fa-square', 'Cursor': 'PDraw', 'Name': 'Shape', 'MenuDropdownItem': [
			{'Icon': 'km-line fs-15', 'Cursor': 'PDraw', 'Name': 'Line', 'Shortcut': 'L', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'far fa-square', 'Cursor': 'PDraw', 'Name': 'Rectangle', 'Shortcut': 'R', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'far fa-circle', 'Cursor': 'PDraw', 'Name': 'Ellipse', 'Shortcut': 'E', 'Disabled': '&nbsp;', 'Divider': 'item-divider' }, {'Icon': '&nbsp;', 'Cursor': 'PDraw', 'Name': 'Polygon', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'fa km-triangle fs-26', 'Cursor': 'PDraw', 'Name': 'Triangle', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'km-star fs-26', 'Cursor': 'PDraw', 'Name': 'Star', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }
		]}, { 'iclass': 'dropdown', 'Icon': 'fa km-nib fs-22 rotateZ-145', 'Cursor': 'PPen', 'Name': 'Path', 'MenuDropdownItem': [
			{'Icon': 'fa km-nib fs-18 rotateZ-145', 'Cursor': 'PPen', 'Name': 'Pen', 'Shortcut': 'P', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': 'fa fa-rotate-90 km-pen fs-20', 'Cursor': 'PPen', 'Name': 'Freehand', 'Shortcut': 'R', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }
		]}, { 'iclass': 'dropdown', 'Icon': 'fas fa-scalpel-path', 'Cursor': 'PKnife', 'Name': 'Knife', 'MenuDropdownItem': [
			{'Icon': 'fa', 'Cursor': 'PKnife', 'Name': 'Knife', 'Shortcut': 'K', 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }, {'Icon': '&nbsp;', 'Cursor': 'PKnife', 'Name': 'Freehand Shapping', 'Shortcut': null, 'Disabled': '&nbsp;', 'Divider': '&nbsp;' }
		]},  
		{ 'iclass': '&nbsp;', 'Icon': 'km-text far fs-22', 'Cursor': 'PDraw', 'Name': 'Text' }, { 'iclass': '&nbsp;', 'Icon': 'far fa-image', 'Name': 'Image'},  
	];
	var toolbar_transform = [
		{ 'Icon': 'km-flip fs-26 fa-flip-horizontal', 'Id': 'flip-h', 'Cursor': 'PSelect', 'Name': 'Flip Horizontal', 'Disabled': 'disabled', 'Type' : 'fllip', 'Typevalue' : "'flipX'" }, { 'Icon': 'km-flip fs-26 fa-rotate-270 fa', 'Id': 'flip-v', 'Cursor': 'PSelect', 'Name': 'Flip Vertical', 'Disabled': 'disabled', 'Type' : 'fllip', 'Typevalue' : "'flipY'" }, { 'Icon': 'fas fa-undo', 'Id': 'rotate-90-left', 'Cursor': 'PSelect', 'Name': 'Rotate 90° Left', 'Disabled': 'disabled', 'Type' : 'rotate', 'Typevalue' : '-90' }, { 'Icon': 'fas fa-redo', 'Id': 'rotate-90-right', 'Cursor': 'PSelect', 'Name': 'Rotate 90° Right', 'Disabled': 'disabled',  'Type' : 'rotate', 'Typevalue' : '90'}
	];
	var toolbar_group = [
		{ 'Icon': 'far fa-object-group', 'Id': 'tool-group', 'Cursor': 'PSelect', 'Name': 'Group', 'Disabled': 'disabled' }, { 'Icon': 'far fa-object-group fa-rotate-180', 'Id': 'tool-ungroup', 'Cursor': 'PSelect', 'Name': 'Ungroup', 'Disabled': 'disabled' }, { 'Icon': 'km-compound fs-20', 'Id': 'tool-compound-shape', 'Cursor': 'PSelect', 'Name': 'Create Compound Shape', 'Disabled': 'disabled' }, { 'Icon': 'fa fa-adjust',  'Id': 'tool-clip', 'Cursor': 'PSelect', 'Name': 'Clip', 'Disabled': 'disabled' }
	];
	var toolbar_arrange = [
		{ 'Icon': 'km-bring-forward fs-20', 'Id': 'tool-bring-forward', 'Cursor': 'PSelect', 'Name': 'Bring Forward', 'Action': 'arrange.order.bring-forward', 'Disabled': 'disabled', 'datapro' : 'bring', 'datavalue' : 'bringForward' }, { 'Icon': 'km-bring-backword fs-20', 'Id': 'tool-send-backward', 'Cursor': 'PSelect', 'Name': 'Send Backward', 'Action': 'arrange.order.send-backward', 'Disabled': 'disabled', 'datapro' : 'bring', 'datavalue' : 'sendBackwards' }
	];
	var toolbar_action = [
		{ 'Icon': 'km-symbol fs-20', 'Id': 'tool-symbol', 'Cursor': 'PSelect', 'Name': 'Create Symbol', 'Disabled': 'disabled' }, { 'Icon': 'km-path fs-24', 'Id': 'tool-convertto-path', 'Cursor': 'PSelect', 'Name': 'Convert to Path', 'Disabled': 'disabled' }, { 'Icon': 'fas fa-braille', 'Id': 'vectorize-border', 'Cursor': 'PSelect', 'Name': 'Vectorize Border', 'Disabled': 'disabled' }, { 'Icon': '&nbsp;', 'Id': 'template-json-file', 'Cursor': 'PSelect', 'Name': 'JSON', 'Disabled': '&nbsp;' }
	];
	/*var talignments = [
		{ 'Name': 'Distribute Horizontally', 'Action': 'arrange.distribute.horizontal', 'Icon': 'fas fa-align-justify fa-rotate-270', 'Divider': '&nbsp;' }, { 'Name': 'Distribute Vertically', 'Action': 'arrange.distribute.vertical', 'Icon': 'fas fa-align-justify', 'Divider': 'divider' }, { 'Name': 'Align Left', 'Action': 'arrange.align.align-left', 'Icon': 'fas fa-align-left' , 'Divider': '&nbsp;', 'v_value' : 'hl' }, { 'Name': 'Align Center', 'Action': 'arrange.align.align-center', 'Icon': 'fas fa-align-center', 'Divider': '&nbsp;', 'v_value' : 'hc' }, { 'Name': 'Align Right', 'Action': 'arrange.align.align-right', 'Icon': 'fas fa-align-right', 'Divider': 'divider', 'v_value' : 'hr' }, { 'Name': 'Align Top', 'Action': 'arrange.align.align-top', 'Icon': 'fas fa-align-right fa-rotate-270' , 'Divider': '&nbsp;' , 'v_value' : 'vt' }, { 'Name': 'Align Middle', 'Action': 'arrange.align.align-middle', 'Icon': 'fas fa-align-center fa-rotate-270', 'Divider': '&nbsp;', 'v_value' : 'vm' }, { 'Name': 'Align Bottom', 'Action': 'arrange.align.align-bottom', 'Icon': 'fas fa-align-right fa-rotate-90', 'Divider': '&nbsp;', 'v_value' : 'vb' }
	];*/
  var talignments = [
		{ 'Name': 'Distribute Horizontally', 'Action': 'arrange.distribute.horizontal', 'Icon': 'distribute-horizontally align-icon', 'Divider': '&nbsp;', 'bstatus': ' disabled distribute-h'}, { 'Name': 'Distribute Vertically', 'Action': 'arrange.distribute.vertical', 'Icon': 'distribute-vertically align-icon', 'Divider': 'divider', 'bstatus': ' disabled distribute-v'}, { 'Name': 'Align Left', 'Action': 'arrange.align.align-left', 'Icon': 'align-left align-icon' , 'Divider': '&nbsp;', 'v_value' : 'hl', 'bstatus': ''}, { 'Name': 'Align Center', 'Action': 'arrange.align.align-center', 'Icon': 'align-center align-icon', 'Divider': '&nbsp;', 'v_value' : 'hc', 'bstatus': ''}, { 'Name': 'Align Right', 'Action': 'arrange.align.align-right', 'Icon': 'align-right align-icon', 'Divider': 'divider', 'v_value' : 'hr', 'bstatus': ''}, { 'Name': 'Align Top', 'Action': 'arrange.align.align-top', 'Icon': 'align-top align-icon' , 'Divider': '&nbsp;' , 'v_value' : 'vt', 'bstatus': ''}, { 'Name': 'Align Middle', 'Action': 'arrange.align.align-middle', 'Icon': 'align-middle align-icon', 'Divider': '&nbsp;', 'v_value' : 'vm', 'bstatus': ''}, { 'Name': 'Align Bottom', 'Action': 'arrange.align.align-bottom', 'Icon': 'align-bottom align-icon', 'Divider': '&nbsp;', 'v_value' : 'vb', 'bstatus': ''}
	];
	var Rightproperty = [
		{ 'Name': 'Position', 'Input_1': 'x', 'Dimension_1': 'x', 'Max_1': '100', 'InputId_1': 'pos-x', 'v_1' : 'left', 'act_1' : 'set', 'Input_2': 'y', 'Max_2': '100', 'Dimension_2': 'y', 'InputId_2': 'pos-y', 'Ratio': '&nbsp;', 'v_2'  : 'top', 'act_2' : 'set' }, { 'Name': 'Size', 'Input_1': 'w', 'Max_1': '4000', 'InputId_1': 'size-width', 'Dimension_1': 'Width', 'v_1' : 'width', 'act_1' : 'set', 'Input_2': 'h', 'Max_2': '4000', 'InputId_2': 'size-height', 'Dimension_2': 'Height', 'Ratio': 'object-link-icon', 'v_2' : 'height', 'act_2' : 'set' }, { 'Name': 'Angle', 'Input_1': 'R',  'Max_1': '360',  'InputId_1': 'angle','Dimension_1': 'Ratio', 'Input_2': '', 'v_1' : 'angle', 'act_1' : 'set' }, 
	]; // fas fa-percent // , 'Input_2': 'Transform', 'Dimension_2': 'Transform', 'InputId_2': 'transform', 'Ratio': '&nbsp;', 'v_1' : 'angle', 'act_1' : 'set'
	var Rightproperty_2 = [
		{ 'Name': 'Move', 'Input_1': 'X', 'Value_1': '0', 'Max_1': '100', 'dataValue_1': 'move-x', 'Input_2': 'Y', 'Value_2': '0', 'Max_2': '100', 'dataValue_2': 'move-y' }, { 'Name': 'Scale', 'Input_1': 'W', 'Value_1': '100', 'Max_1': '4000', 'dataValue_1': 'scale-x', 'Input_2': 'H', 'Max_2': '4000', 'Value_2': '100', 'dataValue_2': 'scale-y' }, { 'Name': 'Rotate', 'Input_1': '↑', 'Value_1': '0', 'Max_1': '360', 'dataValue_1': 'rotateUp', 'Input_2': '↓', 'Value_2': '0', 'Max_2': '360', 'dataValue_2': 'reflect' }, { 'Name': 'Skew', 'Input_1': 'X', 'Value_1': '0°', 'Max_1': '360', 'dataValue_1': 'skew-x', 'Input_2': 'Y', 'Value_2': '0°', 'dataValue_2': 'skew-y',  }, { 'Name': 'Copies', 'Input_1': '&nbsp;', 'Value_1': '0', 'Max_1': '100', 'dataValue_1': 'ncopies' } 
	];
	var Rightproperty_4 = [
		{ 'Label': 'Preset Size', 'Group': [
			{ 'Name': 'Custom Size', 'PresetId': 'preset-size', 'Options': [
				{ 'Name': 'Infinite Canvas', 'Value': '0x0' },
			]},
			{ 'Name': 'Web/Desktop', 'PresetId': 'preset-web', 'Options': [
				{ 'Name': 'Blog Cover', 'Value': '560x315' },
				{ 'Name': 'Blog Graphic', 'Value': '800x1200' },
				{ 'Name': 'Website - Small', 'Value': '1024x768' },
				{ 'Name': 'Website - Normal', 'Value': '1280x800' },
				{ 'Name': 'Website - Medium', 'Value': '1366x768' },
				{ 'Name': 'Website - Large', 'Value': '1440x900' },
				{ 'Name': 'Website - Huge', 'Value': '1920x1280' },
				{ 'Name': 'Full Website', 'Value': '1440x3072' },
			]},
			{ 'Name': 'Social Media', 'PresetId': 'preset-social', 'Options': [
				{ 'Name': 'Facebook Cover', 'Value': '851x315' },
				{ 'Name': 'Twitter Cover', 'Value': '1500x500' },
				{ 'Name': 'YouTube Cover', 'Value': '2560x1440' },
				{ 'Name': 'Google+ Cover', 'Value': '1080x608' },
				{ 'Name': 'LinkedIn Cover', 'Value': '1440x425' },
				{ 'Name': 'Twitch Cover', 'Value': '900x480' },
				{ 'Name': 'Twitter Post', 'Value': '1024x512' },
				{ 'Name': 'Facebook Post', 'Value': '940x788' },
				{ 'Name': 'Facebook App', 'Value': '810x450' },
				{ 'Name': 'Facebook Ad', 'Value': '1200x627' },
				{ 'Name': 'Instagram Post', 'Value': '1080x1080' },
				{ 'Name': 'Tumblr Graphic', 'Value': '540x810' },
				{ 'Name': 'Pinterest Pin', 'Value': '735x600' },
				{ 'Name': 'Twitch Video', 'Value': '1206x708' },
				{ 'Name': 'LinkedIn Banner', 'Value': '646x220' },
				{ 'Name': 'Dribbble Shot 400x300', 'Value': '400x300' },
				{ 'Name': 'Dribbble Shot 800x600', 'Value': '800x600' },
			]},
			{ 'Name': 'Devices', 'PresetId': 'preset-screen', 'Options': [
				{ 'Name': 'iPhone X', 'Value': '375x812' },
				{ 'Name': 'iPhone XR', 'Value': '828x1792' },
				{ 'Name': 'iPhone XS Max', 'Value': '1242x2688' },
				{ 'Name': 'iPhone 6/7/8 Plus', 'Value': '414x736' },
				{ 'Name': 'iPhone 6/7/8', 'Value': '375x667' },
				{ 'Name': 'iPhone 5/SE', 'Value': '320x568' },
				{ 'Name': 'Google Pixel 2/XL', 'Value': '411x731' },
				{ 'Name': 'Android mobile', 'Value': '360x640' },
				{ 'Name': 'Apple Watch 38 mm', 'Value': '272x340' },
				{ 'Name': 'Apple Watch 42 mm', 'Value': '312x390' },
				{ 'Name': 'Apple Watch 4 40 mm', 'Value': '324x394' },
				{ 'Name': 'Apple Watch 4 44 mm', 'Value': '368x448' },
				{ 'Name': 'iPad 3/4/Air/Mini', 'Value': '768x1024' },
				{ 'Name': 'iPad Pro 12.9in', 'Value': '1024x1366' },
				{ 'Name': 'Nexus 7', 'Value': '600x960' },
				{ 'Name': 'Nexus 9', 'Value': '1024x768' },
				{ 'Name': 'Nexus 10', 'Value': '1280x800' },
				{ 'Name': 'Surface Pro 3', 'Value': '1440x960' },
				{ 'Name': 'Surface Pro 4', 'Value': '1368x912' },
			]},
			{ 'Name': 'Print on Demand', 'PresetId': 'preset-print', 'Options': [
				{ 'Name': 'Amazon Popsocket', 'Value': '485x485' },
				{ 'Name': 'Teepublic T-Shirt', 'Value': '1500x1995' },
				{ 'Name': 'Redbubble Standard 2400x3200', 'Value': '2400x3200' },
				{ 'Name': 'Redbubble Long 2875x3900', 'Value': '2875x3900' },
			]},
		]},
		//{ 'Label': 'Rotate Page', 'Property': 'rotate-page', 'Icon': 'kmds-rotatepage' },
		{ 'Label': 'Page Background', 'Property': 'page-background', 'Icon': 'kmds-pagebackground' },
		//{ 'Label': 'Rotate Canvas', 'Disabled': 'disabled', 'Property': 'rotate-canvas', 'Icon': 'fs-18 km-rotatecanvas' },
		//{ 'Label': 'Trim Canvas', 'Disabled': '&nbsp;', 'Property': 'trim-canvas', 'Icon': 'fs-18 km-trimcanvas' },
		//{ 'Label': 'Clip content', 'Disabled': 'disabled', 'Property': 'clip-content', 'Icon': 'fs-18 km-clipcanvas' }
	];
	var Rightproperty_5 = [
		{ 'Name': 'Left', 'Property': 'ml' },
		{ 'Name': 'Top', 'Property': 'mt' },
		{ 'Name': 'Right', 'Property': 'mr' },
		{ 'Name': 'Bottom', 'Property': 'mb' },
	];
	
	var Rightproperty_8 = [
		{ 'Name': 'Image', 'Items': [
			//{ 'Name': 'Replace', 'Id': 'image-replace', 'datapro' : 'imageReplace', 'Value' : 'replace', 'Icon': 'far fa-image', 'Disabled': '&nbsp;' },
			{ 'Name': 'Original Size', 'Id': 'orig-size', 'datapro' : 'imageOriginalSize', 'Value' : 'origSize', 'Icon': 'original-size-icon', 'Disabled': '&nbsp;', 'on_click': 'imgOriginalSize'},//fas fa-expand
			{ 'Name': 'Crop', 'Id': 'image-crop', 'datapro' : 'imageCrop', 'Value' : 'crop', 'Icon': 'fa fa-crop', 'Disabled': '&nbsp;', 'on_click': 'imgCropTool'},
			//{ 'Name': 'Colors', 'Id': 'image-colors', 'datapro' : 'imageReplace', 'Value' : 'replace', 'Icon': 'fas fa-tint fa-rotate-180', 'Disabled': '&nbsp;' }
			]},
		{ 'Name': 'Corner', 'Items': [
			{ 'Name': 'Corner Track', 'Id': 'corner-track', 'datapro' : 'cornerRadius' },
			{ 'Name': 'Corner Input', 'Id': 'corner-input', 'datapro' : 'cornerInput' },
			{ 'Name': 'Corner Advanced', 'Id': 'corner-adv', 'datapro' : 'cornerAdv' },
			]},
	];
	
	var Rightproperty_7 = [
	{ 'Name': 'Color', 'Items': [
		{ 'Name': 'Fill', 'Id': 'textst-fill', 'datapro' : 'textst', 'datavalue' : 'fill', 'Value': '#000000'  },
		{ 'Name': 'Stroke', 'Id': 'textst-stock', 'datapro' : 'textst', 'datavalue' : 'stroke', 'Value': '#000000' },
		{ 'Name': 'Background', 'Id': 'textpro-bg', 'datapro' : 'textpro', 'datavalue' : 'backgroundColor', 'Value': '#ffffff' }, 
    { 'Name': 'Text Background Color', 'Id': 'textpro-tbg', 'datapro' : 'textpro', 'datavalue' : 'textBackgroundColor', 'Value': '#ffffff' }
		]},
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
			{ 'Name': 'Droid Serif' },
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
		]}, { 'Name': 'FSize', 'Id': 'text-font-size', 'Options': [
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
			{ 'Name': 'Bold', 'Id': 'text-cmd-bold', 'datapro' : 'fontWeight', 'datavalue' : 'bold', 'Icon': 'fas fa-bold' },
			{ 'Name': 'Italic', 'Id': 'text-cmd-italic', 'datapro' : 'fontStyle', 'datavalue' : 'italic', 'Icon': 'fas fa-italic' },
			{ 'Name': 'Underline', 'Id': 'text-cmd-underline', 'datapro' : 'textDecoration', 'datavalue' : 'underline', 'Icon': 'fas fa-underline' },
			{ 'Name': 'Strikethrough', 'Id': 'text-cmd-linethrough', 'datapro' : 'textDecoration', 'datavalue' : 'linethrough', 'Icon': 'fas fa-strikethrough' },
		]}, { 'Name': 'Alignments', 'Items': [
			{ 'Name': 'Align Left', 'Value': 'left', 'Id': 'align-left', 'Icon': 'fas fa-align-left' },
			{ 'Name': 'Align Center', 'Value': 'center', 'Id': 'align-center', 'Icon': 'fas fa-align-center' },
			{ 'Name': 'Align Right', 'Value': 'right', 'Id': 'align-right', 'Icon': 'fas fa-align-right' },
			{ 'Name': 'Align Justify', 'Value': 'justify', 'Id': 'align-justify', 'Icon': 'fas fa-align-center fa-rotate-270' },
		]}, { 'Name': 'Vertical', 'Items': [
			{ 'Name': 'Align Top', 'Id': 'align-top', 'Icon': 'fas fa-align-right fa-rotate-270' },
			{ 'Name': 'Align Middle', 'Id': 'align-center', 'Icon': 'fas fa-align-center fa-rotate-270' },
			{ 'Name': 'Align Bottom', 'Id': 'align-right', 'Icon': 'fas fa-align-right fa-rotate-90' },
		]}, { 'Name': 'Spacing', 'Items': [
			{ 'Name': 'Char', 'Id': 'char-spacing', 'Min': '0', 'Value': '0', 'datapro' : 'charSpacing' },
			// { 'Name': 'Word', 'Id': 'word-spacing', 'Min': '0', 'Value': '0', 'datapro' : 'wordSpacing' },
			{ 'Name': 'Line', 'Id': 'line-spacing', 'Min': '1', 'Value': '100', 'datapro' : 'lineHeight' },
		]}, { 'Name': 'Sizing', 'Items': [
			{ 'Name': 'Width', 'Button_1': 'Auto', 'Button_2': 'Fix', 'Id_1': 'width-auto', 'Id_2': 'width-fix' },
			{ 'Name': 'Height', 'Button_1': 'Auto', 'Button_2': 'Fix', 'Id_1': 'height-auto', 'Id_2': 'height-fix' },
		]}, { 'Name': 'Script', 'Options': [
			{ 'Name': 'Left-to-right', 'Value': '0', 'Type' : 'rotate', 'Typevalue' : '0', 'Id': 'left-to-right' },
			{ 'Name': 'Right-to-left', 'Value': '180', 'Type' : 'rotate', 'Typevalue' : '180', 'Id': 'right-to-left' },
			{ 'Name': 'Top-to-bottom', 'Value': '-90', 'Type' : 'rotate', 'Typevalue' : '-90', 'Id': 'top-to-bottom' },
		]}, 
	];
  
  design_id = getUrlDesignID();
  if (design_id == '') {
    setTimeout(function() {
      $('body').removeClass('loading');
      $('#mainframe').css('display', 'flex');
    }, 3000);
  }
  //click on layer refresh link after canvas render.
  if(design_id !== ''){
    setTimeout(function() {
      refreshLayersOnTemplateLoad();
    }, 4000);
  }

  setTimeout(function() {
    var de = new De();
    $('body').append(de);
  }, 3200);
  setTimeout(function() {
    $('.modal-header').hide();
    $('.modal-footer').css('padding', '35px');
		design_id = getUrlDesignID();
    if (design_id == '') {
      $('#modal').modal('show');
    }
		lastClickedTool = $('.toolbar-button.toolbar-Select button.drawingtool');
		undoBtn = $('#undo');
		undo_caption = $('#undo_caption');
		redoBtn = $('#redo');
		redo_caption = $('#redo_caption'); 
		
		var $r = jQuery('input[type="range"]');
		// Initialize
		$r.rangeslider({
			polyfill: false,
			onSlide: function(position, value) {
				//$('#corner-input').val(value);
			},
			onSlideEnd: function(position, value) {
				// Update the rating value once the slide is done
				//$('#corner-input').val(value);
			}
		});
  }, 3500);
	
	$(window).on('resize', function(){
		canvasResize();
	});
	$(window).on('scroll', function(){
		canvasResize();
	}); 
	$(window).on('load', function(){
		canvasResize();
	});
	
	function canvasResize() {
		var w = window.outerWidth;
		var h = window.outerHeight;
		var topRuler = document.getElementById('kmds-top-ruler');
		var leftRuler = document.getElementById('kmds-left-ruler');
		canvas.setWidth(w);
		canvas.setHeight(h);
		/* topRuler.width = w;
		leftRuler.height = h; */
	}
	
	if($('.k-dialog-container').length == 0){
		$('body').append($('<div />', {'class': 'k-dialog-container'}));		
		callProductModal();
	}
	
	$("#modal").on("hidden.bs.modal", function(e) {
		if($('.page-row').length === 0){
			//create new page with rectangle for new template
			var pid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			//add_page(pid, pageWidth, pageHeight, '#ffffff');
      //console.log("PID 1 = "+pid);
		}
		if($('#header .tabs .tab.g-active').length === 0){
			//template_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			//$("<div></div>").addClass("tab g-active").attr('data-id', template_id).append($("<span></span>").addClass("title c-pointer").attr('design', 'untitled').append('Untitled****'))/* .append($("<span/>", {'class': 'close c-pointer', 'designid': 'untitled', 'onclick': 'FntemplateClose(this)', 'html': '✕'})) */.appendTo('#header .tabs');//.attr('onclick', 'FntemplateSwitch(this)')
			//$('<div/>', {'class': 'template-group group-active', 'id': template_id}).appendTo('#layers');
			//document.title = 'Untitled | KaboodleMedia';
			//create new page with rectangle for new template
			//var pid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			//add_page(pid, pageWidth, pageHeight, '#ffffff');
		}
		if(producTypeId !== ''){
			var getactiveTerm = media_base_url+'/termdata/'+ producTypeId +'?_format=json';
			$.getJSON( getactiveTerm, function( getactiveicon ) {
				$('#item-'+producTypeId).find('.product-icon').attr('src', getactiveicon[0].icon);
			});
			$('.k-dialog-container .modal-footer').html(
        $('<div/>', {"class": "cancel-design-modal"}).html(
          $('<button/>', {'id': 'cancel-design', 'onclick': 'cancelCanvasDesignModal(this)', 'class': 'btn btn-blue font-Lato fs-15', text: 'CANCEL'})
        )
      );
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
  
  function keyPressbtn(){
    var e = window.event;
    var measurement = jQuery('#elem-measurement').val();
    if(measurement == 'pixels'){
      return (
        e.keyCode == 8 || 
        (e.charCode >= 48 && e.charCode <= 57)
      );
    }
    if(measurement == 'inches'){
      return (
        e.keyCode == 8 || 
        e.keyCode == 46 ||
        (e.charCode >= 48 && e.charCode <= 57)
      );
    }
    else {
      return false;
    }
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
    var design_id = getUrlDesignID();
    jQuery(".sidebar-selector .media-kit-image-list").trigger("click");
    //Add Image container
    //addImageContainer(); //Disbaled by SMH at 02-04-2021
    /*if(design_id != '' && design_id == "5fbe1aded85c495bfd306eb8"){
      jQuery(".sidebar-selector .media-kit-image-list").trigger("click");
    }
    else {
      $('#imgupload').trigger('click');
    }*/
	}
  /**
  * Callback function imgOriginalSize()
  * to get back the image in original size.
  **/
  function imgOriginalSize(){
		var activepage = $('.page-row.g-active').attr('id');
    var pageObj = canvas.getItemById(activePage);
    var obj = canvas.getActiveObject();
    var imgwidth = imgheight = '';
    var zoomLevel = canvas.getZoom();
    if(obj.OldscaleX){
      if(obj.OldscaleX !== 1){
        imgwidth = obj.width * obj.OldscaleX * zoomLevel;
      }
      else {
        imgwidth = obj.OldWidth * zoomLevel;
      }
    }
    else {
      if(obj.width > pageObj.width){
        imgwidth = pageObj.width * zoomLevel;
      } else {
        imgwidth = obj.width * zoomLevel
      }
    }
    if(obj.OldscaleY){
      if(obj.OldscaleY !== 1){
        imgheight = obj.height * obj.OldscaleY * zoomLevel;
      }
      else {
        imgheight = obj.OldHeight * zoomLevel;
      }
    }
    else {
      if(obj.height > pageObj.height){
        imgheight = pageObj.height * zoomLevel;
      } else {
        imgheight = obj.height * zoomLevel;
      }
    }
    obj.scaleToHeight(imgheight);
    obj.scaleToWidth(imgwidth);
    canvas.renderAll().setActiveObject(obj);
    obj.setCoords();
	}
  /**
  * Callback function imgCropTool()
  * to crop the image from canvas.
  * open the Image Asset Editor,
  * /tools/image-editor/[file-id]?destination=/kmds/design/toolx?d=[template-id]
  **/
  function imgCropTool(){
    var obj = canvas.getActiveObject();
    if(obj.type == 'image'){
      if(savedDesignFlag){
        //console.log("Open Image editor.");
        if(obj.imgfid){
          var imgfid = obj.imgfid;
          var design_id = getUrlDesignID();
          window.location.href = '/tools/image-editor/'+imgfid+'?destination=/kmds/design/toolx/'+design_id;
        }
        else {
          FnNewFolderModal();
          FnDefaultModal('Insert image ID in selected image or add new image.');
          $('.g-dialog-container .g-dialog-header').addClass('d-none');
        }
      }
      else {
        FnNewFolderModal();
        FnDefaultModal('Save changes before transferring to the Image Asset Editor.');
        $('.g-dialog-container .g-dialog-header').addClass('d-none');
      }
    }
  }
  function tooltipfn(){
    $('[data-toggle="tooltip"]').tooltip({
			placement : 'bottom',
			trigger : 'hover'
		});
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
  	
	elemAttr.prototype.keyAction = function(ev){
		$('#'+this.id).keypress(function(event){
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if(keycode == 13 && this.id == 'canvas-width'){
				if (!$.isNumeric($('#canvas-width').val())) {
					jQuery('#canvas-width').val(parseFloat(pageWidth).toFixed(2));
          //setPageSizeOption();
					savedDesignFlag = false;
					return;
				}
				pageAtrribute('width', parseFloat(jQuery('#canvas-width').val()).toFixed(2));
        setPageSizeOption(parseFloat(jQuery('#canvas-width').val()).toFixed(2), parseFloat(jQuery('#canvas-height').val()).toFixed(2));
      }
			if(keycode == 13 && this.id == 'canvas-height'){
	      if (!$.isNumeric($('#canvas-height').val())) {
          jQuery('#canvas-height').val(parseFloat(pageHeight).toFixed(2));
          //setPageSizeOption();
					savedDesignFlag = false;
          return;
        }
        pageAtrribute('height', parseFloat(jQuery('#canvas-height').val()).toFixed(2));
        setPageSizeOption(parseFloat(jQuery('#canvas-width').val()).toFixed(2), parseFloat(jQuery('#canvas-height').val()).toFixed(2));
      }
    });
	}
	
	
	
  $("#canvas-width").on('focusout', function(){
		if (!$.isNumeric($('#canvas-width').val())) {
			jQuery('#canvas-width').val(parseFloat(pageWidth).toFixed(2));
      //setPageSizeOption();
			savedDesignFlag = false;
			return;
		}
		var cw = jQuery('#canvas-width').val();
		pageAtrribute('width', parseFloat(cw).toFixed(2));
    setPageSizeOption(parseFloat(cw).toFixed(2), parseFloat(jQuery('#canvas-height').val()).toFixed(2));
  });
	
  $("#canvas-height").on('focusout', function(){
		if (!$.isNumeric($('#canvas-height').val())) {
			jQuery('#canvas-height').val(parseFloat(pageHeight).toFixed(2));
      //setPageSizeOption();
			savedDesignFlag = false;
			return;
		}
		var ch = jQuery('#canvas-height').val();
		pageAtrribute('height', parseFloat(ch).toFixed(2));
    setPageSizeOption(parseFloat(jQuery('#canvas-width').val()).toFixed(2), parseFloat(ch).toFixed(2));
  });
	
	getAction.prototype.menuAction = function(){
		return $('#'+this.id).attr('data-action', this.action);
	}
	setProperties.prototype.properties = function(){
		return $('#'+this.id).val(this.value);
	}
	
	if(producTypeId !== ''){
    console.log('5');
		getProductName(producTypeId);
	}
	
	/**
	 * Active page set Attribute
	 */
	function pageAtrribute(attribute, value){
    var zoomLevel = canvas.getZoom();
    var measurements = jQuery("#measurements").val();
    activePageID = $('.page-row.g-active').attr('id');
    active_page_object = canvas.getItemsByPage(activePageID)[0];
		if(measurements == 'in'){
      value = (value * 72);
    }
    if(attribute == 'width') {
      var pw = value;
      var widthDif = (((pw - active_page_object.width)*zoomLevel)/2);
      var topRulerX = (((pw*zoomLevel)-pw)/2);
      topRulerZoom = topRulerX;
    }
    else {
      var ph = value;
      var heightDif = (((ph - active_page_object.height)*zoomLevel)/2);
      var leftRulerY = (((ph*zoomLevel)-ph)/2);
      leftRulerZoom = leftRulerY;
    }
	  var activepage = $('.page-row.g-active').attr('id');
		canvas.getObjects().forEach(function(o) {
			if(activepage == o.id && o.type == 'page'){
				o.set(attribute, value).setCoords();
				canvas.renderAll();
				//console.log(o);
			}
		});
    if(attribute == 'width') {
      if(widthDif > 0){
        topRuler.relativePan({x: -widthDif, y: 0});
      }
      else {
        widthDif = (widthDif * -1);
        topRuler.relativePan({x: widthDif, y: 0});
      }
    }
    else {
      if(heightDif > 0){
        leftRuler.relativePan({x: 0, y: -heightDif});
      }
      else {
        heightDif = (heightDif * -1);
        leftRuler.relativePan({x: 0, y: heightDif});
      }
    }
    setPageSizeOption();
		savedDesignFlag = false;
		if(!savedDesignFlag){
			DetectTemplateChanges();
		}
	}
	
	/**
	 * return Product active Icons
	 */
  function getActiveicon(e){
    var id = e.id;
    var tid = $('#'+id).data('tid');
    $('.modal-content').append('<div class="progress-overlay sub-preset-loader toolbarPanel_4-overlay"><div class="spinner-border"></div></div>');
    /*$('.product-item').each(function(event) {
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
    });*/
    
    $('.product-icon').removeClass("d-none");
    $('.product-active-icon').addClass("d-none");
    $('.product-item').removeClass("active");
    $('#'+id).addClass('active');
    if($('#'+id).hasClass('active')) {
      $('#'+id).find('.product-icon').addClass("d-none");
      $('#'+id).find('.product-active-icon').removeClass("d-none");
      /*var getactiveTerm = media_base_url+'/termdata/'+ tid +'?_format=json';
      $.getJSON( getactiveTerm, function( getactiveicon ) {
        $('#'+id).find('.product-icon').attr('src', getactiveicon[0].activeicon);
      });*/
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
      var $footerelem = $('.modal-footer').html(
        $('<div/>', {"class": "d-none d-flex align-items-center", "id": "create-design"}).html(elems)
      );
      $('#create-design').removeClass('d-none');
      $('.modal-footer').css('padding', '1rem');
      //image_preset
      $('.modal-footer').prepend($('<div/>', {"class": "align-items-center", "id": "preset-select-design"}).html($('<select/>', {"class": 'preset-select-list', "id": 'preset-select', "onChange": "preset_select_modal(this)"}).append($('<option/>', {'value': '_none', 'text': 'Select a preset...'}))));
      //image_preset
      var media_preset = [];
      media_preset.push('<option value="none">Select a preset...</option>');
      var getTokenList = media_base_url+'/tokendata?_format=json';
      var url_data = {vid : "image_preset", product_group_tid : product_group, sub_image_preset: tid}
      $.getJSON(getTokenList, url_data, function( tokenlist ) {
        $.each(tokenlist, function(key, val) {
          media_preset.push('<option value="'+val.tid+'" width="'+val.width+'" height="'+val.height+'" unit="'+val.unit+'">'+val.name+'</option>');
        });
        media_preset = media_preset.join('');
        jQuery("#preset-select").empty();
        jQuery("#preset-select").append(media_preset);
        //jQuery("#preset-size").append(media_preset);
        producTypeId = tid;
        getPageSizePreset(product_group);
      }).always(function() {
        //remove loader
        jQuery(".progress-overlay.sub-preset-loader").remove();
      });
      jQuery('input#elem-height, input#elem-width').on('keypress', function(event){
        jQuery('#preset-select').val('none');
				//unset global variables of preset name
				presetVal = '';
				productId = $('.product-item.active').attr('data-group');
				producTypeId = $('.product-item.active').attr('data-tid');
				presetName = 'Custom';
				jQuery('#header .selectedpreset #preset-name').attr('href', '/kmds/design/'+uid+'/'+productId+'/'+producTypeId);
				jQuery('#header .selectedpreset #preset-name').text(presetName);
        var measurement = jQuery('#elem-measurement').val();
        if(measurement == 'pixels'){
          return (
            event.keyCode == 8 || 
            (event.charCode >= 48 && event.charCode <= 57)
          );
        }
        else if(measurement == 'inches'){
          return (
            event.keyCode == 8 || 
            event.keyCode == 46 ||
            (event.charCode >= 48 && event.charCode <= 57)
          );
        }
      });
    }
  }
	
	/**
	 * A Global Modal Box
	 */
  function modalBox (modalcontent, title_msg = null) {
    var $elem = $('body div.k-dialog-container');
    $elem.append(
      $('<div/>', {'class': 'modal fade align-items-center', 'id': 'modal', 'data-backdrop': "static", 'data-keyboard': "false"}).append(
        $('<div/>', {'class': 'modal-dialog'}).append(
          $('<div/>', {'class': 'modal-content'}).append(
            $('<div/>', {'class': 'modal-header'}).append(
              $('<h4/>', {'class': 'modal-title', text: title_msg})
            )
          ).append(
            $('<div/>', {'class': 'modal-body'})
          ).append(
          $('<div/>', {'class': 'modal-footer'})
            .append(
              $('<div/>', {'class': 'cancel-design-modal'}).append(
                $('<button/>', {'id': 'cancel-design', 'onclick': 'cancelCanvasDesignModal(this)', 'class': 'btn btn-blue font-Lato fs-15', text: 'CANCEL'})
              )
            )/*.append(
              $('<button/>', {'class': 'btn btn-primary', text: button_text})
            ) */
          )
        )
      )
    );  
  }
	
	/**
	 * return Modal Body elements
	 */
  function modalContent () {
    $.getJSON( product_group_url, function( data ) { //products
      var products = [];
      var productitems = [];
      var allelemitems = [];
      var pro_tid = 0;
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++){
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
        if(hash[0] == 'template') {
          pro_tid = vars['template'];
        }
      }
      $.each( data, function( key, val ) { 
        if(pro_tid == 0){
          if(val.name == 'Social Media'){
            var $class = 'active';
            var $iclass = 'show active';
            var $area = true;
          } else {
            var $class = $iclass = '';
            var $area = false;
          }
        }
        else if(val.tid == pro_tid){
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
            groups[groupName].push({name: myArray[i].name, tid: myArray[i].tid, icon: myArray[i].icon, a_icon: myArray[i].a_icon});
          }
          myArray = [];
          for (groupName in groups) {
            myArray.push({group: groupName, items: groups[groupName]});
          }         
          $.each( myArray, function( ikey, ival ) {
            ival.items.sort((a, b) => a.name.localeCompare(b.name));
            var p_item = ival.items.map((nitem, nkey) => {            
              return '<div id="item-' + nitem.tid +'" data-tid='+ nitem.tid +' data-name="'+ nitem.name +'" data-group='+ ival.group +' class="product-item" onclick="getActiveicon(this)"><img class="product-icon" src="'+ nitem.icon +'" alt="'+ nitem.name +'" title="'+ nitem.name +'"/><img class="product-active-icon d-none" src="'+ nitem.a_icon +'" alt="'+ nitem.name +'" title="'+ nitem.name +'"/></div>';
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
        //Preset select list
        //allelemitems.push($('<select/>', {"class": 'preset-select-list', "id": 'preset-select'}).append($('<option/>', {'value': '_none', 'text': 'Select a preset...'})).append($('<option/>', {'value': 'p1', 'text': 'Preset 1'})));        
      });
      var $elem = $('.modal-body').append(
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
        $('.modal-footer').html(
          $('<div/>', {"class": "cancel-design-modal"}).html(
            $('<button/>', {'id': 'cancel-design', 'onclick': 'cancelCanvasDesignModal(this)', 'class': 'btn btn-blue font-Lato fs-15', text: 'CANCEL'})
          )
        );
        $('.modal-footer').css('padding', '35px');
      });

      var $output = $elem;
      return $output;
    });
  }
	
  /**
	 * return Modal form elements
	 */
  function InputElems(max, measurement, title) {
    //$('<select/>', {"class": 'preset-select-list', "id": 'preset-select'}).append($('<option/>', {'value': '_none', 'text': 'Select a preset...'})).append($('<option/>', {'value': 'p1', 'text': 'Preset 1'}))
     return $('<ul/>', {'class': 'd-flex'})
      .append(
        $('<li/>').append(
          $('<input/>', {'type': 'number', 'min': 0, 'max': max, 'maxlength': 2, 'class': 'dcreate-elem pl-2', 'name': 'width', 'title': '', 'data-toggle':'tooltip', 'data-placement': 'bottom', 'id': 'elem-width', 'placeholder': 'width', 'onmouseover': "tooltipfn(this)", 'onkeyup': "keyUpbtn()", 'onkeydown': "keyDownbtn()", 'oninput':"(this.value > "+max+") ? this.title = '" + title + "' : this.value"})
        )
      ).append(
        $('<li/>', {'class': 'elem-separator', 'text': 'x'})
      ).append(
        $('<li/>').append(
          $('<input/>', {'type': 'text', 'min': 0, 'max': max, /* 'maxlength': 4, */ 'data-toggle':'tooltip', 'data-placement': 'bottom', 'title': '', 'class': 'dcreate-elem pl-2', 'name': 'height', 'id': 'elem-height', 'placeholder': 'height', 'onkeyup': "keyUpbtn()", 'onkeydown': "keyDownbtn()", 'onmouseover': "tooltipfn(this)", 'oninput':"(this.value > "+max+") ? this.title = '" + title + "' : this.value" }) 
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
      ).append(
        $('<li/>', {'class': 'elem-separator'})
      ).append(
        $('<li/>', {'class': 'cancel-design-modal'}).append(
          $('<button/>', {'id': 'cancel-design', 'onclick': 'cancelCanvasDesignModal(this)', 'class': 'btn btn-blue font-Lato fs-15', text: 'CANCEL'})
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

    this._header = new getMenuBar();
    this._toolbar = new ToolBar();
    this._leftSidebars = new LeftSidebars();
    this._panels = new canvasInit();
    this._rightSidebars = new RightSidebars();
  //  var h = $("<div></div>").attr("id", "footer").appendTo(this._mainframe);
    this._footer = "footer"; 
  }
  
	/**
	 * return Header Menu
	 */
  function getMenuBar (){
		template_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		
    $("<div></div>").addClass("section menu").append($("<nav></nav>").addClass("g-menu-bar").append($("<ul></ul>").addClass("g-menu g-menu-root"))).appendTo('#header')
		
		$("<div></div>").addClass("section windows d-flex").append($("<div></div>").addClass("selectedpreset d-flex justify-content-center align-items-center").append($("<a></a>").attr('href', '').attr('id', 'preset-name')).append($("<span></span>").text(': '))).append($("<div></div>").addClass("tabs").append($("<div></div>").addClass("tab g-active").attr('data-id', template_id).append($("<span></span>").addClass("title").attr('design', 'untitled').append('Untitled*'))/* .append($("<span/>", {'class': 'close c-pointer', 'designid': 'untitled', 'onclick': 'FntemplateClose(this)', 'html': '✕'})) */)).appendTo('#header');//.attr('onclick', 'FntemplateSwitch(this)') // c-pointer
		
		/* $("<div></div>").addClass("section login user").append(
			$('<img class="avatar" src="'+ avatar +'" alt='+ name +' title='+ name +'/>')	
		).appendTo('#header') */

		getFileName(); //update template name
		
    
    $.each(H_items, function (index, dataMenu) {
      var menuBuilder = [];
      menuBuilder.push('<li class="g-menu-item"><span class="g-menu-item-caption">' + dataMenu.Name + '</span>');

      if (dataMenu.MenuItem.length > 0) {
				if(dataMenu.Name == 'Edit'){
					var n = dataMenu.Name;
					var cl = n.toLowerCase()+'-options';
				}	else {var cl = '';}
        menuBuilder.push('<ul class="g-menu g-menu-bottom '+cl+'">');
        $.each(dataMenu.MenuItem, function (i, dataSubmenu) {
					
					if(dataMenu.Name == 'Edit'){
					var commoncl = 'tool-act';
					} else {
						var commoncl = '';
					}
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
          menuBuilder.push('<li data-title="'+dataSubmenu.Name+'" class="g-menu-item '+ dataSubmenu.Tail +' '+ dataSubmenu.Disabled +' '+ dataSubmenu.Divider +' '+commoncl+'"><span class="g-menu-item-icon"><i class="'+ dataSubmenu.Icon +'"></i></span><span data-action="'+dataSubmenu.Action+'" id="' + Itemname + '_caption" class="g-menu-item-caption">' + dataSubmenu.Name + '</span><span class="g-menu-item-shortcut">'+ shortcutf +'</span></><span class="g-menu-item-tail '+ dataSubmenu.Tail +'"></span>');
					if(dataSubmenu.Tail == 'has-tail'){
						if(dataSubmenu.Name == 'Magnification'){
							var zoomcl = 'zoomview';
						} else {
							var zoomcl = '';
						} 
						menuBuilder.push('<ul class="g-menu g-menu-right '+zoomcl+'">');
						$.each(dataSubmenu.MenuTailItem, function (ii, dataTailmenu) {
							if(dataSubmenu.Name == 'Transform'){
								var datacallbk = 'onclick="'+ dataTailmenu.Type +'('+ dataTailmenu.Typevalue +')"';
							}else {
								var datacallbk = '';
							}
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
							if(dataSubmenu.Name == 'Export'){
								var Itemnamem = dataTailmenu.Id;								
							} else {
								var arrm = [];
								var Itemnamem = '';
								arrm = dataTailmenu.Name.split(' ');
								for (var i = 0; i<=arrm.length; i++) {
									var Itemnamem = arrm.join("_").toLowerCase().replace('...','');
								}
							}
							if(dataTailmenu.Name == 'Show Rulers'){
								if(dataTailmenu.Class == 'optionEnabled'){
									rulerStatus = 1;
									$('.kmds-g-ruler').css('display', 'block');
								} else {
									rulerStatus = 0;
									$('.kmds-g-ruler').css('display', 'none');
								}
							}
							if(dataTailmenu.Name == 'Show Guidelines'){
								var i;
								if(dataTailmenu.Class == 'optionEnabled'){
									guideStatus = 1;
								} else {
									guideStatus = 0;
									$('.kmds-g-ruler').css('display', 'none');
								}
								/* for (i in guides) {
									if (guides.hasOwnProperty(i)) {
										guides[i].style.display = (guideStatus === 1) ? 'block' : 'none';
									}
								} */
							}
							if(dataSubmenu.Name == 'Canvas' && dataTailmenu.Class == 'optionEnabled'){
								var ico = dataTailmenu.Icon;
							} else {
								var ico = '';
							}
							menuBuilder.push('<li data-view="'+dataTailmenu.dataView+'" data-value="'+dataTailmenu.dataValue+'" class="g-menu-item '+dataTailmenu.Class+' '+ dataSubmenu.Tail +' '+ dataTailmenu.Disabled +' '+ dataTailmenu.Divider +'"><span class="g-menu-item-icon"><i class="'+ ico +'"></i></span><span data-title="'+ datatitle +'" '+ fncallback +' id="' + Itemnamem + '" class="g-menu-item-caption caption apri" '+datacallbk+' data-value="'+dataTailmenu.dataValue+'" data-pro="'+dataTailmenu.dataPro+'">' + dataTailmenu.Name + '</span>'+ input_browse +'<span class="g-menu-item-shortcut">'+ shortcutt +'</span></><span class="g-menu-item-tail '+ dataTailmenu.Tail +'"></span>');
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
		
		$('.g-menu:not(.g-menu-root) > .g-menu-item').each(function(event){
			var nf = new getAction('new_design_caption', 'f.new')
			var fs = new getAction('save_caption', 'f.save')
			var fss = new getAction('save_as_caption', 'f.saveas')
			var ft = new getAction('new_design_from_template_caption', 'f.new.ft')
			//var fp = new getAction('open_template_caption', 'f.open')
			nf.menuAction();			
			fs.menuAction();						
			fss.menuAction();						
			ft.menuAction();			
			//fp.menuAction();			
						
			$(this).on('click', function(){ 
				this._match = $(this).children('.g-menu-item-caption').attr('id');
				this._actions = $(this).children('.g-menu-item-caption').data('action');
				
				switch (this._match) {
					case 'show_rulers':	
						toggleRulers();
						break;
						
					case 'show_guidelines':	
						toggleGuides();
						break;
				}
				
				switch (this._actions) {
					case 'f.new':            			
            			window.location.href = '/kmds/design';
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
						// openSaveTemplateModal();
						// design_id = getUrlDesignID();
						// if(design_id !== ''){
						// 	var gettitle = $('#header .tabs .tab.g-active .title').text();
						// 	gettitle = gettitle.split('*')[0];
						// 	$('#template-name').val(gettitle);
						// }
						openSaveAsTemplateModal();
						break;
						
					case 'edit.undo':
						undo(); //undo menu functionality
						break;
						
					case 'edit.redo':
						redo(); //redo menu functionality
						break;
						
					case 'f.open':
						//openingTemplate = true;
						//openSaveTemplateModal();
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
			toolBarBuilder.push('<div class="toolbar-button edit-options"><button data-cursor="'+toolBarmenu_file.Cursor+'" data-action="' + toolBarmenu_file.Action + '" id="' + toolBarmenu_file.Id + '" class="tool-act action-button" onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom" data-title="' + toolBarmenu_file.Name + '" ' + toolBarmenu_file.Disabled + '><i class="' + toolBarmenu_file.Icon + '"></i></button></div>')
		})
		toolBarBuilder.push('</div>');
		
		// Toolbar View
		toolBarBuilder.push('<div class="section t-section view-section">')
		$.each(toolbar_view, function (ii, toolBarmenu_view) {
			if(toolBarmenu_view.iclass == 'zoom-button'){
				var left_btn = '<button data-cursor="PSelect" id="zoom-out" data-view="zoomOut" class="left-attached attached-button tool-view" style="width: 15px;">-</button>';
				var right_btn = '<button data-cursor="PSelect" id="zoom-in" data-view="zoomIn" class="right-attached attached-button tool-view" style="width: 15px;">+</button>';
				var caption = '<span class="caption">100%</span>';
				var d = 'zoomb';
			} else {
				var left_btn = '';
				var right_btn = '';
				var caption = '';
				var d = '';
			}
			if(toolBarmenu_view.iclass == 'dropdown'){
				var dropdown = '<button class="dropdown-button"><i class="fa fa-caret-down"></i></button>';
			}	else {
				var dropdown = '';
			}
			toolBarBuilder.push('<div class="toolbar-button '+ toolBarmenu_view.iclass +'">'+ left_btn +'<button data-cursor="'+toolBarmenu_view.Cursor+'" id="'+ toolBarmenu_view.Id +'" onmouseover="tooltipfn(this)" class="action-button '+toolBarmenu_view.buttonClass+'" data-view="'+toolBarmenu_view.dataView+'" data-toggle="tooltip" data-placement="bottom" data-title="' + toolBarmenu_view.Name + '"><i class="' + toolBarmenu_view.Icon + '"></i>'+ caption +'</button>'+ dropdown+''+ right_btn)
			if(toolBarmenu_view.iclass == 'dropdown' || toolBarmenu_view.bclass == 'dropdown'){
				toolBarBuilder.push('<ul class="g-menu g-menu-bottom fixed '+d+'">');
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
					toolBarBuilder.push('<li data-cursor="'+DropdownItem.Cursor+'" class="g-menu-item '+DropdownItem.buttonClass+' '+ DropdownItem.Disabled +' '+ DropdownItem.Divider +'" data-view="'+DropdownItem.dataView+'" data-value="'+DropdownItem.dataValue+'"><span class="g-menu-item-icon"><i class="'+ DropdownItem.Icon +'"></i></span><span class="'+ Itemnamel +'" id="' + Itemnamel + '_tool" class="g-menu-item-caption">' + DropdownItem.Name + '</span><span class="g-menu-item-shortcut">'+ shortcutl +'</span>');
					
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
			if(toolBarmenu_tool.Name == 'Select'){
				var cl = 'g-active';
				$( ".canvas-container" ).addClass( "g-cursor-select" );
			} else {
				var cl = '';
			}
			if(toolBarmenu_tool.Name == 'Image'){
				var fncallback1 = 'onclick="browseImg()"';
			} else if(toolBarmenu_tool.Name == 'Text'){
				var fncallback1 = 'onclick="addtextallow(this)"';
			} else {
				var fncallback1 = '';								
			}
			toolBarBuilder.push('<div class="toolbar-button toolbar-'+ toolBarmenu_tool.Name +' '+ toolBarmenu_tool.iclass +'"><button data-cursor="'+toolBarmenu_tool.Cursor+'" class="action-button drawingtool '+cl+'"  '+ fncallback1 +' onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom" data-title="' + toolBarmenu_tool.Name + '"><i class="' + toolBarmenu_tool.Icon + '"></i></button>'+ dropdown)
			if(toolBarmenu_tool.iclass == 'dropdown'){
				toolBarBuilder.push('<ul class="g-menu g-menu-bottom fixed">');
				$.each(toolBarmenu_tool.MenuDropdownItem, function (x, DropdownItemtool) {
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
					toolBarBuilder.push('<li data-cursor="'+DropdownItemtool.Cursor+'" class="g-menu-item '+ DropdownItemtool.Disabled +' '+ DropdownItemtool.Divider +'"><span class="g-menu-item-icon"><i class="'+ DropdownItemtool.Icon +'"></i></span><span id="' + Itemnamel + '_tool" class="g-menu-item-caption">' + DropdownItemtool.Name + '</span><span class="g-menu-item-shortcut">'+ shortcut +'</span>');
					
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
			toolBarBuilder.push('<div class="toolbar-button"><button data-cursor="'+toolBarmenu_transform.Cursor+'" id="'+toolBarmenu_transform.Id+'" onmouseover="tooltipfn(this)" onclick="'+ toolBarmenu_transform.Type +'('+ toolBarmenu_transform.Typevalue +')" class="action-button" data-toggle="tooltip" data-placement="bottom" data-title="' + toolBarmenu_transform.Name + '" ' + toolBarmenu_transform.Disabled + '><i class="' + toolBarmenu_transform.Icon + '"></i></button></div>')
		})
		toolBarBuilder.push('</div>');
		
		// Toolbar Group
		toolBarBuilder.push('<div class="section t-section transform-section">')
		$.each(toolbar_group, function (v, toolBarmenu_group) {
			toolBarBuilder.push('<div class="toolbar-button"><button data-cursor="'+toolBarmenu_group.Cursor+'" id="'+toolBarmenu_group.Id+'" onmouseover="tooltipfn(this)" class="action-button" data-toggle="tooltip" data-placement="bottom" data-title="' + toolBarmenu_group.Name + '" ' + toolBarmenu_group.Disabled + '><i class="' + toolBarmenu_group.Icon + '"></i></button></div>')
		})
		toolBarBuilder.push('</div>');
		
		// Toolbar Arrange
		toolBarBuilder.push('<div class="section t-section transform-section">')
		$.each(toolbar_arrange, function (vi, toolBarmenu_arrange) {
			toolBarBuilder.push('<div class="toolbar-button" data-action="' + toolBarmenu_arrange.Action + '"><button data-cursor="'+toolBarmenu_arrange.Cursor+'" id="'+toolBarmenu_arrange.Id+'" onmouseover="tooltipfn(this)" class="action-button apri" data-toggle="tooltip" data-placement="bottom" data-title="' + toolBarmenu_arrange.Name + '" ' + toolBarmenu_arrange.Disabled + ' data-pro="' + toolBarmenu_arrange.datapro + '" data-value="' + toolBarmenu_arrange.datavalue + '"><i class="' + toolBarmenu_arrange.Icon + '"></i></button></div>')
		})
		toolBarBuilder.push('</div>');
		
		// Toolbar Action
		toolBarBuilder.push('<div class="section t-section action-section">')
		$.each(toolbar_action, function (vii, toolBarmenu_action) {
			if(toolBarmenu_action.Name == 'JSON'){
				if(adminRole !== '' && adminRole == 'administrator'){
					var btns = '<div class="toolbar-button"><button data-cursor="'+toolBarmenu_action.Cursor+'" id="'+toolBarmenu_action.Id+'"  class="font-fjalla action-button">'+toolBarmenu_action.Name+'</button></div>';
				} else {
					var btns = '';
				}
			} else {
				var btns = '<div class="toolbar-button"><button data-cursor="'+toolBarmenu_action.Cursor+'" id="'+toolBarmenu_action.Id+'" onmouseover="tooltipfn(this)" class="action-button" data-toggle="tooltip" data-placement="bottom" data-title="' + toolBarmenu_action.Name + '" ' + toolBarmenu_action.Disabled + '><i class="' + toolBarmenu_action.Icon + '"></i></button></div>';
			}
			toolBarBuilder.push(btns);
		})
		toolBarBuilder.push('</div>');

		$('#toolbar').append(toolBarBuilder.join(''));
		
		$("#fit-all, #tool-group, #tool-ungroup, #tool-bring-forward, #tool-send-backward,  #flip-h, #flip-v, #rotate-90-left, #rotate-90-right").mouseleave(function() {
			if($(this).hasClass('g-active')){
				$(this).removeClass('g-active');
			}
		});

		$('.toolbar-button.dropdown .dropdown-button').each(function(){
			$(this).on('click', function(){
				$("ul.g-menu.g-menu-bottom.fixed").each(function(){
					$(this).hide();
				})
				$(this).next('ul.g-menu.g-menu-bottom.fixed').css('display', 'inline-block')
			})
			$(document).on("click", function(event){
        var $trigger = $(".toolbar-button.dropdown");
        if($trigger !== event.target && !$trigger.has(event.target).length){
          $("ul.g-menu.g-menu-bottom.fixed").hide();
        }            
			});
		});
		
		//toolbar button click		
		$('#toolbar .toolbar-button ul.g-menu-bottom li.g-menu-item').each(function(){
			$(this).on('click touch', function(e){
				$("ul.g-menu.g-menu-bottom.fixed").hide()
				if($('ul.g-menu.g-menu-bottom.fixed.zoomb').hasClass('d-inline')){
					$('#zoomb').removeClass('g-active');
					$('ul.g-menu.g-menu-bottom.fixed.zoomb').removeClass('d-inline');
				}
				var cursor = $(this).attr('data-cursor');
				if(handSelected){
					deactivateHandtool();
				}
				switch (cursor) {
					case 'PSelect':
						$( ".canvas-container" ).attr('class', 'canvas-container');
						$( ".canvas-container" ).addClass( "g-cursor-select" );
					break;
					
					case 'PDraw':
						$( ".canvas-container" ).attr('class', 'canvas-container');
						$( ".canvas-container" ).addClass( "g-cursor-draw" );
					break;
					
					case 'PZoom':
						zoomInTool = true;
						$( ".canvas-container" ).attr('class', 'canvas-container');
						$( ".canvas-container" ).addClass( "g-cursor-zoom" );
					break;
					
					case 'PKnife':
						$( ".canvas-container" ).attr('class', 'canvas-container');
						$( ".canvas-container" ).addClass( "g-cursor-knife" );
					break;
					
					/* case 'PPen':
						$( ".canvas-container" ).attr('class', 'canvas-container');
						$( ".canvas-container" ).addClass( "g-cursor-pen" );
					break; */
					
					case 'PHandpan':
						$( ".canvas-container" ).attr('class', 'canvas-container');
					  $( ".canvas-container" ).addClass( "k-cursor-hand-open" );
					break;
					
					default:
						$( ".canvas-container" ).attr('class', 'canvas-container');
						$( ".canvas-container" ).addClass( "g-cursor-select" );
					break;
				}
			});
		});
		
		$('#toolbar .toolbar-button .action-button').each(function(){
			var fss = new getAction('save', 'f.save');
			var je = new getAction('template-json-file', 'json.export');
			var z = new getAction('zoomb', 'zoomb');
			fss.menuAction();						
			je.menuAction();						
			z.menuAction();						
			$(this).on('click touch', function(e){
				$('#toolbar .toolbar-button button.action-button.g-active').removeClass('g-active');
				$(this).addClass('g-active');
				
				if(!savedDesignFlag){
					DetectTemplateChanges();
				}
				
				if($(this).attr('id') !== 'zoomb'){
					if($('ul.g-menu.g-menu-bottom.fixed.zoomb').hasClass('d-inline')){
						$('#zoomb').removeClass('g-active');
						$('ul.g-menu.g-menu-bottom.fixed.zoomb').removeClass('d-inline');
					}
				}
				
				if($(this).attr('id') !== 'handtool'){
					deactivateHandtool();
					if($(this).hasClass('drawingtool')){
						lastClickedTool = $(this);
					}
				}
				if(handSelected){
					handSelected = false;
				}
				
				if(zoomInTool){
					zoomInTool = false;
				}
				
				this._actions = $(this).data('action');
				this._cursor = $(this).attr('data-cursor');
				
				switch (this._cursor) {
					case 'PSelect':
						$( ".canvas-container" ).attr('class', 'canvas-container');
						$( ".canvas-container" ).addClass( "g-cursor-select" );
					break;
					
					case 'PDraw':
						$( ".canvas-container" ).attr('class', 'canvas-container');
						$( ".canvas-container" ).addClass( "g-cursor-draw" );
					break;
					
					case 'PZoom':
						$( ".canvas-container" ).attr('class', 'canvas-container');
						$( ".canvas-container" ).addClass( "g-cursor-zoom" );
					break;
					
					case 'PKnife':
						$( ".canvas-container" ).attr('class', 'canvas-container');
						$( ".canvas-container" ).addClass( "g-cursor-knife" );
					break;
					
					/* case 'PPen':
						$( ".canvas-container" ).attr('class', 'canvas-container');
						$( ".canvas-container" ).addClass( "g-cursor-pen" );
					break; */
					
					case 'PHandpan':
						$( ".canvas-container" ).attr('class', 'canvas-container');
					  $( ".canvas-container" ).addClass( "k-cursor-hand-open" );
					break;
					
					default:
						$( ".canvas-container" ).attr('class', 'canvas-container');
						$( ".canvas-container" ).addClass( "g-cursor-select" );
					break;
				}
				
				switch (this._actions) {
					case 'zoomb':
            $('ul.g-menu.g-menu-bottom.fixed.zoomb').toggleClass('d-inline');
          break;
					case 'f.save':
						var t = checkDesign();
						if (t === false) {
							openSaveTemplateModal();
						} else {
							kmdsToolSettingSave();
						}
						break;
					case 'edit.undo':
						undo();
						
						break;
					case 'edit.redo':
						redo();
						
						break;
					case 'json.export':
						var design_id = getUrlDesignID();
						if(design_id == ''){
							FnNewFolderModal();
							FnDefaultModal('Please save the template first to export Json data.');
						} else {
							var jsonurl = '/kmds/json-data/'+design_id;
							window.open(jsonurl, '_blank');
						}
					break;
				}
			})		
		});

		//image upload
    $('#imgupload').on('change', function(e){
      var activePage = $('.page-row.g-active').attr('id');
      if($('#pages #'+activePage+' .page-lock-icon').hasClass('fa-lock')){
        $('button.action-button.g-active').removeClass('g-active');
        return;
      }
			activeLayerID = $("#layers .template-group .layer-row.g-active").attr("id");
      //$('.layer-row.g-active').removeClass('g-active');
      $('.toolbar.main-toolbar').addClass('d-flex');
      $('.toolbarPanel_1').removeClass('d-none').addClass('d-block');
      $('.properties-panel.main-toolbar').addClass('d-block');
      $('.toolbar.appearance-toolbar').addClass('d-flex');
      $('.properties-panel .appearance-property-panel.text-properties-panel').removeClass('d-block').addClass('d-none');
      $('.properties-panel .appearance-property-panel.image-properties-panel').addClass('d-block');
      $(".appearance-toolbar button").addClass("d-none");
      //console.log('imge');
      //console.log(e);

      const len = e.target.files.length;
      var uploadedFiles = e.target.files;
      if(len > 0){
        $.each( uploadedFiles, function(i, file) {  
          ImageProcessFn(file, activePage);
        });
      }
    });
	}

	/**
	 * return Left Sidebar
	 */
	function LeftSidebars (){	
    var LsidebarBarBuilder = [];

		var getactivetabid = $('#header .tabs .tab.g-active').attr('data-id');
		var $selector = LsidebarBarBuilder.push('<div class="left-panel"><div class="sidebar-selector d-flex"><div class="sidebar-option text-uppercase d-flex justify-content-center align-items-center  sidebar-layers active c-pointer">Layers</div><div class="sidebar-option text-uppercase d-flex justify-content-center align-items-center sidebar-library c-pointer">Resources</div><div class="sidebar-option text-uppercase d-flex justify-content-center align-items-center sidebar-symbols media-kit-image-list c-pointer">Assets</div></div>');
		
		var $layers_pagesContainer = LsidebarBarBuilder.push('<div class="sidebar-container sidebar-layers align-items-stretch flex-column multiple"><div id="accordionDiv" class="toolbar accordion justify-content-between align-items-center"><label>Pages</label><button onclick="toggleLeftLayers(this)" class="g-accordion page" data-toggle="collapse" data-target="#pages-container" aria-expanded="true" aria-controls="pages-container"></button><div class="g-accordion-ghost"></div></div><div id="pages-container" class="collapse show pages-container" aria-labelledby="accordionDiv"><div id="pages" class="g-page-panel pages"></div></div><div id="page-layer-divider"><hr><div></div></div>');
		
		// disabled create page, multiple page toggle and delete page buttons for now, when required add below mentioned code after "g-accordion-ghost" div in above $layers_pagesContainer html.
		//<div class="g-accordion-ghost"></div>
		/*<label class="g-switch" data-toggle="tooltip" data-placement="bottom "data-title="Toggle Single / Multipage Mode" style="margin-right: 5px;"><input type="checkbox" id="multipage-switch"><div></div></label><button id="delete-page" data-toggle="tooltip" data-placement="bottom" data-title="Delete Active Page"><i class="fas fa-trash-alt"></i></button><button id="create-new" data-toggle="tooltip" data-placement="bottom" data-title="Create New Page"><i class="far fa-plus-square"></i></button>*/
		
		var $layers_layersContainer = LsidebarBarBuilder.push('<div class="toolbar justify-content-between align-items-center layer-toolbar"><label class="flex-grow">Layers</label><button id="delete-layer" data-toggle="tooltip" data-placement="bottom" data-title="Delete Layer or Item"><span class="fas fa-trash-alt"></span></button><button id="create-new-layer" data-toggle="tooltip" data-placement="bottom" data-title="New Layer"><span class="far fa-plus-square"></span></button></div><div class="layers-container"><div id="layers" class="layers g-layer-panel"><div id="'+ getactivetabid +'" class="template-group group-active"></div></div></div><hr></div>');
		
		
		var $libraryContainer = LsidebarBarBuilder.push('<div class="sidebar-container sidebar-library resources-library multiple" style="display:none;"><div class="sidebar-option image-container" onclick="addImageContainer()"><div class="resources-icon"><img src="/modules/custom/media_design_system/css/assets/img/DynamicImage-FF0000.png" width="50" /></div><div class="resources-label">Image Container</div></div><div class="sidebar-option images"><div class="resources-icon"><img src="/modules/custom/media_design_system/css/assets/img/ImagesFolder-023364.png" width="50" /></div><div class="resources-label">images</div></div><div class="sidebar-option shapes"><div class="resources-icon"><img src="/modules/custom/media_design_system/css/assets/img/ShapesFolder-023364.png" width="50" /></div><div class="resources-label">Shapes</div></div><div class="sidebar-option backgrounds"><div class="resources-icon"><img src="/modules/custom/media_design_system/css/assets/img/BackgroundsFolder-023364.png" width="50" /></div><div class="resources-label">Backgrounds</div></div><div class="sidebar-option upload-resources" onclick="callResourcesModal()"><div class="resources-icon"><img src="/modules/custom/media_design_system/css/assets/img/Upload-92px-023364.png" width="50" /></div><div class="resources-label">Upload Resources</div></div></div>');
		
		var $symbolsContainer = LsidebarBarBuilder.push('<div class="sidebar-container sidebar-symbols media-kit-images multiple empty" style="display:none;"><div class="progress-overlay"><div class="spinner-border"></div></div></div></div>');

		var stikey_footer = LsidebarBarBuilder.push('<div class="kmds-powered-footer"></div>');
						
		//LsidebarBarBuilder.push($selector);
		
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
		
		//page row resizer
		//$('#page-layer-divider')
		// Delete Page row
    $('button#delete-page').on('click', function(e){	
			if($('.page-row').length > 1) {
				var id = $('.page-row.g-active').attr('id');
				var all_layers = canvas.getItemsByType('page', false);
				all_layers.forEach(function(l) {
					if(l.page == id) {
						canvas.remove(l); // remove layers objects an page label
						$('#layers #'+l.id).remove(); //remove layers tabs
					}
				});
				canvas.remove(canvas.getItemById(id)); // remove page object
				$('#'+id).remove(); // remove active page tab
				canvas.renderAll();
				$('.page-row:last-child').addClass('g-active'); //make active last page tab
				var lastpage = $('.page-row:last-child').attr('id');
				var elem = document.getElementById(lastpage);
				pageClick(elem);
			} else {
				$('button#delete-page').css('cursor', 'default')
			}
		});
		// Add new Page row
		var counter = 1;			
    /*$('button#create-new').on('click', function(e){
			var pid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			add_page(pid, pageWidth, pageHeight, '#ffffff');
      console.log("PID 3 = "+pid);
			$('.layer-row.g-active').removeClass('g-active');
			$('.layer-row.parent-layer.g-has-selection').removeClass('g-has-selection');
			switch_page(pid);
		});*/
		
		//Page tools action
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
			var gArr = [];
			e.preventDefault();
			deleteSelectedObject();
		});
		// Add new Layer row
		var count_layer = 0;			
    $('button#create-new-layer').on('click', function(e){
			//count_layer++;
			$('.layer-row').each(function(){
				$(this).removeClass('g-active');
        if($(this).hasClass('g-has-selection')){
          $(this).removeClass('g-has-selection');
        }
			});
			if($('.layer-row.parent-layer').length == 0) {
				count_layer = 0;
			}else {
				count_layer++;
			}
			var groupId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			var title = 'Layer '+ count_layer;
			$('.layer-row .layer-title').each(function(){
				if($(this).text() == title){
					var title = 'Layer '+ count_layer++;					
				}
			});
			var page_id = $('.page-row.g-active').attr('id');
			parentLayerStructure(groupId, title, page_id, '');  // ading parent layer folder group
			layerReordering();
		});
    //Insert User MediaKit Options
    $(".media-kit-image-list").click(function(){
      if($('body div.left-panel .media-kit-images').hasClass("empty")){
        $('body div.left-panel .media-kit-images').removeClass("empty");
        var uid = drupalSettings.uid;	
        var media_kit_url = media_base_url+'/user/media_kits/'+ uid +'?_format=json';
        var $elem = $('body div.left-panel .media-kit-images');
        $.getJSON( media_kit_url, function( result ) {
          $.each(result, function(key, val) {
            $elem.append(
              $("<div/>", {"class": "media-kit-image empty", "id": "mediakit-"+val.nid, "data-value": val.nid}).append(
                $("<span/>", {"class": "media-kit-image-title", text: val.title}),
                $("<span/>", {"class": "fas fa-caret-right image-list-caret"}),
              )
            );
            console.log('d-tollo');
            $(".media-kit-images .progress-overlay").remove();
          });
        });
      }
      else {
        $('.media-kit-images .media-kit-image').removeClass("active");
        $('.media-kit-images .image-list-caret').removeClass("fa-caret-down").addClass("fa-caret-right");
        $('.media-kit-images .mediakit-images').removeClass("d-block").addClass("d-none");
      }
    });
    //Load media kit image list
    $(document).on('click','.media-kit-image',function (e) {
      if($(e.target).hasClass('media-kit-image-title') || $(e.target).hasClass('image-list-caret')){
        $(".media-kit-images .progress-overlay").remove();
        var $this = $(this);
        if($this.hasClass("active")){
          $this.removeClass("active");
          $this.find('.image-list-caret').removeClass("fa-caret-down").addClass("fa-caret-right");
          $this.find('.mediakit-images').removeClass("d-block").addClass("d-none");
        }
        else {
          $(".media-kit-image").removeClass("active");
          $this.addClass("active");
          $(".media-kit-image").find('.image-list-caret').removeClass("fa-caret-down").addClass("fa-caret-right");
          $this.find('.image-list-caret').removeClass("fa-caret-right").addClass("fa-caret-down");
          $('body div.left-panel .mediakit-images').removeClass("d-block").addClass("d-none");
          if($this.hasClass("empty")){
            var nid = $this.attr("data-value");
            $this.removeClass("empty");
            $this.append(
              $("<div/>", {"class": "mediakit-images d-block clicked", "id": "mk-photo-gallery-"+nid}).append(
                $("<div/>", {"class": "progress-overlay"}).append(
                  $("<div/>", {"class": "spinner-border"})
                )
              )
            );
            var $elem = $this.find('.mediakit-images');
            var kit_class = $(".media-kit-image.active").find(".media-kit-image-title").text();
            kit_class = kit_class.toLowerCase().replace(/ /g,"-");
            var media_kit_url = media_base_url+'/node/'+ nid +'?_format=json';
            $.getJSON( media_kit_url, function( result ) {
              $.each(result.field_vault_photo, function(key, val) {
                var target_id = val.target_id;
                var media_image_url = media_base_url+'/media/'+target_id+'/edit?_format=json';
                $.getJSON( media_image_url, function( image_url ) {
                  var image_name = image_url.name[0].value;
                  image_name = image_name.replace("/var/tmp/", "");
                  //var index = image_name.lastIndexOf("/") + 1;
                  //var filename = image_name.substr(index);
                  //var ext = image_name.substring(image_name.lastIndexOf('.'));
                  //image_name = image_name.split(ext)[0];
                  $elem.append(
                    $("<div/>", {"class": "media-data d-flex "+kit_class, "image-title": image_name, "data-src": image_url.field_media_image[0].original_url, "onmouseover": "tooltipfn(this)", "data-toggle": "tooltip", "data-title": image_name, "data-fid": target_id}).append(
                      $("<div>", {"class": "kit-image"}).append(
                        $("<img/>", {"src": image_url.field_media_image[0].image_import_url}),
                        $("<div/>", {"class": "overlay"}).append(
                          $("<button/>", {"class": "preview-icon", "data-value-nid": nid, "image-url": image_url.field_media_image[0].original_url})
                        )
                      ),
                      $("<div/>", {"class": "kit-name", text: image_name})
                    )
                  );
                  sortMediaKitImagesList(kit_class);
                });
              });
            }).done(function() { 
              $(".media-kit-images .progress-overlay").remove();
            });
          }
          else {
            $this.find('.mediakit-images').removeClass("d-none");
            $this.find('.mediakit-images').addClass("d-block");
          }
        }
      }
    });
    //open media kit image gallery
    $(document).on('click','.media-kit-image .preview-icon',function (e) {
      var nid = $(this).attr("data-value-nid");
      var src = $(this).attr("image-url");
      var wInnerHeight = window.innerHeight;
      var cheight = (window.innerHeight * 80/100);
      var cWidth = (window.innerWidth * 80/100);
      $('<div/>', {"class": "g-dialog-container kmds-static-image-modal d-block justify-content-center align-items-center visible"})
        .append($('<div/>', {"class": "g-dialog"})
          .append($('<div/>', {"class": "g-dialog-content"})
            .append($('<div/>', {"class": "d-grid"})
              .append($('<span/>', {"class": "d-block"})
                .append($("<div/>", {"class": "progress-overlay kmds-static-image-modal-spinner"})
                  .append($("<div/>", {"class": "spinner-border"})))
                .append($('<img class="temp-static-image" src="'+ src +'" />'))
              )
            )
          )
          .append($('<div/>', {"class": "g-dialog-footer"})
            .append($('<a/>', {'class': 'close-modal', 'href': 'javascript:void(0);', text: 'X'}))
          )
        ).appendTo('#mainframe');
      let img = new Image();
      img.onload = function() {
        if(img.width >= img.height){
          size1 = img.width;
          size2 = "auto";
          if(img.width > cWidth){
            size1 = cWidth;
            if(img.height > wInnerHeight){
              size1 = wInnerHeight;
            }
          }
        }
        else if(img.width < img.height){
          size1 = "auto";
          size2 = img.height;
          if(img.height > cheight){
            size2 = cheight;
          }
        }
        jQuery("#mainframe .temp-static-image").css("width", size1);
        jQuery("#mainframe .temp-static-image").css("height", size2);
        jQuery("#mainframe .kmds-static-image-modal .kmds-static-image-modal-spinner").remove();
      }
      img.src = src;
    });
    //Close Image Modal Window
    $(document).on('click','.close-modal',function (e) {
      $(".g-dialog-container.kmds-static-image-modal").remove();
    });
    //Insert image file at canvas after click on image name
    $(document).on('click','.media-data .kit-name',function (e) {
      $('.media-data').removeClass('active-gray');
      $(this).parent('.media-data').addClass('active-gray');
      $(this).append('<div class="progress-overlay kmds-static-image-load-spinner"><div class="spinner-border"></div></div>');
      if(jQuery(".km-image-crop-modal").length != 0){
        var wInnerWidth = parseInt(window.innerWidth/2);
        var wInnerHeight = parseInt(window.innerHeight/2);
        jQuery('.km-image-editor .cropit-preview').append('<div class="spinner-border"></div>');
        var obj = canvas.getActiveObject();
        if(obj){
          var imgWidth = obj.width;
          var imgHeight = obj.height;
          var objWidth = obj.width*obj.scaleX;
          var objHeight = obj.height*obj.scaleY;
          if(objWidth > wInnerWidth){
            objWidth = wInnerWidth;
          }
          if(objHeight > wInnerHeight){
            objHeight = wInnerHeight;
          }
          var imgsrc = jQuery(this).parent(".media-data").attr("data-src");
          $imageCropper = jQuery('.km-image-editor');
          ReplaceResizeImage($imageCropper, imgsrc, objHeight, objWidth, imgWidth, imgHeight, 0, function(result) {
            //console.log(result);
          });
        }
      }
      else {
        var container = canvas.getActiveObject();
        if(container && container.type == 'ImageContainer'){
          var imgsrc = $(this).parent(".media-data").attr("data-src");
          kmdsImageCrop(imgsrc);
        }
        else {
          var activePage = $('.page-row.g-active').attr('id');
          activeLayerID = $("#layers .template-group .layer-row.g-active").attr("id");
          if($('.layer-row.parent-layer').hasClass('g-active')){
            var activeLayer = $('.layer-row.parent-layer.g-active').attr('id');
            var activeLayerTitle = $('.layer-row.parent-layer.g-active .layer-title').text();
            var parentlayerOrder = $('.layer-row.parent-layer.g-active').attr('order');
          } else if($('.layer-row.parent-layer').hasClass('g-has-selection')){
            var activeLayer = $('.layer-row.parent-layer.g-has-selection').attr('id');
            var activeLayerTitle = $('.layer-row.parent-layer.g-has-selection .layer-title').text();
            var parentlayerOrder = $('.layer-row.parent-layer.g-has-selection').attr('order');
          } else {
            var activeLayer = '';
            var activeLayerTitle = '';
            var parentlayerOrder = '';
          }
          var imgsrc = $(this).parent(".media-data").attr("data-src");
          var imgfid = $(this).parent(".media-data").attr("data-fid");
          var pageObj = canvas.getItemById(activePage);
          var imgwidth = pageObj.width;
          var imgheight = pageObj.height;
          var imgtop = pageObj.top;
          var imgleft = pageObj.left;
          var actualLeft = pageObj.left;
          var actualTop = pageObj.top;
          var pageID = pageObj.id;
          var layerIndexing = 1;
          var scaleX = 1;
          var scaleY = 1;
          var angle = 0;
          var opacity = 1;
          var containerName = '';
          var containerID = '';
          var containerWidth = '';
          var containerHeight = '';
          var originX = 'center';
          var originY = 'center';
          var imageContainer = false;
          var layer_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          const img = new Image();
          img.src = imgsrc;
          img.onload = function(){
            if(!imageContainer){
              if(this.width > pageObj.width){
                imgwidth = pageObj.width;
              } else {
                imgwidth = this.width;
              }
              if(this.height > pageObj.height){
                imgheight = pageObj.height;
              } else {
                imgheight = this.height;
              }
            }
            var index = imgsrc.lastIndexOf("/") + 1;
            var filename = imgsrc.substr(index);
            var ext = filename.substring(filename.lastIndexOf('.'));
            var basename = filename.split(ext)[0];
            imageSRCToBase64(imgsrc, function(imgsrcBase64) {
              fabric.Image.fromURL(imgsrcBase64, function(img) {
                img.set({
                  left: imgleft,
                  top: imgtop,
                  actualLeft: actualLeft,
                  actualTop: actualTop,
                  name: basename,
                  originX: originX,
                  originY: originY,
                  id: layer_id,
                  page: pageID,
                  layerGroup: activeLayer,
                  layerGroupTitle: activeLayerTitle,
                  parentlayerOrder: parentlayerOrder,
                  OldscaleX: "",
                  OldscaleY: "",
                  OldWidth: "",
                  OldHeight: "",
                  imgfid: imgfid,
                  layerIndexing: layerIndexing,
                  angle: angle,
                  opacity: opacity,
                  imageArConstraint: 'scale-crop',
                });
                //console.log("imgwidth = "+imgwidth+"** imgheight = "+imgheight);
                img.scaleToHeight(imgheight);
                img.scaleToWidth(imgwidth);
                canvas.add(img);
                add_layer(layer_id, basename, 'image', pageID, activeLayer, '');
                //canvas.add(img).renderAll().setActiveObject(img);
                img.setCoords();
                canvas.renderAll().setActiveObject(img);
                layerReordering();
                $('.kmds-static-image-load-spinner').remove();
                $(".media-data").removeClass("active-gray");
              });
            });
          };
        }
      }
    });
		
		/**
		 * Multipage Toggle - hide this functionality
		 
		const multiPage = document.getElementById('multipage-switch')
		multiPage.addEventListener('change', (event) => {
			event.preventDefault();
			if (event.target.checked) {
				TogglePages('active');
			} else {
				TogglePages('inactive');
			}
		});*/
		
/*****Layer Panel functionality Start*****/
    //Layer draggable
		$('#layers .layer-row').droppable({
      activeClass: "g-drop-active",
      hoverClass: "g-drop-hover",
      accept:".layer-row",
    });
    $( ".template-group" ).sortable({
      revert: true,
      update: function(event, ui) {
				//console.log('updated');
        $_this = $(this);
        var itemID = $(ui.item).attr("id");
				var obj = canvas.getItemById(itemID);
				$('.layer-row.g-active').removeClass('g-active');
				$(ui.item).addClass('g-active');
        if(ui.item.hasClass('parent-layer')){
          $('.child-layer').each(function() {
            if($(this).attr("data-group") == itemID){
							var childID = $(this).attr("id");
							var childObj = canvas.getItemById(childID);
              if(jQuery("#"+childID).hasClass('d-none')){
                jQuery("#"+childID).removeClass('d-none');
                var text = jQuery("#"+childID);
                jQuery("#"+itemID).after(text);
                jQuery("#"+childID).addClass('d-none');
              }
              else {
                var text = jQuery("#"+childID);
                jQuery("#"+itemID).after(text);
              }
            }
						//layer rearrange
						layerReordering();
          });
        } else {
					var self_id = ui.item.attr("data-group");
          var next_id = $("#"+itemID).next().attr("data-group");
          if(!next_id){
            next_id = $("#"+itemID).prev().attr("data-group");
            if(!next_id){
              next_id = $("#"+itemID).prev('.parent-layer').attr("id");
            }
          }
					
					if(!next_id && self_id){
						next_id = '';
						$("#"+itemID).attr("data-group", '');
						$("#"+itemID).removeClass("pl-2rem");
						$("#"+itemID).removeClass("child-layer");
					} else if(next_id && !self_id){
						//console.log('!self_id = '+self_id+' | next_id = '+next_id);
						$("#"+itemID).attr("data-group", next_id);
						$("#"+itemID).addClass("pl-2rem");
						$("#"+itemID).addClass("child-layer");
						var obj = canvas.getActiveObject();
						if(obj){
							canvas.moveTo(obj, parseInt($(ui.item).attr('order')));		
							canvas.renderAll();
						}
					}
					
					if(self_id != next_id){
						if(next_id){
							$("#"+itemID).attr("data-group", next_id);
							$("#"+itemID).addClass("pl-2rem");
							$("#"+itemID).addClass("child-layer");
							if(obj){
								canvas.moveTo(obj, $("#"+itemID).attr("order"));
								canvas.renderAll();
							}
							var previousLayerId = $('#'+next_id).prev('.layer-row').attr('id');
							if(previousLayerId){
								
								var prevObj = canvas.getItemById(previousLayerId);
								if(prevObj){
									canvas.moveTo(prevObj, $("#"+previousLayerId).attr("order"));
									canvas.renderAll();
								}
							}
						} else if(self_id){
							if(!$('#'+self_id).hasClass('child-layer')){ 
								var previousLayerId = $('#'+itemID).prev('.layer-row').attr('id');
								var nextLayerId = $('#'+itemID).next('.layer-row').attr('id');
								if(previousLayerId){
									if($('#'+nextLayerId).hasClass('parent-layer')){return;}
									var prevObj = canvas.getItemById(previousLayerId);
									if(prevObj){
										canvas.moveTo(obj, $("#"+itemID).attr("order"));
										canvas.moveTo(prevObj, $("#"+previousLayerId).attr("order"));
										canvas.renderAll();
									}
								}
								if(nextLayerId){
									if($('#'+nextLayerId).hasClass('parent-layer')){return;}
									var nextObj = canvas.getItemById(nextLayerId);
									if(nextObj){
										if(obj){
											canvas.moveTo(obj, $("#"+itemID).attr("order"));
											canvas.renderAll();
										}
									}
								}
							}
							$("#"+itemID).attr("data-group", '');
							$("#"+itemID).removeClass("pl-2rem");
							$("#"+itemID).removeClass("child-layer");
							if(obj){
								canvas.moveTo(obj, $("#"+itemID).attr("order"));
								canvas.renderAll();
							}
							var previousLayerId = $('.layer-row.g-active').prev('.layer-row').attr('id');
							if(previousLayerId){
								var prevObj = canvas.getItemById(previousLayerId);
								if(prevObj){
									canvas.moveTo(prevObj, $("#"+previousLayerId).attr("order"));
									canvas.renderAll();
								}
							}
						} else if(!self_id){
							if(obj){
								canvas.moveTo(obj, $("#"+itemID).attr("order"));
								canvas.renderAll();
							}
						}
						
            if(next_id && $('#'+next_id).children('.fa-caret-down').length == 0){
              $('#'+next_id).children('.fa-caret-right').remove();
							if($('#'+next_id).hasClass('tool-group')){
								var gcl = 'tool-group-ico';
							} else {
								var gcl = '';
								$('#'+next_id+' .layer-icon').removeClass('fas').addClass('far');							
							}
              $('#'+next_id).prepend('<span class="'+gcl+' fa fa-caret-down pr-2" onclick="FnToggleLayers(this)"></span>');
            }
					}
				}
				//layers rearrangement
				layerReordering();
				
      },
      start: function(event, ui){
        ui.item.css("cursor","none");
				//console.log('start');
      },
      over: function(event, ui){
        //console.log('over');
      },
      out: function(event, ui){
        if($('.g-drop-hover').length == 0){
          dragOutID = $(ui.item).attr("id");
          //console.log("Out Target Out ID"+dragOutID);
        }
      },
      stop: function(event, ui) {
        ui.item.css("cursor","pointer");
				$(ui.item).addClass('g-active');
				var x = canvas.getActiveObject($(ui.item).attr("id"));
				canvas.setActiveObject(x).renderAll();
				//layerReordering();
      }
    }).disableSelection();

    //Layer copy past functionality
    //Predefine variable and key ASCI value
    var ctrlDown = false,
        ctrlKey = 17,
        cmdKey = 91,
        vKey = 86,
        cKey = 67;
    //Check CTRL button has pressed
    $(document).keydown(function(e) {
      if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
    }).keyup(function(e) {
      if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
    });
    //if no copy has applied
    /*$(".no-copy-paste").keydown(function(e) {
      if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)) return false;
    });*/
    
    // Now Ctrl + C/V action
    $(document).keydown(function(e) {
      if (ctrlDown && (e.keyCode == cKey)){
        canvas.getActiveObject().clone(function(cloned) {
          _clipboard = cloned;
        });
      }
      else if (ctrlDown && (e.keyCode == vKey)){
        var pageID = $(".page-row.g-active").attr("id");
        activeLayerID = $("#layers .template-group .layer-row.g-active").attr("id");
        var activeLayer = '';
        var activeLayerTitle = '';
        var parentlayerOrder = '';
        if($('.layer-row.parent-layer').length){
          if($('.layer-row.parent-layer').hasClass('g-active')){
            var activeLayer = $('.layer-row.parent-layer.g-active').attr('id');
            var activeLayerTitle = $('.layer-row.parent-layer.g-active .layer-title').text();
            var parentlayerOrder = $('.layer-row.parent-layer.g-active').attr('order');
          } else if($('.layer-row.parent-layer').hasClass('g-has-selection')){
            var activeLayer = $('.layer-row.parent-layer.g-has-selection').attr('id');
            var activeLayerTitle = $('.layer-row.parent-layer.g-has-selection .layer-title').text();
            var parentlayerOrder = $('.layer-row.parent-layer.g-has-selection').attr('order');
          }
        }
        var objLeft = 0;
        var objTop = 0;
        layer_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        // clone again, so you can do multiple copies.
        _clipboard.clone(function(clonedObj) {
          canvas.discardActiveObject();
          clonedObj.set({
            left: clonedObj.left + 10,
            top: clonedObj.top + 10,
            evented: true,
            id: layer_id,
            page: pageID,
            layerGroup: activeLayer,
            layerGroupTitle: activeLayerTitle,
            parentlayerOrder: parentlayerOrder,
          });
          if (clonedObj.type === 'activeSelection') {
            // active selection needs a reference to the canvas.
            clonedObj.canvas = canvas;
            clonedObj.forEachObject(function(obj) {
              layer_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
              obj.set({
                left: obj.left + 10,
                top: obj.top + 10,
                evented: true,
                id: layer_id,
                page: pageID,
                layerGroup: activeLayer,
                layerGroupTitle: activeLayerTitle,
                parentlayerOrder: parentlayerOrder,
              });
              canvas.add(obj);
              activeLayerID = $("#layers .template-group .layer-row.g-active").attr("id");
              //console.log("activeLayerID 3 = "+activeLayerID)
              add_layer(layer_id, obj.name, obj.type, pageID, activeLayer, '');
							layerReordering();
							/* $('.layer-row:not(.parent-layer)').each(function(){
								var obid = $(this).attr('id');
								var ob = canvas.getItemById(obid);
								canvas.moveTo(ob, $('#'+obid).attr('order'));	
							}); */	
            });
            // this should solve the unselectability
            clonedObj.setCoords();
          } else {
            canvas.add(clonedObj);
            //activeLayerID = $("#layers .template-group .layer-row.g-active").attr("id");
            //console.log("activeLayerID 2 = "+activeLayerID)
            add_layer(layer_id, clonedObj.name, clonedObj.type, pageID, activeLayer, '');
						layerReordering();
          }
          _clipboard.top += 10;
          _clipboard.left += 10;
          canvas.setActiveObject(clonedObj);
          canvas.requestRenderAll();
        });
      }
    });
/*****Layer Panel functionality End*****/
	}
	
	//mouse hover for parent layer
	$(".template-group .layer-row.parent-layer").mouseenter(function() {
		if(handSelected || zoomInTool || layerReording){return;}
		var id = $(this).attr("id");
		if($('#layers #'+id+' .layer-lock-icon').hasClass('fa-unlock-alt') && $('#layers #'+id+' .layer-show-icon').hasClass('fa-eye')){
			groupLayerObjects(id, true, false);
		} else if($('#layers #'+id+' .layer-lock-icon').hasClass('fa-lock')){
			groupLayerObjects(id, true, false);
		}
	}).mouseleave(function() {
		if(handSelected || zoomInTool || layerReording){return;}
		var id = $(this).attr("id");
		if($('#layers #'+id+' .layer-lock-icon').hasClass('fa-unlock-alt') && $('#layers #'+id+' .layer-show-icon').hasClass('fa-eye')){
			groupLayerObjects(id, false, false);
		} else if($('#layers #'+id+' .layer-lock-icon').hasClass('fa-lock')){
			groupLayerObjects(id, false, false);
		}
	});

	//mouse hover for all layers except parent layers
	//For dynamic data icon hide/show in left side.
	//$(".template-group .layer-row:not(.parent-layer)").mouseenter(function() {
  $(document).on('mouseenter', '.template-group .layer-row:not(.parent-layer)',function () {
		if(handSelected || zoomInTool){ return;}
		/*if(!$(this).hasClass('editable')){
			$(this).find('.dynamic-data-icon').show();
		}*/
		var id = $(this).attr("id");
		//var obj = canvas.getItemById(id);
		activeLayerObject(id, 'active');
		/* if(obj && obj.type == 'Lineshape'){
			console.log('Lineshape 1');
			obj.set('stroke', '#e75e00');
			obj.set('fill', '#e75e00');
			canvas.renderAll();
		} else {
			activeLayerObject(id, 'active');
		} */
	//}).mouseleave(function() {
  });
  $(document).on('mouseleave', '.template-group .layer-row:not(.parent-layer)',function () {
		if(handSelected || zoomInTool){return;}
		/*if($(this).find('.dynamic-data-icon').hasClass("dynamic-active")){
			return;
		}*/
		//$(this).find('.dynamic-data-icon').hide();
		var id = $(this).attr("id");
		//var obj = canvas.getItemById(id);
		activeLayerObject(id, 'inactive');
		/* if(obj && obj.type == 'Lineshape'){
			obj.set('stroke', '#2880E6');
			obj.set('fill', '#2880E6');
			canvas.renderAll();
		} else {
			activeLayerObject(id, 'inactive');
		} */
	});
	
	function parentLayerStructure(groupId, title, page_id, parentlayerIndex){
		if(toolGroup){
			var ico = 'far fa-object-group';
			var gcl = 'tool-group';
		} else {
			var ico = 'fas fa-folder';
			var gcl = '';
		}
		//layer lock and visibility on load
		var layerLockIcon = 'fa-unlock-alt';
		var layerShowIcon = 'fa-eye';
    var lock_group = true;
    var eye_slash = true;
    var child_layer_found = false;
		var objs = canvas._objects.filter(function(obj){
			if(obj.layerGroup == groupId){
        if(!obj.lock_position || obj.lock_position == 0){
          lock_group = false;
        }
        if(!obj.hide_data || obj.hide_data == 0){
          eye_slash = false;
        }
        child_layer_found = true;
			}
		});
    if(lock_group && child_layer_found){
      layerLockIcon = 'fa-lock';
    }
    if(eye_slash && child_layer_found){
      layerShowIcon = 'fa-eye-slash';
    }
		var layer_html =  $("<div></div>").attr("class", 'd-flex align-items-center parent-layer layer-row g-active g-has-selection '+gcl+'').attr('order', parentlayerIndex).attr('id', groupId).attr('data-pageId', page_id).attr('onclick', 'layerFolderClick(this)')
      .append(
					$("<span></span>").attr("class", "d-flex layer-title-group align-items-center")
					.append($("<span></span>").attr("class", 'layer-icon '+ico+''))
					.append($("<span></span>").attr("class", "layer-title").text(title))
				).append(
					$('<span/>', {
						"class": "layer-action layer-lock-icon c-pointer fas "+layerLockIcon+" fa fa-flip-horizontal",
						"data-title": "Toggle Locker",
						"data-placement": "bottom",
						"data-toggle": "tooltip",
						"onmouseover": "tooltipfn(this)",
					})
				).append(
					$('<span/>', {
						"class": "layer-action layer-show-icon c-pointer fas "+layerShowIcon,
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
      );
			if(toolGroup){
				if(!savedDesignFlag){
					if($('.layer-row.g-active').length === 1){
						var activeElement = document.getElementById($('.layer-row.g-active').attr('id'));
						layer_html.insertBefore(activeElement);		
						layerReordering();
					} else if($('.layer-row.g-active').length > 1){
						var first_active = $('.layer-row.g-active').first().attr('id');
						$('.layer-row.g-active').each(function(){
							if($(this).attr('id') != first_active){
								$(this).insertAfter('#'+first_active);
							}
							layerReordering();		
						});
						var activeElement = document.getElementById(first_active);
						layer_html.insertBefore(activeElement);
						layerReordering();
					}
				} else if(savedDesignFlag){
					$('#layers .template-group.group-active').prepend(layer_html);		
				}
			} else {
				$('#layers .template-group.group-active').prepend(layer_html);
			}
			toolGroup = false;
	}
	
	/**
	 * return Right Sidebar
	 */
	function RightSidebars (){	
    var RsidebarBarBuilder = [];

		var $toolbarPanel_1 = [];
		var $toolbarPanel_2 = [];
		var $toolbarPanel_3 = [];
		var $toolbarPanel_4 = [];
		var $propertyPanel_1 = [];
		var $propertyPanel_2 = [];
		var $propertyPanel_3 = [];
		var $propertyPanel_4 = [];
		var $propertyPanel_5 = [];
		var $propertyPanel_6 = [];
		var $propertyPanel_7 = [];
		var $propertyPanel_7_1 = [];
		var $propertyPanel_7_2 = [];
		var $dynamicDataPanel = [];
		var $dynamicDataPanelBody = [];
		var $settingsDataPanel = [];
		var $settingsDataPanelBody = [];
		
		//$propertyPanel_1
		$toolbarPanel_1.push('<div class="toolbar main-toolbar justify-content-between align-items-center" style="display:none;">')
		$.each(talignments, function (a, alignment) {
			//$toolbarPanel_1.push('<button class="talignments" onmouseover="tooltipfn(this)" class="fs-18" data-action="' + alignment.Action + '" data-toggle="tooltip" data-placement="bottom" data-title="' + alignment.Name + '" data-value="' + alignment.v_value + '"><i class="' + alignment.Icon + '"></i></button><span class="' + alignment.Divider + '"></span>')
			$toolbarPanel_1.push('<button class="talignments'+alignment.bstatus+'" onmouseover="tooltipfn(this)" class="fs-18" data-action="' + alignment.Action + '" data-toggle="tooltip" data-placement="bottom" data-title="' + alignment.Name + '" data-value="' + alignment.v_value + '"><span class="' + alignment.Icon + '">&nbsp;</span></button><span class="' + alignment.Divider + '"></span>')
		})
		$toolbarPanel_1.push('</div>');
		$toolbarPanel_1 = $toolbarPanel_1.join('');		
		$propertyPanel_1.push('<div class="properties-panel main-toolbar" style="display:none;">')
		$.each(Rightproperty, function (r, Rproperty) {
			if(Rproperty.Ratio != ''){
        if(Rproperty.Ratio == 'object-link-icon'){
          var $cont = '<div class="content align-items-center d-flex fs-8" style="height:22px;"><span class="' + Rproperty.Ratio + ' unlinked" onclick="setObjectLink()" id="objectLinkAction" onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom" data-title="Object Link" data-ratio="no" style="text-align: center; cursor: pointer;">&nbsp;</span></div>';
        }
        else {
          var $cont = '<div class="content align-items-center d-flex fs-8" style="height:22px;"><span class=' + Rproperty.Ratio + ' onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom" data-title="Keep Ratio" data-ratio="no" style="text-align: center; cursor: pointer;"></span></div>';
        }
				var cClass = 'column';
			} else {
				var $cont = '&nbsp;';
				var cClass = 'column p-0';
			}
      var input2 = '';
			if(Rproperty.Input_2 == 'Transform'){
				input2 = '<button id='+ Rproperty.InputId_2 +' onclick="openTransformBlock(this)" class="transform-button">'+Rproperty.Input_2+'</button>';
			} else if(Rproperty.Input_2 !== ''){
        input2 = '<div><span class="g-input-label">' + Rproperty.Input_2 + '</span><input id='+ Rproperty.InputId_2 +' type="text" min="0" data-dimension=' + Rproperty.Dimension_2 + ' class="w-100 rightProp" style="padding-left: 20px;" data-act=' + Rproperty.act_2 + ' data-value=' + Rproperty.v_2 + ' data-act=' + Rproperty.act_2 + ' data-value=' + Rproperty.v_2 + '></div>';
			}
			$propertyPanel_1.push('<div class="g-property-row"><label><span class="vertical-align">'+ Rproperty.Name +'</span></label><div class="columns d-flex"><div class="column d-flex flex-column align-items-center" style="width: 44%;"><div class="content w-100"><div><span class="g-input-label">' + Rproperty.Input_1 + '</span><input id='+ Rproperty.InputId_1 +' type="text" min="0" data-dimension=' + Rproperty.Dimension_1 + ' class="w-100" style="padding-left: 20px;" data-act=' + Rproperty.act_1 + ' data-value=' + Rproperty.v_1 + '></div></div></div><div class='+ cClass +' style="width: 12%;">'+ $cont +'</div><div class="column d-flex flex-column align-items-center" style="width: 44%;"><div class="content w-100">'+ input2 +'</div></div></div></div>')
		})		
		$propertyPanel_1.push('</div>')
		$propertyPanel_1 = $propertyPanel_1.join('');
		
		//Transform Property Panel
		$toolbarPanel_2.push('<div class="toolbar toolbar-title transform justify-content-between align-items-center"><label>Transform&nbsp;<i class="right-label fas fa-caret-down"></i></label><button data-action="stroke-settings" data-title="Advanced settings"><i class="fas fa-sliders-h"></i></button></div>')		
		$propertyPanel_2.push('<div class="properties-panel transform toolbar-body">')
		$.each(Rightproperty_2, function (r, Rproperty_2) {
			if (Rproperty_2.Name == 'Copies') {
				var $hr = '<hr>';
				var input2 = '<div class="column p-0" style="width: 44%;"><div class="d-flex w-100 justify-content-center"><div data-property="pivot" class="g-pivot align-self-center"><div class="borderline"></div><div class="side" data-side="tl"></div><div class="side" data-side="tc"></div><div class="side" data-side="tr"></div><div class="side g-active" data-side="rc"></div><div class="side" data-side="br"></div><div class="side" data-side="bc"></div><div class="side" data-side="bl"></div><div class="side" data-side="lc"></div><div class="side" data-side="cc"></div></div></div></div>';
			} else {
				var $hr = '';
				var input2 = '<div class="column d-flex flex-column align-items-center" style="width: 44%;"><div class="content w-100"><div><span class="g-input-label">' + Rproperty_2.Input_2 + '</span><input id="'+ Rproperty_2.dataValue_2 +'" value='+ Rproperty_2.Value_2 +' type="text" min="0" max="'+ Rproperty_2.Max_2 +'" class="w-100" style="padding-left: 20px;"></div></div></div>';
			}
			$propertyPanel_2.push($hr+'<div class="g-property-row"><label><span class="vertical-align">'+ Rproperty_2.Name +'</span></label><div class="columns d-flex"><div class="column d-flex flex-column align-items-center" style="width: 44%;"><div class="content w-100"><div><span class="g-input-label">' + Rproperty_2.Input_1 + '</span><input id="'+ Rproperty_2.dataValue_1 +'" value='+ Rproperty_2.Value_1 +' type="text" min="0" max="'+ Rproperty_2.Max_1 +'" class="w-100" style="padding-left: 20px;"></div></div></div><div class="content p-0" style="width: 12%;">&nbsp;</div>'+ input2 +'</div></div>')
		})
		$propertyPanel_2.push('<div class="g-property-row"><label><span class="vertical-align"></span></label><div class="columns d-flex"><div class="content w-100"><button id="merge-transform" class="transform-button w-100" style="margin-top: 5px;">Apply</button></div></label></div></div><br>')
		$propertyPanel_2.push('</div>')
		$propertyPanel_2 = $propertyPanel_2.join('');

		//$propertyPanel_3
		var activepage = $('.page-row.g-active .page-title').text();
		$propertyPanel_3.push('<div class="toolbar justify-content-between align-items-center page-toolbar"><label>Page (Page 1)</label></div>')
		
		var color = '<div class="column w-23"><div class="content text-center"><input type="color" id="page-background" class="apri rightProp" data-right-prop="fill" data-pro="canvas" data-value="setBackgroundColor" value="#ffffff"></div></div>';

		var w = '<div class="column w-25"><div class="content"><div><span class="g-input-label">W</span><input type="text" value="'+ pageWidth +'" min="0" data-property="w" id="canvas-width" class="w-100" style="padding-left: 20px;"></div></div></div>';

		var h = '<div class="column w-25"><div class="content"><div><span class="g-input-label">H</span><input type="text" value="'+ pageHeight +'" min="0" data-property="h" id="canvas-height" class="w-100" style="padding-left: 20px;"></div></div></div>';

		var opacity = '<label class="column w-25"><div class="content"><input value="100%" type="text" data-property="bop" class="apri" data-pro="canvas" data-value="setopacity"></div></label>';

		$propertyPanel_3.push('<div class="properties-panel page-properties-panel"><div  class="g-property-row text-center"><div class="columns d-flex m-0">'+ color +' '+ w +' '+ h +' '+ opacity +' </div><div class="labels mt-1 ml-0 text-center"><label  class="w-25"><span>Background</span></label><label class="w-25"><span>Width</span></label><label class="w-25"><span>Height</span></label><label  class="w-25"><span>Opacity</span></label></div>')
		
		$propertyPanel_3.push('</div></div><hr>')
		$propertyPanel_3 = $propertyPanel_3.join('');
		
		//$propertyPanel_4
		$propertyPanel_4.push('<div class="g-property-row"><div class="columns ml-2 d-flex"><div class="column d-flex flex-row align-items-center mr-2"><div class="content"><span>Preset</span></div></div>')		
		$.each(Rightproperty_4, function (r4, Rproperty_4) {
			if (Rproperty_4.Label == 'Preset Size') {
				var options = [];
				var width = '65%';
				/*$.each(Rproperty_4.Group, function (po, presetgroup) {
					options.push('<optgroup label="'+ presetgroup.Name +'">')
					$.each(presetgroup.Options, function (po, presetoption) {
						var presetwh = presetoption.Value.split('x');
						var presetw = presetwh[0];
						var preseth = presetwh[1];
						options.push('<option data-preset-id='+ presetgroup.PresetId +' value='+ presetoption.Value +' page-width="'+presetw+'" page-height="'+preseth+'">'+ presetoption.Name +'</option>')
					})	
					options.push('</optgroup>');
				})*/
        options.push('<option value="none">- None -</option>');
				options = options.join('');
        getPageSizePreset(productId);
				var $label = '<select onchange="set_page(this)" id="preset-size" class="w-100">'+ options +'</select>';
			} else {
				var width = '15%';
				var $label = '<button data-property="'+ Rproperty_4.Property +'" onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom" data-title="'+ Rproperty_4.Label +'" '+ Rproperty_4.Disabled +'><span class="'+ Rproperty_4.Icon +'">&nbsp;</span></button>';
			}
			$propertyPanel_4.push('<label class="column d-flex flex-row align-items-center" style="width: '+ width +';"><div class="content">'+ $label +'</div></label>')
		})
		$propertyPanel_4.push('</div></div><div class="mb-8"></div>')
		//$propertyPanel_4.push('<div class="g-property-row"><div class="columns ml-2 d-flex"><label><input type="checkbox" id="bleed"><label class="checkb" for="bleed"></label><span class="ml-2">Bleed and crop</span></label></div></div><hr>')
		$propertyPanel_4 = $propertyPanel_4.join('');
		
		//$propertyPanel_5
		/* $propertyPanel_5.push('<div class="g-property-row"><div class="columns ml-0 d-flex"><div class="column d-flex flex-row align-items-center w-25"><div class="content"><span>Margin</span></div></div>')
		$.each(Rightproperty_5, function (r5, Rproperty_5) {
			$propertyPanel_5.push('<label class="column d-flex flex-row align-items-center" style="width: 18%;"><div class="content"><input value="0" type="text" data-property="'+ Rproperty_5.Property +'"></div></label>')
		})
		$propertyPanel_5.push('</div>')
		$propertyPanel_5.push('<div class="labels mt-1"><label class="w-25">&nbsp;</label>')
		$.each(Rightproperty_5, function (r5l, Label) {
			$propertyPanel_5.push('<label style="width: 15%;"><span>'+ Label.Name +'</span></label>')
		})
		$propertyPanel_5.push('</div></div><br>')
		$propertyPanel_5 = $propertyPanel_5.join('');
		 */
		//$propertyPanel_6
		$propertyPanel_6.push('<div class="toolbar toolbar-title justify-content-between align-items-center" style=""><label>Document&nbsp;<i class="right-label fas fa-caret-down"></i></label><button data-action="stroke-settings" data-title="Advanced settings"><i class="fas fa-sliders-h"></i></button></div><div class="properties-panel toolbar-body"><div class="g-property-row"><div class="columns ml-0 d-flex"><div class="column d-flex flex-row align-items-center w-25"><div class="content"><span>Unit</span></div></div><label class="column d-flex flex-row align-items-center w-75"><div class="content"><select id="measurements" onchange="selectMeasurements(this)"><option value="in">Inches</option><option value="px">Pixels</option></select></div></label></div></div><hr><div class="g-property-row"><div class="columns ml-0 d-flex"><div class="column d-flex flex-row align-items-center w-25"><div class="content"><span>DPI/PPI</span></div></div><div class="column d-flex flex-row align-items-center w-75"><div class="content"><input id="kmds-dpi" type="number" value="72" min="72" max="300"></div></div></div></div><hr><div class="g-property-row"><div class="columns ml-0 d-flex"><div class="column d-flex flex-row align-items-center w-25"><div class="content"><span>Color Space</span></div></div><label class="column d-flex flex-row align-items-center w-75"><div class="content"><select id="kmds-color-space" onchange="selectColorSpace(this)"><option value="RGB">RGB</option><option value="sRGB">sRGB</option><option value="CMYK">CMYK</option><option value="grayscale">Grayscale</option></select></div></label></div></div><hr><div class="g-property-row"><div class="columns ml-0 d-flex"><div class="column d-flex flex-row align-items-center w-25"><div class="content"><span>Format</span></div></div><label class="column d-flex flex-row align-items-center w-75"><div class="content"><select id="kmds-format" onchange="selectPageFormat(this)"><option value="jpg">JPG</option><option value="png">PNG</option><option value="pdf">PDF</option></select></div></label></div></div><hr><div class="g-property-row"><div class="columns ml-0 d-flex"><div class="column d-flex flex-row align-items-center w-25"><div class="content"><span>Bleed</span></div></div><label class="column d-flex flex-row align-items-center w-75"><div class="content"><input type="checkbox" id="page-bleed" value="1" class="form-checkbox" onclick="savePageSettings(\'bleed\');" /><label class="checkb" for="page-bleed"></label></div></label></div></div><hr><div class="g-property-row"><div class="columns ml-0 d-flex"><div class="column d-flex flex-row align-items-center w-25"><div class="content"><span>Trim Marks</span></div></div><label class="column d-flex flex-row align-items-center w-75"><div class="content"><input type="checkbox" id="page-trim-marks" value="1" class="form-checkbox" onclick="savePageSettings(\'trim-marks\');" /><label class="checkb" for="page-trim-marks"></label></div></label></div></div><hr><div class="g-property-row"><div class="columns ml-0 d-flex"><div class="column d-flex flex-row align-items-center w-100"><div class="content page-setting-action"><span><a href="javascript:void(0);" id="page-export" class="font-fjalla btn btn-primary">Export</a></span><span><a href="javascript:void(0);" class="page-reset font-fjalla btn btn-cancel" id="page-setting-reset" onclick="resetPageSettings();">Reset</a></span></div></div></div></div>')		
		$propertyPanel_6.push('</div></div>')
		$propertyPanel_6 = $propertyPanel_6.join('');
		
	 	//Dynamic data panel
    $dynamicDataPanel.push('<div class="toolbar toolbar-title dynamic-data-toolbar justify-content-between align-items-center"><label>Dynamic Data&nbsp;<i class="right-label fas fa-caret-down"></i></label><button data-action="stroke-settings" data-title="Advanced settings"><i class="fas fa-sliders-h"></i></button></div>');
		$dynamicDataPanelBody.push('<div class="dynamic-data-panel toolbar-body font-Lato"><div class="text-dynamic-data-panel">');
    //for textbox

    $dynamicDataPanelBody.push('<div class="text-token-content-section d-none"><div class="d-flex text-token-content"><label>Text&nbsp;Token</label><select class="w-80" id="text-dynamic-token" onchange="addTextToken(this)"><option value="none">None</option>');
    //token list
    var token_list = [];
    var getTokenList = media_base_url+'/tokendata?_format=json';
    var url_data = {vid : "kmds_token"}
    $.getJSON(getTokenList, url_data, function( tokenlist ) {
      $.each(tokenlist, function(key, val) {
        //$dynamicDataPanelBody.push('<option value="'+val.token+'" tid="'+val.tid+'" machine_field="'+val.machine_field+'">'+val.name+'</option>');
        token_list.push('<option value="'+val.token+'" tid="'+val.tid+'" machine_field="'+val.machine_field+'">'+val.name+'</option>');
      });
      token_list = token_list.join('');
      jQuery("#text-dynamic-token").append(token_list); 
    });
    $dynamicDataPanelBody.push('</select></div></div>');
    //for image
    /*$dynamicDataPanelBody.push('<div class="listing-photo-settings d-none"><div class="image-source">Image Source</div><div class="non-listing-image d-flex"><div class="photo-options radio-select"><input type="radio" id="dynamic-listing-photo-none" value="none" name="listingimage" checked onclick="dynamicDataClick(\'image_source\');" /><label for="dynamic-listing-photo-none" class="radiob"><span>&nbsp;</span></label><span class="option-label">None</span></div></div><div class="listing-photo-option d-flex"><div class="photo-options">&nbsp;</div><div class="photo-options">AR Constraint</div></div><div class="listing-photo-option d-flex"><div class="photo-options radio-select"><input type="radio" id="dynamic-listing-photo-media-kit" value="media_kit" name="listingimage" onclick="dynamicDataClick(\'image_source\');" /><label for="dynamic-listing-photo-media-kit" class="radiob"><span>&nbsp;</span></label><span class="option-label">Media Kit</span></div><div class="photo-options"><select class="w-80 ar-constraint media_kit" id="media-kit-style" onchange="dynamicDataClick(\'media-kit\');"><option value="scale-crop">Scale & Crop</option><option value="width">Width</option><option value="height">Height</option></select></div></div><div class="listing-photo-option d-flex"><div class="photo-options radio-select"><input type="radio" id="dynamic-listing-photo-user-picture" value="user_picture" name="listingimage" onclick="dynamicDataClick(\'image_source\');" /><label for="dynamic-listing-photo-user-picture" class="radiob"><span>&nbsp;</span></label><span class="option-label">User Picture</span></div><div class="photo-options"><select class="w-80 ar-constraint user_picture" id="user-picture-style" onchange="dynamicDataClick(\'user-picture\');"><option value="scale-crop">Scale & Crop</option><option value="width">Width</option><option value="height">Height</option></select></div></div><div class="listing-photo-option d-flex"><div class="photo-options radio-select"><input type="radio" id="dynamic-listing-photo-branding-logo" value="branding_logo" name="listingimage" onclick="dynamicDataClick(\'image_source\');" /><label for="dynamic-listing-photo-branding-logo" class="radiob"><span>&nbsp;</span></label><span class="option-label">Branding Logo</span></div><div class="photo-options"><select class="w-80 ar-constraint branding_logo" id="branding-logo-style" onchange="dynamicDataClick(\'branding-logo\');"><option value="scale-crop">Scale & Crop</option><option value="width">Width</option><option value="height">Height</option></select></div></div><hr/><div class="image-source">Image Preset</div><div class="listing-photo-option image-preset d-flex"><div class="photo-options">Preset Group</div><div class="photo-options"><select class="w-80 image-preset-select" id="preset-group-style" onchange="addImagePreset(this)"><option value="none">- None -</option></select></div></div><div class="listing-photo-option image-preset d-flex"><div class="photo-options">Preset</div><div class="photo-options"><select class="w-80 image-preset-select" id="media-preset-style" onchange="dynamicDataClick(\'media-preset\');" disabled><option value="none">- None -</option></select></div></div></div>');
    var preset_group = [];
    //preset_group.push('<option value="none">- none -</option>');
    var getTokenList = media_base_url+'/tokendata?_format=json';
    var url_data = {vid : "product_group"}
    $.getJSON(getTokenList, url_data, function( tokenlist ) {
      $.each(tokenlist, function(key, val) {
        //$dynamicDataPanelBody.push('<option value="'+val.token+'" tid="'+val.tid+'" machine_field="'+val.machine_field+'">'+val.name+'</option>');
        preset_group.push('<option value="'+val.tid+'">'+val.name+'</option>');
      });
      preset_group = preset_group.join('');
      jQuery("#preset-group-style").append(preset_group); 
    });*/
    $dynamicDataPanelBody.push('<hr><div class="image-ar-constraint-section d-none"><div class="d-flex image-ar-constraint-content"><label class="ml-2 text-left">AR&nbsp;Constraint</label><select class="w-80 image-ar-constraint" id="image-ar-constraint" onchange="dynamicDataClick(\'ar-constraint\')"><option value="scale-crop">Scale & Crop</option><option value="width">Width</option><option value="height">Height</option></select></div></div>');
    $dynamicDataPanelBody.push('</div></div>');
    $dynamicDataPanelBody = $dynamicDataPanelBody.join('');
	 	//Settings data panel
    $settingsDataPanel.push('<div class="toolbar toolbar-title settings-data-toolbar justify-content-between align-items-center"><label>Settings&nbsp;<i class="right-label fas fa-caret-down"></i></label></div>');
		$settingsDataPanelBody.push('<div class="settings-data-panel toolbar-body font-Lato"><div class="text-settings-data-panel">');
		$settingsDataPanelBody.push('<div class="setting-title d-flex">Thumbnail</div><div class="settings-static-image d-flex"><div class="static-image-page column flex-row w-45-per"><div class="image-button"><a href="javascript:void(0);" class="image-page-button create-thumbnail d-block" onclick="savePageSettings(\'create-new\');">Create</a><a href="javascript:void(0);" class="image-page-button remove-thumbnail d-none" onclick="savePageSettings(\'remove-thumbnail\');">Remove</a></div></div><div class="static-image column flex-row w-55-per"><div class="no-static-image margin-auto">&nbsp;</div></div></div>');
    $settingsDataPanelBody.push('<div class="static-image-upload d-flex"><div class="image-upload column flex-row w-45-per"><a href="javascript:void(0);" class="image-page-button custom-thumbnail d-block" onclick="savePageSettings(\'upload-new\');">Upload</a><input type="file" id="static-img-upload" style="display:none" accept="image/png, image/jpg, image/jpeg" /></div><div class="image-upload-description column flex-row w-55-per margin-auto">Acceptable files: JPEG, JPG or PNG; less than 500KB.</div></div>');
    //$settingsDataPanelBody.push('<div class="border-bottom"></div>');
    $settingsDataPanelBody.push('<div class="settings-others"><div class="active-page-setting d-flex"><div class="active-checkbox"><input type="checkbox" id="active-page" value="1" class="form-checkbox" onclick="savePageSettings(\'active-page\');" /><label class="checkb" for="active-page"></label><span class="active-title">Make Template Active</span></div></div><div class="removal-page-setting d-flex"><div class="active-checkbox"><input type="checkbox" id="removal-page" value="1" class="form-checkbox" onclick="savePageSettings(\'removal-page\');"><label class="checkb" for="removal-page"></label><span class="removal-title">Flag Template for Removal</span></div></div></div>');
    $settingsDataPanelBody.push('<div class="template-tags"><div class="template-tags-title">Tags</div><div class="template-tags-field"><div class="container"><div id="template-tags" class="form-control"></div></div></div><hr/></div>');
    $settingsDataPanelBody.push('<div class="template-descriptions"><div class="template-descriptions-title">Description – 82 characters max (<span>including spaces</span>)</div><div class="template-tags-field"><div class="container"><textarea id="template-descriptions" name="template-descriptions-field" rows="3" cols="35" maxlength="82"></textarea></div></div></div>');
    $settingsDataPanelBody.push('</div></div>');
    $settingsDataPanelBody = $settingsDataPanelBody.join('');

		//$propertyPanel_3
	 	$toolbarPanel_3.push('<div class="toolbar toolbar-title appearance-toolbar justify-content-between align-items-center" style="display:none;"><label>Appearance&nbsp;<i class="right-label fas fa-caret-down"></i></label><button data-action="stroke-settings" data-title="Advanced settings"><i class="fas fa-sliders-h"></i></button></div>')	

		// Text properties panel
		$propertyPanel_7.push('<div class="properties-panel appearance-properties-panel toolbar-body"><div class="appearance-property-panel text-properties-panel">')
		var $ffamily = $FStylelabel = $Fsizelabel = $hr = $scriptLabel = $FSizeText ='';
		var decoration = [];
		var alignments = [];
		var vertical = [];
		var spacing = [];
		var sizing = [];
		var pcolor = [];

		$scaleonresize = '<div class="g-property-row"><div class="columns d-flex ml-2"><div class="column d-flex auto-grow"><div class="content d-flex"><label><input type="checkbox" id="scaleonresize"/><label class="checkb" for="scaleonresize"></label><span class="ml-2">Scale font on resizing</span></label></div></div></div><div class="columns d-flex ml-2 maximum-characters"><div class="column d-flex auto-grow"><div class="content d-flex"><div class="maximum-characters-content"><label>Maximum&nbsp;Characters</label><input type="text" id="maximum-characters" onclick="dynamicDataClick(\'max-character\')"></div></div></div></div><div class="columns d-flex ml-2"><div class="column d-flex auto-grow"><div class="content d-flex"><label><input type="checkbox" id="dynamic-lock-data" value="1" class="form-checkbox" onclick="dynamicDataClick(\'lock\');"><label class="checkb" for="dynamic-lock-data"></label><span class="ml-2">Lockdown Text Edit Capability</span></label></div></div></div><div class="columns d-flex ml-2"><div class="column d-flex auto-grow"><div class="content d-flex"><label><input type="checkbox" id="dynamic-all-caps" value="1" class="form-checkbox" onclick="dynamicDataClick(\'caps\');"><label class="checkb" for="dynamic-all-caps"></label><span class="ml-2">ALL CAPS</span></label></div></div></div></div>';
		
		$.each(Rightproperty_7, function (rp7, Rproperty_7) {
			if(Rproperty_7.Name == 'Color'){				
				$.each(Rproperty_7.Items, function (rp0, citems) {
					pcolor.push('<label class="column w-25 text-center"><div class="content"><input type="color" id="'+ citems.Id +'" class="apri mt-1 c-pointer w-30px rightProp" data-right-prop="'+ citems.datavalue +'"  data-pro="'+ citems.datapro +'" data-value="'+ citems.datavalue +'" value="'+citems.Value+'"/></div></label>')
				})
				pcolor = pcolor.join('');
			} 

			if(Rproperty_7.Name == 'FFamily'){
				var FFamily = [];
					/*$.each(Rproperty_7.Options, function (rp1, family) {
						if(family.Name == 'Open Sans'){var selected = 'selected';} else {var selected = '';}
						FFamily.push("<option style='font-family:"+ family.Name +"' value='"+ family.Name +"' "+ selected +">"+ family.Name +"</option>")
					})*/
          var fonts = kmdsFontsList();
          fonts = fonts.sort();
          $.each(fonts, function(key, val){
            if(val == 'Open Sans'){var selected = 'selected';} else {var selected = '';}
						FFamily.push("<option style='font-family:"+ val +"' value='"+ val +"' "+ selected +">"+ val +"</option>")
          });
				FFamily = FFamily.join('');
				$ffamily = '<label class="ml-2 text-left w-25"><input type="color" id="kmds-color-fill" class="kmds-color-section apri" data-right-prop="fill" data-pro="kmdstextcolor" data-value="fill" value="#000000" /><span class="ml-2 text-left kmds-color-picker">&nbsp;</span><span class="icon-color-picker"><i class="fa fa-eyedropper" aria-hidden="true"></i></span><!--<span class="vertical-align fw-600">Font </span>--></label><div class="column d-flex flex-row align-items-center" style="width:67%;"><div class="content"><select class="w-100 rightProp" id="font-family" class="btn-object-action" data-pro="fontFamily" data-right-prop="fontFamily">'+ FFamily +'</select></div></div>';
			}
			
			if(Rproperty_7.Name == 'FStyle'){
				var FStyle = [];
        addFontStyle("Open Sans", 'Regular');
        var fstyle = kmdsFontsList("Open Sans");
        var count = fstyle.length;
        jQuery.each(fstyle, function(key, val){
          if(val == 'Regular'){var selected = 'selected';} else {var selected = '';}
          jQuery("#fstyle").append('<option value="'+val+'">'+val+'</option>');
          FStyle.push('<option value='+ val+' '+ selected +'>'+ val +'</option>')
        });
					//$.each(Rproperty_7.Options, function (rp2, fstyle) {
					//	if(fstyle.Value == '400#N'){var selected = 'selected';} else {var selected = '';}
						/* var optId = fstyle.Name;
						optId = optId.split(' ').map(function (s, i) {
							return i && s.length ? s.toLowerCase() : s.toLowerCase();
						}).join('-'); */
					//	FStyle.push('<option value='+ fstyle.Value +' '+ selected +'>'+ fstyle.Name +'</option>')
					//})	
				FStyle = FStyle.join('');
				$FStylelabel = '<div class="column d-flex flex-row align-items-center"><select data-property="preset-font-style" class="w-100" id="fstyle">'+ FStyle +'</select></div>';
			}
			if(Rproperty_7.Name == 'FSize'){				
				var NFSizen = [];
					$.each(Rproperty_7.Options, function (rp3, fsize) {											
						NFSizen.push('<div class="option-item" datavalue='+ fsize.Value +'>'+ fsize.Name +'</div>')
					})				
				NFSizen = NFSizen.join('');				
				$Fsizelabel = '<div class="column d-flex flex-row w-38"><div class="dropdown"><input value="24" id="text-font-size" data-pro="fontSize" data-right-prop="fontSize" onclick="textSizeList()" class="dropbtn w-100 p-1"/><div id="myDropdown" class="dropdown-content">'+ NFSizen +'</div><span class="dropdown-content-icon" onclick="textSizeList()"><i class="fas fa-chevron-down"></i></span></div></div>';
			}
			
		  if(Rproperty_7.Name == 'Decoration'){
				$hr = '<hr>';				
				$.each(Rproperty_7.Items, function (rp4, ritems) {
					decoration.push('<div class="column d-flex flex-row align-items-center w-23"><div class="content"><button id="'+ ritems.Id +'" class="apri rightProp" data-right-prop="'+ ritems.datapro +'" data-pro="'+ ritems.datapro +'" data-value="'+ ritems.datavalue +'" onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom" data-title="'+ ritems.Name +'"><span class="'+ ritems.Icon +'"></span></button></div></div>')
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
					alignments.push('<div class="column d-flex flex-row align-items-center w-23"><div class="content"><button data-value="'+ aitems.Value +'" data-right-prop="textAlign" data-pro="textAlign" value="'+ aitems.Value +'" id="'+ aitems.Id +'" class="'+ activeclass +' align apri rightProp" data-property="'+ aitems.Id +'" onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom" data-title="'+ aitems.Name +'"><span class="'+ aitems.Icon +'"></span></button></div></div>')
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
					vertical.push('<div class="column d-flex flex-row align-items-center w-23"><div class="content"><button class="apri valign" data-value="'+ vitems.Value +'" data-pro="textAlign" data-right-prop="textAlign" value="'+ vitems.Value +'" id="'+ vitems.Id +'" class="'+ activeclass +' valign rightProp" data-property="'+ vitems.Id +'" onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom" data-title="'+ vitems.Name +'"><span class="'+ vitems.Icon +'"></span></button></div></div>')
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
					spacing.push('<div class="column d-flex flex-row align-items-center '+ width +'"><div class="content text-center"><input value="'+ sitems.Value +'" id="'+ sitems.Id +'" class="apri rightProp" data-right-prop="spacing" data-pro="spacing" data-value="'+sitems.datapro+'" min='+ sitems.Min +' type="text" data-property="'+ sitems.Id +'" data-title="'+ sitems.Name +'"/>'+ percent +'<label class="mt-1">'+sitems.Name+'</label></div></div>')
				})
				spacing = spacing.join('');
			}

			if(Rproperty_7.Name == 'FSizeText'){
				$.each(Rproperty_7.Items, function (rp7, sitems) {
					if(sitems.Name == 'Line'){
						var percent = '<button class="percent-style">%</button>';
						var width = 'w-30';
					} else {
						var percent = '';
						var width = 'w-25';
					}
					FSizeText.push('<div class="column d-flex flex-row align-items-center '+ width +'"><div class="content text-center"><input value="'+ sitems.Value +'" id="'+ sitems.Id +'" class="apri rightProp" data-right-prop="spacing" data-pro="spacing" data-value="'+sitems.datapro+'" min='+ sitems.Min +' type="text" data-property="'+ sitems.Id +'" data-title="'+ sitems.Name +'"/>'+ percent +'<label class="mt-1">'+sitems.Name+'</label></div></div>')
				})
				FSizeText = FSizeText.join('');
			}
			
			if(Rproperty_7.Name == 'Sizing'){
				sizing.push('<div class="columns ml-0 d-flex">')
				$.each(Rproperty_7.Items, function (rp8, siitems) {
					if(siitems.Button_1 == 'Fix' || siitems.Button_2 == 'Fix'){
						var selected = 'g-active';
					} else{
						var selected = '';
					}
					sizing.push('<div class="column d-flex flex-row align-items-center w-45"><div class="content d-flex"><button onclick="FnSizing(this)" class="w-100 g-group-start rightProp'+ siitems.Class_1 +'" id="'+ siitems.Id_1 +'">'+ siitems.Button_1 +'</button><button onclick="FnSizing(this)" id="'+ siitems.Id_2 +'" class="w-100 g-group-end '+ siitems.Class_2 +' '+ selected +'">'+ siitems.Button_2 +'</button></div></div>')
				})
				sizing.push('</div>')
				sizing.push('<div class="labels mt-1"><label class="text-center w-50"><span>Width</span></label><label class="text-center w-50"><span>Height</span></label></div>')
				sizing = sizing.join('');
			} 
			
			if(Rproperty_7.Name == 'Script'){
				var Script = [];
					$.each(Rproperty_7.Options, function (rp9, scitems) {
						if(scitems.Name == 'Left-to-right'){var selected = 'selected';} else {var selected = '';}
						Script.push('<option '+selected+' value='+ scitems.Value +'>'+ scitems.Name +'</option>')
					})	
				Script = Script.join('');
				$scriptLabel = '<div class="column d-flex flex-row align-items-center w-50"><select onchange="rotate(this.value)" class="w-100 rightProp" id="script">'+ Script +'</select></div>';
			}	
		})	// End Text properties panel
		
    $propertyPanel_7.push('<div class="dynamic-branding ml-2"><div class="style-title ">Dynamic Branding Styles</div><div class="font-familt-style d-flex columns"><select class="w-70 font-family-select column" id="font-family-type" onchange="addDynamicBranding(\'font-family\')"><option value="none">- None -</option></select></div><div class="font-color-style d-flex columns"><select class="w-70 font-color-select column" id="font-color-type" onchange="addDynamicBranding(\'font-color\');"><option value="none">- None -</option></select></div></div>');
    var font_family = [];
    var font_color = [];
    var background_color = [];
    var border_color = [];
    var getFontFamily = media_base_url+'/tokendata?_format=json';
    var url_data = {vid : "branding_css"}
    $.getJSON(getFontFamily, url_data, function( tokenlist ) {
      $.each(tokenlist, function(key, val) {
        if(typeof val.fontfamily != "undefined"){
          font_family.push('<option value="'+val.fontfamily.tid+'">'+val.fontfamily.name+'</option>');
        }
        else if(typeof val.fontcolor != "undefined"){
          font_color.push('<option value="'+val.fontcolor.tid+'">'+val.fontcolor.name+'</option>');
        }
        else if(typeof val.backgroundcolor != "undefined"){
          background_color.push('<option value="'+val.backgroundcolor.tid+'">'+val.backgroundcolor.name+'</option>');
        }
        else if(typeof val.bordercolor != "undefined"){
          border_color.push('<option value="'+val.bordercolor.tid+'">'+val.bordercolor.name+'</option>');
        }
      });
      font_family = font_family.join('');
      font_color = font_color.join('');
      background_color = background_color.join('');
      border_color = border_color.join('');
      jQuery("#font-family-type").append(font_family); 
      jQuery("#font-color-type").append(font_color); 
      jQuery("#background-color-type").append(background_color); 
      jQuery("#border-color-type").append(border_color); 
    });
		// $propertyPanel_7.push('<div class="g-property-row"><div class="columns d-flex m-0">'+pcolor+'</div><div class="labels text-center m-0 p-0"><label class="mt-2 w-25">Fill</label><label class="mt-2 w-25">Stroke</label><label class="mt-2  w-25">Background</label><label class="mt-2 w-25">Text Background Color</label></div>'+$hr)

		$propertyPanel_7.push('<div class="g-property-row">'+$hr)
		
		$propertyPanel_7.push('<div class="g-property-row text-center"><div class="columns d-flex m-0">'+$ffamily+'</div></div>')
		$propertyPanel_7.push('<div class="g-property-row text-center"><label class="ml-2"></label><div class="columns d-flex">'+ $FStylelabel +' '+ $Fsizelabel +' </div><div class="labels mt-1 text-center"><label style="width:63%;"><span style="font-size: 10px;">Weight</span></label><label class="w-25"><span style="font-size: 10px;">Size</span></label></div></div>')
		$propertyPanel_7.push($hr+'<div class="g-property-row"><label class="ml-2"><span class="vertical-align">Decoration</span></label><div class="columns decoration ml-0 d-flex">'+decoration+'</div></div>'+$hr)
		$propertyPanel_7.push('<div class="g-property-row"><label class="ml-2"><span class="vertical-align">Alignment</span></label><div class="columns alignments ml-0 d-flex">'+ alignments +'</div></div>')
		//$propertyPanel_7.push('<div class="g-property-row"><label class="ml-2"><span class="vertical-align">Vertical</span></label><div class="columns alignments mb-8 ml-0 d-flex">'+ vertical +'</div></div>')
		$propertyPanel_7.push('<div class="g-property-row"><label class="ml-2 mt--05"><span class="vertical-align">Spacing</span></label><div class="columns spacing mb-3 mt-3 ml-0 d-flex">'+ spacing +'</div></div>')
		$propertyPanel_7.push('<div class="g-property-row"><label class="ml-2"><span class="vertical-align">Sizing</span></label>'+ sizing +'</div>')
		$propertyPanel_7.push('<div class="g-property-row"><label class="ml-2"><span class="vertical-align">Script</span></label><div class="columns script ml-0 d-flex">'+ $scriptLabel +'</div></div>')
		$propertyPanel_7.push($scaleonresize)
		$propertyPanel_7.push('</div></div>') //text appearance close
			
		//Image Apearance Panel
		$propertyPanel_7.push('<div class="appearance-property-panel image-properties-panel"  style="display:none;">')
		var imgapp_1 = [];
		var imgapp_2 = [];
		$.each(Rightproperty_8, function (rp8, Rproperty_8) {
			if(Rproperty_8.Name == 'Image'){
				$.each(Rproperty_8.Items, function (img1, imgitems1) {
          var fncallback = 'onclick="'+imgitems1.on_click+'()"';
					/*if(imgitems1.Name == 'Replace'){
						var fncallback = 'onclick="browseImg()"';
					}
          else if(imgitems1.Name == 'Original Size'){
            var fncallback = 'onclick="imgOriginalSize()"';
          }
          else {
						var fncallback = datatitle = '';								
					}*/
					imgapp_1.push('<label class="column w-50 text-center"><div class="content"><button '+fncallback+' data-value="'+ imgitems1.Value +'" data-pro="'+imgitems1.dataPro+'" value="'+ imgitems1.Value +'" id="'+ imgitems1.Id +'" '+imgitems1.Disabled+' class="image apri g-flat"><span class="'+ imgitems1.Icon +' fs-17"></span></button></div></label>')
				})
				imgapp_1 = imgapp_1.join('');
			}
			if(Rproperty_8.Name == 'Corner'){
				$.each(Rproperty_8.Items, function (img2, imgitems2) {
					if(imgitems2.Name == 'Corner Track'){
						var field = '<div class="column d-flex align-items-center auto-grow mr-2" style="width: 77%;"><div id="'+imgitems2.Id+'" class="content"><input id="dynamic-image-corner-range" role="input-range" type="range" min="0" max="100" step="10" value="0" data-rangeslider="" style="position: absolute; width: 1px; height: 1px; overflow: hidden; opacity: 0;"></div></div>';//w-55
					} 
					if(imgitems2.Name == 'Corner Input'){
						var field = '<label class="column d-flex align-items-center" style="width: 35px;"><div class="content"><input id="'+ imgitems2.Id +'" type="number" class="corner-radius" value="0" min="0" max="100"></div></label>';
					}
					/*if(imgitems2.Name == 'Corner Advanced'){
						var field = '<div class="column d-flex align-items-center" style="width: 35px;"><div class="content"><div onclick="openCornerBlock()" onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom" id="'+ imgitems2.Id +'" data-title="Advanced Settings" class="d-flex h-26px g-button g-icon align-items-center justify-content-center"><span class="fas color-75 fa-sliders-h fs-16"></span></div></div></div>';
					}*/
					imgapp_2.push(field)
				})
				imgapp_2 = imgapp_2.join('');
			}
		})
		//var corners = '<div class="g-property-row" id="corner-type" style="display:none;"><div class="columns p-0 m-0 mt-3"><label class="column" style="width: 20%;"><div class="content"><button value="56" class="g-flat g-corner g-active" data-corner-type="R" data-title="Round" onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom"><span class="fa"></span>Round</button></div></label><label class="column" style="width: 20%;"><div class="content"><button value="56" class="g-flat g-corner" data-corner-type="U" data-title="Round2" onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom"><span class="fa"></span>Round2</button></div></label><label class="column" style="width: 20%;"><div class="content"><button value="56" class="g-flat g-corner" data-corner-type="B" data-title="Bevel" onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom"><span class="fa"></span>Bevel</button></div></label><label class="column" style="width: 20%;"><div class="content"><button value="56" class="g-flat g-corner" data-corner-type="I" data-title="Inset" onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom"><span class="fa"></span>Inset</button></div></label><label class="column" style="width: 20%;"><div class="content"><button value="56" class="g-flat g-corner" data-corner-type="F" data-title="Fancy" onmouseover="tooltipfn(this)" data-toggle="tooltip" data-placement="bottom"><span class="fa"></span>Fancy</button></div></label></div></div>';
		//$propertyPanel_7.push('<div class="g-property-row m-0"><div class="columns d-flex ml-2">'+imgapp_1+'</div><div class="labels ml-2 p-0 text-center"><label class="w-25"><span>Replace</span></label><label class="w-25"><span>Orig. Size</span></label><label class="w-25"><span>Crop</span></label><label class="w-25"><span>Colors</span></label></div></div>'+$hr)
		$propertyPanel_7.push('<div class="g-property-row m-0"><div class="columns d-flex ml-2">'+imgapp_1+'</div><div class="labels ml-2 p-0 text-center"><label class="w-50"><span>Original Size</span></label><label class="w-50"><span>Crop</span></label></div></div>'+$hr)
		$propertyPanel_7.push('<div class="g-property-row ml-2" id="corner-block"><label class="ml-2" style="width: 17%;"><span class="vertical-align">Corner</span></label><div class="columns d-flex m-0">'+imgapp_2+'</div></div>' +$hr)//'+corners+' {Hide by SMH at 8-12-2020}
    $propertyPanel_7.push('<div class="dynamic-opacity-branding ml-2"><div class="g-property-row text-center"><div class="columns d-flex m-0"><label class="ml-2 text-left" style="width:20%;">Opacity</label><div class="column d-flex flex-row align-items-center" style="width:64%;"><div class="content"><input id="dynamic-image-opacity-range" type="range" value="100" step="10" max="100" min="10" /></div></div><div class="column d-flex flex-row align-items-center" style="width:16%;"><div class="content"><input type="text" class="w-100 rightProp" id="image-opacity-range" value="100%" /></div></div></div></div></div>');
		
		$propertyPanel_7.push('</div>') //image appearance close
		
		$propertyPanel_7.push('<div class="appearance-property-panel shape-properties-panel" style="display:none;">')
    $propertyPanel_7.push('<div class="dynamic-branding ml-2"><div class="style-title">Dynamic Branding Styles</div><div class="background-color-style d-flex columns"><select class="w-70 background-color-select column" id="background-color-type" onchange="addDynamicBranding(\'background-color\')"><option value="none">- None -</option></select></div><div class="border-color-style d-flex columns"><select class="w-70 border-color-select column" id="border-color-type" onchange="addDynamicBranding(\'border-color\');"><option value="none">- None -</option></select></div></div><hr />');
    $propertyPanel_7.push('<div class="dynamic-corner-branding ml-2 d-none"><div class="g-property-row text-center"><div class="columns d-flex m-0"><label class="ml-2 text-left" style="width:20%;">Corner</label><div class="column d-flex flex-row align-items-center" style="width:50%;"><div class="content"><input id="dynamic-corner-range" type="range" value="0" step="10" max="100" min="0" /></div></div><div class="column d-flex flex-row align-items-center" style="width:15%;"><div class="content"><input type="text" class="w-100 rightProp" id="corner-range" value="0" /></div></div><div class="column d-flex flex-row align-items-center" style="width:15%; font-size: 18px;"><div class="content"><button data-title="Advanced settings"><i class="fas fa-sliders-h"></i></button></div></div></div></div><hr /></div>');
    $propertyPanel_7.push('<div class="dynamic-opacity-branding ml-2"><div class="g-property-row text-center"><div class="columns d-flex m-0"><label class="ml-2 text-left" style="width:20%;">Opacity</label><div class="column d-flex flex-row align-items-center" style="width:64%;"><div class="content"><input id="dynamic-opacity-range" type="range" value="100" step="10" max="100" min="10" /></div></div><div class="column d-flex flex-row align-items-center" style="width:16%;"><div class="content"><input type="text" class="w-100 rightProp" id="opacity-range" value="100%" /></div></div></div></div></div>');
    //$propertyPanel_7.push('<div class="dynamic-blending-branding ml-2"><div class="g-property-row text-center"><div class="columns d-flex m-0"><label class="ml-2 text-left" style="width:20%;">Blending</label><div class="column d-flex flex-row align-items-center" style="width:78%;"><div class="content"><select class="w-100 rightProp" id="blending-select" data-pro="blendingselect" data-right-prop="blendingselect"><option value="normal">Normal</option></select></div></div></div></div></div>');
    $propertyPanel_7.push('</div>'); //shape appearance close
		
		$propertyPanel_7.push('</div>'); //appearance body close
		$propertyPanel_7 = $propertyPanel_7.join('');

	 	//Shape Fills section
    $propertyPanel_7_1.push('<div class="toolbar toolbar-title fills-toolbar justify-content-between align-items-center"><label class="flex-grow">Fills&nbsp;<i class="right-label fas fa-caret-down"></i></label><button data-action="stroke-settings" data-title="Advanced settings"><i class="fas fa-sliders-h"></i></button><button id="delete-fill" data-toggle="tooltip" data-placement="bottom" data-title="Delete Fill"><span class="fas fa-trash-alt"></span></button><button id="create-new-fill" data-toggle="tooltip" data-placement="bottom" data-title="New Fill" data-original-title="" title=""><span class="far fa-plus-square"></span></button></div>');
		$propertyPanel_7_1.push('<div class="properties-panel appearance-properties-panel toolbar-body"><div class="appearance-property-panel fills-properties-panel">');
		$propertyPanel_7_1.push('<div class="appearance-property-panel fills-properties-panel">')
    $propertyPanel_7_1.push('<div class="shape-fill ml-2"><div class="g-property-row text-center"><div class="columns d-flex m-0"><label class="ml-2 text-left" style="width:15%;"><input type="color" id="kmds-shape-fill" class="kmds-shape-section apri" data-right-prop="fill" data-pro="kmdsshapefill" data-value="fill" value="#ffffff"><span class="ml-2 text-left kmds-shape-picker">&nbsp;</span><span class="icon-color-picker"><i class="fa fa-eyedropper" aria-hidden="true"></i></span></label><div class="column d-flex flex-row align-items-center" style="width:58%;"><div class="content"><select class="w-100 rightProp" id="fill-select" data-pro="shapefill" data-right-prop="shapefill"><option value="normal">Normal</option></select></div></div><div class="column d-flex flex-row align-items-center" style="width:16%;"><div class="content"><input type="text" class="w-100 rightProp" id="fill-percent" value="100%" /></div></div><div class="column d-flex flex-row align-items-center" style="width:5%;"><div class="content"><span class="fill-action fill-show-icon c-pointer fas fa-eye" data-title="Fill Visibility" data-placement="bottom" data-toggle="tooltip" onmouseover="tooltipfn(this)"></span></div></div></div></div></div>');
    $propertyPanel_7_1.push('</div>');
    $propertyPanel_7_1.push('</div></div>');
    $propertyPanel_7_1 = $propertyPanel_7_1.join('');
	 	//Borders Fills section
    $propertyPanel_7_2.push('<div class="toolbar toolbar-title borders-toolbar justify-content-between align-items-center"><label class="flex-grow">Borders&nbsp;<i class="right-label fas fa-caret-down"></i></label><button data-action="stroke-settings" data-title="Advanced settings"><i class="fas fa-sliders-h"></i></button><button id="delete-border" data-toggle="tooltip" data-placement="bottom" data-title="Delete Border"><span class="fas fa-trash-alt"></span></button><button id="create-new-border" data-toggle="tooltip" data-placement="bottom" data-title="New Border" data-original-title="" title=""><span class="far fa-plus-square"></span></button></div>');
		$propertyPanel_7_2.push('<div class="properties-panel appearance-properties-panel toolbar-body"><div class="appearance-property-panel borders-properties-panel">');
		$propertyPanel_7_2.push('<div class="appearance-property-panel borders-properties-panel">')
    $propertyPanel_7_2.push('<div class="shape-border ml-2"><div class="g-property-row text-center"><div class="columns d-flex m-0"><label class="ml-2 text-left" style="width:15%;"><input type="color" id="kmds-shape-border" class="kmds-shape-border-section apri" data-right-prop="stroke" data-pro="kmdsshapeborder" data-value="stroke" value="#000000"><span class="ml-2 text-left kmds-border-picker">&nbsp;</span><span class="icon-color-picker"><i class="fa fa-eyedropper" aria-hidden="true"></i></span></label><div class="column d-flex flex-row align-items-center" style="width:10%;"><div class="content"><input type="text" class="w-100 rightProp" id="border-stroke-num" value="1" /></div></div><div class="column d-flex flex-row align-items-center" style="width:53%;"><div class="content"><select class="w-100 rightProp" id="fill-select" data-pro="shapefill" data-right-prop="shapefill"><option value="normal">Normal</option></select></div></div><div class="column d-flex flex-row align-items-center" style="width:16%;"><div class="content"><input type="text" class="w-100 rightProp" id="line-opacity-range" value="100%" /></div></div><div class="column d-none flex-row align-items-center" style="width:5%;"><div class="content"><span class="stroke-action stroke-show-icon c-pointer fas fa-eye" data-title="Stroke Visibility" data-placement="bottom" data-toggle="tooltip" onmouseover="tooltipfn(this)"></span></div></div></div><div class="columns d-none m-2 line-cap-container"><label class="ml-2 text-left" style="width:24%; margin: auto 0;">Line&nbsp;Cap</label><div class="column d-flex flex-row align-items-center" style="width:53%;"><div class="content"><select class="w-100 rightProp" id="LineCapSelect" data-pro="lineCap" data-right-prop="lineCap" onchange="applyLineCap(this)"><option value="butt">None (butt)</option><option value="round">Round</option><option value="square">Square</option></select></div></div></div></div></div>');
    $propertyPanel_7_2.push('</div>');
    $propertyPanel_7_2.push('</div></div>');
    $propertyPanel_7_2 = $propertyPanel_7_2.join('');
		
		RsidebarBarBuilder.push('<div id="right-container"><div id="sidebar-container" class="sidebar-container sidebar-inspector d-flex flex-column"><div class="panels flex-grow canvas-page-settings"><div class="toolbarPanel_1 panels d-none">'+ $toolbarPanel_1 +' '+ $propertyPanel_1 +'</div> <div class="toolbarPanel_2 panels d-none">'+ $toolbarPanel_2 +' '+ $propertyPanel_2 +'</div> <div class="toolbarPanel_3 panels d-block">'+ $propertyPanel_3 +' '+ $propertyPanel_4 +'</div> <div class="toolbarPanel_4 panels d-block">'+ $propertyPanel_5 +' '+ $propertyPanel_6 +'</div> <div class="toolbarPanel_5 panels d-none">'+ $toolbarPanel_3 +' '+ $propertyPanel_7 +'</div> <div class="toolbarPanel_5_1 panels d-none">'+ $propertyPanel_7_1 +' '+ $propertyPanel_7_2 +'</div> <div class="toolbarPanel_6 panels d-none">'+$dynamicDataPanel + $dynamicDataPanelBody +'</div> <div class="toolbarPanel_7 panels d-block">'+$settingsDataPanel+' '+$settingsDataPanelBody+'</div></div></div></div><div class="kmds-stickey-footer"></div>');

	  $('#right-sidebar').prepend(RsidebarBarBuilder.join(''));
		
		var ew = new elemAttr('canvas-width', 'width');
		ew.keyAction();
		var eh = new elemAttr('canvas-height', 'height');
		eh.keyAction();
		
		$('#right-sidebar .text-properties-panel .alignments button').each(function(){
			$(this).on('click touch', function(e){
				//e.preventDefault();
				//e.stopPropagation();
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
				//e.preventDefault();
				//e.stopPropagation();
				$('#right-sidebar .text-properties-panel button.sizing-width').removeClass('g-active');
				$(this).toggleClass('g-active');
			})
		});
		$('#right-sidebar .text-properties-panel button.sizing-height').each(function(){
			$(this).on('click touch', function(e){
				//e.preventDefault();
			//	e.stopPropagation();
				$('#right-sidebar .text-properties-panel button.sizing-height').removeClass('g-active');
				$(this).toggleClass('g-active');
			})
		});
		$('#right-sidebar .text-properties-panel .decoration button').each(function(){
			$(this).on('click touch', function(e){
				$(this).toggleClass('g-active');
				FnFontStyle();				
			})
		});
    //show hide right sidebar panel
    $('.toolbar-title').click(function(){
      $(this).next('.toolbar-body').toggle();
      if($(this).next('.toolbar-body').css('display') == 'none') {
        $(this).find('.right-label').removeClass('fa-caret-down');
        $(this).find('.right-label').addClass('fa-caret-right');
      }
      else {
        $(this).find('.right-label').addClass('fa-caret-down');
        $(this).find('.right-label').removeClass('fa-caret-right');
      }
    });
    var cs = new elemAttr('char-spacing', null);
		cs.keyAction();
		//Static image upload
    $('#static-img-upload').on('change', function(e){
      jQuery('.settings-data-panel').append('<div class="progress-overlay page-setting-progress"><div class="spinner-border"></div></div>');
      var design_id = getUrlDesignID();
      if (design_id == '') {
        jQuery('.settings-data-panel .page-setting-progress').remove();
        FnNewFolderModal();
        FnDefaultModal('Please save the template before creating or uploading a thumbnail.');
        return;
      }
      const len = e.target.files.length;
      var uploadedFiles = e.target.files;
      var imgwidth = imgheight = '';
      if(len > 0){
        $.each( uploadedFiles, function(i, file) {
          if(file.size < 500000) {
            var reader = new FileReader();
            //Read the contents of Image File.
            reader.readAsDataURL(file);
            reader.onload = function (en) {
              //Initiate the JavaScript Image object.
              var image = new Image();
              //Set the Base64 string return from FileReader as source.
              image.src = en.target.result;
              //File Height and Width.
              image.onload = function () {
                imgwidth = this.width;
                imgheight = this.height;
                //console.log("height = "+ this.height + " *** " + "width = "+ this.width);
              };
            };
            var form_data = new FormData();
            form_data.append("file", e.target.files[0]);
            form_data.append('new_filename', design_id);
            form_data.append('uid', uid);
            jQuery.ajax({
              url: media_base_url+"/kmds/design-tool/static-image-upload",
              method:"POST",
              data: form_data,
              contentType: false,
              cache: false,
              processData: false,
              success: function(result) {
                if(jQuery(".static-image .no-static-image").length){
                  var size = imgwidth >= imgheight ? 'width' : 'height';
                  //console.log("size attribute = "+ size);
                  jQuery(".static-image .no-static-image").remove();
                  jQuery(".static-image").append('<div class="static-image-thumb margin-auto"><img src="'+result.src+'" '+size+'="128" /></div>');
                  jQuery(".image-page-button.remove-thumbnail").removeClass('d-none').addClass('d-block');
                  jQuery(".image-page-button.create-thumbnail").removeClass('d-block').addClass('d-none');
                  jQuery(".static-image-upload").removeClass('d-flex').addClass('d-none');
                }
                else {
                  jQuery('.static-image-thumb img').attr('src', result.src);
                }
                var page_settings = {'static_image_url' : result.src};
                update_design_url(design_id, page_settings);
                jQuery('.settings-data-panel .page-setting-progress').remove();
              }
            });
          }
          else {
            jQuery('.settings-data-panel .page-setting-progress').remove();
            FnNewFolderModal();
            FnDefaultModal('Thumbnail images should be JPEG, JPG, or PNG files, and less than 500KB.');
          }
          //ImageProcessFn(file, activePage);
        });
      }
    });
    //apply strokewidth to selected object
    $('input#border-stroke-num').on('keypress', function(event){
      return (
        event.keyCode == 8 || 
        event.keyCode == 46 ||
        (event.keyCode >= 37 && event.keyCode <= 40) ||
        (event.charCode >= 48 && event.charCode <= 57)
      );
    }).keyup(function(){
      var stroke_num = parseInt($('input#border-stroke-num').val());
      var obj = canvas.getActiveObject();
      obj.set({
        strokeWidth: stroke_num,
      });
      canvas.renderAll();
    });
    //applying color opacity with selected object
    $("#dynamic-opacity-range").change(function(){
      var newval = $(this).val();
      jQuery("#opacity-range").val(newval+"%");
      var obj = canvas.getActiveObject();
      if(obj){
        obj.set({
          opacity: (newval/100),
          dynamic_opacity_range: (newval/100),
        });
        canvas.renderAll();
      }
    });
    $('input#opacity-range').on('keypress', function(event){
      return (
        event.keyCode == 8 || 
        event.keyCode == 46 ||
        (event.keyCode >= 37 && event.keyCode <= 40) ||
        (event.charCode >= 48 && event.charCode <= 57)
      );
    }).keyup(function(){
      var newval = parseInt($('input#opacity-range').val());
      if(newval === 0){
        FnNewFolderModal();
        FnDefaultModal('<p>Zero opacity is not supported via the Opacity slider.<br><br>To completely hide a layer, please utilize the<br><br>visibility feature in the Layers palette.</p>');
      }
      else {
        var obj = canvas.getActiveObject();
        if(obj){
          obj.set({
            opacity: (newval/100),
            dynamic_opacity_range: (newval/100),
          });
          canvas.renderAll();
          $('#dynamic-opacity-range').val(newval);
          $('input[type="range"]').rangeslider('update', true);
        }
      }
    }).blur(function() {
      var newval = parseInt($('input#opacity-range').val());
      var obj = canvas.getActiveObject();
      if(obj){
        newval = (newval === 0) ? (obj.opacity * 100) : newval;
      }
      $('input#opacity-range').val("").val(newval+"%");
    });
    //END color opacity with selected object
    //Line opacity range start
    $('input#line-opacity-range').on('keypress', function(event){
      return (
        event.keyCode == 8 || 
        event.keyCode == 46 ||
        (event.keyCode >= 37 && event.keyCode <= 40) ||
        (event.charCode >= 48 && event.charCode <= 57)
      );
    }).keyup(function(){
      var newval = parseInt($('input#line-opacity-range').val());
      if(newval === 0){
        FnNewFolderModal();
        FnDefaultModal('<p>Zero opacity is not supported via the Opacity slider.<br><br>To completely hide a layer, please utilize the<br><br>visibility feature in the Layers palette.</p>');
      }
      else {
        var obj = canvas.getActiveObject();
        if(obj){
          obj.set({
            opacity: (newval/100),
            dynamic_opacity_range: (newval/100),
          });
          canvas.renderAll();
          $('#dynamic-opacity-range').val(newval);
          $('input#opacity-range').val(newval)
          $('input[type="range"]').rangeslider('update', true);
        }
      }
    }).blur(function() {
      var newval = parseInt($('input#line-opacity-range').val());
      var obj = canvas.getActiveObject();
      if(obj){
        newval = (newval === 0) ? (obj.opacity * 100) : newval;
      }
      $('input#opacity-range').val("").val(newval+"%");
      $('input#line-opacity-range').val("").val(newval+"%");
    });
    //Line opacity range END
    //applying image opacity with selected image object
    $("#dynamic-image-opacity-range").change(function(){
      var newval = $(this).val();
      jQuery("#image-opacity-range").val(newval+"%");
      var obj = canvas.getActiveObject();
      if(obj){
        obj.set({
          opacity: (newval/100),
          dynamic_image_opacity_range: (newval/100),
        });
        canvas.renderAll();
      }
    });
    $('input#image-opacity-range').on('keypress', function(event){
      return (
        event.keyCode == 8 || 
        event.keyCode == 46 ||
        (event.keyCode >= 37 && event.keyCode <= 40) ||
        (event.charCode >= 48 && event.charCode <= 57)
      );
    }).keyup(function(){
      var newval = parseInt($('input#image-opacity-range').val());
      if(newval === 0){
        FnNewFolderModal();
        FnDefaultModal('<p>Zero opacity is not supported via the Opacity slider.<br><br>To completely hide a layer, please utilize the<br><br>visibility feature in the Layers palette.</p>');
      }
      else {
        var obj = canvas.getActiveObject();
        if(obj){
          obj.set({
            opacity: (newval/100),
            dynamic_image_opacity_range: (newval/100),
          });
          canvas.renderAll();
          $('#dynamic-image-opacity-range').val(newval);
          $('input[type="range"]').rangeslider('update', true);
        }
      }
    }).blur(function() {
      var newval = parseInt($('input#image-opacity-range').val());
      var obj = canvas.getActiveObject();
      if(obj){
        newval = (newval === 0) ? (obj.opacity * 100) : newval;
      }
      $('input#image-opacity-range').val("").val(newval+"%");
    });
    //END color opacity with selected object
    //applying rectangle corner with selected object
    $("#dynamic-corner-range").change(function(){
      var newval = $(this).val();
      jQuery("#corner-range").val(newval);
      var obj = canvas.getActiveObject();
      if(obj && obj.type == "Rectshape"){
        obj.set({
          rx: newval,
          ry: newval,
          dynamic_corner: newval,
        });
        canvas.renderAll();
      }
    });
    $('input#corner-range').on('keypress', function(event){
      return (
        event.keyCode == 8 || 
        event.keyCode == 46 ||
        (event.keyCode >= 37 && event.keyCode <= 40) ||
        (event.charCode >= 48 && event.charCode <= 57)
      );
    }).keyup(function(){
      var newval = parseInt($('input#corner-range').val());
      var obj = canvas.getActiveObject();
      if(obj && obj.type == "Rectshape"){
        obj.set({
          rx: newval,
          ry: newval,
          dynamic_corner: newval,
        });
        canvas.renderAll();
        $('#dynamic-corner-range').val(newval);
        $('input[type="range"]').rangeslider('update', true);
      }
    });
    //applying image corner with selected object
    $("#dynamic-image-corner-range").change(function(){
      var obj = canvas.getActiveObject();
      if(obj && obj.type == "image"){
        var newval = $(this).val();
        //obj.clipTo = roundedImageCorners.bind(obj);
        var rxw = (((obj.width/2)*newval)/100);
        var ryh = (((obj.height/2)*newval)/100);
        obj.clipTo = function(obj) {
          var rect = new fabric.Rect({
            left:0,
            top:0,
            rx:rxw,
            ry:ryh,
            width:this.width,
            height:this.height,
            fill:'#000000'
          });
          rect._render(obj, false);
        };
        obj.dynamicImageCorner = newval;
        obj.dynamicImageCornerrxw = rxw;
        obj.dynamicImageCornerryh = ryh;
        canvas.renderAll();
        jQuery("#corner-input").val(newval);
      }
    });
    $('input#corner-input').on('keypress', function(event){
      return (
        event.keyCode == 8 || 
        event.keyCode == 46 ||
        (event.keyCode >= 37 && event.keyCode <= 40) ||
        (event.charCode >= 48 && event.charCode <= 57)
      );
    }).keyup(function(){
      var newval = parseInt($('input#corner-input').val());
      var obj = canvas.getActiveObject();
      if(obj && obj.type == "image"){
        $('#dynamic-image-corner-range').val(newval);
        $('input[type="range"]').rangeslider('update', true);
        //obj.clipTo = roundedImageCorners.bind(obj);
        var rxw = (((obj.width/2)*newval)/100);
        var ryh = (((obj.height/2)*newval)/100);
        obj.clipTo = function(obj) {
          var rect = new fabric.Rect({
            left:0,
            top:0,
            rx:rxw,
            ry:ryh,
            width:this.width,
            height:this.height,
            fill:'#000000'
          });
          rect._render(obj, false);
        };
        obj.dynamicImageCorner = newval;
        obj.dynamicImageCornerrxw = rxw;
        obj.dynamicImageCornerryh = ryh;
        canvas.renderAll();
      }
    });
    //END rectangle corner with selected object
    //Start template Tags
    var tagsList = [];
    var getTagsList = media_base_url+'/tokendata?_format=json';
    var url_data = {vid : "template_tags"}
    $.getJSON(getTagsList, url_data, function( tokenlist ) {
      $.each(tokenlist, function(key, val) {
        tagsList.push(val.name);
      });
      tagsList = tagsList.join(',');
    });
    var templateTags = $('#template-tags').magicSuggest({
      data: ['Crone','Canvas','Object']
      //data: tagsList,
    });
    templateTags.setData(tagsList)
    $(templateTags).on('selectionchange', function(){
      templateAddedTags  = this.getValue();
    });
    //END template Tags
    //Start template Description
    $('#template-descriptions').keyup(function (e) {
       var desc = $(this).val();
       var maxLength = 82;
       if (desc.length > maxLength) {
         $(this).val(desc.substring(0, (maxLength)));
         e.preventDefault();
         return;
       }
       else {
         templateAddedDescriptions = $(this).val();
       }
    });
    //End template Description
    //ColorPicker code Start
      jQuery("input[type='color']").addClass('jsscolor');
      jQuery("input[type='color']").each(function(){
        this.type = 'text';
      });
      //jQuery("input.jsscolor").click(function(){
      var top_minus = 0;
      jQuery("input.jsscolor").mousedown(function(){
        jQuery("input.jsscolor").removeClass('active');
        jQuery(this).addClass('active');
        var data_pro = jQuery(this).attr('data-pro');
        var position = jQuery(this).offset();
        var windowHeight = window.innerHeight;
        if(parseInt(windowHeight) < parseInt(position.top + 308)){
          top_minus = 315;
        }
        else {
          top_minus = 0;
        }
        //var old_color = jQuery('input.jsscolor.active').val();
        /*var activepage = jQuery('.page-row.g-active').attr('id');
        var activePageObj = canvas.getItemById(activepage);
        var old_page_color = (activePageObj.backgroundColor) == '' ? '#ffffff' : activePageObj.backgroundColor;*/
        if(data_pro == 'canvas'){
          var old_page_color = jQuery('.page-row.g-active').attr('old_page_color');
        }
        else {
          var obj = canvas.getActiveObject();
          if(data_pro == 'kmdsshapefill'){
            if(obj.oldkmdsshapefill){
              old_page_color = obj.oldkmdsshapefill;
            }
            else {
              old_page_color = obj.fill;
              obj.set({
                oldkmdsshapefill: old_page_color
              });
              canvas.renderAll();
            }
          }
          else if(data_pro == 'kmdsshapeborder'){
            if(obj.oldkmdsshapeborder){
              old_page_color = obj.oldkmdsshapeborder;
            }
            else {
              old_page_color = obj.stroke;
              obj.set({
                oldkmdsshapeborder: old_page_color
              });
              canvas.renderAll();
            }
          }
          else if(data_pro == 'kmdstextcolor'){
            if(obj.oldkmdstextcolor){
              old_page_color = obj.oldkmdstextcolor;
            }
            else {
              old_page_color = obj.fill;
              obj.set({
                oldkmdstextcolor: old_page_color
              });
              canvas.renderAll();
            }
          }
          else if(data_pro == 'textst'){
            var data_value = jQuery(this).attr('data-value');
            if(data_value == 'fill'){
              if(obj.oldtextstfill){
                old_page_color = obj.oldtextstfill;
              }
              else {
                old_page_color = obj.fill;
                obj.set({
                  oldtextstfill: old_page_color
                });
                canvas.renderAll();
              }
            }
            else if(data_value == 'stroke'){
              if(obj.oldtextststroke){
                old_page_color = obj.oldtextststroke;
              }
              else {
                old_page_color = obj.stroke;
                obj.set({
                  oldtextststroke: old_page_color
                });
                canvas.renderAll();
              }
            }
          }
          else if(data_pro == 'textpro'){
            var data_value = jQuery(this).attr('data-value');
            if(data_value == 'backgroundColor'){
              if(obj.oldtextstbackgroundColor){
                old_page_color = obj.oldtextstbackgroundColor;
              }
              else {
                old_page_color = obj.backgroundColor;
                obj.set({
                  oldtextstbackgroundColor: old_page_color
                });
                canvas.renderAll();
              }
            }
            else if(data_value == 'textBackgroundColor'){
              if(obj.oldtextBackgroundColor){
                old_page_color = obj.oldtextBackgroundColor;
              }
              else {
                old_page_color = obj.textBackgroundColor;
                obj.set({
                  oldtextBackgroundColor: old_page_color
                });
                canvas.renderAll();
              }
            }
          }
        }
        jQuery('input.jsscolor.active').attr("old_color", old_page_color);
      });
      var colors = jQuery('input.jsscolor').colorPicker({
        position: 'left',
        customBG: '#222',
        readOnly: true,
        //delayOffset: 8, // pixels offset when shifting mouse up/down inside input fields before it starts acting as slider
        CSSPrefix: 'cp-', // the standard prefix for (almost) all class declarations (HTML, CSS)
        size: 3, // one of the 4 sizes: 0 = XXS, 1 = XS, 2 = S, 3 = L (large); resize to see what happens...
        allMixDetails: true, // see Colors...
        noAlpha: true, // disable alpha input (all sliders are gone and current alpha therefore locked)
        init: function(elm, colors) {
          // colors is a different instance (not connected to colorPicker)
          elm.style.backgroundColor = elm.value;
          elm.style.color = elm.value;
        },
        margin: {left: -400, top: 0},
        actionCallback: function(elm, action){// callback on any action within colorPicker (buttons, sliders, ...)
          if(action == 'saveAsBackground' || action == 'external'){
            var selected_color = '#'+jQuery('.cp-app .cp-HEX .cp-disp').text();
            jQuery('input.jsscolor.active').val(selected_color);
            var data_pro = jQuery('input.jsscolor.active').attr('data-pro');
            applyCanvasObjectColor(data_pro, selected_color);
            if(action == 'saveAsBackground'){
              //jQuery('.cp-app').hide('fast');
              //jQuery('.cp-app').remove();
              var colorPickers = $.fn.colorPicker.colorPickers;
              var colorPicker = colorPickers.current;
              $colorPicker = $(colorPicker ? colorPicker.nodes.colorPicker : undefined);
              $colorPicker.hide(0);
              $(':focus').trigger('blur');
            }
          }
          else if(action == 'changeXYValue'){
            var selected_color = jQuery('input.jsscolor.active').val();
            var data_pro = jQuery('input.jsscolor.active').attr('data-pro');
            applyCanvasObjectColor(data_pro, selected_color);
          }
          else if(action == 'resetColor'){
            var old_color = jQuery('input.jsscolor.active').attr("old_color");
            jQuery('input.jsscolor.active').val(old_color);
            jQuery("input.jsscolor.active").css("background-color", old_color);
            var data_pro = jQuery('input.jsscolor.active').attr('data-pro');
            var colorPickers = $.fn.colorPicker.colorPickers;
            var colorPicker = colorPickers.current;
            colorPicker.setColor(old_color, undefined, undefined, true);
            //colorPicker.saveAsBackground();
            applyCanvasObjectColor(data_pro, old_color, 'resetColor');
          }
          //console.log("action: "+action);
          //console.log("top_minus: "+top_minus);
          var colorPickers = $.fn.colorPicker.colorPickers;
          var colorPicker = colorPickers.current;
          if(colorPicker){
            colorPicker.color.options.margin.top = -top_minus;
            var cp_top = parseInt(jQuery('.cp-app').css('top'));
            //jQuery('.cp-app').css('top', parseInt(cp_top-top_minus));
          }
        }
        // appendTo: document.querySelector('.samples')
      }).each(function(idx, elm) {
        // $(elm).css({'background-color': this.value})
      });
      document.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          var colorPickers = $.fn.colorPicker.colorPickers;
          var colorPicker = colorPickers.current;
          $colorPicker = $(colorPicker ? colorPicker.nodes.colorPicker : undefined);
          $colorPicker.hide(0);
          $(':focus').trigger('blur');
        }
      });
    //DPI change by user
		$('#kmds-dpi').keypress(function(event){
      var keycode = (event.keyCode ? event.keyCode : event.which);
			if(keycode == 13){
	      if (!$.isNumeric($('#kmds-dpi').val())) {
          var dpi = jQuery('#kmds-dpi').attr("preset-value") ? jQuery('#kmds-dpi').attr("preset-value") : fabric.DPI;
          jQuery('#kmds-dpi').val(parseInt(dpi));
          return;
        }
        var design_id = getUrlDesignID();
        if (design_id == '') {
          var dpi = jQuery('#kmds-dpi').attr("preset-value") ? jQuery('#kmds-dpi').attr("preset-value") : fabric.DPI;
          jQuery('#kmds-dpi').val(parseInt(dpi));
          FnNewFolderModal();
          FnDefaultModal('Please save the template before enter DPI/PPI.');
          return;
        }
        else {
          var fabricDPI = jQuery('#kmds-dpi').val();
          //var presetValue = jQuery("#kmds-dpi").attr("preset-value");
          fabric.DPI = fabricDPI;
          var activepage = jQuery('.page-row.g-active').attr('id');
          var activePageObj = canvas.getItemById(activepage);
          if(activePageObj){
            activePageObj.set({
              fabricDPI: fabricDPI,
            });
          }
          $('.toolbarPanel_4.d-block').append('<div class="progress-overlay toolbarPanel_4-overlay"><div class="spinner-border"></div></div>');
          var page_settings = {'fabricDPI' : fabricDPI};
          updateTemplatePresetName(page_settings);
        }
      }
		});
	}
/**
 * Callback function applyDynamicImageCorner()
 * to add radios in image object
 **/
function applyDynamicImageCorner() {
  var active_page_object = canvas._objects;
  active_page_object.forEach(function(obj) {
    if(obj.type == 'image'){
      if(obj.dynamicImageCorner){
        var newval = obj.dynamicImageCorner;
        obj.clipTo = function(ctx) {
          var rect = new fabric.Rect({
            left:0,
            top:0,
            rx:this.dynamicImageCornerrxw,
            ry:this.dynamicImageCornerryh,
            //rx:this.dynamicImageCornerrxw / this.scaleX,
            //ry:this.dynamicImageCornerryh / this.scaleY,
            width:this.width,
            height:this.height,
            fill:'#000000'
          });
          rect._render(ctx, false);
        };
        canvas.renderAll();
      }
    }
  });
}
/**
 * Callback function roundedImageCorners()
 * to add radios in image object
 **/
function roundedImageCorners(ctx) {
  var range = $("#corner-track input").val();
  var rect = new fabric.Rect({
    left:0,
    top:0,
    rx:range / this.scaleX,
    ry:range / this.scaleY,
    width:this.width,
    height:this.height,
    fill:'#000000'
  });
  rect._render(ctx, false);
}

function toggleLeftLayers(e){
	var p = $('#pages-container')[0].scrollHeight;
	var n = $('#navbar-top')[0].scrollHeight;
	var left = $('#left-sidebar').height();
	var layerheight = 220;
	if(p == 0 && n == 0){
		//console.log(1);
		var val = parseInt(layerheight) + parseInt(168);
		var vh = (100 * val) / window.innerHeight;
		$('#left-sidebar .layers-container').height(vh+'vh');
	} else if(p == 0 && n != 0){
		//console.log(2);
		var val = parseInt(layerheight-30);
		var vh = (100 * val) / window.innerHeight;
		$('#left-sidebar .layers-container').height(vh+'vh');
	} else if(p != 0 && n != 0){
		//console.log(3);
		var val = parseInt(layerheight-30) + parseInt(168);
		var vh = (100 * val) / window.innerHeight;
		$('#left-sidebar .layers-container').height(vh+'vh');
	} else {
		//console.log(4);
		var val = parseInt(layerheight) + parseInt(168) + parseInt(76);
		var vh = (100 * val) / window.innerHeight;
		$('#left-sidebar .layers-container').height(vh+'vh');
	}
}

function toggleNavHeader(e){
	$('#navbar-top').toggle(1000);
	$(e).toggleClass('fa-rotate-180');
	var h = window.height;
	var p = $('#pages-container')[0].scrollHeight;
	var layerheight = 220;

	if($(e).hasClass('fa-rotate-180')){
		$('ul.g-menu.g-menu-bottom.fixed').css('top', '165px');
		//var rval = parseInt(h-20);
		//var rvh = (100 * rval) / window.innerHeight;
		$('#sidebar-container').css('height', 'calc(100vh - 190px)');
		if(p == 0){
			//console.log(11);
			var val = parseInt(layerheight) + parseInt(168);
			var vh = (100 * val) / window.innerHeight;
			$('#left-sidebar .layers-container').height(vh+'vh');
		} else {
			//console.log(12);
			var val = parseInt(layerheight-20);
			var vh = (100 * val) / window.innerHeight;
			$('#left-sidebar .layers-container').height(vh+'vh');
		}
	} else {
		$('ul.g-menu.g-menu-bottom.fixed').css('top', '89px');
		//var rval1 = parseInt(h-30) + parseInt(76);
		//var rvh1 = (100 * rval1) / window.innerHeight;
		$('#sidebar-container').css('height', 'calc(100vh - 115px)');
		if(p == 0){
			//console.log(21);
			var val = parseInt(layerheight) + parseInt(158)+parseInt(76);
			var vh = (100 * val) / window.innerHeight;
			$('#left-sidebar .layers-container').height(vh+'vh');
		} else {
			//console.log(22);
			var val = parseInt(layerheight-30) + parseInt(76);
			var vh = (100 * val) / window.innerHeight;
			$('#left-sidebar .layers-container').height(vh+'vh');
		}
	}
}

function openTransformBlock(e) {
	$(e).toggleClass('g-active');
	$('.toolbarPanel_2').toggleClass('d-none');
}
	
function openCornerBlock(){
	$('#corner-type').toggle('d-none');
}
	
function FntemplateSwitch(e){
	$('#header .tabs .tab.g-active').removeClass('g-active');
	$('#layers .template-group.group-active').addClass('d-none').removeClass('group-active');
	var clickedTab = $(e).parent('.tab');
	clickedTab.addClass('g-active');
	var clickedTabId = clickedTab.attr('data-id');
	//alert('clickedTabId - '+clickedTabId);
	$('#layers #'+clickedTabId).addClass('group-active').removeClass('d-none');
	var DocDesign = $(e).attr('design');
	var tempid = $(e).attr('producTypeId');
	//alert('switch template tempid - '+ tempid);
	//alert('actual product id - '+ producTypeId);
	if(tempid !== '' || tempid !== null || typeof tempid !== 'undefined'){
    console.log('1');
		getProductName(tempid);	
	}
	var Doctitle = $(e).text();
	Doctitle = Doctitle.split('*')[0];
	document.title = Doctitle+' | KaboodleMedia';
	var Docurl = window.location.href;
	if(DocDesign === 'untitled' || typeof DocDesign === 'undefined'){
		canvas.clear();
		Docurl = Docurl.split('?')[0];
		window.history.pushState("object or string", 'title', Docurl );
	} else if(DocDesign !== 'untitled' || typeof DocDesign !== 'undefined'){
		queryString.push('d', DocDesign);
    addrulernew(ixx, iyy);
    //console.log('20');
		//get_check_user_access(uid, name, email);
    //location.reload();
    //getDesignData(DocDesign, 'switch'); //load design data on canvas
	}		
}

function FntemplateClose(e){
	var Docurl = window.location.href;
	var designId = $(e).attr('designid');
	var dataId = $(e).parent('.tab').attr('data-id');
	var tablength = $('#header .tabs .tab').length;
	$('#header .tabs .tab.g-active').removeClass('g-active');
	$('#layers #'+dataId).remove();
	if((designId === 'untitled' || typeof designId === 'undefined') && tablength === 1){
		//alert(11);
		$('#header .tabs .tab').remove();
		document.title = 'Untitled | KaboodleMedia';
		$('#modal').modal('show');
		canvas.clear();
		//reset canvas
	} else if((designId !== 'untitled' || typeof designId !== 'undefined') && tablength === 1){
		//alert(2);
		Docurl = Docurl.split('?')[0];
		window.history.pushState("object or string", 'title', Docurl );
		document.title = 'Untitled | KaboodleMedia';
		$('#header .tabs .tab').remove();
		$('#layers .template-group.group-active').remove();
		$('#modal').modal('show');
		canvas.clear();
		//reset canvas
	} else if((designId === 'untitled' || typeof designId === 'undefined') && tablength > 1){
		var prevtab = $(e).parent('.tab').prev('.tab');
		var prevtabid = prevtab.attr('data-id');
		var nexttab = $(e).parent('.tab').next('.tab');
		var nexttabid = nexttab.attr('data-id');
		if(prevtab.length == 1){
			prevtab.addClass('g-active');	
			$('#layers .template-group.group-active').addClass('d-none').removeClass('group-active');
			$('#layers #'+prevtabid).addClass('group-active').removeClass('d-none');
		} else if(nexttab.length == 1){
			nexttab.addClass('g-active');	
			$('#layers .template-group.group-active').addClass('d-none').removeClass('group-active');
			$('#layers #'+nexttabid).addClass('group-active').removeClass('d-none');			
		}
		$(e).parent('.tab').remove();
		var s = $('#header .tabs .tab.g-active span.title').attr('design');
		var st = $('#header .tabs .tab.g-active span.title').text();
		st = st.split('*')[0];
		//alert(s);
		if(s !== 'untitled' || typeof s !== 'undefined'){
			queryString.push('d', s);
			document.title = st+' | KaboodleMedia';
			getDesignData(s);
		} else {
			document.title = 'Untitled | KaboodleMedia';
			canvas.clear();
		}
	} else if((designId !== 'untitled' || typeof designId !== 'undefined') && tablength > 1){
		var prevtab = $(e).parent('.tab').prev('.tab');
		var prevtabid = prevtab.attr('data-id');
		var nexttab = $(e).parent('.tab').next('.tab');
		var nexttabid = nexttab.attr('data-id');
		if(prevtab.length == 1){
			prevtab.addClass('g-active');	
			$('#layers .template-group.group-active').addClass('d-none').removeClass('group-active');
			$('#layers #'+prevtabid).addClass('group-active').removeClass('d-none');
		} else if(nexttab.length == 1){
			nexttab.addClass('g-active');	
			$('#layers .template-group.group-active').addClass('d-none').removeClass('group-active');
			$('#layers #'+nexttabid).addClass('group-active').removeClass('d-none');			
		}
		$(e).parent('.tab').remove();
		var s = $('#header .tabs .tab.g-active span.title').attr('design');
		var st = $('#header .tabs .tab.g-active span.title').text();
		st = st.split('*')[0];
		//alert(s);
		if(s !== 'untitled' || typeof s !== 'undefined'){
			queryString.push('d', s);
			document.title = st+' | KaboodleMedia';
			getDesignData(s); //reload canvas
		} else {
			document.title = 'Untitled | KaboodleMedia';
			canvas.clear();
		}
	}
	var tempid = $('#header .tabs .tab.g-active span.title').attr('producTypeId');
  console.log('2');
	getProductName(tempid);	
}

function canvasInit() {
	MAX_WIDTH = $('#canvas-width').val();
	MAX_HEIGHT = $('#canvas-height').val();	
}
  
function addtextallow() {
	drawmode = true;
  right_panels_text_activities();
	canvas.selection = false;
	draw();
	changeSelectableStatus(false);
}
/**
 * Callback function right_panels_text_activities()
 * to displayed or hide the panelsd
 * for textbox object.
 */
function right_panels_text_activities(){
  $('.toolbar.main-toolbar').addClass('d-flex');
	$('.toolbarPanel_1').removeClass('d-none').addClass('d-block');
	$('.properties-panel.main-toolbar').addClass('d-block');
	$('.toolbar.page-toolbar').removeClass('d-flex').addClass('d-none');
	$('.properties-panel.page-properties-panel').removeClass('d-block').addClass('d-none');
  $('.toolbarPanel_3').removeClass('d-block').addClass('d-none');
  $('.toolbarPanel_4').removeClass('d-block').addClass('d-none');
  $('.toolbarPanel_7').removeClass('d-block').addClass('d-none');
	$('.toolbar.appearance-toolbar').addClass('d-flex');
  $('.toolbarPanel_5').removeClass('d-none').addClass('d-block');
  var obj = canvas.getActiveObject();
  if(obj){
    if(obj.type === 'Lineshape' || obj.type === 'circle' || obj.type === 'Rectshape' || obj.type === 'triangle'){
      $('.toolbarPanel_5_1').removeClass('d-none').addClass('d-block');
      if(obj.type === 'Lineshape'){
        $('.toolbarPanel_5_1 .appearance-properties-panel .fills-properties-panel').addClass('d-none');
        $('.toolbarPanel_5_1 .fills-toolbar').addClass('d-none');
        $('.toolbarPanel_5_1 .borders-toolbar .flex-grow').html('Line&nbsp;<i class="right-label fas fa-caret-down"></i>');
        $('.toolbarPanel_5_1 .line-cap-container').removeClass('d-none').addClass('d-flex');
      }
      else {
        $('.toolbarPanel_5_1 .appearance-properties-panel .fills-properties-panel').removeClass('d-none');
        $('.toolbarPanel_5_1 .fills-toolbar').removeClass('d-none');
        $('.toolbarPanel_5_1 .borders-toolbar .flex-grow').html('Borders&nbsp;<i class="right-label fas fa-caret-down"></i>');
        $('.toolbarPanel_5_1 .line-cap-container').removeClass('d-flex').addClass('d-none');
      }
    }
  }
	$('.toolbarPanel_6').removeClass('d-none').addClass('d-block');
  enabledDynamicDataSection();
	$('.properties-panel .appearance-property-panel.image-properties-panel').removeClass('d-block');
  $(".appearance-toolbar button").removeClass("d-none");
	$('.properties-panel .appearance-property-panel.text-properties-panel').removeClass('d-none').addClass('d-block');
}
function changeSelectableStatus(val) {
	canvas.forEachObject(function(obj) {
		if(obj.type !== 'page'){
			obj.selectable = val;
		}
	})
	canvas.renderAll();
}

function draw() {
  activeLayerID = $("#layers .template-group .layer-row.g-active").attr("id");
	canvas.on('mouse:down', onMouseDown);
	canvas.on('mouse:move', onMouseMove);
	canvas.on('mouse:up', onMouseUp);
}

function commonOnfreeDrawObjects(downFn, moveFn, upFn){
	//var activePage = $('.page-row.g-active').attr('id');
	if(activePage){
		if($('#pages #'+activePage+' .page-lock-icon').hasClass('fa-lock')){
			$('button.action-button.g-active').removeClass('g-active');
			return;
		}
	}
	var data_title = $('button.action-button.g-active').attr('data-title');
  if(handSelected == true){
		canvas.selection = true;
		canvas.off('mouse:down', downFn);
		canvas.off('mouse:move', moveFn);
		canvas.off('mouse:up', upFn);
		changeSelectableStatus(true);
		DisableRightProperties();
		DisableActionToolbar();
		return;
	}
	EnableRightProperties();	
	EnableActionToolbar();
  isDown = true;
	//var activepage = $('.page-row.g-active').attr('id');
	if($('.layer-row.parent-layer').hasClass('g-active')){
		activeLayer = $('.layer-row.parent-layer.g-active').attr('id');
		activeLayerTitle = $('.layer-row.parent-layer.g-active .layer-title').text();
		parentlayerOrder = $('.layer-row.parent-layer.g-active').attr('order');
	} else if($('.layer-row.parent-layer').hasClass('g-has-selection')){
		activeLayer = $('.layer-row.parent-layer.g-has-selection').attr('id');
		activeLayerTitle = $('.layer-row.parent-layer.g-has-selection .layer-title').text();
		parentlayerOrder = $('.layer-row.parent-layer.g-has-selection').attr('order');
	} else {
		activeLayer = '';
		activeLayerTitle = '';
		parentlayerOrder = '';
	}
}

function onMouseDown(o) {
	var data_title = $('button.action-button.g-active').attr('data-title');
	var layer_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  commonOnfreeDrawObjects(onMouseDown, onMouseMove, onMouseUp);
	var pointer = canvas.getPointer(o.e);
  origX = pointer.x;
  origY = pointer.y;
  var fs = document.getElementById("text-font-size");
  var ff = document.getElementById("font-family");
  var fst = document.getElementById("fstyle");
  var fontFamily = ff.options[ff.selectedIndex].value;
  // var fontSize = fs.options[fs.selectedIndex].value;
  var fontSize = $('#text-font-size').val();
  var fstyle = fst.options[fst.selectedIndex].value;
  var fontweight = fstyle.split('#')[0];
  var fontStyle = 'normal';
  if(fstyle.split('#')[1] == 'N'){
    fontStyle = 'normal';
  }if(fstyle.split('#')[1] == 'I'){
    fontStyle = 'italic';
  }
  var align = $('.align.g-active').val();
  var valign = $('.valign.g-active').val();
  var charspacing = $('#char-spacing').val();  
  var wspacing = $('#word-spacing').val();
  var color = $('#textst-fill').val();
  var tBg = $('#textpro-bg').val();
	(tBg == '#ffffff') ? tBg = '' : tBg = tBg;
  var ttBg = $('#textpro-tbg').val();
	(ttBg == '#ffffff') ? ttBg = '' : ttBg = ttBg;
  var stcolor = $('#textst-stock').val();
  var underline = linethrough = false;
  ($('#text-cmd-underline').hasClass('g-active')) ? underline = true : underline = false;
  ($('#text-cmd-linethrough').hasClass('g-active')) ? linethrough = true : linethrough = false;
  
  /*textSample1 = new fabric.Textbox('Your text here', {
    left: origX,
    top: origY,
		actualLeft: origX,
		actualTop: origY,
    name: 'Text',
    id: layer_id,
		page: activePage,
		layerGroup: activeLayer,
		layerGroupTitle: activeLayerTitle,
		parentlayerOrder: parentlayerOrder,
    fill: color,
    fontSize: fontSize,
   	// fstext: fontSize,
    fontFamily: fontFamily,
    fontWeight: fontweight,
    textAlign: align,
    verticalAlign: valign,
    fontStyle: fontStyle,
    underline: underline,
    linethrough: linethrough,
		backgroundColor: tBg,
    textBackgroundColor: ttBg,
    stroke: stcolor,
    charSpacing: charspacing,
    //shadow: '',
    strokeWidth: 0,
    originX: 'left',
    hasRotatingPoint: true,
    centerTransform: true,
    selectable: false,
  });*/

  textSample = new fabric.Textbox('Your text here', {
    left: origX,
    top: origY,
		actualLeft: origX,
		actualTop: origY,
    name: 'Text',
    id: layer_id,
		page: activePage,
		layerGroup: activeLayer,
		layerGroupTitle: activeLayerTitle,
		parentlayerOrder: parentlayerOrder,
    fill: '#000000',
    fontSize: 24,
   	// fstext: fontSize,
    fontFamily: "Open Sans",
    fontWeight: "400",
    textAlign: align,
    verticalAlign: valign,
    fontStyle: "normal",
    underline: underline,
    linethrough: linethrough,
		backgroundColor: '',
    textBackgroundColor: ttBg,
    stroke: stcolor,
    charSpacing: charspacing,
    //shadow: '',
    strokeWidth: 0,
    originX: 'left',
    hasRotatingPoint: true,
    centerTransform: true,
    selectable: false,
  });
  canvas.add(textSample);
  canvas.renderAll();
	isMoving = true;
  var selectedObj = o.target;
  if (selectedObj != null) {
    canvas.clearContext(canvas.contextTop)
  }
  add_layer(layer_id, 'Text', 'textbox', activePage, activeLayer, '');
	layerReordering();
  updateProperties(o);
	if(data_title === 'Text'){
    $('button.action-button.g-active').removeClass('g-active');
  }
}


function onMouseMove(o) {
	if (!isDown) return;
	//$( ".canvas-container" ).addClass( "g-cursor-draw" );
	var pointer = canvas.getPointer(o.e);
	if (origX > pointer.x) {
		textSample.set({
			left: Math.abs(pointer.x)
		});
	}
	if (origY > pointer.y) {
		textSample.set({
			top: Math.abs(pointer.y)
		});
	}

	textSample.set({
		width: Math.abs(origX - pointer.x)
	});
	textSample.set({
		height: Math.abs(origY - pointer.y)
	});
	
	canvas.clearContext(canvas.contextTop);
	textSample._renderControls(canvas.contextTop, {
		hasControls: false
	});
	canvas.renderAll();
	
//updating right properties on mouse move for text
	//var prop_x = new setProperties('pos-x', Math.round(textSample.left));
	//var prop_y = new setProperties('pos-y', Math.round(textSample.top));
  var textSampleCoords = textSample.getBoundingRect(true, true);
	var prop_x = new setProperties('pos-x', Math.round(textSampleCoords.left - leftmargin));
	var prop_y = new setProperties('pos-y', Math.round(textSampleCoords.top - topmargin));
	var prop_w = new setProperties('size-width', Math.round(textSample.width));
	var prop_h = new setProperties('size-height', Math.round(textSample.height));
	var prop_angle = new setProperties('angle', Math.round(textSample.angle));
	prop_x.properties();				
	prop_y.properties();
	prop_w.properties();				
	prop_h.properties();  
	prop_angle.properties();
}

function onMouseUp(o) {
  textSample.setCoords();
  isDown = false;
  isMoving = false;
	drawmode = false;
  DrawingRectangle = false;
  canvas.selection = true;
	canvas.off('mouse:down', onMouseDown);
	canvas.off('mouse:move', onMouseMove);
	canvas.off('mouse:up', onMouseUp);
  changeSelectableStatus(true);
  canvas.renderAll();
	updateCanvasState();
  canvas.setActiveObject(textSample);
}

function updateProperties(e){
	var activeObject = e.target;
	if (!activeObject) {
		return;
	}
	if (activeObject.lock_position === 1) {
    activeObject.lockMovementX = true;
    activeObject.lockMovementY = true;
    activeObject.lockScalingX = true;
    activeObject.lockScalingY = true;
    activeObject.lockRotation = true;
    activeObject.selectable = false;
    activeObject.hasControls = false;
    activeObject.hasBorders = false;
    canvas.renderAll();
    //console.log("updateProperties locked again");
		return;
	}
  if (activeObject.type == 'line' || activeObject.type == 'guideline') {
		return;
	}
  if (activeObject.type == 'textbox') {
    //this attribute used to delete token
    activeObject.set({
      old_text: activeObject.text,
    });
    canvas.renderAll();
	}
  //console.log("updateProperties: "+activeObject.type);
  var objScaleX = parseFloat(activeObject.scaleX).toFixed(2);
  var objScaleY = parseFloat(activeObject.scaleY).toFixed(2);
	var width = parseFloat(activeObject.width * objScaleX).toFixed(2);
  //console.log("Obj width: "+width);
	var height = parseFloat(activeObject.height * objScaleY).toFixed(2);
  //console.log("Obj height: "+height);
  activeObject.set({
    'scaleX'     : objScaleX,
    'scaleY'     : objScaleY,
  });
  canvas.renderAll();
	var rotation = activeObject.angle;
	//var prop_x = new setProperties('pos-x', Math.round(activeObject.left));
	//var prop_y = new setProperties('pos-y', Math.round(activeObject.top));
  var activeObjectCoords = activeObject.getBoundingRect(true, true);
	var prop_x = new setProperties('pos-x', Math.round(activeObjectCoords.left - leftmargin));
	var prop_y = new setProperties('pos-y', Math.round(activeObjectCoords.top - topmargin));
	var prop_w = new setProperties('size-width', width);
	var prop_h = new setProperties('size-height', height);
	//var prop_w = new setProperties('size-width', Math.round(width));
	//var prop_h = new setProperties('size-height', Math.round(height));
	var prop_angle = new setProperties('angle', Math.round(rotation));
	prop_x.properties();				
	prop_y.properties();
	prop_w.properties();				
	prop_h.properties();  
	prop_angle.properties();
  //Insert Object Angle value in field
  //$('#angle').val(activeObject.angle);
	//update page actual top/left
	if(multipageToggle == false){
		activeObject.set({
			actualLeft: activeObject.left,
			actualTop: activeObject.top,
		});
	}
  //To update Dynamic data section
  enabledDynamicDataSection();
  //console.log(JSON.stringify(activeObject))
  if(activeObject.type == 'ImageContainer' && typeof activeObject.containerImage !== 'undefined'){
    if(activeObject.containerImage !== ''){
      var containerImg = canvas.getItemById(activeObject.containerImage);
      if(containerImg){
        containerImg.set({
          'angle': activeObject.angle,
        });
        containerImg.setCoords();
        canvas.renderAll();
      }
    }
    else{
      var containerImg = canvas.getItemById("default"+activeObject.id);
      if(containerImg){
        containerImg.set({
          'angle': activeObject.angle,
        });
        containerImg.setCoords();
        canvas.renderAll();
      }
      //console.log(JSON.stringify(containerImg))
    }
  }
}

function ObjectScaling(e) { 
	//for scaling
	var obj = e.target,
	w = obj.width * obj.scaleX,
	h = obj.height * obj.scaleY,
	s = obj.strokeWidth;
  //console.log("width: "+obj.width+", scaleX : "+obj.scaleX+", h: "+h+", w: "+w+", s: "+s);
  if(obj){
    if(obj.type == 'ImageContainer' && typeof obj.containerImage !== 'undefined'){
      if(obj.containerImage !== ''){
        var containerImg = canvas.getItemById(obj.containerImage);
        var scaleX = w/containerImg.width;
        var scaleY = h/containerImg.height;
        containerImg.set({
          'top': obj.top,
          'left': obj.left,
          'scaleX': scaleX,
          'scaleY': scaleY,
        });
        containerImg.setCoords();
        canvas.renderAll();
      }
      else{
        var containerImg = canvas.getItemById("default"+obj.id);
        if(containerImg){
          containerImg.set({
            'top': obj.top,
            'left': obj.left,
          });
          containerImg.setCoords();
          canvas.renderAll();
        }
      }
    }
  }
	/*console.log(obj.width, obj.scaleX, h,w,s);
	
	 obj.set({
		'height': obj.width,
		'width': obj.height,
		'scaleX': 1,
		'scaleY': 1,
    'h': h,
		'w': w
	});
	canvas.renderAll();
	console.log(obj); */
  //console.log(JSON.stringify(obj));
}

function ObjectZoomInOut(option){
	var obj = canvas.getActiveObject();
	if (!obj) return;
	option.e.preventDefault();
	if (option.e.deltaY > 0) {
		obj.set({
			zoomX: obj.zoomX - 0.1,
			zoomY: obj.zoomY - 0.1
		});
	} else {
		obj.set({
			zoomX: obj.zoomX + 0.1,
			zoomY: obj.zoomY + 0.1
		});
	}
	canvas.renderAll();
}

function ImageProcessFn(file, activePage) {
  var reader = new FileReader();
  var filename = file.name;
  var ext = filename.substring(filename.lastIndexOf('.'));
  var basename = filename.split(ext)[0];
	var activepage = $('.page-row.g-active').attr('id');
	if($('.layer-row.parent-layer').hasClass('g-active')){
		var activeLayer = $('.layer-row.parent-layer.g-active').attr('id');
		var activeLayerTitle = $('.layer-row.parent-layer.g-active .layer-title').text();
		var parentlayerOrder = $('.layer-row.parent-layer.g-active').attr('order');
	} else if($('.layer-row.parent-layer').hasClass('g-has-selection')){
		var activeLayer = $('.layer-row.parent-layer.g-has-selection').attr('id');
		var activeLayerTitle = $('.layer-row.parent-layer.g-has-selection .layer-title').text();
		var parentlayerOrder = $('.layer-row.parent-layer.g-has-selection').attr('order');
	} else {
		var activeLayer = '';
		var activeLayerTitle = '';
		var parentlayerOrder = '';
	}
  reader.addEventListener("load", function () {
    var imgwidth = imgheight = '';
    const img = new Image();
    var imgsrc = reader.result;
    img.src = imgsrc;
    var layer_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		var pageObj = canvas.getItemById(activePage);

    img.onload = function(){
			if(this.width > pageObj.width){
				imgwidth = pageObj.width;
			} else {
				imgwidth = this.width;
			}
			
			if(this.height > pageObj.height){
				imgheight = pageObj.height;
			} else {
				imgheight = this.height;
			}
    };
    fabric.Image.fromURL(imgsrc, function(img) {
      img.set({
        left: pageObj.left,
        top: pageObj.top,
				actualLeft: pageObj.left,
				actualTop: pageObj.top,
        name: basename,
        originX: 'center',
        originY: 'center',
        id: layer_id,
				page: activepage,
				layerGroup: activeLayer,
				layerGroupTitle: activeLayerTitle,
				parentlayerOrder: parentlayerOrder,
      });
      img.scaleToHeight(imgheight);
      img.scaleToWidth(imgwidth);
      canvas.add(img).renderAll().setActiveObject(img);
			img.setCoords();
      add_layer(layer_id, basename, 'image', activepage, activeLayer, '');
			layerReordering();
      $('button.action-button.g-active').removeClass('g-active');
    });
  }, false);
  if (file) {
    reader.readAsDataURL(file);
  }
}

/**
 * Callback function onMouseDownp()
 * mouse down when page toggle active
 */
function onMouseDownp(e) { // this will work for only multipage functionality
  var obj = e.target;
  //console.log("Clicked = "+JSON.stringify(obj));
  if(multipageToggle == false){
    return;
  }
	if(multipageToggle == true && handSelected == true){    
	  return;
	}
  if(!obj){
    deactivatePage();
    return;
  }

  if(obj && obj.type !== 'text' && obj.type !== 'line' && obj.type !== 'guideline'){
    if(obj.type == 'page'){
      obj.set({
        hasControls: false,
        selectable: false,
        hasRotatingPoint: false,
        hasBorders: false,
      });
      canvas.renderAll();
      activate_page_layers(obj.id);
    } else {
      if(obj.type == 'activeSelection'){
        activate_page_layers(obj.page);
      } else {
        activate_page_layers(obj.page);
        deactivatePage();
      }
    }
  }
  else if(obj && obj.type == 'text'){
    activate_page_layers(obj.page);
		var label = $('#pages #'+obj.page+' .page-title').text();
    canvas.discardActiveObject().renderAll();
    if($('#pages #'+obj.page+' .page-lock-icon').hasClass('fa-unlock-alt') && ObjinterSection == false){
      activatePage(obj.page, label);
    }
  } else if(obj && obj.type !== 'activeSelection' && obj.type !== 'text' && obj.type !== 'line' && obj.type !== 'guideline'){
    deactivatePage();
  }
  else if(obj.type == 'PageMediaBox'){
    canvas.sendToBack(obj);
  }

}


/**
 * Callback function onMouseDownc()
 * Canvas mouse down event for dynamic data
 */
function onMouseDownc(e) {
  //console.log("onMouseDownc");
	var target = e.target;
	var groupCount = 0;
	var obj = canvas.getActiveObject();
	//canvas.discardActiveObject().renderAll();
	//canvas.setActiveObject(obj);
	
	/* if(canvas.getObjects().indexOf(activePageObj) !== 0){
		canvas.moveTo(activePageObj, 0);
		canvas.renderAll();
	} */
  if(!obj){
    return;
  }
  if(obj.lock_position === 1){
    return;
  }
  if(obj.type == 'activeSelection'){
    var objs = obj._objects.filter(function(o) {
      if(o.lock_position && o.lock_position == 1){
        return o;
      }
    });
    if(objs.length > 0){
      lockGroupLayerObjects();
    }
  }
	if(obj){
		obj.set({
			borderColor: "#2880E6",
		});
		updateProperties(obj);
		LayerActivation();
		if (window.event.shiftKey) {
			ShifPressed = true;
			if (obj.type == 'activeSelection'){
				canvas.getActiveObjects().forEach((obj) => {
					$('#layers #'+obj.id).addClass('g-active');
				});
			}
		}	

		//if(obj.type == 'group'){
		if(obj.type == 'group'){
			var groupId = obj.id;
			if(groupId){
				canvas.clearContext(canvas.contextTop);
				if(!($('#layers #'+groupId).hasClass('g-active'))){
					$('#layers #'+groupId).addClass('g-active');
					$('#layers #'+groupId).addClass('layerFolderHighlighted');
					$('.layer-row.parent-layer').removeClass('active-row');
					$('#tool-group').attr('disabled', 'disabled');
					$('#group_selection_caption').parent('.g-menu-item').addClass('g-disabled');
					$('#tool-ungroup').removeAttr('disabled');
					$('#ungroup_selection_caption').parent('.g-menu-item').removeClass('g-disabled');
				}
			}
		}

		if(target && target.type == 'ConnectorHandleStart'){
			//canvas.setActiveObject(target.shape); //make active to line shape object
			var end_handle = canvas.getItemById(target.end_handle);
			target.set({
				stroke: '#fff',
				fill: "#2880E6",
				selectable: true
			});
			target.setControlsVisibility({
				mt: false, 
				mb: false, 
				ml: false, 
				mr: false, 
				bl: false,
				br: false, 
				tl: false, 
				tr: false,
				mtr: false, 
			});
			
			end_handle.set({
				stroke: "#2880E6",   	
				fill: "#fff",
				selectable: true
			});	
			end_handle.setControlsVisibility({
				mt: false, 
				mb: false, 
				ml: false, 
				mr: false, 
				bl: false,
				br: false, 
				tl: false, 
				tr: false,
				mtr: false, 
			});			
		}
		if(target && target.type == 'ConnectorHandleEnd'){
			//canvas.setActiveObject(target.shape); //make active to line shape object
			var start_handle = canvas.getItemById(target.start_handle);
			target.set({
				stroke: '#fff',
				fill: "#2880E6",
				selectable: true
			});
			target.setControlsVisibility({
				mt: false, 
				mb: false, 
				ml: false, 
				mr: false, 
				bl: false,
				br: false, 
				tl: false, 
				tr: false,
				mtr: false, 
			});			
			
			start_handle.set({
				stroke: "#2880E6",   	
				fill: "#fff",
				selectable: true
			});	
			start_handle.setControlsVisibility({
				mt: false, 
				mb: false, 
				ml: false, 
				mr: false, 
				bl: false,
				br: false, 
				tl: false, 
				tr: false,
				mtr: false, 
			});	
		}

		if(obj.type == 'Lineshape'){
      var start_handle = canvas.getItemById(obj.start_handle);
      var end_handle = canvas.getItemById(obj.end_handle);
			start_handle.set({
				stroke: "#2880E6",   	
				fill: "#fff",
				opacity: 1, 
				selectable: true
			});
			end_handle.set({
				stroke: "#2880E6",   	
				fill: "#fff", 
				opacity: 1,				
				selectable: true
			});
			//obj.set('stroke', '#2880E6');
			//obj.set('fill', '#2880E6');
			canvas.renderAll();
		}
		
		/*if(obj.type == 'circle'){
			obj.set({
				stroke: "#2880E6",
			});
		}*/
		
		if (obj.type !== 'page' && obj.type !== 'text' && obj.type !== 'group' && obj.type !== 'guideline' && obj.type !== 'line' && obj.type !== 'Lineshape' && obj.type !== 'ConnectorHandleStart' && obj.type !== 'ConnectorHandleEnd' && obj.type !== 'textbox') {
			if (handSelected || zoomInTool) { return; }
			if(!$('#layers #'+obj.id).hasClass('child-layer')){
				childLayerSelected = false;
			}
			creatingGroup = true;
			obj._renderControls(canvas.contextTop, {
				hasControls: false,
				hasBorders: false,
				lockMovementX: true,
				lockMovementY: true,
			})
		}
    
    //code added by SMH for Dynamic data panel
    if(obj.type === 'textbox'){
			$('.properties-panel .appearance-property-panel.image-properties-panel').removeClass('d-block');
      $(".appearance-toolbar button").removeClass("d-none");
			$('.properties-panel .appearance-property-panel.text-properties-panel').removeClass('d-none').addClass('d-block');
      $('.properties-panel .appearance-property-panel.shape-properties-panel').removeClass('d-block');
      $('.toolbarPanel_5_1').removeClass('d-block').addClass('d-none');
      updateTextAppearance();
		} else if(obj.type === 'image' || obj.type === 'ImageContainer'){
			$('.properties-panel .appearance-property-panel.text-properties-panel').removeClass('d-block').addClass('d-none');
			$('.properties-panel .appearance-property-panel.image-properties-panel').addClass('d-block');
      $(".appearance-toolbar button").addClass("d-none");
      
      $('.properties-panel .appearance-property-panel.shape-properties-panel').removeClass('d-block');
      $('.toolbarPanel_5_1').removeClass('d-block').addClass('d-none');
		} else if(obj.type === 'Lineshape' || obj.type === 'circle' || obj.type === 'Rectshape' || obj.type === 'triangle'){
			$('.properties-panel .appearance-property-panel.text-properties-panel').removeClass('d-block').addClass('d-none');
			$('.properties-panel .appearance-property-panel.image-properties-panel').removeClass('d-block');
      $(".appearance-toolbar button").removeClass("d-none");
			$('.properties-panel .appearance-property-panel.shape-properties-panel').addClass('d-block');
      if(obj.type === 'Rectshape'){
        $('.properties-panel .dynamic-corner-branding').removeClass('d-none').addClass('d-block');
      }
      else {
        $('.properties-panel .dynamic-corner-branding').removeClass('d-block').addClass('d-none');
      }
      $('.toolbarPanel_5_1').removeClass('d-none').addClass('d-block');
      if(obj.type === 'Lineshape'){
        $('.toolbarPanel_5_1 .appearance-properties-panel .fills-properties-panel').addClass('d-none');
        $('.toolbarPanel_5_1 .fills-toolbar').addClass('d-none');
        $('.toolbarPanel_5_1 .borders-toolbar .flex-grow').html('Line&nbsp;<i class="right-label fas fa-caret-down"></i>');
        $('.toolbarPanel_5_1 .line-cap-container').removeClass('d-none').addClass('d-flex');
      }
      else {
        $('.toolbarPanel_5_1 .appearance-properties-panel .fills-properties-panel').removeClass('d-none');
        $('.toolbarPanel_5_1 .fills-toolbar').removeClass('d-none');
        $('.toolbarPanel_5_1 .borders-toolbar .flex-grow').html('Borders&nbsp;<i class="right-label fas fa-caret-down"></i>');
        $('.toolbarPanel_5_1 .line-cap-container').removeClass('d-flex').addClass('d-none');
      }
      updateTextAppearance();
		}
    activeDynamicSeparateCobinePanel('inactive');
    if(obj.position_relative){
      if(obj.position_relative == 1){
        activeDynamicSeparateCobinePanel('active');
      }
    }
    //Apply object default value to dunamic data form.
    enabledDynamicDataSection();
    applyDynamicDataDefaultValue();
    
	} else if(obj && obj.type == 'activeSelection'){ 
    var objs = canvas.getItemsByType('page', false);
    objs.forEach(function(obj) {
      if(obj.type !== 'text' && obj.type !== 'line' && obj.type !== 'guideline' && obj.type !== 'Lineshape' && obj.type !== 'ConnectorHandleStart' && obj.type !== 'ConnectorHandleEnd' && obj.type !== 'circle' && obj.type !== 'Rectshape'){
        obj.set({
          hasBorders: true,
          hasControls: true,
          borderColor: '#2880E6'
        });
      }
      canvas.renderAll();
    });
  }
  else {
    activeDynamicSeparateCobinePanel('inactive');
  }
  $("#layers .parent-layer").removeClass("layerFolderHighlighted");
}

var creatingGroup = true;
function onMouseOverGroup(o) {
  var activepage = jQuery('.page-row.g-active').attr('id');
  //var activePageObj = canvas.getItemById(activepage);
	var selectedObj = o.target;	
	var activeObj = canvas.getActiveObject();
	if(childLayerSelected){return;} //do not hover group when child layer is selected
	if((activeObj && activeObj.type == 'line') || (activeObj && activeObj.type == 'textbox' && activeObj.isEditing)){
		return;
	}
	if(selectedObj != null && selectedObj.type !== 'page' && selectedObj.id){
		if($('#layers #'+selectedObj.id+' .layer-lock-icon').hasClass('fa-lock') && $('#layers #'+selectedObj.id+' .layer-show-icon').hasClass('fa-eye-slash')){return;}
		if (handSelected || zoomInTool || ShifPressed || CtrlPressed) { return; }
    if(selectedObj.page !== activepage){return;}
		if (selectedObj.hide_container) { return; }
	}
		
	if (selectedObj != null && selectedObj.type !== 'line' && selectedObj.type !== 'text' && selectedObj.type !== 'page' && selectedObj.type !== 'activeSelection') {
    //console.log(JSON.stringify(selectedObj));
		if(selectedObj.type !== 'group'){
			if(selectedObj.layerGroup && selectedObj.layerGroup !== ''){
				if(creatingGroup){
					creatingGroup = false;
					$('#layers #'+selectedObj.layerGroup).addClass('active-row');
					var groupId = selectedObj.layerGroup;
					var groupOrder = $('#'+groupId).attr('order');
					groupLayerObjects(selectedObj.layerGroup, true, false);
					if(canvas.getActiveObject()){
						canvas.getActiveObject().toGroup();
						canvas.getActiveObject().set({
							id: groupId,
						});
						canvas.requestRenderAll();
						canvas.discardActiveObject();
						selectedObj._renderControls(canvas.contextTop, {
							hasControls: false,
							borderColor: '#2880E6',
						});
					}
				}
			}
		} 
		else if(selectedObj.type == 'group'){
			selectedObj._renderControls(canvas.contextTop, {
				hasControls: false,
				borderColor: '#e75e00',
			});
		}
	}	
}

function onMouseOutGroup(o) {
	var selectedObj = o.target;
	if (selectedObj != null && selectedObj.type == 'group') {
		if(ShifPressed || CtrlPressed){return;}
		childLayerSelected = false;
		creatingGroup = true;
		$('.layer-row.parent-layer').removeClass('active-row');
		canvas.clearContext(canvas.contextTop);
	}
}

function onMouseOver(o) {
  var selectedObj = o.target;	
  var activepage = jQuery('.page-row.g-active').attr('id');
  //var activePageObj = canvas.getItemById(activepage);
	var activeObj = canvas.getActiveObject();
	if(selectedObj && selectedObj.type == 'text' && selectedObj.name !== 'measurement'){	
		//check if page active or not		
		$('#pages #'+selectedObj.page).addClass('active-row'); //show border on page row
    selectedObj.set('hoverCursor', 'default');
		activePageObject(selectedObj.page, 'active');			
	}
  else if (selectedObj != null && selectedObj.type !== 'page' && selectedObj.type !== 'text'  && selectedObj.type !== 'guideline' && selectedObj.type !== 'line' && selectedObj.type !== 'group' && selectedObj.type !== 'ConnectorHandleStart' && selectedObj.type !== 'ConnectorHandleEnd') {
		if (handSelected || zoomInTool || selectedObj.lock_position === 1 || ShifPressed || CtrlPressed || selectedObj.hide_container === 1) { return; }
		if(selectedObj.layerGroup !== ''){return;}
		if(selectedObj.page !== activepage){return;}
		if((activeObj && activeObj.type == 'line' && activeObj.type == 'Rectshape' && activeObj.type == 'circle'  && activeObj.type == 'Lineshape' && activeObj.type == 'ConnectorHandleStart' && activeObj.type == 'ConnectorHandleEnd')){ // do not mouse over when moving guidelines
			return;
		}
		creatingGroup = true;
		selectedObj._renderControls(canvas.contextTop, {
			hasControls: false,
			borderColor: '#e75e00',
		});
		if(activeObj && activeObj.id == selectedObj.id){
			selectedObj._renderControls(canvas.contextTop, {
				borderColor: '#2880E6',
			});
		}
  }
	/*if(selectedObj && selectedObj.type == 'Lineshape' && (activeObj && activeObj.type !== 'Lineshape' || !(activeObj))){
		selectedObj.set('stroke', '#e75e00');
		selectedObj.set('fill', '#e75e00');
		canvas.renderAll();
	}
	if(selectedObj && selectedObj.type == 'circle' && (activeObj && activeObj.type !== 'circle' || !(activeObj))){
		selectedObj.set('stroke', '#e75e00');
		canvas.renderAll();
	}*/
}


function onMouseOut(o) {
  var selectedObj = o.target;
	var activeObj = canvas.getActiveObject();
	if(selectedObj != null && selectedObj.type == 'text' && selectedObj.name !== 'measurement'){
		//reset all page hover
		$('#pages .page-row').removeClass('active-row');
		activePageObject(selectedObj.page, 'inactive');
	}
  if (selectedObj != null && selectedObj.type !== 'page' && selectedObj.type !== 'text' && selectedObj.type !== 'guideline' && selectedObj.type !== 'line' && selectedObj.type !== 'group' && selectedObj.type !== 'Lineshape' && selectedObj.type !== 'ConnectorHandleStart' && selectedObj.type !== 'ConnectorHandleEnd') {
		if(ShifPressed || CtrlPressed){return;}		
		if(selectedObj.layerGroup !== ''){return;}
		canvas.clearContext(canvas.contextTop);
  }
	/*if(selectedObj && selectedObj.type == 'Lineshape'){
		selectedObj.set('stroke', '#2880E6');
		selectedObj.set('fill', '#2880E6');
		canvas.renderAll();
	}
	if(selectedObj && selectedObj.type == 'circle' && (activeObj && activeObj.type !== 'circle' || !(activeObj))){
		selectedObj.set('stroke', '#F0EFEF');
		canvas.renderAll();
	}*/
}

/**
 * Callback function onMouseUpc()
 * Canvas mouse up event for dynamic data
 */
function onMouseUpc(e){
  //console.log("onMouseUpc");
  var activeObject = canvas.getActiveObject();
  //console.log(JSON.stringify(e.target));
  if(activeObject && activeObject.type == 'activeSelection'){
    var objs = activeObject._objects.filter(function(o) {
      if(o.lock_position && o.lock_position == 1){
        return o;
      }
    });
    if(objs.length > 0){
      lockGroupLayerObjects();
    }
    activePage = $('.page-row.g-active').attr('id');
    activePageObj = canvas.getItemById(activePage);
    if(activePageObj.pageGuideLines == 0){
      var objsCheck = activeObject._objects.filter(function(oc){
        if((oc.type == 'text' && oc.name != 'measurement') && oc.type != 'line' && oc.type != 'guideline'){
          return o;
        }
      });
      if(objsCheck.length == 0){
        canvas.discardActiveObject().renderAll();
      }
    }
    //Enabled right panel after mouse UP
    EnableRightProperties();	
    EnableActionToolbar();
  }
  //var activeObject = canvas.getActiveObject();
  if(activeObject){
    //console.log(JSON.stringify(activeObject));
    var width = activeObject.width * activeObject.scaleX;
    var height = activeObject.height * activeObject.scaleY;
    var rotation = activeObject.angle;
    //var prop_x = new setProperties('pos-x', Math.round(activeObject.left));
    //var prop_y = new setProperties('pos-y', Math.round(activeObject.top));
    var activeObjectCoords = activeObject.getBoundingRect(true, true);
    var prop_x = new setProperties('pos-x', Math.round(activeObjectCoords.left - leftmargin));
    var prop_y = new setProperties('pos-y', Math.round(activeObjectCoords.top - topmargin));
    var prop_w = new setProperties('size-width', Math.round(width));
    var prop_h = new setProperties('size-height', Math.round(height));
    var prop_angle = new setProperties('angle', Math.round(rotation));
    prop_x.properties();				
    prop_y.properties();
    prop_w.properties();				
    prop_h.properties();  
    prop_angle.properties();
  }
	CtrlPressed = false;
	var obj = e.target;
	if(!obj || (obj && obj.type == 'page')){
		/* if(canvas.getObjects().indexOf(activePageObj) !== 0){
			if(canvas.getObjects().indexOf(activePageObj) !== 0){
			canvas.sendToBack(activePageObj);
		} */
		ShifPressed = false;
		if($('.layer-row.parent-layer').length){
			groupToActiveSelection(null);
		}
		childLayerSelected = false; // disable group mouse over
		creatingGroup = true; // enable group mouse over
		/* var ellipses = canvas.getItemsByType('circle', true);
		if(ellipses && !(drawmode)){
			ellipses.forEach(function(eo){
				eo.set({
					stroke: "#F0EFEF", //"transparent",
				});
				canvas.renderAll();
			});
		} */
		var checkStartHandle = canvas.getItemsByType('ConnectorHandleStart', true);
		var checkEndHandle = canvas.getItemsByType('ConnectorHandleEnd', true);
		if(checkStartHandle && checkEndHandle){
			checkStartHandle.forEach(function(shandle){
				shandle.set({
					opacity: 0, 
					selectable: false,
				});
			});
			checkEndHandle.forEach(function(ehandle){
				ehandle.set({
					opacity: 0, 
					selectable: false,
				});
			});
		}
	}
  //console.log(JSON.stringify(obj));
  if(obj){
    if(obj && (obj.type == 'image' || obj.type == 'textbox') && typeof obj.containerID !== 'undefined'){
      obj.lockScalingX = false;
      obj.lockScalingY = false;
      obj.lockRotation = false;
      obj.lockMovementX = false;
      obj.lockMovementY = false;
      obj.hasBorders = false;
      //console.log('containerID = '+obj.containerID);
      var container = canvas.getItemById(obj.containerID);
      if(container){
        container.lockScalingX = false;
        container.lockScalingY = false;
        container.lockRotation = false;
        container.lockMovementX = false;
        container.lockMovementY = false;
        container.hasBorders = false;
        canvas.setActiveObject(container);
      }
      else {
        canvas.setActiveObject(obj);
      }
      canvas.renderAll();
    }
    if(obj && obj.type == 'ImageContainer'){
      if(obj.containerImage !== ''){
        //console.log('containerImage = '+obj.containerImage);
        obj.lockScalingX = false;
        obj.lockScalingY = false;
        obj.lockRotation = false;
        obj.lockMovementX = false;
        obj.lockMovementY = false;
        obj.hasBorders = false;
        canvas.setActiveObject(obj);
        canvas.renderAll();
      }
    }
  }
	/* if(!(childLayerSelected) && creatingGroup){
		activeSelectionToGroup();
	} */

	if(!CtrlPressed && (!obj || (obj && obj.type == 'page'))){
		$('.layer-row.g-active').removeClass('g-active');
	}
	
	if(($('.layer-row.parent-layer.g-active').length || $('.layer-row.parent-layer.g-has-selection').length) && (!obj || (obj && obj.type == 'page'))){
		$('.layer-row.parent-layer .layer-title-group .layer-icon').css('color', '');
		$('.layer-row.parent-layer').removeClass('g-active g-has-selection layerFolderHighlighted');
	}
	if(drawmode){
		drawmode = false;
	}
	if(zoomInTool == true){
		//console.log('up');
		var zin = $('#zoomb .caption').text();
		zin = zin.split('%')[0];
		var i = z.indexOf(parseInt(zin));
		if(i === -1){
			zin = closest(z, zin, 'zoomin');
		} else {
			zin = z[i+1];
		}
		if(typeof zin == 'undefined') { return; }
		$('#zoomb .caption').html(zin+'%');
		zin = zin/100;
		//canvas.zoomToPoint(new fabric.Point(activePageObj.left, activePageObj.top), zin);
    kmdsDesignZoomIn(zin);
		//addrulernew(ixx, iyy);
    //console.log('21');
	}
	if(!$('#handtool').hasClass('g-active') && zoomInTool == false){
		$('.toolbar-button.toolbar-Select .action-button').trigger('click');
		if($('ul.g-menu.g-menu-bottom.fixed.zoomb').hasClass('d-inline')){
			$('#zoomb').removeClass('g-active');
			$('ul.g-menu.g-menu-bottom.fixed.zoomb').removeClass('d-inline');
		}
		$('ul.g-menu.g-menu-bottom.fixed').hide();
	}
	var obj = canvas.getActiveObject();
	if(obj){
		updateProperties(obj);
    //Add/Remove layer active class
		LayerActivation();
    //code added by SMH for Dynamic data panel
    activeDynamicSeparateCobinePanel('inactive');
    if(obj.position_relative){
      if(obj.position_relative == 1){
        activeDynamicSeparateCobinePanel('active');
      }
    }
    //Apply object default value to dunamic data form.
    //enabledDynamicDataSection();
    //applyDynamicDataDefaultValue();
	}
  else {
    activeDynamicSeparateCobinePanel('inactive');
		
  }
}

/**
 * Callback function onMouseMovec()
 * Canvas mouse move event for pointer position
 */
function onMouseMovec(e) {
  $('#layers .layer-row').removeClass('active-row');
	var obj = e.target;
	
  if(obj){
		if(obj.type !== 'page' && obj.type !== 'text' && obj.type !== 'line' && obj.type !== 'guideline' && !(handSelected) && !(zoomInTool) && obj.lock_position === 0 && obj.hide_container !== 1){
			canvas.hoverCursor = 'move';
			if(!(obj.hide_data)){
				if(obj.layerGroup == '' || typeof obj.layerGroup == 'undefined' ){	
					var oid = obj.id;
					$('#layers #'+oid).addClass('active-row');				
				} 
			}
			if(obj.hide_data){
				canvas.hoverCursor = 'context-menu';
			}
		}
  }
  else{		
		canvas.hoverCursor = 'context-menu';
  }
	//var pointer = canvas.getPointer(e.e);
  //var original_x = parseInt(pointer.x-(topRulerZoom)); // parseInt(pointer.x - 330);
  //var original_y = parseInt(pointer.y-(leftRulerZoom)); // parseInt(pointer.y - 22);
	var pointer = canvas.getPointer(e.e, true);
  var original_x = parseInt(pointer.x); // parseInt(pointer.x - 330);
  var original_y = parseInt(pointer.y); // parseInt(pointer.y - 22);
  $(".g-ruler-widget.horizontal .mouse-marker").css("left", original_x);
  $(".g-ruler-widget.vertical .mouse-marker").css("top", original_y);
	if(showMeasures){
		/* var objss = canvas._objects.filter(function(obj){
      if ($.inArray(obj.id, 'linemeasures') != -1){
        return obj;
      }
    }); */
		var linexy = canvas.getItemById('linemeasures');
		var lr_text = (Math.round(original_x)).toString();
		var tr_text = (Math.round(original_y)).toString();
		var lineText = lr_text+', '+tr_text;
		if(linexy){
			linexy.set({
				text: lineText,
				left: original_x + 5,
				top: original_y
			});
		}
	}
}

//Image Drag/drop
//Commented by SMH, #task 6059
/*function handleImageDrop(e){
	e = e || window.event;
	if (e.preventDefault) {
		e.preventDefault();
	}
  activeLayerID = $("#layers .template-group .layer-row.g-active").attr("id");
  var activePage = $('.page-row.g-active').attr('id');
  if($('#pages #'+activePage+' .page-lock-icon').hasClass('fa-lock')){
    $('button.action-button.g-active').removeClass('g-active');
    return;
  }

  //console.log(e);
	var droppedFiles = e.originalEvent.dataTransfer.files;
	if(droppedFiles.length > 0){
		$.each( droppedFiles, function(i, file) {		
			ImageProcessFn(file, activePage);
		});
	}
	
	$('.toolbar.main-toolbar').addClass('d-flex');
  $('.toolbarPanel_1').removeClass('d-none').addClass('d-block');
	$('.properties-panel.main-toolbar').addClass('d-block');
	$('.toolbar.appearance-toolbar').addClass('d-flex');
	$('.toolbarPanel_5').removeClass('d-none').addClass('d-block');
  var obj = canvas.getActiveObject();
  if(obj){
    if(obj.type === 'Lineshape' || obj.type === 'circle' || obj.type === 'Rectshape'){
      $('.toolbarPanel_5_1').removeClass('d-none').addClass('d-block');
    }
  }
	$('.toolbarPanel_6').removeClass('d-none').addClass('d-block');
	$('.properties-panel .appearance-property-panel.text-properties-panel').removeClass('d-block').addClass('d-none');
	$('.properties-panel .appearance-property-panel.image-properties-panel').addClass('d-block');
  $(".appearance-toolbar button").addClass("d-none");
}
}*/

function cancel(e) {
	if (e.preventDefault) { e.preventDefault(); }
	return false;
}

$(document).ready(function() {
  topRuler = new fabric.Canvas('kmds-top-ruler');
  leftRuler = new fabric.Canvas('kmds-left-ruler');
	//Image Drag/drop
	//Commented by SMH, #task 6059
  //$(".canvas-container").on('drop', handleImageDrop);
	//$(".canvas-container").on('dragover', cancel);
	//$(".canvas-container").on('dragenter', cancel);
	
  $(".canvas-container").mouseover(function() {
    //canvas.off();
    //canvas off start
    canvas.off('mouse:down', onMouseDownc);
    canvas.off('mouse:down', onMouseDownp);
    canvas.off('mouse:up', onMouseUpc);
    canvas.off('mouse:over', onGuideOver);
    canvas.off('mouse:out', onGuideOut);
    canvas.off('mouse:over', onMouseOver);
    canvas.off('mouse:over', onMouseOverGroup);
    canvas.off('mouse:out', onMouseOut);
    canvas.off('mouse:out', onMouseOutGroup);
    //Smart Guide
    //canvas.off('mouse:down', _drawObjectGuides);
    //canvas.off('object:moving', _moveObjectGuides);
    //canvas off end
    canvas.on('mouse:over', onGuideOver);
    canvas.on('mouse:out', onGuideOut);
    canvas.on('object:moving', onGuideMove);
    canvas.on('mouse:over', onMouseOver);
    canvas.on('mouse:over', onMouseOverGroup);
    canvas.on('mouse:out', onMouseOut);
    canvas.on('mouse:out', onMouseOutGroup);
    //canvas.on('mouse:out', onMouseOutc);
    canvas.on('mouse:up', onMouseUpc);
    canvas.on('mouse:down', onMouseDownc);
    canvas.on('mouse:down', onMouseDownp);
    canvas.on('mouse:move', onMouseMovec);
    canvas.on('object:added', NewobjectAdded);
    canvas.on('object:removed', objectRemoved);
    canvas.on('object:modified', modifyCanvasState);
    canvas.on('object:modified', updateProperties);
    canvas.on('object:modified', DetectTemplateChanges);
    canvas.on('object:rotating', updateProperties);
    canvas.on('object:moving', handleMove);
    canvas.on('object:moving', updateProperties);
    canvas.on('object:moving', updatePageObjects);
    canvas.on('object:moving', objectIntersectingCheck);
    canvas.on('object:selected', updateProperties);
    canvas.on('object:scaling', ObjectScaling);
    canvas.on('selection:created', SelectionCreated);
    canvas.on('selection:cleared', SelectionCleared);
    canvas.on('mouse:dblclick', activateChildObject);
    canvas.on('mouse:wheel', mousewellscroll);
    //Smart Guide
    //canvas.on('mouse:down', _drawObjectGuides);
    //canvas.on('object:moving', _moveObjectGuides);
  });
  /*window.onload = function() {
    //load all fonts from kmdsFontsLoad.js
    kmdsFontsLoad();
  }*/

  /** function to create the crop marks on canvas template for PNG preview***/
/**********Bleed and crop end *************/
});

/****Model Pupup action ****************/
function newCanvasLayer () {
	productName = $('.nav-item.nav-link.active').text();
	productId = $('.product-item.active').attr('data-group');
	producTypeId = $('.product-item.active').attr('data-tid');
	producTypeName = $('.product-item.active').attr('data-name');
  presetVal = (jQuery('#preset-select').val() != 'none') ? jQuery('#preset-select').val() : '';
  if($('#elem-measurement').val() === 'pixels'){
    var pw = parseFloat($('#elem-width').val()).toFixed(2);
    var ph = parseFloat($('#elem-height').val()).toFixed(2);
    pageUnit = 'px';
  }
  else {
    var pw = parseFloat(($('#elem-width').val())*72).toFixed(2);
    var ph = parseFloat(($('#elem-height').val())*72).toFixed(2);
    pageUnit = 'in'
  }
  pageWidth = parseFloat($('#elem-width').val()).toFixed(2);
  pageHeight = parseFloat($('#elem-height').val()).toFixed(2);
  //pageWidth = pw;
  //console.log("pageWidth 2 ="+pageWidth);
  //pageHeight = ph;
  if($('#elem-measurement').val() === 'pixels'){
    cunit = 'px';
    var selectedIndex = 1;
  }
  else {
    cunit = 'in';
    var selectedIndex = 0;
  }
	if(producTypeName !== ''){
		template_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		$('#header .tabs .tab.g-active').removeClass('g-active');
    if(!("#header .tabs .tab.g-active").length){
      $("<div></div>").addClass("tab g-active").attr('data-id', template_id).append($("<span></span>").addClass("title c-pointer").attr('design', 'untitled').attr('producTypeId', $('.product-item.active').attr('data-tid')).append('Untitled*'))/* .append($("<span/>", {'class': 'close c-pointer', 'designid': 'untitled', 'onclick': 'FntemplateClose(this)', 'html': '✕'})) */.appendTo('#header .tabs');//.attr('onclick', 'FntemplateSwitch(this)')
    }
		var Docurl = window.location.href;
		var t = checkDesign();
		if(t === true){
			Docurl = Docurl.split('?')[0];
			window.history.pushState("object or string", 'title', Docurl );
			canvas.clear();
		}
		document.title = 'Untitled | KaboodleMedia';
		$('#layers .template-group.group-active').removeClass('group-active').addClass('d-none'); //hide old template layers and add new template group
		$('<div/>', {'class': 'template-group group-active', 'id': template_id}).appendTo('#layers');
		/*var pid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		var pw = $('#elem-width').val();
		var ph = $('#elem-height').val();
		add_page(pid, pageWidth, pageHeight, '#ffffff');*/
    var page_no = 0, layout_front = '', layout_back = '';
    if(presetVal != ''){
      var getPageSize = media_base_url+'/tokendata?_format=json';
      var url_data = {vid : "image_preset", preset_tid : presetVal}
      $.getJSON(getPageSize, url_data, function( pageSizeList ) {
        page_no = pageSizeList[0].page_no;
        layout_front = pageSizeList[0].layout_front;
        layout_back = pageSizeList[0].layout_back;
        //console.log(JSON.stringify(pageSizeList));
      }).always(function(){
        if(page_no != null) {
          for(x=1; x<=page_no; x++){
            var pid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            var $layout = (x == 1) ? layout_front : layout_back;
            add_page(pid, pw, ph, '#ffffff', $layout);
            if(x == page_no){
              //jQuery(".page-row.g-active .page-layout-visibility").addClass("layout-active");
              jQuery('.page-row[page-no=1]').click();
              var pageLayout1 = canvas.getItemById("layout-1");
              if(pageLayout1 && pageLayout1.hide_data == 0){pageLayout1.set({opacity: 1});}
              var pageLayout2 = canvas.getItemById("layout-2");
              if(pageLayout2){pageLayout2.set({opacity: 0});}
              canvas.renderAll();
            }
          }
        }
        else {
          var pid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          add_page(pid, pw, ph, '#ffffff');
        }
      });
    }
    else if(jQuery('#preset-select').val() == 'none') {
      var pid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      //console.log("2 >> pw = "+pw+" -- ph = "+ph);
      add_page(pid, pw, ph, '#ffffff');
    }
	}
  this.width = parseFloat($('#elem-width').val()).toFixed(2);
  this.height = parseFloat($('#elem-height').val()).toFixed(2);
	this.unit = $('#elem-measurement').val();
	$('#canvas-width').val(pageWidth);     			
	$('#canvas-height').val(pageHeight);
	jQuery('#header .selectedpreset #preset-name').text(presetName);
	
  //getPageSizePreset(productId);
	//$('#measurements').val('px');
	$('#measurements').val(cunit);
  jQuery('.g-ruler-widget-px span').text(cunit);
  //console.log(selectedIndex);
  if(t === false){
    if(presetVal == ''){
      setPageSizeOption(pageWidth, pageHeight);
    }
    else {
      setPageSizeOption();
    }
  }
  /*if($('#elem-measurement').val() === 'pixels'){
    pageWidth = this.width;
    pageHeight = this.height;
  }
  else {
    pageWidth = parseInt((this.width)*72);
    pageHeight = parseInt((this.height)*72);
  }*/
	//$('#preset-size').val('');
	//document.getElementById("measurements").selectedIndex = selectedIndex;
	$('#modal').modal('hide');
	//$('#header .tabs .tab.g-active .title').attr('producTypeId', producTypeId);
	$('#header .tabs .tab.g-active .title').attr('producTypeId', producTypeId);
	if(producTypeId !== ''){
    console.log('3');
		getProductName(producTypeId);
	}
  //addrulernew(0,0); //ds new location
}

/**
 * Callback function cancelCanvasDesignModal()
 * to cancel design modal and redirecet
 * the user to previous page.
 **/
function cancelCanvasDesignModal(){
  if($("#pages .page-row").length){
    $('#modal').modal('hide');
  }
  else{
    var vars = [], hash, url;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    url = '/kmds/design';
    for(var i = 0; i < hashes.length; i++){
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
      if(hash[0] == 'destination') {
        url = vars['destination'];
        window.location.href = url;
      }
      else if(hash[0] == 'template') {
        url = url+'/group'+'/'+uid+'/'+vars['template'];
        window.location.href = url;
      }
      else {
        url = 'n/a';
      }
    }
    if(url == 'n/a'){
      window.location.href = '/kmds/design';
    }
    $('#modal').modal('hide');
  }
}

/****************Start switch page************/
function activate_page_layers(page_id) {
  $('.page-row.g-active').removeClass('g-active');
	$('#'+page_id).addClass('g-active');
	$('.layer-row.g-active').removeClass('g-active');
  //var activepage = $('.page-row.g-active').attr('id');
	$('.layer-row').each(function(){
		var datagroup = $(this).attr('data-group');
		var datapage = $(this).attr('data-pageId');
		if(datapage == page_id){
			if(datagroup !== ''){ //check for child layer
				$('#'+datagroup).removeClass('d-none').addClass('d-flex');
				if($('#'+datagroup).children('.fa-caret-down').length == 1){
					$(this).removeClass('d-none').addClass('d-flex');
				}
			} else {
				$(this).removeClass('d-none').addClass('d-flex');
			}
		} else {
			$(this).removeClass('d-flex').addClass('d-none');
		}
	});
}

function switch_page(page_id) {
  activate_page_layers(page_id);
  var activepage = page_id;
  var activepageTitle = $('#'+page_id+' .page-title').text();
	//var activepage = $('.page-row.g-active').attr('id');
	//var activepageTitle = $('.page-row.g-active .page-title').text();
	canvas.discardActiveObject();
	if(multipageToggle == false){
    var tpages = canvas.getItemsByType('page', true);
		tpages.forEach(function(p) {
      if(p.id == activepage){
        if(p.pageMeasurement){
          cunit = p.pageMeasurement;
        }
        //var pw = p.width;
        //var ph = p.height;
        var pw = pageWidth;
        var ph = pageHeight;
        if(cunit == 'in' && pageUnit == 'px'){
          pageUnit = 'in';
          pageWidth = (pw / 72);
          pageWidth = parseFloat(pageWidth).toFixed(2);
          //console.log("pageWidth 3 ="+pageWidth);
          pageHeight = (ph / 72);
          pageHeight = parseFloat(pageHeight).toFixed(2);
          $('#canvas-width').val(pageWidth);
          $('#canvas-height').val(pageHeight);
        }
        else {
          $('#canvas-width').val(parseFloat(pw).toFixed(2));
          $('#canvas-height').val(parseFloat(ph).toFixed(2));
        }
        //console.log('get p');
        //console.log(p);
        $('#measurements').val(cunit);
        //setPageSizeOption(pw, ph);
        setPageSizeOption();
				var paggecolor = (p.backgroundColor) == '' ? '#ffffff' : p.backgroundColor;
				$('#page-background').val(paggecolor);
        jQuery('#page-background').css('background-color', paggecolor);
        p.set('visibility', true);
        p.set('opacity', 1);
      } else {
        p.set('visibility', false);
				p.set('opacity', 0);
      }
    });
    
    //all objects of page
    var objs = canvas.getItemsByType('page', false);
		objs.forEach(function(o) {
      if(o.type !== 'text' && o.type !== 'line' && o.type !== 'guideline' && o.type !== 'PageMediaBox' && o.type !== 'PageTrimBox'){
        if(o.page == activepage){
					if(o.type == 'Lineshape' || o.type == 'ConnectorHandleStart' || o.type == 'ConnectorHandleEnd'){
						o.set('visibility', true);
            if(o.dynamic_opacity_range){
              o.set('opacity', o.dynamic_opacity_range);
            }
            else {
              o.set('opacity', 1);
            }
						o.setControlsVisibility({
							mt: false, 
							mb: false, 
							ml: false, 
							mr: false, 
							bl: false,
							br: false, 
							tl: false, 
							tr: false,
							mtr: false, 
						});
					} else {
            var showData = true;
            var unLockData = true;
            if(o.hide_data && o.hide_data == 1){
              showData = false;
            }
            if(o.lock_position && o.lock_position == 1){
              unLockData = false;
            }
            if(showData){
              o.set('visibility', true);
              o.set('selectable', true);
              o.set('hasControls', true);
              o.set('hasBorders', true);
              o.set('evented', true);
              if(o.dynamic_opacity_range){
                o.set('opacity', o.dynamic_opacity_range);
              }
              else if(o.dynamic_image_opacity_range){
                o.set('opacity', o.dynamic_image_opacity_range);
              }
              else {
                o.set('opacity', 1);
              }
              o.setControlsVisibility({
                mt: true, 
                mb: true, 
                ml: true, 
                mr: true, 
                bl: true,
                br: true, 
                tl: true, 
                tr: true,
                mtr: true, 
              });
            }
            if(unLockData){
              o.lockMovementX = false;
              o.lockMovementY = false;
              o.lockScalingX = false;
              o.lockScalingY = false;
              o.lockRotation = false;
            }
					}
				} else {
          o.lockMovementX = true;
          o.lockMovementY = true;
          o.lockScalingX = true;
          o.lockScalingY = true;
          o.lockRotation = true;
					o.set('selectable', false);
					o.set('hasControls', false);
					o.set('hasBorders', false);
					o.set('visibility', false);
					o.set('evented', false);
					o.set('opacity', 0);
				}
      }
			if(o.type == 'PageMediaBox'){
        addPageMediaBox();
      }
			if(o.type == 'line'){
				if(guideStatus == 1 && o.page == activepage){
					//o.set('opacity', 1);
          o.set({
            visibility: true,
            opacity: 1,
            selectable: true,
            evented: true,
          });
          o.set('hasBorders', false);
          o.set('borderColor', 'transparent');
          o.setControlsVisibility({
             mt: false, 
             mb: false, 
             ml: false, 
             mr: false, 
             bl: false,
             br: false, 
             tl: false, 
             tr: false,
             mtr: false, 
          });
          if(o.name == 'guidev'){
            o.set({
              hasControls: false,
              lockMovementX: false,
              lockMovementY: true,
              lockScalingX: true,
              lockScalingY: true,
              lockRotation: true,
            });
          }
          else if(o.name == 'guideh'){
            o.set({
              hasControls: false,
              lockMovementY: false,
              lockMovementX: true,
              lockScalingX: true,
              lockScalingY: true,
              lockRotation: true,
            });
          }
				} else {
					//o.set('opacity', 0);
          o.set({
            visibility: false,
            opacity: 0,
            selectable: false,
            evented: false,
          });
          o.setControlsVisibility({
            mt: false, 
            mb: false, 
            ml: false, 
            mr: false, 
            bl: false,
            br: false, 
            tl: false, 
            tr: false,
            mtr: false, 
          });
				}
			}
      canvas.renderAll();
    });
	} else if(multipageToggle == true && ObjinterSection == false){
    if($('#pages #'+page_id+' .page-lock-icon').hasClass('fa-unlock-alt')){
      activatePage(page_id, activepageTitle);
    }
	}
	DisableRightProperties();
	DisableActionToolbar();
	
	//set right panel > page 
	var ap = $('.page-row.g-active .page-title').text();
	$('.toolbar.page-toolbar label').text('Page ('+ap+')');
  var pageNo = jQuery('.page-row.g-active').attr("page-no");
  if(parseInt(pageNo) == 1){
    //console.log("pageNo 1= "+pageNo);
    var pageLayout1 = canvas.getItemById("layout-1");
    if(pageLayout1 && pageLayout1.hide_data == 0){
      //console.log("hide_data1 = "+pageLayout1.hide_data);
      pageLayout1.set({opacity: 1});
      //pageLayout1.bringToFront();
    }
    var pageLayout2 = canvas.getItemById("layout-2");
    if(pageLayout2){pageLayout2.set({opacity: 0});}
    canvas.renderAll();
  }
  else {
    //console.log("pageNo 2= "+pageNo);
    var pageLayout1 = canvas.getItemById("layout-1");
    if(pageLayout1){pageLayout1.set({opacity: 0});}
    var pageLayout2 = canvas.getItemById("layout-2");
    if(pageLayout2 && pageLayout2.hide_data == 0){
      //console.log("hide_data2 = "+pageLayout1.hide_data);
      pageLayout2.set({opacity: 1});
      //pageLayout2.bringToFront();
    }
    canvas.renderAll();
  }
}

/****************End switch page************/
/**
 * Callback function enabledTemplatePage()
 * to disabled/enabled template pages at product page
 **/
function enabledTemplatePage(){
  var pageID = $('.page-row[page-no=1]').attr('id');
  var pageObjects = canvas._objects;
  //console.log("enabledTemplatePage");
  pageObjects.forEach(function(obj) {
    if(obj.id === pageID){
      obj.set({
        visibility: true,
        opacity: 1,
      });
      obj.setControlsVisibility({
        mt: true, 
        mb: true, 
        ml: true, 
        mr: true, 
        bl: true,
        br: true, 
        tl: true, 
        tr: true,
        mtr: true, 
      });
      //Activate active page
      var activePageObj = canvas.getItemById(pageID);
      var pageIndex = canvas.getObjects().indexOf(activePageObj);
      if(pageIndex != 0 ){
        canvas.moveTo(activePageObj, 0);
        canvas.renderAll();	
      } 
      canvas.renderAll();
    }
    else if(obj.page && obj.page === pageID){
      if((obj.type == 'text' && obj.name == 'measurement') || (obj.hide_data && obj.hide_data == 1) || obj.type == 'ConnectorHandleStart' || obj.type == 'ConnectorHandleEnd'){
        return;
      }
      else if(obj.type === 'line' || obj.type === 'guideline'){
				if(guideStatus == 1){
          obj.set({
            visibility: true,
            opacity: 1,
            selectable: true,
            evented: true,
          });
				} else {
					obj.set('opacity', 0);
				}
				obj.set('hasBorders', false);
				obj.set('borderColor', 'transparent');
				obj.setControlsVisibility({
					 mt: false, 
					 mb: false, 
					 ml: false, 
					 mr: false, 
					 bl: false,
					 br: false, 
					 tl: false, 
					 tr: false,
					 mtr: false, 
				});
        if(obj.name == 'guidev'){
          obj.set({
            hasControls: false,
            lockMovementX: false,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
          });
        }
        else if(obj.name == 'guideh'){
          obj.set({
            hasControls: false,
            lockMovementY: false,
            lockMovementX: true,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
          });
        }
      }
      else {
        if(obj.dynamic_opacity_range){
          obj.set('opacity', obj.dynamic_opacity_range);
        }
        else if(obj.dynamic_image_opacity_range){
          obj.set('opacity', obj.dynamic_image_opacity_range);
        }
        else {
          obj.set('opacity', 1);
        }
        obj.set({
          visibility: true,
          //opacity: 1,
          selectable: true,
          evented: true,
        });
        obj.setControlsVisibility({
          mt: true, 
          mb: true, 
          ml: true, 
          mr: true, 
          bl: true,
          br: true, 
          tl: true, 
          tr: true,
          mtr: true, 
        });
        //move object on layerindex basis
        var ord = (obj.layerIndexing) ? obj.layerIndexing : 1;
        canvas.moveTo(obj, parseInt(ord));		
        canvas.renderAll();
      }
    }
    else {
      if(obj.page && obj.page !== pageID){
        obj.set({
          visibility: false,
          opacity: 0,
          selectable: false,
          evented: false,
        });
        obj.setControlsVisibility({
          mt: false, 
          mb: false, 
          ml: false, 
          mr: false, 
          bl: false,
          br: false, 
          tl: false, 
          tr: false,
          mtr: false, 
        });
      }
      else if(obj.id !== pageID){
        obj.set({
          visibility: false,
          opacity: 0,
          selectable: false,
          evented: false,
        });
        obj.setControlsVisibility({
          mt: false, 
          mb: false, 
          ml: false, 
          mr: false, 
          bl: false,
          br: false, 
          tl: false, 
          tr: false,
          mtr: false, 
        });
      }
    }
    canvas.renderAll();
  });
}
/****************Start set Page from right side bar************/
function set_page(o){
	changePage = true;
  var zoomLevel = canvas.getZoom();
	if(changePage){
    activePageID = $('.page-row.g-active').attr('id');
    active_page_object = canvas.getItemsByPage(activePageID)[0];
		var preset = document.getElementById("preset-size");
		var preset_size = preset.options[preset.selectedIndex].value;
    if(preset_size !== 'none'){
      jQuery("#preset-size option[preset-name='Custom']").remove();
      presetVal = preset.options[preset.selectedIndex].getAttribute('preset-tid');
      presetName = preset.options[preset.selectedIndex].text;
      jQuery("#preset-size").attr('preset-tid', presetVal);
      jQuery("#preset-size").attr('preset-name', presetName);
      jQuery('#header .selectedpreset #preset-name').text(presetName);
      var presetx = preset_size.split('x');
      var pw = parseFloat(presetx[0]).toFixed(2);
      var ph = parseFloat(presetx[1]).toFixed(2);

      var getPageSetings = media_base_url+'/tokendata?_format=json';
      var url_data = {vid : "image_preset", 'presetVal' : presetVal, 'image_preset_selector': 'yes'}
      $('.toolbarPanel_4.d-block').append('<div class="progress-overlay toolbarPanel_4-overlay"><div class="spinner-border"></div></div>');
      $.getJSON(getPageSetings, url_data, function( pageSetings ) {
        //[{"tid":"566","name":"Instagram Post","format":"png","color_space":"sRGB","dpi":null}]
        if(pageSetings[0].color_space !== null){
          jQuery("#kmds-color-space").val(pageSetings[0].color_space);
          jQuery("#kmds-color-space").attr("preset-value", pageSetings[0].color_space);
        }
        if(pageSetings[0].format !== null){
          jQuery("#kmds-format").val(pageSetings[0].format);
          jQuery("#kmds-format").attr("preset-value", pageSetings[0].format);
          if(pageSetings[0].format == 'pdf'){
            addPageMediaBox();
          }
        }
        if(pageSetings[0].dpi !== null){
          jQuery("#kmds-dpi").val(pageSetings[0].dpi);
          jQuery("#kmds-dpi").attr("preset-value", pageSetings[0].dpi);
          fabric.DPI = pageSetings[0].dpi;
        }
        if(pageSetings[0].unit !== null){
          var unit_of_measurement = {'pixels':'px', 'inches':'in'};
          cunit = unit_of_measurement[pageSetings[0].unit];
          jQuery("#measurements").val(cunit);
          jQuery("#measurements").attr("preset-value", cunit);
          jQuery('.g-ruler-widget-px span').text(cunit);
        }
      }).always(function() {
        var measurements = jQuery("#measurements").val();
        /*if(measurements == 'in' && pageUnit == 'px'){
          pageUnit = 'in'
          pageWidth = (pw / 72).toFixed(4);
          pageWidth = parseFloat(pageWidth);
          pageHeight = (ph / 72).toFixed(4);
          pageHeight = parseFloat(pageHeight);
          $('#canvas-width').val(pageWidth);
          $('#canvas-height').val(pageHeight);
        }
        else {
          $('#canvas-width').val(pw);
          $('#canvas-height').val(ph);
        }*/
        if(cunit == 'in'){
          ph = parseFloat(ph).toFixed(2);
          pw = parseFloat(pw).toFixed(2);
        }
        $('#canvas-height').val(parseFloat(ph).toFixed(2));
        $('#canvas-width').val(parseFloat(pw).toFixed(2));
        if(active_page_object != null){
          var oldCoordinates = active_page_object.getBoundingRect();
          if(pw == 0 && ph == 0){
            var presetw = window.innerWidth;
            var preseth = window.innerHeight;
          }
          else {
            var presetw = (cunit == 'in') ? pw*72 : pw;
            var preseth = (cunit == 'in') ? ph*72 : ph;
            /*var widthDif = (((pw - active_page_object.width)*zoomLevel)/2);
            var heightDif = (((ph - active_page_object.height)*zoomLevel)/2);
            var leftRulerY = (((ph*zoomLevel)-ph)/2);
            leftRulerZoom = leftRulerY;
            var topRulerX = (((pw*zoomLevel)-pw)/2);
            topRulerZoom = topRulerX;*/
          }
          active_page_object.set({
            width: presetw,
            height: preseth,
          });      
          canvas.renderAll();
          /*if(widthDif > 0){
            topRuler.relativePan({x: -widthDif, y: 0});
          }
          else {
            widthDif = (widthDif * -1);
            topRuler.relativePan({x: widthDif, y: 0});
          }
          if(heightDif > 0){
            leftRuler.relativePan({x: 0, y: -heightDif});
          }
          else {
            heightDif = (heightDif * -1);
            leftRuler.relativePan({x: 0, y: heightDif});
          }*/
          var newCoordinates = active_page_object.getBoundingRect();
          var topRulerYDif = (oldCoordinates.left - newCoordinates.left);
          var leftRulerYDif = (oldCoordinates.top - newCoordinates.top);
          var unitx = topRulerYDif;
          var delta = new fabric.Point(-unitx,0);
          topRuler.relativePan(delta);
          var unity = leftRulerYDif;
          var delta = new fabric.Point(0,-unity);
          leftRuler.relativePan(delta);
        }
        //pageAdded = false;
        //var pid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        //add_page(pid, presetw, preseth, '#ffffff');
        //addrulernew(ixx, iyy);
        changePage = false;
        addrulernew(-300, -300);
        //console.log('22');
        //setPageSettings();
        $('.toolbarPanel_4 .toolbarPanel_4-overlay').remove();
      });
    }
    /*else {
      console.log("presetName 1 "+presetName);
      //presetVal = '';
      presetName = 'Custom';
      jQuery("#preset-size").attr('preset-tid', presetVal);
      jQuery("#preset-size").attr('preset-name', presetName);
      jQuery('#header .selectedpreset #preset-name').text(presetName);
    }*/
	}
}
/**
 * Callback function setPageSettings()
 * to set the page settings right panel
 **/
function setPageSettings(){
  if(presetVal !== ''){
    design_id = getUrlDesignID();
    var getPageSetings = media_base_url+'/tokendata?_format=json';
    var url_data = {vid : "image_preset", 'presetVal' : presetVal, 'image_preset_selector': 'yes'}
    $.getJSON(getPageSetings, url_data, function( pageSetings ) {
      //[{"tid":"566","name":"Instagram Post","format":"png","color_space":"sRGB","dpi":null}]
      if(pageSetings[0].color_space !== null){
        if(design_id === ''){
          jQuery("#kmds-color-space").val(pageSetings[0].color_space);
        }
        jQuery("#kmds-color-space").attr("preset-value", pageSetings[0].color_space);
      }
      if(pageSetings[0].format !== null){
        if(design_id === ''){
          jQuery("#kmds-format").val(pageSetings[0].format);
          if(pageSetings[0].format == 'pdf'){
            addPageMediaBox();
          }
        }
        jQuery("#kmds-format").attr("preset-value", pageSetings[0].format);
      }
      if(pageSetings[0].dpi !== null){
        if(design_id === ''){
          jQuery("#kmds-dpi").val(pageSetings[0].dpi);
        }
        jQuery("#kmds-dpi").attr("preset-value", pageSetings[0].dpi);
      }
      if(pageSetings[0].unit !== null){
        var unit_of_measurement = {'pixels':'px', 'inches':'in'};
        if(design_id === ''){
          jQuery("#measurements").val(unit_of_measurement[pageSetings[0].unit]);
        }
        jQuery("#measurements").attr("preset-value", unit_of_measurement[pageSetings[0].unit]);
      }
    });
  }
}
/**
 * Callback function setPageSizeOption()
 * to set the page size option in right panel
 **/
function setPageSizeOption(pw = null, ph = null){
  design_id = getUrlDesignID();
  var cunit = jQuery("#measurements").val();
  var pageWidth = parseFloat(jQuery('#canvas-width').val()).toFixed(2);
  //console.log("pageWidth 4 ="+pageWidth);
  var pageHeight = parseFloat(jQuery('#canvas-height').val()).toFixed(2);
  /*if(cunit == 'in' && pageUnit == 'in'){
    pageWidth =  parseInt(pageWidth*72);
    pageHeight = parseInt(pageHeight*72);
  }*/
  var pWpH_null = false;
  if(pw == null && ph == null){
    pWpH_null = true;
  }
  pw = (pw == null) ? pageWidth : pw;
  ph = (ph == null) ? pageHeight : ph;
  if(cunit == 'in' && pw !== '' && pw !== null && $.isNumeric(pw)){
    pw = parseFloat(pw).toFixed(2);
    ph = parseFloat(ph).toFixed(2);
  }
  //var savedPresetName = jQuery("#preset-size").attr('preset-name', presetName);
  if(presetName !== 'Custom'){
    if(pWpH_null && $("#preset-size option[preset-tid='"+presetVal+"']").length > 0){
      jQuery("#preset-size option[preset-tid='"+presetVal+"']").prop('selected', true);
      jQuery('#header .selectedpreset #preset-name').text(presetName);
      jQuery("#preset-size").attr('preset-tid', presetVal);
      jQuery("#preset-size").attr('preset-name', presetName);
    }
    else if($("#preset-size option[value='"+pw+"x"+ph+"']").length > 0){
      jQuery("#preset-size").val(pw+"x"+ph);
      presetVal = jQuery('option:selected', "#preset-size").attr('preset-tid');
      presetName = jQuery('option:selected', "#preset-size").text();
      jQuery('#header .selectedpreset #preset-name').text(presetName);
      jQuery("#preset-size").attr('preset-tid', presetVal);
      jQuery("#preset-size").attr('preset-name', presetName);
    }
    else {
      //console.log("1 >> pw = "+pw+" -- ph = "+ph);
      //presetVal = '';
      presetName = 'Custom';
      jQuery("#preset-size").attr('preset-tid', presetVal);
      jQuery("#preset-size").attr('preset-name', presetName);
      //jQuery("#preset-size option[preset-tid='"+presetVal+"']").prop('selected', true);
      jQuery('#header .selectedpreset #preset-name').text(presetName);
      jQuery("#preset-size option[preset-name='Custom']").remove();
      if(!$("#preset-size option[preset-name='Custom']").length > 0){
        //var pw = parseFloat(jQuery('#canvas-width').val()).toFixed(2);
        //var ph = parseFloat(jQuery('#canvas-height').val()).toFixed(2);
        var preset_tid = jQuery("#preset-size").attr("preset-tid");
        jQuery("#preset-size").append('<option preset-name="Custom" preset-tid="'+preset_tid+'" value="'+pw+'x'+ph+'" page-width="'+pw+'" page-height="'+ph+'">'+presetName+'</option>');
        jQuery("#preset-size option[preset-name='Custom']").prop('selected', true);
      }
    }
  }
  else {
    //console.log("2 >> pw = "+pw+" -- ph = "+ph);
    //presetVal = '';
    presetName = 'Custom';
    jQuery("#preset-size").attr('preset-tid', presetVal);
    jQuery("#preset-size").attr('preset-name', presetName);
    //jQuery("#preset-size option[preset-tid='"+presetVal+"']").prop('selected', true);
    jQuery('#header .selectedpreset #preset-name').text(presetName);
    jQuery("#preset-size option[preset-name='Custom']").remove();
    if(!$("#preset-size option[preset-name='Custom']").length > 0){
      //var pw = parseFloat(jQuery('#canvas-width').val()).toFixed(2);
      //var ph = parseFloat(jQuery('#canvas-height').val()).toFixed(2);
      var preset_tid = jQuery("#preset-size").attr("preset-tid");
      jQuery("#preset-size").append('<option preset-name="Custom" preset-tid="'+preset_tid+'" value="'+pw+'x'+ph+'" page-width="'+pw+'" page-height="'+ph+'">'+presetName+'</option>');
      jQuery("#preset-size option[preset-name='Custom']").prop('selected', true);
    }
  }
  if(design_id === ''){
    setPageSettings();
  }
	jQuery('#header .selectedpreset #preset-name').attr('href', '/kmds/design/'+uid+'/'+productId+'/'+producTypeId);
}
/****************End add Page from right side bar************/

/****************Start add Page in left side bar************/
function add_page(page_id, pw, ph, old_page_color = null, layout = null, pageOrder = null) {
	pageAdded = true;
	//$('.page-row.g-active').removeClass('g-active');
	if(pageOrder == null){
    if($('.page-row').length == 0) {
      counter = 1;
    }else {
      counter++;
    }
  }
  else {
    counter = pageOrder;
  }
  var layout_disabled = ' disabled';
  if(layout !== null){
    layout_disabled = '';
  }
  var layout_active = ' layout-active';
  var pageLayout = canvas.getItemById("layout-"+counter);
  if(pageLayout){
    if(pageLayout.hide_data == 1){
      layout_active = '';
    }
  }
  var pageClass = (counter == 1) ? 'd-flex page-row align-items-center g-active' : 'd-flex page-row align-items-center';
  //console.log("pageClass = "+pageClass);
	var page_html =  $("<div></div>").attr("class", pageClass).attr('id', page_id).attr('onclick', 'pageClick(this)').attr('old_page_color', old_page_color).attr('page-no', counter)
	.append(
		$("<span></span>").attr("class", "d-flex page-title-group align-items-center")
		.append($("<span></span>").attr("class", "page-icon far fa-file"))
		.append($("<span></span>").attr("class", "page-title").text('Page '+ counter +''))
	).append(
		$('<span/>', {
			//"class": "page-action fas fa-exchange-alt",
			"class": "page-action page-layout-visibility"+layout_active+layout_disabled,
			"data-title": "Toggle Page Layout",
			"data-placement": "bottom",
			"data-toggle": "tooltip",
			"onmouseover": "tooltipfn(this)",
			'html': '&nbsp;',
		})
	).append(
		$('<span/>', {
			"class": "page-action page-lock-icon c-pointer fas fa-unlock-alt fa fa-flip-horizontal",
			"data-title": "Toggle Locker",
			"data-placement": "bottom",
			"data-toggle": "tooltip",
			"onmouseover": "tooltipfn(this)",
			"onclick": "pageLocking(this)",
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
	//var pw = $('#canvas-width').val();
	//var ph = $('#canvas-height').val();
  design_id = getUrlDesignID();
  //leftmargin = parseInt(((visiblewidth - 560 )/2)-(pw/2)); // using in ruler guides
  //topmargin = parseInt(visibleheight-(ph/2)); // using in ruler guides
  if(design_id === ''){
    add_rectangle(page_id, 'Page '+ counter, pw, ph, counter, layout);
	}
  else {
    if(counter !== 1){
      var pageObj = canvas.getItemById(page_id);
      pageObj.set('visibility', false);
      pageObj.set('opacity', 0);
      canvas.renderAll();
    }
    //Add crop area
    //addPageMediaBox(page_id);
  }
	//activePage = $('.page-row.g-active').attr('id');
  activePage = $('.page-row[page-no=1]').attr('id')
	activePageObj = canvas.getItemById(activePage);
	addrulernew(0,0);
  //console.log('23');
  //console.log(activePage);
	//For dynamic data icon hide/show in left side.
  $(".page-row").mouseenter(function() {
    var id = $(this).attr("id");
		activePageObject(id, 'active');
  }).mouseleave(function() {
    var id = $(this).attr("id");
		activePageObject(id, 'inactive');
  });
  if($("#pages .page-row").length > 1){
    sortPageList();
  }
}
/****************End add Page in left side bar************/

function FnToggleLayers(e){
	var pid = $(e).parent('.parent-layer').attr('id');
	if($(e).hasClass('fa-caret-down')){
		$(e).removeClass('fa-caret-down').addClass('fa-caret-right');
		if($(e).hasClass('tool-group-ico') == false){
			$(e).parent('.parent-layer').find('.layer-icon').removeClass('far').addClass('fas');
		}
		$('.layer-row.child-layer').each(function(){
			var dgroup = $(this).attr('data-group');
			if(dgroup === pid){
				$(this).removeClass('d-flex').addClass('d-none');
			}
		})
	} else {
		$(e).removeClass('fa-caret-right').addClass('fa-caret-down');
		if($(e).hasClass('tool-group-ico') == false){
			$(e).parent('.parent-layer').find('.layer-icon').removeClass('fas').addClass('far');
		}
		$('.layer-row.child-layer').each(function(){
			var dgroup = $(this).attr('data-group');
			if(dgroup === pid){
				$(this).removeClass('d-none').addClass('d-flex');
			}
		})
	}
}

/**
 * callback function layersRearrangement for re-indexing/bringForward/sendBackwards
 */
function layerReordering(){
	if(isDown){return;}
	//$('#layers .layer-row').each(function(){
  var activepage = jQuery('.page-row.g-active').attr('id');
  var totalLen = $('.layer-row').length;
  var aid = jQuery('.page-row[page-no=1]').attr('id');
  var pageOneLayers = parseInt($('.layer-row[data-pageid="'+aid+'"]').length);
  var layout2Position = totalLen - pageOneLayers;
	$('#pages .page-row').each(function(){
    var pageID = $(this).attr('id');
    $('#layers .layer-row[data-pageid="'+pageID+'"]').each(function(){
      var index = $(this).index();
      //var totalLen = $('.layer-row').length;
      //var totalLen = $('.layer-row[data-pageid="'+activepage+'"]').length;
      $(this).attr('order', parseInt(totalLen - index));
      var parent_index = '';
      var title_group = '';					
      var objectgroup = false;			
      var itemID = $(this).attr("id");
      var parentID = $(this).attr("data-group");
      if(parentID){
        parent_index = $("#"+parentID).attr('order');
        title_group = $("#"+parentID).find(".layer-title-group .layer-title").text();
        if($('#'+parentID).hasClass('tool-group')){
          var objectgroup = true;
        } else {
          var objectgroup = false;						
        }
      }
      if(!($(this).hasClass('.parent-layer'))){
        var lob = canvas.getItemById($(this).attr('id'));
        var odr = $(this).attr('order');
        if(lob){
          /* console.log('next_id = '+parentID);
          console.log('objectgroup = '+objectgroup);
          console.log('title_group = '+title_group);
          console.log('parent_index = '+parent_index);
          console.log('itemID = '+itemID);
          console.log('lob.id = '+lob.id+' Layerindexing = '+lob.layerIndexing);
           */
          lob.set({
            objectGroup : objectgroup,
            layerGroup : parentID,
            layerGroupTitle : title_group,
            parentlayerOrder : parent_index,
            layerIndexing : parseInt(odr),
          });
          canvas.renderAll();
        }
      }
      canvas.forEachObject(function(o){
        if(o.type == 'page'){
          var activepage = jQuery('.page-row.g-active').attr('id');
          activePageObj = canvas.getItemById(activePage);
          var pageIndex = canvas.getObjects().indexOf(activePageObj);
          //console.log('pageIndex layerreordering - '+pageIndex);
          if(pageIndex != 0 ){
            canvas.moveTo(activePageObj, 0);
            canvas.renderAll();	
          } 
          //console.log('pageIndex 2 - '+pageIndex);
          canvas.renderAll();
        }
        else if(o.id == 'layout-1' || o.id == 'layout-2'){
          canvas.moveTo(o, 0);
          canvas.renderAll();	
        }
        else if(o.id == 'layout-2'){
          canvas.moveTo(o, layout2Position);
          canvas.renderAll();	
        }
        else if(o.type == 'PageMediaBox'){
          canvas.moveTo(o, 0);
          canvas.renderAll();	
        }
        /*else if(o.type == 'PageMediaBox'){
          var activepage = jQuery('.page-row.g-active').attr('id');
          if(o.id == activePage+'MediaBox'){
            canvas.sendToBack(o);
            canvas.renderAll();	
          }
        }
        else if(o.type == 'PageTrimBox'){
          canvas.bringForward(o);
          canvas.renderAll();	
        }*/
        else if(o.type != 'page' && o.type != 'text' && o.type != 'line' && o.type != 'guideline' && o.type != 'Lineshape' && o.type != 'ConnectorHandleStart' && o.type != 'ConnectorHandleEnd' && o.type != 'PageTrimBox' && o.type != 'PageMediaBox'){
          var activepage = jQuery('.page-row.g-active').attr('id');
          if(o.id && o.id !== 'layout-1' && o.id !== 'layout-2' && o.page == activepage){
            //var ord = $('#'+o.id).attr('order');
            var ord = ($('#'+o.id).length) ? $('#'+o.id).attr('order') : 1;
            //canvas.moveTo(o, parseInt(ord));		
            canvas.moveTo(o, parseInt(ord));		
            o.set({
              layerIndexing : parseInt(ord),
            });
            canvas.renderAll();
          }
        }
      });
      addPageMediaBox();
    });
	});
	
	//canvas.renderAll();
}

function layerReordering2(){
  var activepage = jQuery('.page-row.g-active').attr('id');
	//$('#layers .layer-row').each(function(){
	$('#layers .layer-row[data-pageid="'+activepage+'"]').each(function(){
		var index = $(this).index();
		//var totalLen = $('.layer-row').length;
		var totalLen = $('.layer-row[data-pageid="'+activepage+'"]').length;
		$(this).attr('order', parseInt(totalLen - index));
		if(!($(this).hasClass('.parent-layer'))){
			var lob = canvas.getItemById($(this).attr('id'));
			var odr = $(this).attr('order');
			if(lob){
				lob.set('layerIndexing', parseInt(odr));
				canvas.moveTo(lob, parseInt(odr));	
				canvas.renderAll();
				if($(this).hasClass('child-layer')){
					if(lob.layerGroup !== ''){
						var parentIndex = $('#'+lob.layerGroup).attr('order');			
						lob.set('parentlayerOrder', parentIndex);
						if($('#'+lob.layerGroup+' .layer-icon').hasClass('fa-object-group')){
							lob.set('objectGroup', true);
						}
					}				
				}
			}
		}
	});
	canvas.renderAll();
}

function sort_layer() {
	$("#layers .template-group").each(function(){
		$(this).html($(this).children('.layer-row').sort(function(a, b){
			return (parseInt($(b).attr('order'))) > (parseInt($(a).attr('order'))) ? 1 : -1;
		}));
	});
}

/****************add Layer in left side bar************/
function add_layer(layer_id, basename, obj_type, page_id, layerGroupId, layerIndexing, imageContainer = null) {
  //console.log("obj_type 1="+obj_type);
	var layer_ico;
	switch(obj_type) {
		case 'textbox':
			layer_ico = 'far km-text fs-22';
			break;
		
		case 'Rectshape':
			layer_ico = 'far fa-square fs-16';
			break;
			
		case 'Lineshape':
			layer_ico = 'fa km-nib fs-20 rotateZ-145';
			break;
			
		case 'circle':
			layer_ico = 'far fa-circle';
			break;
			
		case 'polygon':
			layer_ico = 'fa km-triangle fs-26';
			break;
			
		case 'triangle':
			layer_ico = 'fa km-triangle fs-26';
			break;
			
		case 'star':
			layer_ico = 'km-star fs-26';
			break;
		
		case 'image':
			layer_ico = 'far fa-image';
			
			break;
		
		case 'ImageContainer':
			layer_ico = 'far fa-image';
			
			break;
		
		default:
			// code block
		break;
	}
	if(layerGroupId !== ''){
		var groupId = layerGroupId;
    var activeLayer = '';
		if($('#'+groupId).hasClass('g-has-selection') || $('#'+groupId).hasClass('g-active')){
			if(savedDesignFlag == true){
				var gcl = '';
				if($('#'+groupId).hasClass('tool-group')){
					var gcl = 'tool-group-ico';
				}
				if($('#'+groupId).children('.fa-caret-right').length == 0){
					$('#'+groupId).children('.fa-caret-down').remove();
					$('#'+groupId).prepend('<span class="'+gcl+' fa fa-caret-right pr-2" onclick="FnToggleLayers(this)"></span>');
				}
				var cClass = 'd-none child-layer pl-2rem';
			} else {
				if($('#'+groupId).children('.fa-caret-down').length == 0){
					$('#'+groupId).children('.fa-caret-right').remove();
					$('#'+groupId).prepend('<span class="fa fa-caret-down pr-2" onclick="FnToggleLayers(this)"></span>');
				}
				$('.layer-row.child-layer').each(function(){
					if($(this).attr('data-group') == groupId){
						$(this).removeClass('d-none').addClass('d-flex');
					}
				});
				var cClass = 'd-flex child-layer pl-2rem';
				$('#'+groupId+' .layer-icon').removeClass('fas').addClass('far');
			}
		}
		$('.layer-row.g-active').removeClass('g-active');			
	}	else {
		var groupId = '';
		var cClass = 'd-flex';
		$('.layer-row.g-active').removeClass('g-active');	
	}
	var activetemplateid = $('#header .tabs .tab.g-active').attr('data-id');
	var layertemplategroupid = $('#layers .template-group.group-active').attr('id');

	//Textbox, Lineshape, Rectangle shape, Ellipse shape Layer
	if(obj_type == 'textbox' || obj_type == 'Lineshape' || obj_type == 'Rectshape' || obj_type == 'circle' || obj_type == 'polygon' || obj_type == 'triangle' || obj_type == 'star'){

		//layer lock and visibility on load
		var layerLockIcon = 'fa-unlock-alt';
		var layerShowIcon = 'fa-eye';
		var active_page_object = canvas._objects;
		active_page_object.forEach(function(objv) {	
			if(objv.id == layer_id && objv.lock_position == 1){
				layerLockIcon = 'fa-lock';
			}
			if(objv.id == layer_id && objv.hide_data == 1){
				layerShowIcon = 'fa-eye-slash';
			}
		});

    var layer_html =  $("<div></div>").attr("class", "layer-row "+obj_type+" align-items-center g-active "+cClass+"").attr('order', layerIndexing).attr('data-pageId', page_id).attr('id', layer_id).attr('onclick', 'layerClick(this)').attr('onmousedown', 'layerKeyPressed(event)').attr('data-group', groupId)
    .append(
      $("<span></span>").attr("class", "d-flex layer-title-group align-items-center")
      .append($("<span></span>").attr("class", "layer-icon "+layer_ico+""))
      .append($("<span></span>").attr("class", "layer-title").text(basename))
    ).append(
      $('<span/>', {
        "class": "page-action dynamic-data-icon",
        "data-title": "Toggle Dynamic Data",
        "data-placement": "bottom",
        "data-toggle": "tooltip",
        "onmouseover": "tooltipfn(this)",
        'html': '&nbsp;',
      })
    ).append(
      $('<span/>', {
        "class": "layer-action layer-lock-icon c-pointer fas " + layerLockIcon+ " fa fa-flip-horizontal",
        "data-title": "Toggle Locker",
        "data-placement": "bottom",
        "data-toggle": "tooltip",
        "onmouseover": "tooltipfn(this)",
      })
    ).append(
      $('<span/>', {
        // "class": "layer-action layer-show-icon c-pointer fas fa-eye",
        "class": "layer-action layer-show-icon c-pointer " + layerShowIcon + " fas",
        "data-title": "Layer Visibility",
        "data-placement": "bottom",
        "data-toggle": "tooltip",
        "onmouseover": "tooltipfn(this)",
      })
    );
		//console.log('activeLayerID - '+activeLayerID);
		if(activetemplateid === layertemplategroupid){
			if(groupId !== ''){
				 if($('#'+groupId).hasClass('g-has-selection') || $('#'+groupId).hasClass('g-active')){
          if($('#'+groupId).hasClass('g-active')){
            var referenceNode = document.getElementById(groupId);
            layer_html.insertAfter(referenceNode);
          }
          else if($('#'+groupId).hasClass('g-has-selection')){
            if(activeLayerID){
              if($('#'+activeLayerID).hasClass('parent-layer')){
                var referenceNode = document.getElementById(activeLayerID);
                layer_html.insertAfter(referenceNode);
              }
              else {
                var referenceNode = document.getElementById(activeLayerID);
                layer_html.insertBefore(referenceNode);
              }
            }
            else {
              var referenceNode = document.getElementById(groupId);
              layer_html.insertAfter(referenceNode);
            }
          }
				}
			} else {
				//console.log(activeLayerID);
        //console.log("activeLayerID 1 = "+activeLayerID)
        if(activeLayerID && !(redoing)){
					var referenceNode = document.getElementById(activeLayerID);
					layer_html.insertBefore(referenceNode);
        }
        else {
          $('#layers #'+layertemplategroupid).prepend(layer_html);
        }
			}
		}
  }
  
  if(obj_type == 'image' || obj_type == 'ImageContainer'){
    var containerId = '';
    if(imageContainer !== null){
      containerId = imageContainer;
      var cClass = 'd-flex container-image';
      /*if(basename == 'defaultImage'){
        var cClass = 'd-none container-image';
      }*/
    }
    var layerRowClass = (obj_type == 'ImageContainer') ? ' imageContainer' : '';
    //console.log("obj_type 2="+obj_type);
		//layer lock and visibility on load
		var layerLockIcon = 'fa-unlock-alt';
		var layerShowIcon = 'fa-eye';
		var active_page_object = canvas._objects;
		active_page_object.forEach(function(objv) {	
			if(objv.id == layer_id && objv.lock_position == 1){
				layerLockIcon = 'fa-lock';
			}
			if(objv.id == layer_id && objv.hide_data == 1){
				layerShowIcon = 'fa-eye-slash';
			}
		});
    var layer_image_html =  $("<div></div>").attr("class", "layer-row image"+layerRowClass+" align-items-center g-active "+cClass+"").attr('order', layerIndexing).attr('data-pageId', page_id).attr('id', layer_id).attr('onclick', 'layerClick(this)').attr('onmousedown', 'layerKeyPressed(event)').attr('data-group', groupId).attr('data-container', containerId)
    .append(
      $("<span></span>").attr("class", "d-flex layer-title-group align-items-center")
      .append($("<span></span>").attr("class", "layer-icon "+layer_ico+""))
      .append($("<span></span>").attr("class", "layer-title").text(basename.trunc(20)))
    )/*.append (
      $('<span/>', {
        //"class": "layer-action c-pointer fas fa-exchange-alt",
        "class": "page-action dynamic-data-icon",
        "data-title": "Toggle Dynamic Data",
        "data-placement": "bottom",
        "data-toggle": "tooltip",
        "onmouseover": "tooltipfn(this)",
        'html': '&nbsp;',
      })
    )*/.append (
      $('<span/>', {
        "class": "layer-action layer-lock-icon c-pointer fas " + layerLockIcon+ " fa fa-flip-horizontal",
        "data-title": "Toggle Locker",
        "data-placement": "bottom",
        "data-toggle": "tooltip",
        "onmouseover": "tooltipfn(this)",
      })
    ).append(
      $('<span/>', {
        "class": "layer-action layer-show-icon c-pointer fas " + layerShowIcon,
        "data-title": "Layer Visibility",
        "data-placement": "bottom",
        "data-toggle": "tooltip",
        "onmouseover": "tooltipfn(this)",
      })
    );

		if(activetemplateid === layertemplategroupid){
			if(groupId !== ''){
				if($('#'+groupId).hasClass('g-has-selection') || $('#'+groupId).hasClass('g-active')){
          if($('#'+groupId).hasClass('g-active')){
            var referenceNode = document.getElementById(groupId);
            layer_image_html.insertAfter(referenceNode);
          }
          else if($('#'+groupId).hasClass('g-has-selection')){
            if(activeLayerID){
              if($('#'+activeLayerID).hasClass('parent-layer')){
                var referenceNode = document.getElementById(activeLayerID);
                layer_image_html.insertAfter(referenceNode);
              }
              else {
                var referenceNode = document.getElementById(activeLayerID);
                layer_image_html.insertBefore(referenceNode);
              }
            }
            else {
              var referenceNode = document.getElementById(groupId);
              layer_image_html.insertAfter(referenceNode);
            }
          }
				}
			}
      else if(containerId !== '' && $('#'+containerId).length){
        var referenceNode = document.getElementById(containerId);
        if(basename == 'defaultImage'){
          layer_image_html.insertBefore(referenceNode);
        }
        else {
          layer_image_html.insertAfter(referenceNode);
        }
        //console.log("containerId IN = "+containerId);
      }
      else {
				//console.log(activeLayerID);
        //console.log("activeLayerID 2 = "+activeLayerID)
        if(activeLayerID && !(redoing)){
					var referenceNode = document.getElementById(activeLayerID);
					layer_image_html.insertBefore(referenceNode);
        }
        else {
          $('#layers #'+layertemplategroupid).prepend(layer_image_html);
        }
			}
		}
    if(obj_type === 'ImageContainer'){
      var obj = canvas.getItemById(layer_id);
      if(obj && obj.containerImage !== ''){
        if(!$("#"+layer_id+".imageContainer .kmds-image-crop-wrapper").length){
          $("#"+layer_id+".imageContainer .layer-title-group").after($("<span></span>").attr("class", "kmds-image-crop-wrapper layer-icon").attr("id", "kmdsImageCrop").html("&nbsp;"));
        }
      }
      else {
        $("#"+layer_id+".imageContainer .layer-title-group").after($("<span></span>").attr("class", "media-kit-image-list layer-icon far fa-image"));
      }
    }
    if(containerId !== ''){
      $("#"+layer_id+".container-image .layer-title-group").before($("<span></span>").attr("class", "container-image-icon layer-icon").html("&nbsp;"));
      $("#"+layer_id+".container-image .layer-title-group").after($("<span></span>").attr("class", "container-image-delete fas fa-trash-alt").html("&nbsp;"));
      $("#"+layer_id+" .layer-action.layer-lock-icon").addClass('d-none');
      $("#"+layer_id+" .layer-action.layer-show-icon").addClass('d-none');
      $('#'+containerId).addClass('g-active')
    }
  }

	//mouse hover for parent layer
	$("#layers .layer-row.parent-layer").on('mouseenter', function() {
		if(handSelected || zoomInTool){return;} 
		var id = $(this).attr("id");
		if($('#layers #'+id+' .layer-lock-icon').hasClass('fa-unlock-alt') && $('#layers #'+id+' .layer-show-icon').hasClass('fa-eye')){
			groupLayerObjects(id, true, false);
		} else if($('#layers #'+id+' .layer-lock-icon').hasClass('fa-lock')){
			groupLayerObjects(id, true, false);
		}
	});
	
	$("#layers .layer-row.parent-layer").on('mouseleave', function() {
		if(handSelected || zoomInTool){return;}
		var id = $(this).attr("id");
		if($('#layers #'+id+' .layer-lock-icon').hasClass('fa-unlock-alt') && $('#layers #'+id+' .layer-show-icon').hasClass('fa-eye')){
			groupLayerObjects(id, false, false);
		} else if($('#layers #'+id+' .layer-lock-icon').hasClass('fa-lock')){
			groupLayerObjects(id, false, false);
		}
	});

	//mouse hover for all layers except parent layers
	//For dynamic data icon hide/show in left side.
	$("#layers .layer-row:not(.parent-layer)").on('mouseenter', function() {
		if(handSelected || zoomInTool){ return;}
		/*if(!$(this).hasClass('editable')){
			$(this).find('.dynamic-data-icon').show();
		}*/
		var id = $(this).attr("id");
		activeLayerObject(id, 'active');
	});
	
	$("#layers .layer-row:not(.parent-layer)").on('mouseleave', function() {
		if(handSelected || zoomInTool){return;}
		/*if($(this).find('.dynamic-data-icon').hasClass("dynamic-active")){
			return;
		}
		$(this).find('.dynamic-data-icon').hide();*/
		var id = $(this).attr("id");
		activeLayerObject(id, 'inactive');
	});
  sort_layer();
}

/*****************Keyboard event ******************/

document.onkeyup = function(e) {
	var key;
	if(window.e){
		key = window.e.keyCode;
	}
	else{
		key = e.keyCode;
	}

	switch(key){
		case 32: //handpan "leaving spacebar"
      jQuery('#toolbar .toolber-button .action-button.g-active').removeClass('g-active');
			if(handSelected){
        handSelected = false;
        $('#toolbar .toolbar-button button[data-title=Select]').trigger('click');
				//$(lastClickedTool).trigger('click');
			}
			break;
			
		default:
			break;
	}
}

$(window).bind('mousewheel DOMMouseScroll', function (event) {
	if (event.ctrlKey == true) {
		event.preventDefault();
	}
});

document.onkeydown = function(e) {
  // console.log(e.keyCode); 
	var key;
	if(window.e){
		key = window.e.keyCode;
	}
	else{
		key = e.keyCode;
	}
	
	if (e.ctrlKey==true && (e.which == '61' || e.which == '107' || e.which == '173' || e.which == '109'  || e.which == '187' || e.which == '189')) {
		e.preventDefault(); //stop browser zooming and cntrl event
	}
	// 107 Num Key  +
	// 109 Num Key  -
	// 173 Min Key  hyphen/underscor Hey
	// 61 Plus key  +/= key
	
	switch(key){
		case 90: // redo/undo Ctrl+Z and Ctrl+Shift+Z
			if(e.ctrlKey && !e.shiftKey){  //Undo  Ctrl+Z
				undo();
			} else if(e.ctrlKey && e.shiftKey){ // Redo  Ctrl+Shift+Z
				redo();
			}
			
			break;

		case 38:  /* Up arrow */
        if(canvas.getActiveObject()){
					var activeObj = canvas.getActiveObject();
					if(activeObj.type == 'activeSelection' || activeObj.type == 'group'){
						var aObj = $('.layer-row.parent-layer.g-active').attr('id');
					} else {
						var aObj = activeObj.id;
					}
					if(!e.shiftKey && !e.ctrlKey){
						activeObj.top -= 1;
						canvas.renderAll();
            var activeObjCoords = activeObj.getBoundingRect(true, true);
						var p_y = new setProperties('pos-y', Math.round(activeObjCoords.top - topmargin))
						p_y.properties();
						if(multipageToggle == false){
							activeObj.set({
								actualTop: activeObj.top,
							});
						}
						savedDesignFlag = false;
					} else if(e.shiftKey && e.ctrlKey){  //bringToFront // Shift+Ctrl+Up
						if($('#layers #'+aObj).hasClass('child-layer')){
							activeObj.top -= 10;
							canvas.renderAll();
              var activeObjCoords = activeObj.getBoundingRect(true, true);
							var p_y = new setProperties('pos-y', Math.round(activeObjCoords.top - topmargin))
							p_y.properties();
							if(multipageToggle == false){
								activeObj.set({
									actualTop: activeObj.top,
								});
							}
							savedDesignFlag = false;
						} else {
							layerReording = true;
							layerObjectReordering('bringToFront');
							layerReording = false;
						}						
					} else if(!e.shiftKey && e.ctrlKey){  //bringForward // Ctrl+Up		
						if($('#layers #'+aObj).hasClass('child-layer')){
							activeObj.top -= 1;
							canvas.renderAll(); 
              var activeObjCoords = activeObj.getBoundingRect(true, true);
							var p_y = new setProperties('pos-y', Math.round(activeObjCoords.top - topmargin))
							p_y.properties();
							if(multipageToggle == false){
								activeObj.set({
									actualTop: activeObj.top,
								});
							}
							savedDesignFlag = false;
						} else {
							layerReording = true;
							layerObjectReordering('bringForward');
							layerReording = false;
						}
					}
					
					if(!savedDesignFlag){
						DetectTemplateChanges();
					}
        }
      break;
			
    case 40:  /* Down arrow  */
        if(canvas.getActiveObject()){
					var activeObj = canvas.getActiveObject();
					if(activeObj.type == 'activeSelection' || activeObj.type == 'group'){
						var aObj = $('.layer-row.parent-layer.g-active').attr('id');
					} else {
						var aObj = activeObj.id;
					}
					if(!e.shiftKey && !e.ctrlKey){
						activeObj.top += 1;
						canvas.renderAll();
            var activeObjCoords = activeObj.getBoundingRect(true, true);
						var p_y = new setProperties('pos-y', Math.round(activeObjCoords.top - topmargin))
						p_y.properties();
						if(multipageToggle == false){
							activeObj.set({
								actualTop: activeObj.top,
							});
						}
						savedDesignFlag = false;
					} else if(e.shiftKey && e.ctrlKey){  //sendToBack // Shift+Ctrl+Down
						if($('#layers #'+aObj).hasClass('child-layer')){
							activeObj.top += 10;
							canvas.renderAll();
              var activeObjCoords = activeObj.getBoundingRect(true, true);
							var p_y = new setProperties('pos-y', Math.round(activeObjCoords.top - topmargin))
							p_y.properties();
							if(multipageToggle == false){
								activeObj.set({
									actualTop: activeObj.top,
								});
							}
							savedDesignFlag = false;
						} else {
							layerReording = true;
							layerObjectReordering('sendToBack');
							layerReording = false;							
						}						
					} else if(!e.shiftKey && e.ctrlKey){  //sendBackwards // Ctrl+Down
						if($('#layers #'+aObj).hasClass('child-layer')){
								activeObj.top += 1;
								canvas.renderAll();
                var activeObjCoords = activeObj.getBoundingRect(true, true);
								var p_y = new setProperties('pos-y', Math.round(activeObjCoords.top - topmargin))
								p_y.properties();
								if(multipageToggle == false){
									activeObj.set({
										actualTop: activeObj.top,
									});
								}
								savedDesignFlag = false;
						} else {
							layerReording = true;
							layerObjectReordering('sendBackwards');
							layerReording = false;
						}
					}

					if(!savedDesignFlag){
						DetectTemplateChanges();
					}
        }
      break;
			
    case 37:  /* Left arrow  */
        if(canvas.getActiveObject()){
					var activeObj = canvas.getActiveObject();
          activeObj.left -= 1; 
          canvas.renderAll();
          var activeObjCoords = activeObj.getBoundingRect(true, true);
					var p_x = new setProperties('pos-x', Math.round(activeObjCoords.left - leftmargin));
					p_x.properties();	
					if(multipageToggle == false){
						activeObj.set({
							actualLeft: activeObj.left,
						});
					}
					updateCanvasState();
					savedDesignFlag = false;
					if(!savedDesignFlag){
						DetectTemplateChanges();
					}
        }
      break;
			
    case 39:  /* Right arrow  */
        if(canvas.getActiveObject()){
					var activeObj = canvas.getActiveObject();
          activeObj.left += 1; 
          canvas.renderAll();
          var activeObjCoords = activeObj.getBoundingRect(true, true);
					var p_x = new setProperties('pos-x', Math.round(activeObjCoords.left - leftmargin));
					p_x.properties();	
					if(multipageToggle == false){
						activeObj.set({
							actualLeft: activeObj.left,
						});
					}
					updateCanvasState();
					savedDesignFlag = false;
					if(!savedDesignFlag){
						DetectTemplateChanges();
					}
        }
      break;
			
    case 46:  /* delete */
        if(canvas.getActiveObject() && !canvas.getActiveObject().isEditing){
          //to delete active object.
          deleteSelectedObject();
        }
      break;
			
		case 32: //handpan "press spacebar"
			if(canvas.getActiveObject() && canvas.getActiveObject().type == 'textbox' && canvas.getActiveObject().isEditing){
				return;
			}
			if(e.target.type != 'text'){
        jQuery('#toolbar .toolber-button .action-button.g-active').removeClass('g-active');
        if(handSelected == false){
          $('#toolbar .toolbar-button #handtool').trigger('click');
        }
        /*else {
          handSelected = false;
          $('#toolbar .toolbar-button button[data-title=Select]').trigger('click');
        }*/
      }
			break;
			
		case 97: //zoom "ctrl+1"
			//100%
      if(e.ctrlKey){
        var zoomv = 100;
        jQuery('#zoomb .caption').html(zoomv+'%');
        zoomv = zoomv/100;
        //canvas.zoomToPoint(new fabric.Point(activePageObj.left, activePageObj.top), zoomv);
        kmdsDesignZoomIn(zoomv);
        //addrulernew(ixx, iyy);
        //console.log('1');
      }
			break;
			
		case 98: //zoom "ctrl+2"
			//200%
      if(e.ctrlKey){
        var zoomv = 200;
        jQuery('#zoomb .caption').html(zoomv+'%');
        zoomv = zoomv/100;
        //canvas.zoomToPoint(new fabric.Point(activePageObj.left, activePageObj.top), zoomv);
        kmdsDesignZoomIn(zoomv);
        //addrulernew(ixx, iyy);
        //console.log('2');
			}
      break;
			
		case 100: //zoom "ctrl+4"
			//400%
      if(e.ctrlKey){
        var zoomv = 400;
        jQuery('#zoomb .caption').html(zoomv+'%');
        zoomv = zoomv/100;
        //canvas.zoomToPoint(new fabric.Point(activePageObj.left, activePageObj.top), zoomv);
        kmdsDesignZoomIn(zoomv);
        //addrulernew(ixx, iyy);
        //console.log('3');
      }
			break;
			
		case 101: //zoom "ctrl+5"
			//50%
      if(e.ctrlKey){
        var zoomv = 50;
        jQuery('#zoomb .caption').html(zoomv+'%');
        zoomv = zoomv/100;
        //canvas.zoomToPoint(new fabric.Point(activePageObj.left, activePageObj.top), zoomv);
        kmdsDesignZoomIn(zoomv);
        //addrulernew(ixx, iyy);
        //console.log('4');
      }
			break;
			
		case 104: //zoom "ctrl+8"
			//800%
      if(e.ctrlKey){
        var zoomv = 800;
        jQuery('#zoomb .caption').html(zoomv+'%');
        zoomv = zoomv/100;
        //canvas.zoomToPoint(new fabric.Point(activePageObj.left, activePageObj.top), zoomv);
        kmdsDesignZoomIn(zoomv);
        //addrulernew(ixx, iyy);
        //console.log('5');
      }
			break;
			
		case 96: //zoom "ctrl+0"
			//original-view reset zoom
      if(e.ctrlKey){
        var zoomv = 100;
        jQuery('#zoomb .caption').html(zoomv+'%');
        zoomv = zoomv/100;
        //canvas.zoomToPoint(new fabric.Point(activePageObj.left, activePageObj.top), zoomv);
        kmdsDesignZoomOut(zoomv);
        //addrulernew(ixx, iyy);
        //console.log('6');
      }
			break;
			
		case 187: //zoomIn "ctrl++"
			//zoomin
      if(e.ctrlKey){
        var zoomin = $('#zoomb .caption').text();
        zoomin = zoomin.split('%')[0]
        var i = z.indexOf(parseInt(zoomin));
        if(i === -1){
          zoomin = closest(z, zoomin, 'zoomin');
        } else {
          zoomin = z[i+1];
        }
        if(typeof zoomin == 'undefined') { return; }
        $('#zoomb .caption').html(zoomin+'%');
        zoomin = zoomin/100;
        //canvas.zoomToPoint(new fabric.Point(activePageObj.left, activePageObj.top), zoomin);
        kmdsDesignZoomIn(zoomin);
        //addrulernew(ixx, iyy);
        //console.log('7');
      }
			break;
			
		case 189: //zoom "ctrl+-"
			//zoomout
      if(e.ctrlKey){
        var zoomout = $('#zoomb .caption').text();
        zoomout = zoomout.split('%')[0];
        var i = z.indexOf(parseInt(zoomout));
        if(i === -1){
          zoomout = closest(z, zoomout, 'zoomout');
        } else {
          zoomout = z[i-1];
        }
        if(typeof zoomout == 'undefined') { return; }
        $('#zoomb .caption').html(zoomout+'%');
        zoomout = zoomout/100;
        //canvas.zoomToPoint(new fabric.Point(activePageObj.left, activePageObj.top), zoomout);
        kmdsDesignZoomOut(zoomout);
        //addrulernew(ixx, iyy);
        //console.log('8');
      }
			break;
			
		case 82:
			if(e.ctrlKey && e.altKey){
				toggleRulers();
			}
			break;
    // To hide the guide
		case 188://CTRL + ,
			if(e.ctrlKey){
				toggleGuides();
			}
			break;
		// To hide the ruler and guide
		case 65://CNTRL + ALT + A
			if(e.ctrlKey && e.altKey){
				if (rulerStatus === 1 || guideStatus === 1) {
					rulerStatus = guideStatus = 1;
				} else {
					rulerStatus = guideStatus = 0;
				}
				toggleRulers();
				toggleGuides();
			}
			break;
		case 8:// backspace pressed
      /*var obj = canvas.getActiveObject();
      if(obj){
        //console.log("Type = "+obj.type);
        if(obj.type === 'textbox'){
            obj.set({
              text: 'Masoom',
              //old_text: updated_text,
            });
            canvas.renderAll();
            canvas.setActiveObject(obj);
          var updated = false;
          var old_text = obj.old_text;
          //console.log("old_text = "+old_text);
          var data = old_text.split(" ");
          var obj_text = obj.text;
          canvas.renderAll();
          //console.log("obj_text = "+obj_text);
          var actual_text = obj_text.split(" ");
          for (var a = 0; a < data.length; a++) {
            if (actual_text[a] != data[a]) {
              //console.log("Matched = "+actual_text[a]);
              var str_arr = actual_text[a].split('');
              if(str_arr[0] == '#'){
                actual_text.splice(a, 1);
                updated = true;
                break;
              }
            }
          }
          if(updated){
            var updated_text = actual_text.join(" ");
            //console.log("updated_text = "+updated_text);
            obj.set({
              text: updated_text,
              //old_text: updated_text,
            });
            canvas.renderAll();
            canvas.setActiveObject(obj);
        //console.log(JSON.stringify(obj));
          }
        }
      }*/
    break;
    case 78: //New Design "Alt+N"
      if(e.altKey && e.keyCode == 78){
        window.location.href = '/kmds/design';
      }
     break;
    case 83:// SHIFT + CNTRL + S
			if(e.ctrlKey && e.shiftKey){
				e.preventDefault();
				openSaveAsTemplateModal();
			}
      else if(e.ctrlKey){
        e.preventDefault();
        var t = checkDesign();
        if (t === false) {
          openSaveTemplateModal();
        } else {
          kmdsToolSettingSave();
        }
      }
		break;
		default:
			break;
	}
}

/**
 * Callback function deleteSelectedObject()
 * to delete active object.
 **/
function deleteSelectedObject(){
  //console.log("Delete 1");
  var activeObj = canvas.getActiveObject();
  if(activeObj){
    //console.log("Delete 2");
    canvas.getActiveObjects().forEach((obj) => {
      if(activeObj.type == 'activeSelection'){
        //console.log("Delete 4");
        var groupFolderID = $('.layer-row.parent-layer.g-active').attr('id');
				$('.layer-row.child-layer').each(function(){
					if($(this).attr('data-group') == groupFolderID){
            //console.log("Delete 5");
						var obid = $(this).attr('id');
						var childObj = canvas.getItemById(obid);
            if(childObj.type == 'ImageContainer'){
              //console.log("Delete 6");
              if(childObj.containerImage != ''){
                //console.log("Delete 7");
                contImg = canvas.getItemById(childObj.containerImage);
                $('div#'+contImg.id).remove();
                canvas.remove(contImg);
                childObj.set({
                  fill: '#bbbbbb',
                  opacity: 1,
                  lockMovementX: false,
                  lockMovementY: false,
                  selectable: true,
                  hasControls: true,
                  hasBorders: true,
                  hide_container: 0,
                  containerImage: '',
                }).setCoords();
                //addImageContainer(childObj);
                $('div#'+childObj.id+' .kmds-image-crop-wrapper').remove();
                $("#"+childObj.id+".imageContainer .layer-title-group").after($("<span></span>").attr("class", "media-kit-image-list layer-icon far fa-image"));
              }
              else {
                //console.log("Delete 8");
                canvas.remove(childObj);
                var defImag = canvas.getItemById("default"+childObj.id);
                if(defImag){
                  canvas.remove(defImag);
                  $('div#'+obid).remove();
                }
              }
            }
            else {
              //console.log("Delete 9");
              canvas.remove(childObj);
              $('div#'+obid).remove();
            }
					}
				});
				$('div#'+groupFolderID).remove();					
      }
			else if(activeObj.type !== 'activeSelection'){
        //console.log("Delete 10");
        var groupFolderID = obj.layerGroup;
				if(groupFolderID !== '' || typeof groupFolderID !== 'undefined'){
          //console.log("Delete 11");
					var child = [];
					$('.layer-row.child-layer').each(function(){
						if($(this).attr('data-group') == groupFolderID){
              //console.log("Delete 12");
							child.push($(this).attr('id'));
						}
					});
					if(child.length === 1){
            //console.log("Delete 13");
						//$('div#'+obj.id).remove();
            if(obj.type == 'ImageContainer'){
              //console.log("Delete 14");
              if(obj.containerImage != ''){
                //console.log("Delete 15");
                contImg = canvas.getItemById(obj.containerImage);
                $('div#'+contImg.id).remove();
                canvas.remove(contImg);
                obj.set({
                  fill: '#bbbbbb',
                  opacity: 1,
                  lockMovementX: false,
                  lockMovementY: false,
                  selectable: true,
                  hasControls: true,
                  hasBorders: true,
                  hide_container: 0,
                  containerImage: '',
                }).setCoords();
                //addImageContainer(obj);
                $('div#'+obj.id+' .kmds-image-crop-wrapper').remove();
                $("#"+obj.id+".imageContainer .layer-title-group").after($("<span></span>").attr("class", "media-kit-image-list layer-icon far fa-image"));
              }
              else {
                //console.log("Delete 16");
                $('div#'+obj.id).remove();
                canvas.remove(obj);
                var defImag = canvas.getItemById("default"+obj.id);
                if(defImag){
                  canvas.remove(defImag);
                }
              }
            }
            else {
              //console.log("Delete 17");
              canvas.remove(obj);
              $('div#'+groupFolderID).remove();
            }
					} else {
            //console.log("Delete 18");
            if(obj.type == 'ImageContainer'){
              //console.log("Delete 19");
              if(obj.containerImage != ''){
                //console.log("Delete 20");
                contImg = canvas.getItemById(obj.containerImage);
                $('div#'+contImg.id).remove();
                canvas.remove(contImg);
                obj.set({
                  fill: '#bbbbbb',
                  opacity: 1,
                  lockMovementX: false,
                  lockMovementY: false,
                  selectable: true,
                  hasControls: true,
                  hasBorders: true,
                  hide_container: 0,
                  containerImage: '',
                }).setCoords();
                //addImageContainer(obj);
                $('div#'+obj.id+' .kmds-image-crop-wrapper').remove();
                $("#"+obj.id+".imageContainer .layer-title-group").after($("<span></span>").attr("class", "media-kit-image-list layer-icon far fa-image"));
              }
              else {
                //console.log("Delete 21");
                $('div#'+obj.id).remove();
                canvas.remove(obj);
                var defImag = canvas.getItemById("default"+obj.id);
                if(defImag){
                  canvas.remove(defImag);
                }
              }
            }
            else if(obj.type == 'image' && typeof obj.containerID !== 'undefined'){
              //console.log("Delete 22");
              if(obj.containerID != ''){
                //console.log("Delete 23");
                container = canvas.getItemById(obj.containerID);
                $('div#'+obj.id).remove();
                canvas.remove(obj);
                container.set({
                  fill: '#bbbbbb',
                  opacity: 1,
                  lockMovementX: false,
                  lockMovementY: false,
                  selectable: true,
                  hasControls: true,
                  hasBorders: true,
                  hide_container: 0,
                  containerImage: '',
                }).setCoords();
                //addImageContainer(container);
                $('div#'+container.id+' .kmds-image-crop-wrapper').remove();
                $("#"+container.id+".imageContainer .layer-title-group").after($("<span></span>").attr("class", "media-kit-image-list layer-icon far fa-image"));
              }
              else {
                //console.log("Delete 24");
                $('div#'+obj.id).remove();
                canvas.remove(obj);
                //var defImag = canvas.getItemById("default"+obj.id);
                //if(defImag){canvas.remove(defImag);}
              }
            }
            else {
              //console.log("Delete 25");
              $('div#'+obj.id).remove();
              canvas.remove(obj);
            }
					}
				} else {
          //console.log("Delete 26");
					if(activeObj.type == 'Lineshape'){
            //console.log("Delete 27");
						var start_handle = canvas.getItemById(activeObj.start_handle);
						var end_handle = canvas.getItemById(activeObj.end_handle);
						canvas.remove(start_handle);
						canvas.remove(end_handle);
						$('div#'+obj.id).remove();
						canvas.remove(obj);
					} else {
            //console.log("Delete 28");
            if(obj.type == 'ImageContainer'){
              //console.log("Delete 29");
              if(obj.containerImage != ''){
                //console.log("Delete 30");
                contImg = canvas.getItemById(obj.containerImage);
                $('div#'+contImg.id).remove();
                canvas.remove(contImg);
                obj.set({
                  fill: '#bbbbbb',
                  opacity: 1,
                  lockMovementX: false,
                  lockMovementY: false,
                  selectable: true,
                  hasControls: true,
                  hasBorders: true,
                  hide_container: 0,
                  containerImage: '',
                }).setCoords();
                //addImageContainer(obj);
                $('div#'+obj.id+' .kmds-image-crop-wrapper').remove();
                $("#"+obj.id+".imageContainer .layer-title-group").after($("<span></span>").attr("class", "media-kit-image-list layer-icon far fa-image"));
              }
              else {
                //console.log("Delete 31");
                $('div#'+obj.id).remove();
                canvas.remove(obj);
                var defImag = canvas.getItemById("default"+obj.id);
                if(defImag){
                  canvas.remove(defImag);
                }
              }
            }
            else if(obj.type == 'image' && typeof obj.containerID !== 'undefined'){
              //console.log("Delete 32");
              if(obj.containerID != ''){
                //console.log("Delete 33");
                container = canvas.getItemById(obj.containerID);
                $('div#'+obj.id).remove();
                canvas.remove(obj);
                container.set({
                  fill: '#bbbbbb',
                  opacity: 1,
                  lockMovementX: false,
                  lockMovementY: false,
                  selectable: true,
                  hasControls: true,
                  hasBorders: true,
                  hide_container: 0,
                  containerImage: '',
                }).setCoords();
                //addImageContainer(container);
                $('div#'+container.id+' .kmds-image-crop-wrapper').remove();
                $("#"+container.id+".imageContainer .layer-title-group").after($("<span></span>").attr("class", "media-kit-image-list layer-icon far fa-image"));
              }
              else {
                //console.log("Delete 34");
                $('div#'+obj.id).remove();
                canvas.remove(obj);
                //var defImag = canvas.getItemById("default"+obj.id);
                //if(defImag){canvas.remove(defImag);}
              }
            }
            else {
              //console.log("Delete 35");
              $('div#'+obj.id).remove();
              canvas.remove(obj);
            }
					}
				}
      }
    });
		updateCanvasState();
		savedDesignFlag = false;
    canvas.discardActiveObject().renderAll();
    DisableActionToolbar();
  }
	
	//delete empty group layer folder
	if($('.layer-row.parent-layer.g-active').length){
		var emptyGroup = $('.layer-row.parent-layer.g-active').attr('id');
		var deleteGroup = false;
		if($('.layer-row.child-layer').length){
			$('.layer-row.child-layer').each(function(){
				if($(this).attr('data-group') == emptyGroup){
					deleteGroup = false;
				} else {
					deleteGroup = true;
				}
			});
		} else {
			deleteGroup = true;
		}
		
		if(deleteGroup){
			$('#layers #'+emptyGroup).remove();
		}
	}
	layerReordering();
	if(!savedDesignFlag){
		DetectTemplateChanges();
	}
}


function pageLocking(e) {
  var target = $(e);
  var pageid =  $(e).parent('.page-row').attr('id');
  var pageObj = canvas.getItemById(pageid);
  var allobjs = canvas.getItemsByType('page', false);
  //page lock functionality
  if( target.hasClass( "page-lock-icon" )) {
    if($('#pages #'+pageid+' .page-lock-icon').hasClass('fa-unlock-alt')){
			pageLocked = true;
      $('#pages #'+pageid).find('.page-action.page-lock-icon').removeClass('fa-unlock-alt').addClass('fa-lock');
      $('#pages #'+pageid).find('.page-action.page-lock-icon').css('opacity', 0.7);
      //pageObj.set('selection', true);
      //pageObj.set('evented', true);
      allobjs.forEach(function(o){
        if(o.type !== 'text' && o.page == pageid) {
					if($('#layers .parent-layer').length){
						$('#layers .parent-layer').each(function(){
							var group_page = $(this).attr('data-pageId');
							if(group_page == pageid){
								$(this).find('.layer-action.layer-lock-icon').removeClass('fa-unlock-alt').addClass('fa-lock');
								$(this).find('.layer-action.layer-lock-icon').css('opacity', 0.7);
							}
						})
					}
          $('#layers #'+o.id).find('.layer-action.layer-lock-icon').removeClass('fa-unlock-alt').addClass('fa-lock');
          $('#layers #'+o.id).find('.layer-action.layer-lock-icon').css('opacity', 0.7);
          o.lockMovementX = true;
          o.lockMovementY = true;
          o.lockScalingX = true;
          o.lockScalingY = true;
          o.lockRotation = true;
          o.selectable = false;
          o.hasControls = false;
          o.hasBorders = false;
          o.setControlsVisibility({
             mt: false, 
             mb: false, 
             ml: false, 
             mr: false, 
             bl: false,
             br: false, 
             tl: false, 
             tr: false,
             mtr: false, 
          });
        }
        canvas.renderAll();
      });
			savedDesignFlag = false;
    }
    else {
			pageLocked = false;
      $('#pages #'+pageid).find('.page-action.page-lock-icon').removeClass('fa-lock').addClass('fa-unlock-alt');
      //pageObj.set('selection', false);
      //pageObj.set('evented', false);
      allobjs.forEach(function(o){
        if(o.type !== 'text' && o.page == pageid) {
					if($('#layers .parent-layer').length){
						$('#layers .parent-layer').each(function(){
							var group_page = $(this).attr('data-pageId');
							if(group_page == pageid){
								$(this).find('.layer-action.layer-lock-icon').removeClass('fa-lock').addClass('fa-unlock-alt');
								$(this).find('.layer-action.layer-lock-icon').css('opacity', 0);
							}
						})
					}
          $('#layers #'+o.id).find('.layer-action.layer-lock-icon').removeClass('fa-lock').addClass('fa-unlock-alt');
					$('#layers #'+o.id).find('.layer-action.layer-lock-icon').css('opacity', 0);
          o.lockMovementX = false;
          o.lockMovementY = false;
          o.lockScalingX = false;
          o.lockScalingY = false;
          o.lockRotation = false;
          o.selectable = true;
          o.hasControls = true;
          o.hasBorders = true;
          o.setControlsVisibility({
             mt: true, 
             mb: true, 
             ml: true, 
             mr: true, 
             bl: true,
             br: true, 
             tl: true, 
             tr: true,
             mtr: true, 
          });
        }
        canvas.renderAll();
      });
			savedDesignFlag = false;
    }
  }
	if(!savedDesignFlag){
		DetectTemplateChanges();
	}
}

function pageClick(a) {
	var aid = a.id;
  activePage = aid;
  //console.log("pageClick = "+ aid);
  //switch page functionality
  /*var pageNo = a.getAttribute('page-no');
  if(parseInt(pageNo) == 1){
    console.log("pageNo 1= "+pageNo);
    var pageLayout1 = canvas.getItemById("layout-1");
    if(pageLayout1){pageLayout1.set({opacity: 1});}
    var pageLayout2 = canvas.getItemById("layout-2");
    if(pageLayout2){pageLayout2.set({opacity: 0});}
    canvas.renderAll();
  }
  else {
    console.log("pageNo 2= "+pageNo);
    var pageLayout1 = canvas.getItemById("layout-1");
    if(pageLayout1){pageLayout1.set({opacity: 0});}
    var pageLayout2 = canvas.getItemById("layout-2");
    if(pageLayout2){pageLayout2.set({opacity: 1});}
    canvas.renderAll();
  }*/
  var e = window.event;
  var target = $( e.target );
  if ( target.hasClass( "page-layout-visibility" )) {
    jQuery("#"+aid+" .page-layout-visibility").toggleClass("layout-active");
    var pageNo = a.getAttribute('page-no');
    var pageLayout = canvas.getItemById("layout-"+pageNo);
    if(pageLayout){
      if(jQuery("#"+aid+" .page-layout-visibility").hasClass("layout-active")){
        pageLayout.set({
          opacity: 1,
          hide_data: 0,
        });
      }
      else {
        pageLayout.set({
          opacity: 0,
          hide_data: 1,
        });
      }
      canvas.renderAll();
    }
  }
  else {
    layerReordering();
    switch_page(aid);
  }
}

function selectLayersBetweenIndexes(indexes) {
	indexes.sort(function(a, b) {
		return a - b;
	});

	for (var i = indexes[0]+1; i <= indexes[1]; i++) {
		$('.layer-row:not(.parent-layer):nth-child('+i+')').addClass('g-active');
	}
}

function GroupSelectedLayer(){
	if(CtrlPressed){
		canvas.discardActiveObject().renderAll();
		var objsId = [];
		$('.layer-row.g-active:not(.parent-layer)').each(function(){
			objsId.push($(this).attr('id')); 
		});
		//get all selected objects into an array
		var objs = canvas._objects.filter(function(obj){
			if ($.inArray(obj.id, objsId) != -1){
				return obj;
			}
		});
		var sel = new fabric.ActiveSelection(objs, {
			canvas: canvas,
		});
		canvas.setActiveObject(sel);
		canvas.renderAll();
	}
}

function layerKeyPressed(event){
	if (event.ctrlKey || event.shiftKey) {
    CtrlPressed = true;
  } else {
		CtrlPressed = false;
  }
}

var Dchanged = 0;
var Lchanged = 0;
var Echanged = 0;
var targetID = '';

function layerClick(a){
  var e = window.event;
	var aid = a.id;
  var target = $( e.target );
  if(targetID !== aid){
    var Dchanged = 0;
    var Lchanged = 0;
    var Echanged = 0;
  }

	if($("#"+aid).hasClass('child-layer')){
		groupToActiveSelection($("#"+aid).attr('data-group'));
		childLayerSelected = true;
	} else {
		childLayerSelected = false;
	}
	
  canvas.getObjects().forEach(function(o) { 
    if(o.id == aid) {
			//console.log("ID Clicked: "+o.id);
      //disabled if object has locked 
      if(!(o.lock_position) && !(o.hide_data) && !(o.hide_container) && !(target.hasClass( "layer-lock-icon" )) && !(target.hasClass( "layer-show-icon" ))){
        //console.log("ID Not Locked: "+o.id);
				if (window.event.ctrlKey) {
					if($("#"+aid).hasClass('parent-layer') == false){
						lastSelectedLayer = document.getElementById(aid);
					}
				}
				if (!window.event.ctrlKey && !window.event.shiftKey) {
					if($("#"+aid).hasClass('parent-layer') == false){
						lastSelectedLayer = document.getElementById(aid);
					}
				}
				if($("#"+aid).hasClass('g-active')) {
					$("#"+aid).removeClass('g-active');		
					$('#tool-ungroup').attr('disabled', 'disabled');
					$('#ungroup_selection_caption').parent('.g-menu-item').addClass('g-disabled');
					lastSelectedLayer = '';
					canvas.discardActiveObject().renderAll();
					GroupSelectedLayer(); // when multiple layer selected and then unselect one of them then regroup other active layers
					if(o.type == 'Lineshape'){
						var startHandle = canvas.getItemById(o.start_handle);
						var endHandle = canvas.getItemById(o.end_handle);
						startHandle.set({
							opacity: 0,
							selectable: false
						});
						endHandle.set({
							opacity: 0,
							selectable: false
						});
					}
        }
        else {
					if(!CtrlPressed){
						$('.layer-row.g-active').removeClass('g-active');
					}

          $("#"+aid).addClass('g-active');
          if(o.type == 'ImageContainer'){
            if(o.containerImage !== ''){
              var containerImage = o.containerImage;
              $('#layers #'+containerImage).addClass('g-active');
            }
          }
					if(o.type == 'Lineshape'){
						var startHandle = canvas.getItemById(o.start_handle);
						var endHandle = canvas.getItemById(o.end_handle);
						startHandle.set({
							opacity: 1,
							selectable: true
						});
						endHandle.set({
							opacity: 1,
							selectable: true
						});
            canvas.setActiveObject(o);
					} else {
						canvas.setActiveObject(o);
						o.selectable = true;
						o.hasControls = true;
						o.hasBorders = true;
						o.borderColor = '#e75e00'; //'#2880E6';
						var start_handles = canvas.getItemsByType('ConnectorHandleStart', true);
						var end_handles = canvas.getItemsByType('ConnectorHandleEnd', true);
						start_handles.forEach(function(sh){
							sh.set({
								opacity: 0,
								selectable: false
							});
						});
						
						end_handles.forEach(function(eh){
							eh.set({
								opacity: 0,
								selectable: false
							});
						});
					}
					canvas.renderAll();
					if(CtrlPressed){
						if (window.event.shiftKey) {
							if($(".layer-row.parent-layer.g-active").length){
								$(".layer-row.parent-layer.g-active").removeClass('g-active');
								canvas.discardActiveObject().renderAll();
							}
							selectLayersBetweenIndexes([$(lastSelectedLayer).index(), $('#'+aid).index()]);
						}
						GroupSelectedLayer();
					}
        }
        $('.layer-row.parent-layer.g-has-selection').removeClass('g-has-selection');
				
        if($('#layers #'+o.id).hasClass('child-layer')){
          var g = $('#layers #'+o.id).attr('data-group');
          $('#layers #'+g).addClass('g-has-selection');
          $('.layer-row.parent-layer.g-has-selection .layer-icon').removeClass('fas').addClass('far');
        }
        enabledDynamicDataSection();
        applyDynamicDataDefaultValue();	
      }
			
			/*if(o.type === 'Lineshape'){
				var start_handle = canvas.getItemById(o.start_handle);
				var end_handle = canvas.getItemById(o.end_handle);
				if ( target.hasClass( "layer-lock-icon" )) {
          if($('#layers #'+o.id+' .layer-lock-icon').hasClass('fa-unlock-alt') && Lchanged == 0 ){
            $('#layers #'+o.id).find('.layer-action.layer-lock-icon').removeClass('fa-unlock-alt').addClass('fa-lock');
            $('#layers #'+o.id).find('.layer-action.layer-lock-icon').css('opacity', 0.7);
            $('#layers #'+o.id).removeClass('g-active');
            Lchanged = 1;
            o.lockMovementX = true;
            o.lockMovementY = true;                     
            o.set({
              lock_position: 1,
            });
						start_handle.set({
              opacity: 0,
							selectable: false
            });
						end_handle.set({
              opacity: 0,
							selectable: false
            });
            canvas.renderAll();
						savedDesignFlag = false;
          }
          else {
            $('#layers #'+o.id).find('.layer-action.layer-lock-icon').removeClass('fa-lock').addClass('fa-unlock-alt');
            $('#layers #'+o.id).find('.layer-action.layer-lock-icon').css('opacity', 0);
						$('#layers #'+o.id).removeClass('g-active');
            Lchanged = 0;
            o.lockMovementX = false;
            o.lockMovementY = false;                     
            o.set({
              lock_position: 0,
            });
            canvas.renderAll();
						savedDesignFlag = false;
          }
				} else if ( target.hasClass( "layer-show-icon" )) {
          if($('#layers #'+o.id+' .layer-show-icon').hasClass('fa-eye') && Echanged == 0 ){
            $('#layers #'+o.id).find('.layer-action.layer-show-icon').removeClass('fa-eye').addClass('fa-eye-slash');
            $('#layers #'+o.id).find('.layer-action.layer-show-icon').css('opacity', 0.7);
            $('#layers #'+o.id).removeClass('g-active');
            Echanged = 1;
            o.lockMovementX = true;
            o.lockMovementY = true;
            o.set({
              hide_data: 1,
              opacity: 0,
            });
            canvas.renderAll();
						savedDesignFlag = false;
          }
          else {
            $('#layers #'+o.id).find('.layer-action.layer-show-icon').removeClass('fa-eye-slash').addClass('fa-eye');
            $('#layers #'+o.id).find('.layer-action.layer-show-icon').css('opacity', 0);
            Echanged = 0;
            o.lockMovementX = false;
            o.lockMovementY = false;
            o.set({
              hide_data: 0,
              opacity: 1,
            });
            canvas.renderAll();
						savedDesignFlag = false;
          }
        }
        if($(a).children('.layer-lock-icon').hasClass('fa-lock')){$('#layers #'+o.id).removeClass('g-active');}
			}*/
			
      if(o.type === 'textbox' || o.type === 'image' || o.type === 'Rectshape' || o.type === 'circle' || o.type === 'polygon' || o.type === 'triangle' || o.type === 'star' || o.type === 'Lineshape' || o.type === 'ImageContainer'){
        if(!(o.lock_position) && !(target.hasClass( "layer-lock-icon" ))){
          right_panels_text_activities();
          updateTextAppearance();
					/* if(o.type == 'circle'){
						o.set({
							stroke: "#2880E6",
						});
					} */
          //console.log("ID Not Locked 2: "+o.id);
        }
        /*if ( target.hasClass( "dynamic-data-icon" ) ) {
          if($('.toolbarPanel_6').hasClass('d-none') && Dchanged == 0){
            $('.toolbarPanel_6').removeClass('d-none').addClass('d-block');
            $('#layers #'+o.id).find('.dynamic-data-icon').addClass('dynamic-active');
            $('#layers #'+o.id).find('.dynamic-data-icon').show();
            enabledDynamicDataSection();
            Dchanged = 1;
          }
          else {
            $('.toolbarPanel_6').removeClass('d-block').addClass('d-none');
            $('#layers #'+o.id).find('.dynamic-data-icon').removeClass('dynamic-active');
            Dchanged = 0;
          }
        }
        else */
        if ( target.hasClass( "layer-lock-icon" )) {
          if($('#layers #'+o.id+' .layer-lock-icon').hasClass('fa-unlock-alt') && Lchanged == 0 ){
            //console.log("ID Not Locked 3: "+o.id);
            $('#layers #'+o.id).find('.layer-action.layer-lock-icon').removeClass('fa-unlock-alt').addClass('fa-lock');
            $('#layers #'+o.id).find('.layer-action.layer-lock-icon').css('opacity', 0.7);
            $('#layers #'+o.id).removeClass('g-active');
            o.lockMovementX = true;
            o.lockMovementY = true;
            o.lockScalingX = true;
            o.lockScalingY = true;
            o.lockRotation = true;
            o.selectable = false;
            o.hasControls = false;
            o.hasBorders = true;
            o.setControlsVisibility({
               mt: false, 
               mb: false, 
               ml: false, 
               mr: false, 
               bl: false,
               br: false, 
               tl: false, 
               tr: false,
               mtr: false, 
            });
            Lchanged = 1;
            targetID = aid;
            o.set({
							showImageBorder: true,
							showTextBoxBorder: true,
							textboxBorderColor: '#e75e00',
              lock_position: 1,
              active: true,
            });
						if(o.type == 'circle' || o.type == 'Lineshape'){
							o.set({
								borderColor: '#e75e00',
							});
              if(o.type === 'Lineshape'){
                var start_handle = canvas.getItemById(o.start_handle);
                var end_handle = canvas.getItemById(o.end_handle);
                start_handle.set({
                  opacity: 0,
                  selectable: false
                });
                end_handle.set({
                  opacity: 0,
                  selectable: false
                });
              }
						}
            //canvas.discardActiveObject(o);
            canvas.renderAll();
						savedDesignFlag = false;
          }
          else {
            if(o.layerGroup){
              if($('#layers #'+o.layerGroup+' .layer-lock-icon').hasClass('fa-lock')){
                $('#layers #'+o.layerGroup).find('.layer-action.layer-lock-icon').removeClass('fa-lock').addClass('fa-unlock-alt');
              }
            }
            //console.log("class = lock");
            //console.log("ID Locked: "+o.id);
            $('#layers #'+o.id).find('.layer-action.layer-lock-icon').removeClass('fa-lock').addClass('fa-unlock-alt');
            $('#layers #'+o.id).find('.layer-action.layer-lock-icon').css('opacity', 0);
						$('#layers #'+o.id).removeClass('g-active');
            o.lockMovementX = false;
            o.lockMovementY = false;
            o.lockScalingX = false;
            o.lockScalingY = false;
            o.lockRotation = false;
						o.selectable = false;
            o.hasControls = false;
            o.hasBorders = true;
            o.setControlsVisibility({
               mt: true, 
               mb: true, 
               ml: true, 
               mr: true, 
               bl: true,
               br: true, 
               tl: true, 
               tr: true,
               mtr: true, 
            });
            Lchanged = 0;
            o.set({
							showImageBorder: true,
							showTextBoxBorder: true,
							textboxBorderColor: '#e75e00',
							active: true,
              lock_position: 0,
            });
						//canvas.discardActiveObject(o);
            canvas.renderAll();
						savedDesignFlag = false;
          }
        }
        else if ( target.hasClass( "layer-show-icon" )) {
          if($('#layers #'+o.id+' .layer-show-icon').hasClass('fa-eye') && Echanged == 0 ){
            $('#layers #'+o.id).find('.layer-action.layer-show-icon').removeClass('fa-eye').addClass('fa-eye-slash');
            $('#layers #'+o.id).find('.layer-action.layer-show-icon').css('opacity', 0.7);
            $('#layers #'+o.id).removeClass('g-active');
            o.lockMovementX = true;
            o.lockMovementY = true;
            o.lockScalingX = true;
            o.lockScalingY = true;
            o.lockRotation = true;
            o.selectable = false;
            o.hasControls = false;
            o.hasBorders = false;
            o.setControlsVisibility({
               mt: false, 
               mb: false, 
               ml: false, 
               mr: false, 
               bl: false,
               br: false, 
               tl: false, 
               tr: false,
               mtr: false, 
            });
            Echanged = 1;
            targetID = aid;
            o.set({
              hide_data: 1,
              opacity: 0,
              active: true,
            });
            canvas.discardActiveObject(o);
            canvas.renderAll();
						savedDesignFlag = false;
          }
          else {
            if(o.layerGroup){
              if($('#layers #'+o.layerGroup+' .layer-show-icon').hasClass('fa-eye-slash')){
                $('#layers #'+o.layerGroup).find('.layer-action.layer-show-icon').removeClass('fa-eye-slash').addClass('fa-eye');
              }
            }
            $('#layers #'+o.id).find('.layer-action.layer-show-icon').removeClass('fa-eye-slash').addClass('fa-eye');
            $('#layers #'+o.id).find('.layer-action.layer-show-icon').css('opacity', 0);
            o.lockMovementX = false;
            o.lockMovementY = false;
            o.lockScalingX = false;
            o.lockScalingY = false;
            o.lockRotation = false;
						o.selectable = true;
            o.hasControls = true;
            o.hasBorders = true;
            o.setControlsVisibility({
               mt: true, 
               mb: true, 
               ml: true, 
               mr: true, 
               bl: true,
               br: true, 
               tl: true, 
               tr: true,
               mtr: true, 
            });
            Echanged = 0;
            o.set({
              hide_data: 0,
              opacity: 1,
              active: true,
            });
            canvas.discardActiveObject(o);
            canvas.renderAll();
						savedDesignFlag = false;
          }
        }
        else if ( target.hasClass( "media-kit-image-list" )) {
          $("#"+aid).addClass('g-active');
          canvas.setActiveObject(o);
          jQuery(".sidebar-selector .media-kit-image-list").trigger("click");
        }
        else if ( target.hasClass( "container-image-delete" )) {
          $("#"+aid).addClass('g-active');
          canvas.setActiveObject(o);
          // Delete container image
          deleteSelectedObject();
        }
        else if ( target.hasClass( "kmds-image-crop-wrapper" )) {
          //console.log("aid = "+aid);
          //console.log("containerImage = "+o.containerImage);
          if(o.containerImage !== ''){
            $("#"+aid).addClass('g-active');
            $("#"+o.containerImage).addClass('g-active');
            canvas.setActiveObject(o);
            kmdsImageCrop()
            //jQuery("#kmdsImageCrop").trigger("click");
          }
        }
        if($(a).children('.layer-lock-icon').hasClass('fa-lock')){$('#layers #'+o.id).removeClass('g-active');}
        if(o.type === 'textbox'){
          $('.properties-panel .appearance-property-panel.image-properties-panel').removeClass('d-block');
          $(".appearance-toolbar button").removeClass("d-none");
          $('.properties-panel .appearance-property-panel.text-properties-panel').removeClass('d-none').addClass('d-block');
          $('.toolbarPanel_5_1').removeClass('d-block').addClass('d-none');
          updateTextAppearance();
        } else if(o.type === 'image' || o.type === 'ImageContainer'){
          $('.properties-panel .appearance-property-panel.text-properties-panel').removeClass('d-block').addClass('d-none');
          $('.properties-panel .appearance-property-panel.image-properties-panel').addClass('d-block');
          $(".appearance-toolbar button").addClass("d-none");
          $('.toolbarPanel_5_1').removeClass('d-block').addClass('d-none');
        } else if(o.type === 'Lineshape' || o.type === 'circle' || o.type === 'Rectshape'){
          $('.properties-panel .appearance-property-panel.text-properties-panel').removeClass('d-block').addClass('d-none');
          $('.properties-panel .appearance-property-panel.image-properties-panel').removeClass('d-block');
          $(".appearance-toolbar button").removeClass("d-none");
          $('.toolbarPanel_5_1').removeClass('d-none').addClass('d-block');
          if(o.type === 'Lineshape'){
            $('.toolbarPanel_5_1 .appearance-properties-panel .fills-properties-panel').addClass('d-none');
            $('.toolbarPanel_5_1 .fills-toolbar').addClass('d-none');
            $('.toolbarPanel_5_1 .borders-toolbar .flex-grow').html('Line&nbsp;<i class="right-label fas fa-caret-down"></i>');
            $('.toolbarPanel_5_1 .line-cap-container').removeClass('d-none').addClass('d-flex');
          }
          else {
            $('.toolbarPanel_5_1 .appearance-properties-panel .fills-properties-panel').removeClass('d-none');
            $('.toolbarPanel_5_1 .fills-toolbar').removeClass('d-none');
            $('.toolbarPanel_5_1 .borders-toolbar .flex-grow').html('Borders&nbsp;<i class="right-label fas fa-caret-down"></i>');
            $('.toolbarPanel_5_1 .line-cap-container').removeClass('d-flex').addClass('d-none');
          }
          updateTextAppearance();
        }
      }
    }
  });
	if(!savedDesignFlag){
		DetectTemplateChanges();
	}
}



/**
 * Callback function layerFolderClick()
 * to activate layers group at canvas.
 **/
var LFolderchanged = 0;
var EFolderchanged = 0;
function layerFolderClick(a){
  var e = window.event;
  var target = $(e.target);
  var aid = $(a).attr('id');
  if ( target.hasClass( "layer-lock-icon" )) {
    $("#"+aid).removeClass("layerFolderHighlighted");
    var objsId = [];
    $('.layer-row.child-layer').each(function(){
      var dgroup = $(this).attr('data-group');
      if(dgroup == aid){
        objsId.push($(this).attr('id'));
      }  
    });
    
    //get all the child objects into an array
    if($('#layers #'+aid+' .layer-lock-icon').hasClass('fa-unlock-alt') && LFolderchanged == 0 ){
      $('#layers #'+aid).find('.layer-action.layer-lock-icon').removeClass('fa-unlock-alt').addClass('fa-lock');
      $('#layers #'+aid).find('.layer-action.layer-lock-icon').css('opacity', 0.7);
      $('#layers #'+aid).removeClass('g-active');
      var objs = canvas._objects.filter(function(o){
        if ($.inArray(o.id, objsId) != -1){
          $('#layers #'+o.id).find('.layer-action.layer-lock-icon').removeClass('fa-unlock-alt').addClass('fa-lock');
          $('#layers #'+o.id).find('.layer-action.layer-lock-icon').css('opacity', 0.7);
          $('#layers #'+o.id).removeClass('g-active');
          o.lockMovementX = true;
          o.lockMovementY = true;
          o.lockScalingX = true;
          o.lockScalingY = true;
          o.lockRotation = true;
          o.selectable = false;
          o.hasControls = false;
          o.hasBorders = false;
          o.setControlsVisibility({
             mt: false, 
             mb: false, 
             ml: false, 
             mr: false, 
             bl: false,
             br: false, 
             tl: false, 
             tr: false,
             mtr: false, 
          });
          LFolderchanged = 1;
          o.set({
            lock_position: 1,
            active: true,
          });
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      });
			savedDesignFlag = false;
    }
    else {
      $('#layers #'+aid).find('.layer-action.layer-lock-icon').removeClass('fa-lock').addClass('fa-unlock-alt');
      $('#layers #'+aid).find('.layer-action.layer-lock-icon').css('opacity', 0);
      //console.log(JSON.stringify(objsId));
      var objs = canvas._objects.filter(function(o){
        if ($.inArray(o.id, objsId) != -1){
          //console.log("ID: "+o.id);
          $('#layers #'+o.id).find('.layer-action.layer-lock-icon').removeClass('fa-lock').addClass('fa-unlock-alt');
          $('#layers #'+o.id).find('.layer-action.layer-lock-icon').css('opacity', 0);
          o.lockMovementX = false;
          o.lockMovementY = false;
          o.lockScalingX = false;
          o.lockScalingY = false;
          o.lockRotation = false;
          o.selectable = true;
          o.hasControls = true;
          o.hasBorders = true;
          o.setControlsVisibility({
             mt: true, 
             mb: true, 
             ml: true, 
             mr: true, 
             bl: true,
             br: true, 
             tl: true, 
             tr: true,
             mtr: true, 
          });
          LFolderchanged = 0;
          o.set({
            lock_position: 0,
            active: true,
          });
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      });
			savedDesignFlag = false;
    }
  }
  else if (target.hasClass( "layer-show-icon" )) {
    $("#"+aid).removeClass("layerFolderHighlighted");
    var objsId = [];
    $('.layer-row.child-layer').each(function(){
      var dgroup = $(this).attr('data-group');
      if(dgroup == aid){
        objsId.push($(this).attr('id'));
      }  
    });
    if($('#layers #'+aid+' .layer-show-icon').hasClass('fa-eye') && EFolderchanged == 0 ){
      $('#layers #'+aid).find('.layer-action.layer-show-icon').removeClass('fa-eye').addClass('fa-eye-slash');
      $('#layers #'+aid).find('.layer-action.layer-show-icon').css('opacity', 0.7);
      $('#layers #'+aid).removeClass('g-active');
      var objs = canvas._objects.filter(function(o){
        if ($.inArray(o.id, objsId) != -1){
          $('#layers #'+o.id).find('.layer-action.layer-show-icon').removeClass('fa-eye').addClass('fa-eye-slash');
          $('#layers #'+o.id).find('.layer-action.layer-show-icon').css('opacity', 0.7);
          $('#layers #'+o.id).removeClass('g-active');
          o.lockMovementX = true;
          o.lockMovementY = true;
          o.lockScalingX = true;
          o.lockScalingY = true;
          o.lockRotation = true;
          o.selectable = false;
          o.hasControls = false;
          o.hasBorders = false;
          o.setControlsVisibility({
             mt: false, 
             mb: false, 
             ml: false, 
             mr: false, 
             bl: false,
             br: false, 
             tl: false, 
             tr: false,
             mtr: false, 
          });
          EFolderchanged = 1;
          o.set({
            hide_data: 1,
            opacity: 0,
            active: true,
          });
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      });
			savedDesignFlag = false;
    }
    else {
      $('#layers #'+aid).find('.layer-action.layer-show-icon').removeClass('fa-eye-slash').addClass('fa-eye');
      $('#layers #'+aid).find('.layer-action.layer-show-icon').css('opacity', 0);
      var objs = canvas._objects.filter(function(o){
        if ($.inArray(o.id, objsId) != -1){
          $('#layers #'+o.id).find('.layer-action.layer-show-icon').removeClass('fa-eye-slash').addClass('fa-eye');
          $('#layers #'+o.id).find('.layer-action.layer-show-icon').css('opacity', 0);
          o.lockMovementX = false;
          o.lockMovementY = false;
          o.lockScalingX = false;
          o.lockScalingY = false;
          o.lockRotation = false;
          o.selectable = true;
          o.hasControls = true;
          o.hasBorders = true;
          o.setControlsVisibility({
             mt: true, 
             mb: true, 
             ml: true, 
             mr: true, 
             bl: true,
             br: true, 
             tl: true, 
             tr: true,
             mtr: true, 
          });
          EFolderchanged = 0;
          o.set({
            hide_data: 0,
            opacity: 1,
            active: true,
          });
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      });
			savedDesignFlag = false;
    }
  }
  else if(!target.hasClass("pr-2")){
    if($('#layers #'+aid+' .layer-lock-icon').hasClass('fa-unlock-alt') && $('#layers #'+aid+' .layer-show-icon').hasClass('fa-eye')){
			childLayerSelected = false;
      $("#"+aid).toggleClass("layerFolderHighlighted");
      $("#"+aid).toggleClass("g-has-selection");
			groupToActiveSelection($("#"+aid).attr('id'));
      if($("#"+aid).hasClass('parent-layer')){
        if($("#"+aid).hasClass('g-active')) {
          $("#"+aid).removeClass('g-active');
          $("#"+aid).removeClass('g-has-selection');
					$('#tool-ungroup').attr('disabled', 'disabled');
					$('#ungroup_selection_caption').parent('.g-menu-item').addClass('g-disabled');
          groupLayerObjects(aid, true, false);
        }
        else {
          $('.layer-row.g-active').removeClass('g-active');
          $("#"+aid).addClass('g-active');
					$('#tool-group').attr('disabled', 'disabled');
					$('#group_selection_caption').parent('.g-menu-item').addClass('g-disabled');
					$('#tool-ungroup').removeAttr('disabled');
					$('#ungroup_selection_caption').parent('.g-menu-item').removeClass('g-disabled');
          groupLayerObjects(aid, false, true);
        }
      }
    }
	}
	if(!savedDesignFlag){
		DetectTemplateChanges();
	}
}

function activateChildObject(o){
	var cobj = o.target;
	var activeobj = canvas.getActiveObject();
	if(activeobj && activeobj.type == 'group'){
		childLayerSelected = true;
		creatingGroup = false;
		groupToActiveSelection(null);
		if(cobj){
			canvas.setActiveObject(cobj);
			canvas.renderAll();
		}
	}
}

/**
 * callback function to group all parent layers
 * ActiveSelection to Group
 */
function activeSelectionToGroup(){
	var g = canvas.getItemsByType('group', true);
	if(!(g.length) && !(childLayerSelected) && creatingGroup){
		//console.log('clicked');
		if($('.layer-row.parent-layer').length){
			$('.layer-row.parent-layer').each(function(){
				var groupId = $(this).attr('id');
				var order = $(this).attr('order');
				$('.layer-row.child-layer').each(function(){
					var childGroup = $(this).attr('data-group');
					if(childGroup == groupId){
						groupLayerObjects(groupId, false, true);
						if(canvas.getActiveObject()){
							canvas.getActiveObject().toGroup();
							canvas.getActiveObject().set({
								id: groupId,
							});
							canvas.moveTo(canvas.getActiveObject(), order);
							canvas.requestRenderAll();
							canvas.discardActiveObject();
						}
					}
				});
				var objs = canvas._objects.filter(function(obj){
					if (obj.type == 'group'){
						return obj;
					}
				});

				objs.forEach(function(g){
					var t = g._objects.length;
					//console.log(t);
					if(t==0){
						canvas.remove(g);
						canvas.renderAll();
					}
				}); 
				
			});
			//console.log(canvas.getItemsByType('group', true));
			canvas.forEachObject(function(g){
				if(g.type == 'group'){
					var id = g.id;
					var order = $('#'+id).attr('order');
					g.moveTo(order);
					//canvas.sendBackwards(g);
					canvas.renderAll();
				}

			});
		}
		//layerReordering();
	}
}

/**
 * callback function to ungroup Groupped objects
 * Group to ActiveSelection
 */
function groupToActiveSelection(groupId){
	var objActive = canvas.getActiveObject();
	
	if(groupId !== null){
		var group = canvas.getItemById(groupId);
		if(group && group.type == 'group'){
			group.toActiveSelection();	
			layerReordering();			
			canvas.renderAll();
		}
	}
	else if(groupId == null){
		var objs = canvas._objects.filter(function(obj){
			if (obj.type == 'group'){
				return obj;
			}
	  });

		objs.forEach(function(g){
			g.toActiveSelection();
			canvas.discardActiveObject();
			canvas.renderAll();
		}); 
		layerReordering();
		canvas.renderAll();
	}
	
	if(objActive && objActive.type == 'group'){
		objActive.toActiveSelection();
		//canvas.discardActiveObject();
		layerReordering();
    canvas.renderAll();
	}
}

function groupLayerObjects(groupId, hoverGroup, clicked){
  //console.log("groupLayerObjectsNew");
  //console.log("groupLayerObjectsEnabled");
  var create_group = true;
  var lock_group = false;
  var objID = 0;
  var objActive = canvas.getActiveObject();	
  if(objActive && objActive.type == 'activeSelection'){
    objID = objActive.id;
    canvas.setActiveObject(objActive);
    if(objActive.type == 'activeSelection' && !$("#"+groupId).hasClass("layerFolderHighlighted")){
      canvas.discardActiveObject();
      create_group = true;
    }
    else if(objActive.type == 'activeSelection' && $("#"+groupId).hasClass("layerFolderHighlighted")){
			
      if(hoverGroup || clicked){
        objActive.set({
          showactiveSelectionBorder: true,
          borderColor: '#e75e00',
          active: true,
          hasControls: true,
        });
      }
      else {
        objActive.set({
          showactiveSelectionBorder: false,
          borderColor: '#2880E6',
          active: false,
          hasControls: true,
        });
      }
      canvas.setActiveObject(objActive);
      canvas.renderAll();
      create_group = false;
    }
    var objsG = objActive._objects.filter(function(o){
      if(o.lock_position && o.lock_position == 1){
        lock_group = true;
      }
    });
  }
  else{
    canvas.discardActiveObject();
  }
  if(create_group){
    var objsId = [];
    $('.layer-row.child-layer').each(function(){
      var dgroup = $(this).attr('data-group');
      if(dgroup == groupId){
        objsId.push($(this).attr('id'));
      }  
    });

    //get all the child objects into an array
    var objs = canvas._objects.filter(function(obj){
      if ($.inArray(obj.id, objsId) != -1){
        return obj;
      }
    });
    if(hoverGroup || clicked){
      //console.log(JSON.stringify(objs));
      var sel = new fabric.ActiveSelection(objs, {
        canvas: canvas,
				id: groupId,
      });
      sel.selectable = false;
      sel.hasControls = false;
      objs.forEach(function(obj) {
        if(objID == obj.id){
          obj.set({
            hasControls: true,
            borderColor: '#2880E6'
          });
        }
        else {
          obj.set({
            hasControls: false,
            borderColor: 'transparent'
          });
        }
        canvas.renderAll();
      });
      if(hoverGroup){
        sel.set({
          showactiveSelectionBorder: true,
          borderColor: '#e75e00',
          active: true,
          hasControls: false,
        });
      }
      else if(clicked){
        sel.set({
          showactiveSelectionBorder: true,
          borderColor: '#e75e00',
          active: true,
          hasControls: true,
        });
      }
      var objsG = sel._objects.filter(function(o){
        if(o.lock_position && o.lock_position == 1){
          lock_group = true;
        }
      });
      canvas.setActiveObject(sel);
      canvas.renderAll();
    }
    else {
      if($("#"+groupId).hasClass("layerFolderHighlighted")){
        var obj = canvas.getActiveObject();
        if(obj){
          obj.set({
            showactiveSelectionBorder: true,
            borderColor: '#2880E6',
            active: true,
            hasControls: true,
          });
          canvas.setActiveObject(obj);
          canvas.renderAll();
        }
        else{
          canvas.discardActiveObject();
        }
      }
      else {
        canvas.discardActiveObject();
        objs.forEach(function(obj) {
          obj.set({
            hasControls: true,
            borderColor: '#2880E6'
          });
          if(objID == obj.id){
            canvas.setActiveObject(obj);
          }
          canvas.renderAll();
        });
      }
      objs.forEach(function(o){
        if(o.lock_position && o.lock_position == 1){
          lock_group = true;
        }
      });
    }
  }
  if(lock_group){
    lockGroupLayerObjects();
  }
  canvas.renderAll();
}
/**
 * Callback function lockGroupLayerObjects()
 * to lock the group object
 **/
function lockGroupLayerObjects(){
  var obj = canvas.getActiveObject();
  if(obj){
    obj.lockMovementX = true;
    obj.lockMovementY = true;
    obj.lockScalingX = true;
    obj.lockScalingY = true;
    obj.lockRotation = true;
    obj.selectable = false;
    obj.hasControls = false;
    obj.hasBorders = false;
    obj.setControlsVisibility({
       mt: false, 
       mb: false, 
       ml: false, 
       mr: false, 
       bl: false,
       br: false, 
       tl: false, 
       tr: false,
       mtr: false, 
    });
    obj.set({
      lock_position: 1,
      active: true,
    });
    canvas.discardActiveObject();
    canvas.renderAll();
  }
}
function EnableActionToolbar(){
	//enable following on object selection
	//$('#undo_caption').parent('.g-menu-item').removeClass('g-disabled');
	$('#cut_caption').parent('.g-menu-item').removeClass('g-disabled');
	$('#copy_caption').parent('.g-menu-item').removeClass('g-disabled');
	$('#delete_caption').parent('.g-menu-item').removeClass('g-disabled');
	$('#duplicate_caption').parent('.g-menu-item').removeClass('g-disabled');
	$('#deselect_all_caption').parent('.g-menu-item').removeClass('g-disabled');
	$('#bring_forward').parent('.g-menu-item').removeClass('g-disabled');
	$('#send_backward').parent('.g-menu-item').removeClass('g-disabled');
	$('#send_to_back').parent('.g-menu-item').removeClass('g-disabled');
  var enableDistribute = false;
  var activeSelectionObj = canvas.getActiveObject();
  if(activeSelectionObj){
    if(activeSelectionObj.type == 'activeSelection' && activeSelectionObj._objects.length > 2){
      /*var objs = activeSelectionObj._objects.filter(function(o){
        if(o.objectGroup == true){
          return o;
        }
      });
      if(objs.length == 0){
        enableDistribute = true;
      }*/
      if(!jQuery(".parent-layer.layer-row").hasClass("g-active")){
        enableDistribute = true;
      }
    }
  }
	$('#align_caption').parent('li.g-menu-item').children('ul.g-menu-right').children('li.g-menu-item').each(function(){
		$(this).removeClass('g-disabled');
		$(this).children('span#distribute_horizontally').parent('li.g-menu-item').addClass('g-disabled');
		$(this).children('span#distribute_vertically').parent('li.g-menu-item').addClass('g-disabled');
    if(enableDistribute){
      $(this).children('span#distribute_horizontally').parent('li.g-menu-item').removeClass('g-disabled');
      $(this).children('span#distribute_vertically').parent('li.g-menu-item').removeClass('g-disabled');
      $(".toolbarPanel_1 .distribute-h").removeClass("disabled").attr("data-value", 'dh');
      $(".toolbarPanel_1 .distribute-h .distribute-horizontally").addClass("active");
      $(".toolbarPanel_1 .distribute-v").removeClass("disabled").attr("data-value", 'dv');
      $(".toolbarPanel_1 .distribute-v .distribute-vertically").addClass("active");
    }
    else {
      $(".toolbarPanel_1 .distribute-h").addClass("disabled").attr("data-value", '');
      $(".toolbarPanel_1 .distribute-h .distribute-horizontally").removeClass("active");
      $(".toolbarPanel_1 .distribute-v").addClass("disabled").attr("data-value", '');
      $(".toolbarPanel_1 .distribute-v .distribute-vertically").removeClass("active");
    }
	});
	$('#transform_caption').parent('li.g-menu-item').children('ul.g-menu-right').children('li.g-menu-item').each(function(){
		$(this).removeClass('g-disabled');
	});
	if(!($('.layer-row.g-active').hasClass('parent-layer'))){
		$('#group_selection_caption').parent('.g-menu-item').removeClass('g-disabled');
		$('#toolbar button#tool-group').removeAttr('disabled');
	}
	//$('#toolbar button#undo').removeAttr('disabled');
	$('#toolbar button#flip-h').removeAttr('disabled');
	$('#toolbar button#flip-v').removeAttr('disabled');
	$('#toolbar button#rotate-90-left').removeAttr('disabled');
	$('#toolbar button#rotate-90-right').removeAttr('disabled');
	$('#toolbar button#tool-bring-forward').removeAttr('disabled');
	$('#toolbar button#tool-send-backward').removeAttr('disabled');
	//$('#toolbar button#tool-symbol').removeAttr('disabled');
	//$('#toolbar button#tool-convertto-path').removeAttr('disabled');
}

function DisableActionToolbar(){
	//$('#undo_caption').parent('.g-menu-item').addClass('g-disabled');
	$('#group_selection_caption').parent('.g-menu-item').addClass('g-disabled');
	$('#ungroup_selection_caption').parent('.g-menu-item').addClass('g-disabled');
	$('#cut_caption').parent('.g-menu-item').addClass('g-disabled');
	$('#copy_caption').parent('.g-menu-item').addClass('g-disabled');
	$('#delete_caption').parent('.g-menu-item').addClass('g-disabled');
	$('#duplicate_caption').parent('.g-menu-item').addClass('g-disabled');
	$('#deselect_all_caption').parent('.g-menu-item').addClass('g-disabled');
	$('#bring_forward').parent('.g-menu-item').addClass('g-disabled');
	$('#send_backward').parent('.g-menu-item').addClass('g-disabled');
	$('#send_to_back').parent('.g-menu-item').addClass('g-disabled');
	$('#align_caption').parent('li.g-menu-item').children('ul.g-menu-right').children('li.g-menu-item').each(function(){
		$(this).addClass('g-disabled');
	});
	$('#transform_caption').parent('li.g-menu-item').children('ul.g-menu-right').children('li.g-menu-item').each(function(){
		$(this).addClass('g-disabled');
	});
	
	//$('#toolbar button#undo').attr('disabled', 'disabled');
	$('#toolbar button#flip-h').attr('disabled', 'disabled');
	$('#toolbar button#flip-v').attr('disabled', 'disabled');
	$('#toolbar button#rotate-90-left').attr('disabled', 'disabled');
	$('#toolbar button#rotate-90-right').attr('disabled', 'disabled');
	$('#toolbar button#tool-group').attr('disabled', 'disabled');
	$('#toolbar button#tool-ungroup').attr('disabled', 'disabled');
	$('#toolbar button#tool-bring-forward').attr('disabled', 'disabled');
	$('#toolbar button#tool-send-backward').attr('disabled', 'disabled');
	//$('#toolbar button#tool-symbol').attr('disabled', 'disabled');
	//$('#toolbar button#tool-convertto-path').attr('disabled', 'disabled');
}

function DisableRightProperties(){
	$('.toolbar.main-toolbar').removeClass('d-flex');
	$('.toolbarPanel_1').removeClass('d-block').addClass('d-none');
	$('.properties-panel.main-toolbar').removeClass('d-block');
	$('.toolbar.page-toolbar').addClass('d-flex').removeClass('d-none');
	$('.properties-panel.page-properties-panel').addClass('d-block').removeClass('d-none');
	$('.toolbarPanel_3').removeClass('d-none').addClass('d-block');
	$('.toolbarPanel_4').removeClass('d-none').addClass('d-block');
	$('.toolbarPanel_7').removeClass('d-none').addClass('d-block');
	$('.toolbar.appearance-toolbar').removeClass('d-flex');
	$('.toolbarPanel_5').addClass('d-none').removeClass('d-block');
	$('.toolbarPanel_5_1').addClass('d-none').removeClass('d-block');
	$('.toolbarPanel_6').addClass('d-none').removeClass('d-block');
  enabledDynamicDataSection();
	if($('#transform').hasClass('g-active')){
		$('#transform').removeClass('g-active');
		$('.toolbarPanel_2').addClass('d-none');
	}
	$('.properties-panel .appearance-property-panel.text-properties-panel').removeClass('d-block').addClass('d-none');
	$('.properties-panel .appearance-property-panel.image-properties-panel').removeClass('d-block');
  $(".appearance-toolbar button").removeClass("d-none");
}

function EnableRightProperties(){
	//$('.layer-row.g-active').removeClass('g-active');
	$('.toolbar.main-toolbar').addClass('d-flex');
	$('.toolbarPanel_1').removeClass('d-none').addClass('d-block');
	$('.properties-panel.main-toolbar').addClass('d-block');
	$('.toolbar.page-toolbar').removeClass('d-flex').addClass('d-none');
	$('.properties-panel.page-properties-panel').removeClass('d-block').addClass('d-none');
	$('.toolbarPanel_3').removeClass('d-block').addClass('d-none');
	$('.toolbarPanel_4').removeClass('d-block').addClass('d-none');
	$('.toolbarPanel_7').removeClass('d-block').addClass('d-none');
	$('.toolbar.appearance-toolbar').addClass('d-flex');
	$('.toolbarPanel_5').removeClass('d-none').addClass('d-block');
  var obj = canvas.getActiveObject();
  if(obj){
    if(obj.type === 'Lineshape' || obj.type === 'circle' || obj.type === 'Rectshape' || obj.type === 'triangle'){
      $('.toolbarPanel_5_1').removeClass('d-none').addClass('d-block');
      if(obj.type === 'Lineshape'){
        $('.toolbarPanel_5_1 .appearance-properties-panel .fills-properties-panel').addClass('d-none');
        $('.toolbarPanel_5_1 .fills-toolbar').addClass('d-none');
        $('.toolbarPanel_5_1 .borders-toolbar .flex-grow').html('Line&nbsp;<i class="right-label fas fa-caret-down"></i>');
        $('.toolbarPanel_5_1 .line-cap-container').removeClass('d-none').addClass('d-flex');
      }
      else {
        $('.toolbarPanel_5_1 .appearance-properties-panel .fills-properties-panel').removeClass('d-none');
        $('.toolbarPanel_5_1 .fills-toolbar').removeClass('d-none');
        $('.toolbarPanel_5_1 .borders-toolbar .flex-grow').html('Borders&nbsp;<i class="right-label fas fa-caret-down"></i>');
        $('.toolbarPanel_5_1 .line-cap-container').removeClass('d-flex').addClass('d-none');
      }
    }
  }
	$('.toolbarPanel_6').removeClass('d-none').addClass('d-block');
  enabledDynamicDataSection();
}
/**
 * Callback function enabledDynamicDataSection()
 * to enabled the textbox/image section
 * after object type check.
 */
function enabledDynamicDataSection(){
  var obj = canvas.getActiveObject();
  if(obj){
    switch (obj.type) {
      case 'textbox':
        $('.toolbarPanel_6 .text-token-content-section').removeClass('d-none').addClass('d-block');
        $('.toolbarPanel_6 .toolbar.toolbar-title.dynamic-data-toolbar').removeClass('d-none');
        //$('.toolbarPanel_6 .listing-photo-settings').removeClass('d-block').addClass('d-none');
        $('.toolbarPanel_6 .image-ar-constraint-section').removeClass('d-block').addClass('d-none');
      break;
      case 'image':
        $('.toolbarPanel_6 .text-token-content-section').removeClass('d-block').addClass('d-none');
        $('.toolbarPanel_6 .toolbar.toolbar-title.dynamic-data-toolbar').addClass('d-none');
        //$('.toolbarPanel_6 .listing-photo-settings').removeClass('d-none').addClass('d-block');
        $('.toolbarPanel_6 .image-ar-constraint-section').removeClass('d-none').addClass('d-block');
      break;
      case 'ImageContainer':
        $('.toolbarPanel_6 .text-token-content-section').removeClass('d-block').addClass('d-none');
        $('.toolbarPanel_6 .toolbar.toolbar-title.dynamic-data-toolbar').addClass('d-none');
        //$('.toolbarPanel_6 .listing-photo-settings').removeClass('d-none').addClass('d-block');
        $('.toolbarPanel_6 .image-ar-constraint-section').removeClass('d-none').addClass('d-block');
      break;
      default:
        $('.toolbarPanel_6 .text-token-content-section').removeClass('d-block').addClass('d-none');
        $('.toolbarPanel_6 .toolbar.toolbar-title.dynamic-data-toolbar').addClass('d-none');
        //$('.toolbarPanel_6 .listing-photo-settings').removeClass('d-block').addClass('d-none');
        $('.toolbarPanel_6 .image-ar-constraint-section').removeClass('d-block').addClass('d-none');
      break;
    }
  }
}
/**
 * Callback function applyDynamicDataDefaultValue()
 * to enabled the textbox/image section
 * after object type check.
 */
function applyDynamicDataDefaultValue(){
  //console.log("applyDynamicDataDefaultValue");
  var obj = canvas.getActiveObject();
  if(obj){
    var oid = obj.id;
    if(obj.lock_data == 1) {
      $('#dynamic-lock-data').prop( "checked", true );
    } else {
      $('#dynamic-lock-data').prop( "checked", false );
    } if(obj.caps_data == 1){
      $('#dynamic-all-caps').prop( "checked", true );
    } else {
      $('#dynamic-all-caps').prop( "checked", false );
    } if(obj.position_relative == 1){
      $('#dynamic-position-relative').prop( "checked", true );
    } else {
      $('#dynamic-position-relative').prop( "checked", false );
    } if(obj.token_data == 1){
      $('#text-dynamic-token').val("none");
    } if(obj.max_character){
      $('#maximum-characters').val(obj.max_character);
    } else {
      $('#maximum-characters').val('');
    } if(obj.imageSourceOption){
      var imageSource = (obj.imageSourceOption).replace('_', '-');;
      $('#dynamic-listing-photo-'+imageSource).prop( "checked", true);
      $('.photo-options select.ar-constraint').val("scale-crop");
      $('.'+obj.imageSourceOption).val(obj.imageSourceValue);
    } else {
      $('.photo-options select.ar-constraint').val("scale-crop");
      $('#dynamic-listing-photo-none').prop( "checked", true);
    } if(obj.imageArConstraint){
      $('#image-ar-constraint').val(obj.imageArConstraint);
    } else {
      $('#image-ar-constraint').val("scale-crop");
    } if(obj.imagePresetGroup){
      $('#preset-group-style').val(obj.imagePresetGroup);
      getImagePreset(obj.imagePresetGroup, obj.imagePresetPreset);
    } else {
      $('#preset-group-style').val("none");
      $('#media-preset-style').val("none");
      $('#media-preset-style').prop("disabled", true);
    } if(obj.branding_font_family){
      $('#font-family-type').val(obj.branding_font_family);
    } else {
      $('#font-family-type').val("none");
    } if(obj.branding_font_color){
      $('#font-color-type').val(obj.branding_font_color);
    } else {
      $('#font-color-type').val("none");
    } if(obj.line_cap){
      $('#LineCapSelect').val(obj.line_cap);
    } else {
      $('#LineCapSelect').val("butt");
    } if(obj.branding_background_color){
      $('#background-color-type').val(obj.branding_background_color);
    } else {
      $('#background-color-type').val("none");
    } if(obj.branding_border_color){
      $('#border-color-type').val(obj.branding_border_color);
    } else {
      $('#border-color-type').val("none");
    } if(obj.dynamic_opacity_range){
      var new_opacity = (obj.dynamic_opacity_range === 0) ? 0 : (obj.dynamic_opacity_range * 100);
      obj.set({
        opacity: obj.dynamic_opacity_range,
      });
      canvas.renderAll();
      $('#dynamic-opacity-range').val(new_opacity);
      if($('#line-opacity-range').length){
        $('#line-opacity-range').val(new_opacity+"%");
      }
      $("#opacity-range").val(new_opacity+"%");
      $('input[type="range"]').rangeslider('update', true);
    } else {
      var new_opacity = 100;
      $('#dynamic-opacity-range').val(new_opacity);
      $("#opacity-range").val(new_opacity+"%");
      if($('#line-opacity-range').length){
        $('#line-opacity-range').val(new_opacity+"%");
      }
      $('input[type="range"]').rangeslider('update', true);
    } if(obj.dynamic_image_opacity_range){
      var new_opacity = (obj.dynamic_image_opacity_range === 0) ? 0 : (obj.dynamic_image_opacity_range * 100);
      obj.set({
        opacity: obj.dynamic_image_opacity_range,
      });
      canvas.renderAll();
      $('#dynamic-image-opacity-range').val(new_opacity);
      $("#image-opacity-range").val(new_opacity+"%");
      $('input[type="range"]').rangeslider('update', true);
    } else {
      var new_opacity = 100;
      $('#dynamic-image-opacity-range').val(new_opacity);
      $("#image-opacity-range").val(new_opacity+"%");
      $('input[type="range"]').rangeslider('update', true);
    } if(obj.dynamic_corner){
      var new_corner = obj.dynamic_corner;
      obj.set({
        rx: new_corner,
        ry: new_corner,
      });
      canvas.renderAll();
      $('#dynamic-corner-range').val(new_corner);
      $("#corner-range").val(new_corner);
      $('input[type="range"]').rangeslider('update', true);
    } else {
      obj.set({
        rx: 0,
        ry: 0,
      });
      canvas.renderAll();
      $('#dynamic-corner-range').val(0);
      $("#corner-range").val(0);
      $('input[type="range"]').rangeslider('update', true);
    }
    if(obj.dynamicImageCorner){
      var newval = obj.dynamicImageCorner;
      var rxw = obj.dynamicImageCornerrxw;
      var ryh = obj.dynamicImageCornerryh;
      obj.clipTo = function(obj) {
        var rect = new fabric.Rect({
          left:0,
          top:0,
          rx:rxw,
          ry:ryh,
          width:this.width,
          height:this.height,
          fill:'#000000'
        });
        rect._render(obj, false);
      };
      $('#dynamic-image-corner-range').val(newval);
      $('#corner-input').val(newval);
      $('input[type="range"]').rangeslider('update', true);
    }
    else if(!obj.containerID) {
      obj.clipTo = '';
      $('#dynamic-image-corner-range').val(0);
      $('#corner-input').val(0);
      $('input[type="range"]').rangeslider('update', true);
    }
    if(typeof obj.object_link !== 'undefined'){
      objLink = obj.object_link;
      if(objLink == 'unlinked'){
        $("#objectLinkAction").removeClass('linked').addClass('unlinked');
      }
      else {
        $("#objectLinkAction").removeClass('unlinked').addClass('linked');
      }
    }
    else {
      $("#objectLinkAction").removeClass('linked').addClass('unlinked');
    }
  }
}
	
/**
 * Callback function objectIntersectingCheck()
 * to move objects of one page to another page
 */
function objectIntersectingCheck(e) {
	var activeObject = e.target;
	if (!activeObject) {
		return;
	}
	if(activeObject.type == 'activeSelection'){
		return;
	}
	if(multipageToggle == false){    
	  return;
	}
	if(handSelected == true){    
	  return;
	}
	activeObject.setCoords();
	
	//loop canvas page objects
	var pages = canvas.getItemsByType('page', true);
	pages.forEach(function (page) {
		//check intersections with every page object in canvas
		if (activeObject.isContainedWithinObject(page)) {
			if (page.id === activeObject.page) {
				ObjinterSection = false;
			} else if (page.id !== activeObject.page && $('#pages #'+page.id+' .page-lock-icon').hasClass('fa-lock')) { //check if page is locked
				ObjinterSection = false;
			} else if (page.id !== activeObject.page && $('#pages #'+page.id+' .page-lock-icon').hasClass('fa-unlock-alt')) { //check if page is unlocked
				ObjinterSection = true;
			}
			
			if(ObjinterSection == false){
				return;
			} else if(ObjinterSection == true){
				activeObject.set('page', page.id);
				//canvas.bringForward(activeObject);
				$('#layers #'+activeObject.id).attr('data-pageId', page.id);
				var p = document.getElementById(page.id);
				pageClick(p);
			}
		}
	});
}

/**
 * Callback function updatePageObjects()
 * to update page label position when page move
 */
function updatePageObjects(e){
  var obj = e.target;
	if (!obj) {
		return;
	}
  else if(obj.type == 'ImageContainer' && typeof obj.containerImage !== 'undefined'){
    if(obj.containerImage !== ''){
      var contImage = canvas.getItemById(obj.containerImage);
      contImage.set('left', obj.left);
      contImage.set('top', obj.top);
      contImage.setCoords();
      canvas.renderAll();
    }
    else {
      var contImage = canvas.getItemById("default"+obj.id);
      if(contImage){
        //console.log("contImage id ="+contImage.id);
        contImage.set({
          'top': obj.top,
          'left': obj.left,
        });
        contImage.setCoords();
        canvas.renderAll();
      }
    }
  }
  else if((obj.type == 'image' || obj.type == 'textbox') && typeof obj.containerID !== 'undefined'){
    if(obj.containerID !== ''){
      var container = canvas.getItemById(obj.containerID);
      container.set('left', obj.left);
      container.set('top', obj.top);
      canvas.renderAll();
    }
  }
  else {
    if (multipageToggle == false) {
      return;
    }
    if (obj.type !== 'activeSelection') {
      return;
    }
    if(multipageToggle == true){    
      if(obj.type == 'activeSelection'){
        //console.log(JSON.stringify(obj));
        //console.log("updatePageObjects 1");
        //var objs = canvas.getActiveObject()._objects;
        var pageTitle = $('#pages #'+obj.page+' .page-title').text();
        var arrl = [];
        var labelid = '';
        arrl = pageTitle.split(' ')
        for (var i = 0; i<=arrl.length; i++) {
          var labelid = arrl.join("").toLowerCase();
        }
        var page = canvas.getItemById(obj.page);
        var label = canvas.getItemById(labelid);
        label.set('left', obj.left);
        label.set('top', obj.top - 25);
        canvas.renderAll();
      }
    }
  }
}
 
/**
 * Callback function DetectTemplateChanges()
 * its work when new object modified at canvas
 */
function DetectTemplateChanges(){
	savedDesignFlag = false;
	var t = checkDesign();
	if(t === true){
		var gettitle = $('#header .tabs .tab.g-active .title').text();
		gettitle = gettitle.split('*')[0];
		$('#header .tabs .tab.g-active .title').text(gettitle+'*');
		//$('button#save').removeAttr('disabled');
		//$('.g-menu .g-menu-bottom #save_caption').parent('.g-menu-item').removeClass('g-disabled');
	}
}
/**
 * Callback function NewobjectAdded()
 * its work when new object added at canvas
 */
function NewobjectAdded(){
	var obj = canvas.getActiveObject();
	if(savedDesignFlag == true){
		DisableRightProperties();	
		DisableActionToolbar();
	} else {
		
		if(obj && obj.type != 'group' && obj.type != 'Lineshape' && obj.type != 'ConnectorHandleStart' && obj.type != 'ConnectorHandleEnd' && !(isMoving)){
			updateCanvasState();
		}
		if(obj && obj.type !== 'line' && obj.type !== 'guideline' && obj.type != 'Lineshape' && obj.type != 'ConnectorHandleStart' && obj.type != 'ConnectorHandleEnd' && !(isMoving)){
			EnableRightProperties();	
			EnableActionToolbar();
			layerReordering();
		}
	}
}
/**
 * Callback function objectRemoved()
 * its work when object removed from canvas
 */
function objectRemoved(){
	savedDesignFlag = false;
  DisableRightProperties();	
	DisableActionToolbar();
}

 
/**
 * Callback function SelectionCreated()
 * its work when object selection created
 */
function SelectionCreated(e){
  var t = e.target;
	if (handSelected || zoomInTool || (t && t.lock_position === 1)) { canvas.discardActiveObject().renderAll(); return; }
	var obj = canvas.getActiveObject();
	if(obj){
    if(obj.type !== 'line' && obj.type !== 'guideline'){
      EnableRightProperties();	
      EnableActionToolbar();
    }
		updateProperties(e);
		LayerActivation(); //layer selection
		if(obj.type === 'textbox'){
			$('.properties-panel .appearance-property-panel.image-properties-panel').removeClass('d-block');
      $(".appearance-toolbar button").removeClass("d-none");
			$('.properties-panel .appearance-property-panel.text-properties-panel').removeClass('d-none').addClass('d-block');
		} else if(obj.type === 'image' || obj.type === 'ImageContainer'){
			$('.properties-panel .appearance-property-panel.text-properties-panel').removeClass('d-block').addClass('d-none');
			$('.properties-panel .appearance-property-panel.image-properties-panel').addClass('d-block');
      $(".appearance-toolbar button").addClass("d-none");
		}
    //code added by SMH for Dynamic data panel
    activeDynamicSeparateCobinePanel('inactive');
    if(obj.position_relative){
      if(obj.position_relative == 1){
        activeDynamicSeparateCobinePanel('active');
      }
    }
		//EnableActionToolbar(); //enable toolbar menus
	} else {
		if(drawText == false){
			DisableRightProperties();
			DisableActionToolbar(); //disable toolbar menus
		}
    activeDynamicSeparateCobinePanel('inactive');
	}
}

function SelectionCleared(){
	if(!CtrlPressed && !ShifPressed){
		$('.layer-row.g-active:not(.parent-layer)').removeClass('g-active');
	}
	DisableRightProperties();
	DisableActionToolbar(); 
}

function getFileName(){
	var d = checkDesign();
	if(d === true){		
		//$('button#save').attr('disabled', 'disabled');
		//$('.g-menu .g-menu-bottom #save_caption').parent('.g-menu-item').addClass('g-disabled');
		var design_id = getUrlDesignID();	
		$('#header .tabs .tab.g-active').attr('data-id', design_id);
		$('#layers .template-group.group-active').attr('id', design_id);
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
      console.log('settings');
       console.log(settings);
			$.ajax(settings).done(function (response) {
				const promise1 = new Promise(function(resolve, reject) {
					resolve(response);
				}).then(function(data) {
					$('#header .tabs .tab.g-active .title').text(data.name);
          console.log('data');
          console.log(data);
					document.title = data.name+' | KaboodleMedia';
					producTypeId = data.type_tid;
					producTypeName = data.folder_name;
					productId = data.group_tid;
          getPageSizePreset(productId);
					productName = data.group_name;
					$('#header .tabs .tab.g-active .title').attr('producTypeId', producTypeId).attr('productId', productId).attr('productName', productName);
          console.log('toolx-4');
					getProductName(data.type_tid);
					savedDesignFlag = true;
          if (typeof data.static_image_url !== 'undefined') {
            if(jQuery(".static-image .no-static-image").length && data.static_image_url != '' && data.static_image_url != null){
              var imgwidth = imgheight = '';
              var img = new Image();
              img.src = data.static_image_url;
              img.onload = function(){
                imgwidth = this.width;
                imgheight = this.height;
                if(imgwidth < imgheight){
                  jQuery('.static-image-thumb img').attr('width', "auto").attr('height', 128);
                }
                //console.log("3 height = "+ imgheight + " *** " + "width = "+ imgwidth);
              };
              //var size = data.width >= data.height ? 'width' : 'height';
              jQuery(".static-image .no-static-image").remove();
              jQuery(".static-image").append('<div class="static-image-thumb margin-auto"><img src="'+data.static_image_url+'" width="128" /></div>');
              jQuery(".image-page-button.remove-thumbnail").removeClass('d-none').addClass('d-block');
              jQuery(".image-page-button.create-thumbnail").removeClass('d-block').addClass('d-none');
              jQuery(".static-image-upload").removeClass('d-flex').addClass('d-none');
              if (typeof data.template_active !== 'undefined') {
                if(data.template_active == 1){
                  jQuery('#active-page').prop( "checked", true)
                }
              }
            }
          }
          if (typeof data.template_tags !== 'undefined' && data.template_tags != null) {
            if(jQuery.isArray(data.template_tags) && data.template_tags.length > 0){
              var templateTags = jQuery('#template-tags').magicSuggest({});
              templateTags.setValue(data.template_tags);
              templateAddedTags = data.template_tags;
            }
            else {
              var templateTags = jQuery('#template-tags').magicSuggest({});
              var data_temp_tags = [data.template_tags];
              templateTags.setValue(data_temp_tags);
              templateAddedTags = data.template_tags;
            }
            /*if(data.template_tags.length !== 0){
              var templateTags = jQuery('#template-tags').magicSuggest({});
              templateTags.setValue(data.template_tags);
              templateAddedTags = data.template_tags;
            }*/
          }
          if (typeof data.template_descriptions !== 'undefined') {
            templateAddedDescriptions = data.template_descriptions;
            jQuery("#template-descriptions").val(templateAddedDescriptions);
          }
          if (typeof data.measurement !== 'undefined') {
            cunit = data.measurement;
            jQuery("#measurements").val(cunit);
            jQuery('.g-ruler-widget-px span').text(cunit);
            // var pw = parseFloat($('#canvas-width').val()).toFixed(2);
            // var ph = parseFloat($('#canvas-height').val()).toFixed(2);
            var pw = pageWidth;
            var ph = pageHeight;
            if(cunit == 'in' && pageUnit == 'px'){
              //console.log("55-1 pw ="+pw+" ** ph"+ph);
              pageUnit = 'in';
              pageWidth = (pw / 72);
              pageWidth = parseFloat(pageWidth).toFixed(2);
              pageHeight = (ph / 72);
              pageHeight = parseFloat(pageHeight).toFixed(2);
              $('#canvas-width').val(pageWidth);
              $('#canvas-height').val(pageHeight);
              //console.log("55-2 pw ="+pageWidth+" ** ph"+pageHeight);
            }
            else {
              $('#canvas-width').val(pw);
              $('#canvas-height').val(ph);
            }
            //console.log("pageWidth 55 ="+pageWidth);
            setPageSizeOption(pageWidth, pageHeight);
            addrulernew(0,0);
          }
          if (typeof data.page_bleed !== 'undefined') {
            if(data.page_bleed == 1){
              jQuery('#page-bleed').prop("checked", true);
              jQuery('#page-bleed').attr("disabled", false);
            }
          }
          if (typeof data.trim_marks !== 'undefined') {
            if(data.trim_marks == 1){
              jQuery('#page-bleed').prop("checked", true);
              jQuery('#page-trim-marks').prop("checked", true);
              jQuery('#page-bleed').attr("disabled", true);
            }
          }
          if (typeof data.color_space !== 'undefined') {
            var color_space = data.color_space;
            jQuery("#kmds-color-space").val(color_space);
          }
          if (typeof data.page_format !== 'undefined') {
            var page_format = data.page_format;
            jQuery("#kmds-format").val(page_format);
            if(page_format == 'pdf'){
              addPageMediaBox();
            }
          }
          if (typeof data.preset_name !== 'undefined') {
            var preset_name = data.preset_name;
            jQuery("#preset-size").attr('preset-name', preset_name);
            presetName = preset_name;
            jQuery('#header .selectedpreset #preset-name').text(presetName);
          }
          if (typeof data.preset_tid !== 'undefined') {
            presetVal = data.preset_tid;
            jQuery("#preset-size").attr('preset-tid', presetVal);
          }
          if (typeof data.fabricDPI !== 'undefined') {
            var fabricDPI = data.fabricDPI;
            jQuery("#kmds-dpi").val(fabricDPI);
            fabric.DPI = fabricDPI;
          }
          
				  // ruler show/hide on load
				  var active_page_object = canvas._objects;
				  //console.log(active_page_object);
				  if(active_page_object[0]){
				  	if(active_page_object[0].pageRuler == 0){
	          	$('#show_rulers').parent('.g-menu-item').children('.g-menu-item-icon').html('');
							$('#show_rulers').parent('.g-menu-item').removeClass('optionEnabled');
							$('.kmds-g-ruler').css('display', 'none');
					    $('#canvas-wrapper').css('padding', '0px');
					    $('#canvas-wrapper').attr("pageRuler","0");
	          }
				  	if(active_page_object[0].pageGuideLines == 0){
	          	$('#show_guidelines').parent('.g-menu-item').children('.g-menu-item-icon').html('');
							$('#show_guidelines').parent('.g-menu-item').removeClass('optionEnabled');
					    $('#canvas-wrapper').attr("pageGuideLines","0");
              guideStatus = 0;
              $.each( active_page_object, function( key, object ) {
                if(object.type == 'line' || object.type == 'guideline'){
                  //object.set('opacity', 0);
                  object.set({
                    lock_position: 1,
                    opacity: 0,
                    lockMovementX: true,
                    lockMovementY: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    lockRotation: true,
                    hasControls: false,
                    selectable: false,
                    hasBorders: false,
                    borderColor: 'transparent',
                    editable: false,
                  });
                  canvas.renderAll();
                }
              });
	          }
	        }
	        
					return fileName = data.name;
				});
			});
	}	
}

function kmdsToolSettingSave() {
  //canvas.discardActiveObject().renderAll(); //it is required when saving template
	groupToActiveSelection(null);
	layerReordering();
  //Remove Smart Guide
  smartGuideStatus = 0;
  _removeGuide();
	design_id = getUrlDesignID();
	if(design_id === ''){
		fileName = $('#template-name').val();		
	}	
	if(fileName === '' || typeof fileName === 'undefined'){
		if($('.g-dialog-container').length === 0){		
			FnNewFolderModal();
			FnDefaultModal('Please enter a template title.');
		}			
	} else {
    canvas.getObjects().forEach(function(obj) {
      if(obj.type == 'text' && obj.name == 'measurement'){
        obj.set({
          opacity: 0
        });
      }
      else if(obj.type == 'image'){
        obj.set({
          OldscaleX: obj.scaleX,
          OldscaleY: obj.scaleY,
          OldWidth: obj.width,
          OldHeight: obj.height,
          //clipTo: '', 
        });
      }
      else if(obj.type == 'page'){
        obj.set({
          fabricDPI: fabric.DPI,
        });
      }
    });
    canvas.renderAll();
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
    var cunit = jQuery("#measurements").val();
    var pageWidth = parseFloat(jQuery('#canvas-width').val()).toFixed(2);
    //console.log("pageWidth 6 ="+pageWidth);
    var cwidth = (cunit == 'in') ? parseFloat(pageWidth*72) : pageWidth;
    var pageHeight = parseFloat(jQuery('#canvas-height').val()).toFixed(2);
    var cheight = (cunit == 'in') ? parseFloat(pageHeight*72) : pageHeight;
		//var cwidth = parseInt($('#canvas-width').val());
		//var cheight = parseInt($('#canvas-height').val());
    var ruler_status = rulerStatus;
    //console.log('get ruler status');
    //console.log(ruler_status);
    var cunit = jQuery('#measurements').val();
    var color_space = jQuery('#kmds-color-space').val();
    var page_format = jQuery('#kmds-format').val();
    var page_bleed = jQuery('#page-bleed').is(':checked') ? 1 : 0;
    var trim_marks = jQuery('#page-trim-marks').is(':checked') ? 1 : 0;
    presetVal = jQuery("#preset-size").attr('preset-tid');
    presetName = jQuery("#preset-size").attr('preset-name');
    var kmdsDPI = jQuery("#kmds-dpi").val();
    var fabricDPI = (kmdsDPI == '') ? fabric.DPI : kmdsDPI;
    fabric.DPI = fabricDPI;
		var data = {"name": fileName, "_name": fileName, "user_id":uid, "user":name, "group_tid": productId, "type_tid":producTypeId, "group_name":productName, "folder_name":folderName, "template_tid":template_tid, "template_group":group, "type_name": producTypeName, "width": cwidth, "height":cheight, "measurement":cunit, "template_tags":templateAddedTags, "template_descriptions":templateAddedDescriptions,"ruler_status":ruler_status, "kmds": 1, "color_space": color_space, "page_format": page_format, "page_bleed": page_bleed, "trim_marks": trim_marks, "fabricDPI": fabricDPI, "preset_name": presetName, "preset_tid": presetVal};
		var json = canvas.toJSON();
		console.log(json);
		var dataURL = canvas.toDataURL();
		FnDismisModal();
		
		//add loader
		FnNewFolderModal();
		FnDefaultModal('');
		$('.g-dialog-container').css('color', '#e75e00');
		$('.g-dialog-container').html('<div class="progress-overlay"><div class="fs-26 font-Lato">Saving...</div><br><div class="spinner-border"></div></div>');
    //Custom URL to convert base64 to image URL
    /*****************/
    jQuery.ajax({
      url: media_base_url+"/kmds/design-tool/images",
      type: "POST",
      data: {json_data: JSON.stringify(json), design_id: design_id, json_type: 'convert_image', uid: uid},
      dataType: "json",
      beforeSend: function(x) {
        if (x && x.overrideMimeType) {
          x.overrideMimeType("application/json;charset=UTF-8");
        }
      },
      success: function(result) {
        //console.log('Mas image-result'+JSON.stringify(result));
        canvas.clear();
        canvas.loadFromJSON(result, canvas.renderAll.bind(canvas));
        create_save_update_design(design_id, data, result, dataURL);
        savedDesignFlag = true;
        $('#header .tabs .tab.g-active .title').text(fileName);
        $('#template-name').val(fileName);
        document.title = fileName+' | KaboodleMedia';
        //$('button#save').attr('disabled', 'disabled');
        //$('.g-menu .g-menu-bottom #save_caption').parent('.g-menu-item').addClass('g-disabled');
      }
    });
    /*****************/
		//create_save_update_design(design_id, data, json, dataURL);
		//savedDesignFlag = true;
		//$('#header .tabs .tab.g-active .title').text(fileName);
		//$('#template-name').val(fileName);
		//document.title = fileName+' | KaboodleMedia';
		//$('button#save').attr('disabled', 'disabled');
		//$('.g-menu .g-menu-bottom #save_caption').parent('.g-menu-item').addClass('g-disabled');
    if(uid == 1 && templateAddedTags.length !== 0) {
      jQuery.ajax({
        url: media_base_url+"/createtokendata",
        type: "POST",
        data: {template_tags: templateAddedTags, vid: 'template_tags'},
        dataType: "json",
        success: function(result) {
          //console.log('New tags added in taxonomy');
        }
      });
    }
	}
}

function kmdsToolSettingSaveAs() {
  //canvas.discardActiveObject().renderAll(); //it is required when saving template
	groupToActiveSelection(null);
	layerReordering();
	design_id = '';//getUrlDesignID();		
	if(design_id === ''){
		fileName = $('#template-name').val();		
	}	
	if(fileName === '' || typeof fileName === 'undefined'){	
		// if($('.g-dialog-container').length === 0){		
		// 	FnNewFolderModal();
		// 	FnDefaultModal('The new template name is required.');
		// }			
		$('.saveas-error').show();
		setTimeout(function () {
		    $('.saveas-error').hide();
		}, 3000);
	} else {
    canvas.getObjects().forEach(function(obj) {
      if(obj.type == 'text' && obj.name == 'measurement'){
        obj.set({
          opacity: 0
        });
      }
    });
    canvas.renderAll();
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
    var cunit = jQuery("#measurements").val();
    var pageWidth = parseFloat(jQuery('#canvas-width').val()).toFixed(2);
    //console.log("pageWidth 7 ="+pageWidth);
    var cwidth = (cunit == 'in') ? parseFloat(pageWidth*72).toFixed(2) : pageWidth;
    var pageHeight = parseFloat(jQuery('#canvas-height').val()).toFixed(2);
    var cheight = (cunit == 'in') ? parseFloat(pageHeight*72).toFixed(2) : pageHeight;
		//var cwidth = parseInt($('#canvas-width').val());
		//var cheight = parseInt($('#canvas-height').val());
    var cunit = jQuery('#measurements').val();
    var ruler_status = rulerStatus;
    var color_space = jQuery('#kmds-color-space').val();
    var page_format = jQuery('#kmds-format').val();
    var page_bleed = jQuery('#page-bleed').is(':checked') ? 1 : 0;
    var trim_marks = jQuery('#page-trim-marks').is(':checked') ? 1 : 0;
    var kmdsDPI = jQuery("#kmds-dpi").val();
    var fabricDPI = (kmdsDPI == '') ? fabric.DPI : kmdsDPI;
    fabric.DPI = fabricDPI;
		var data = {"name": fileName, "_name": fileName, "user_id":uid, "user":name, "group_tid": productId, "type_tid":producTypeId, "group_name":productName, "folder_name":folderName, "template_tid":template_tid, "template_group":group, "type_name": producTypeName, "width": cwidth, "height":cheight, "measurement":cunit, "template_tags":templateAddedTags, "template_descriptions":templateAddedDescriptions,"ruler_status":ruler_status, "kmds": 1, "color_space": color_space, "page_format": page_format, "page_bleed": page_bleed, "trim_marks": trim_marks, "fabricDPI": fabricDPI};
		var json = canvas.toJSON();
		//console.log(json);
		var dataURL = canvas.toDataURL();
		DismisModal('saveasmodal');
		
		//add loader
		FnNewFolderModal();
		FnDefaultModal('');
		$('.g-dialog-container').css('color', '#e75e00');
		$('.g-dialog-container').html('<div class="progress-overlay"><div class="fs-26 font-Lato">Saving...</div><br><div class="spinner-border"></div></div>');
    
    //remove active thumbnali on save as
		jQuery(".static-image-thumb").remove();
    jQuery('.static-image').append('<div class="no-static-image margin-auto">&nbsp;</div>');
    jQuery(".image-page-button.remove-thumbnail").removeClass('d-block').addClass('d-none');
    jQuery(".image-page-button.create-thumbnail").removeClass('d-none').addClass('d-block');
    jQuery(".static-image-upload").removeClass('d-none').addClass('d-flex');
    jQuery('#active-page').prop( "checked", false )
    
    // modal open after save as
		openSaveAsConfirmationTemplateModal();
					
    //Custom URL to convert base64 to image URL
    /*****************/
    jQuery.ajax({
      url: media_base_url+"/kmds/design-tool/images",
      type: "POST",
      data: {json_data: JSON.stringify(json), design_id: design_id, json_type: 'convert_image', uid: uid},
      dataType: "json",
      beforeSend: function(x) {
        if (x && x.overrideMimeType) {
          x.overrideMimeType("application/json;charset=UTF-8");
        }
      },
      success: function(result) {
        //console.log('Mas image-result'+JSON.stringify(result));
        canvas.clear();
        canvas.loadFromJSON(result, canvas.renderAll.bind(canvas));
        create_save_update_design(design_id, data, result, dataURL);
        savedDesignFlag = true;
        $('#header .tabs .tab.g-active .title').text(fileName);
        $('#template-name').val(fileName);
        document.title = fileName+' | KaboodleMedia';
        //$('button#save').attr('disabled', 'disabled');
        //$('.g-menu .g-menu-bottom #save_caption').parent('.g-menu-item').addClass('g-disabled');
      }
    });
    /*****************/
		//create_save_update_design(design_id, data, json, dataURL);
		//savedDesignFlag = true;
		//$('#header .tabs .tab.g-active .title').text(fileName);
		//$('#template-name').val(fileName);
		//document.title = fileName+' | KaboodleMedia';
		//$('button#save').attr('disabled', 'disabled');
		//$('.g-menu .g-menu-bottom #save_caption').parent('.g-menu-item').addClass('g-disabled');
    if(uid == 1 && templateAddedTags.length !== 0) {
      jQuery.ajax({
        url: media_base_url+"/createtokendata",
        type: "POST",
        data: {template_tags: templateAddedTags, vid: 'template_tags'},
        dataType: "json",
        success: function(result) {
          //console.log('New tags added in taxonomy');
        }
      });
    }
	}
}

function getDesignData(designid){
	//design_id = getUrlDesignID();
	if (designid != '') {
		savedDesignFlag = true;
		var settings = {
			"url": access_check_api + "designjson/" + designid,
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
				var datajsonparse =  JSON.parse(datajson.design);
				var pageArr = [];
				var pagedata = datajsonparse.objects;

				$.each( pagedata, function( key, val ) { 
					if(val.type == 'page'){
						pageArr.push(val);
					}
				});

				pageArr = pageArr.sort(function(a, b) {
					return a.order - b.order;
				});
				
				setTimeout(function() {
					canvas.loadFromJSON(datajsonparse, canvas.renderAll.bind(canvas), function(o, object){
            //console.log(object);
						
						//create pages
						$.each( pageArr, function( key, val ) { 
							if($('#'+val.id).length === 0){
                var paggecolor = (val.backgroundColor) == '' ? '#ffffff' : val.backgroundColor;
								add_page(val.id, val.width, val.height, paggecolor);
							}
						});
						
						//hide labels
            if(object.name && object.name == 'pagelabel' && multipageToggle == false){
							object.set('visibility', false);
							object.set('opacity', 0);
            }
						
						//guides
						if(object.type == 'text' && object.name == 'measurement'){
							object.set('borderColor', 'transparent');
							object.setControlsVisibility({
								 mt: false, 
								 mb: false, 
								 ml: false, 
								 mr: false, 
								 bl: false,
								 br: false, 
								 tl: false, 
								 tr: false,
								 mtr: false, 
							});
              object.set({
                opacity: 0
              });
						}
						if(object.type == 'line' || object.type == 'guideline'){
							if(guideStatus == 1){
								object.set('opacity', 1);
							} else {
								object.set('opacity', 0);
							}
              object.set('hasBorders', false);
							object.set('borderColor', 'transparent');
							object.setControlsVisibility({
								 mt: false, 
								 mb: false, 
								 ml: false, 
								 mr: false, 
								 bl: false,
								 br: false, 
								 tl: false, 
								 tr: false,
								 mtr: false, 
							});
						}

            //console.log('get ruler status 4');
            //console.log(object);
						
						//create parent and child layers
						layersCreationOnTemplateLoad(object);
						if(object.type !== 'page' && object.type !== 'text' && object.type !== 'line' && object.type !== 'guideline' && object.type !== 'group'){
							//console.log(object.name+' = '+object.type+' = '+object.layerIndexing);
							canvas.moveTo(object, parseInt(object.layerIndexing));
						}
            if(object.dynamic_opacity_range){
              object.set('opacity', object.dynamic_opacity_range);
            }
            if(object.dynamic_image_opacity_range){
              object.set('opacity', object.dynamic_image_opacity_range);
            }
            if(object.type == 'image'){
              if(object.dynamicImageCorner){
                object.clipTo = null;
              }
            }
            if(object.dynamic_corner){
              object.set({
                rx: object.dynamic_corner,
                ry: object.dynamic_corner,
              });
            }
						canvas.renderAll();
					});
					
					$( "#overlay" ).remove();
				}, 1200);				
				$('.layer-row.parent-layer.g-has-selection').removeClass('g-has-selection');
				sort_layer();
				var activepage = $('.page-row:first-child').attr('id');
				var page = document.getElementById(activepage);
				pageClick(page);
        var activePageObj = canvas.getItemById(activepage);
        pageWidth = activePageObj.width;
        //console.log("pageWidth 8 ="+pageWidth);
        pageHeight = activePageObj.height;					
        var measurements = jQuery("#measurements").val();
        if(measurements == 'in'){
          pageWidth = (pageWidth / 72).toFixed(4);
          pageWidth = parseFloat(pageWidth).toFixed(2);
          //console.log("pageWidth 9 ="+pageWidth);
          pageHeight = (pageHeight / 72).toFixed(4);
          pageHeight = parseFloat(pageHeight).toFixed(2);
        }
        $('#canvas-width').val(parseFloat(pageWidth).toFixed(2));
        $('#canvas-height').val(parseFloat(pageHeight).toFixed(2));
        var cunit = (activePageObj.pageMeasurement) ? activePageObj.pageMeasurement : 'px';
        $('#measurements').val(cunit);
        setPageSizeOption(activePageObj.width, activePageObj.height);
        getPageSizePreset(productId);
        leftmargin = parseInt(activePageObj.left-(activePageObj.width/2));
        topmargin = parseInt(activePageObj.top-(activePageObj.height/2));
        leftRuler.relativePan({x: 0, y: parseInt(activePageObj.top-(activePageObj.height/2))});
        topRuler.relativePan({x: parseInt(activePageObj.left-(activePageObj.width/2)), y: 0});
				if(activePageObj.backgroundColor == ''){
					var pagecolor = '#ffffff';
				} else {
					var pagecolor = activePageObj.backgroundColor;
				}
				$('#page-background').val(pagecolor);
        jQuery('#page-background').css('background-color', pagecolor);
			},
			function rejectHandler(jqXHR, textStatus, errorThrown) {
				// ...
			}
		).catch(function errorHandler(error) {
      
		});
	}
}
/**
 * Callback function refreshLayersOnTemplateLoad()
 * to refresh the layers sections
 **/
function refreshLayersOnTemplateLoad(){
  var added_json = canvas.toJSON();
  var datas = added_json.objects;
  var total_objects = datas.length;
  var objectCount = 0;
  $.each( datas, function( key, object ) {
    objectCount++;
    //don't add layer if layout object found
    if (object.id === 'layout-1' || object.id === 'layout-2') {
      return;
    }
    activePage = $('.page-row[page-no=1]').attr('id');
    if(object.type == 'page'){
      if($('#'+object.id).length === 0){
        var paggecolor = (object.backgroundColor) == '' ? '#ffffff' : object.backgroundColor;
        if(layoutExist){
          add_page(object.id, object.width, object.height, paggecolor, 'layoutExist', object.order);
        }
        else {
          add_page(object.id, object.width, object.height, paggecolor, null, object.order);
        }
        if(object.id == activePage){
          //switch_page(activePage);
          $('#page-background').val(paggecolor);
          $('#page-background').css('background-color', paggecolor);
        }
      }
    }
    if(typeof object.layerGroup !== 'undefined'){
      if(object.layerGroup !== '' && object.type !== 'page' && object.type !== 'text' && object.type !== 'line' && object.type !== 'guideline' && object.type !== 'ConnectorHandleStart' && object.type !== 'ConnectorHandleEnd'){
        var plArr = [];
        plArr.push({'layerGroup': object.layerGroup, 'layerGroupTitle': object.layerGroupTitle, 'pageId': object.page, 'objectGroup': object.objectGroup, 'childObject': object.id, 'parentlayerOrder': object.parentlayerOrder});
        var filteredArray = plArr.filter(function(item, pos){
          return plArr.indexOf(item)== pos; 
        });
        $.each( filteredArray, function( key, val ) { 		
          if(val.layerGroup !== '' && !($('#'+val.layerGroup).length)){	
            if(val.objectGroup === true){
              toolGroup = true;
            }
            //console.log("layerGroup = "+val.layerGroup);
            parentLayerStructure(val.layerGroup, val.layerGroupTitle, val.pageId, val.parentlayerOrder);
          }
        });
      }
    }
    if(object.name == 'defaultImage'){
      var defaultObj = canvas.getItemById(object.id);
      canvas.remove(defaultObj);
      canvas.renderAll();
      return;
    }
    //child layers
    if(object.type !== 'page' && object.type !== 'text' && object.type !== 'line' && object.type !== 'guideline' && object.type !== 'ConnectorHandleStart' && object.type !== 'ConnectorHandleEnd'){
      var objs = [];
      var containerID = '';
      if(object.containerID){
        containerID = object.containerID;
      }
      objs.push({'Id': object.id, 'Name': object.name, 'Type': object.type, 'Page': object.page, 'layerGroup': object.layerGroup, 'layerIndexing': object.layerIndexing, 'containerID': containerID});
      /* objs = objs.sort(function(a, b) {
        return a.layerIndexing - b.layerIndexing;
      }); */
      //console.log(JSON.stringify(objs));
      $.each( objs, function( key, val ) { 
        if($('#'+val.Id).length === 0){
          //console.log(JSON.stringify(objs));
          if(val.containerID != ''){
            //var valType = (val.Name == 'defaultImage') ? 'ImageContainer' : val.Type;
            var valType = val.Type;
            add_layer(val.Id, val.Name, valType, val.Page, val.layerGroup, val.layerIndexing, val.containerID);
            $('#layers #'+val.Id).attr('order', val.layerIndexing);
            //console.log("val = "+JSON.stringify(val));
          }
          else {
            add_layer(val.Id, val.Name, val.Type, val.Page, val.layerGroup, val.layerIndexing);
            $('#layers #'+val.Id).attr('order', val.layerIndexing);
          }
          sort_layer();
        }
      });
    }
    if(object.type == 'ImageContainer'){
      updateContainerImageCoords(object);
    }
    //objectCount++;
    //console.log("objectCount = "+objectCount);
    //console.log("total_objects = "+total_objects);
    if(parseInt(total_objects) == parseInt(objectCount)){
      //console.log("total_objects = "+total_objects);
      var pageID = jQuery('.page-row[page-no=1]').attr('id');
      layerReordering();
      activate_page_layers(pageID);
      switch_page(pageID);
    }
  });
}
function layersCreationOnTemplateLoad(object){
  //Parent layers
  if(object.layerGroup !== '' && object.type !== 'page' && object.type !== 'text' && object.type !== 'line' && object.type !== 'guideline' && object.type !== 'ConnectorHandleStart' && object.type !== 'ConnectorHandleEnd'){
    var plArr = [];
    plArr.push({'layerGroup': object.layerGroup, 'layerGroupTitle': object.layerGroupTitle, 'pageId': object.page, 'objectGroup': object.objectGroup, 'childObject': object.id, 'parentlayerOrder': object.parentlayerOrder});
    var filteredArray = plArr.filter(function(item, pos){
      return plArr.indexOf(item)== pos; 
    });
    $.each( filteredArray, function( key, val ) { 		
      if(val.layerGroup !== '' && !($('#'+val.layerGroup).length)){	
        if(val.objectGroup === true){
          toolGroup = true;
        }
        parentLayerStructure(val.layerGroup, val.layerGroupTitle, val.pageId, val.parentlayerOrder);
      }
    });
  }
  
  //child layers
  if(object.type !== 'page' && object.type !== 'text' && object.type !== 'line' && object.type !== 'guideline' && object.type !== 'ConnectorHandleStart' && object.type !== 'ConnectorHandleEnd'){
    var objs = [];
    objs.push({'Id': object.id, 'Name': object.name, 'Type': object.type, 'Page': object.page, 'layerGroup': object.layerGroup, 'layerIndexing': object.layerIndexing});
    /* objs = objs.sort(function(a, b) {
      return a.layerIndexing - b.layerIndexing;
    }); */
    //console.log(objs);
    $.each( objs, function( key, val ) { 
      if($('#'+val.Id).length === 0){						
        add_layer(val.Id, val.Name, val.Type, val.Page, val.layerGroup, val.layerIndexing);
        $('#layers #'+val.Id).attr('order', val.layerIndexing);
      }
    });
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
				//console.log(data)
				queryString.push('d', data._id);
				$('#header .tabs .tab.g-active').attr('data-id', data._id);
				$('#layers .template-group.group-active').attr('id', data._id);
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
			//console.log(response);
			//console.log("Setting data saved");
			//alert('save');
		}).then(
			function  fulfillHandler(data) {
				//console.log(data)
				queryString.push('d', data._id);
				savedDesignFlag = true;
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
				savedDesignFlag = true;
				$('#header .tabs .tab.g-active').attr('data-id', design_id);
				$('#layers .template-group.group-active').attr('id', design_id);
				$('#header .tabs .tab.g-active .title').attr('design', design_id);
				$('#header .tabs .tab.g-active .close').attr('designid', design_id);
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
							 //console.log(datajson);
								var datajsonparse =  JSON.parse(datajson.design);
                var total_object_counts = datajsonparse.objects.length;
                var object_count = 0;
								//Pages
								var pageArr = [];
								var pagedata = datajsonparse.objects;
                /*$.each( pagedata, function( key, val ) {
									if(val.type == 'page'){
										pageArr.push(val);
									}
                  else if(val.type == 'text' || val.type == 'textbox'){
                    console.log(val.fontFamily)
                    //load kmds fonts
                    if(val.fontFamily){
                      var fontFamily = val.fontFamily;*/
                      /*FontFaceOnload( fontFamily, {
                        success: function() {
                          var added_json = canvas.toJSON();
                          canvas.clear();
                          canvas.loadFromJSON(added_json, canvas.renderAll.bind(canvas));
                        }
                      });*/
                      /*var fontName = fontFamily.replace(/ /g, "+");
                      var kmdsFont = new FontFace(fontFamily, 'url(https://s3.us-west-2.amazonaws.com/kaboodlemedia.com/s3fs_public/kmdsFonts/'+fontName+'/'+fontName+'.woff2)');
                      kmdsFont.load().then(function(font){
                        // with canvas, if this is ommited won't work
                        document.fonts.add(font);
                        console.log('Font loaded');
                        var added_json = canvas.toJSON();
                        canvas.clear();
                        canvas.loadFromJSON(added_json, canvas.renderAll.bind(canvas));
                      });*/
                      /*kmdsFontsLoad(val.fontFamily);
                    }
                  }
								});
								pageArr = pageArr.sort(function(a, b) {
									return a.order - b.order;
								});*/
								/* var filteredPage = pageArr.filter(function(item, pos){
									return pageArr.indexOf(item)== pos; 
								});
								console.log(filteredPage); */

								/* $.each( pageArr, function( key, val ) { 
									if($('#'+val.id).length === 0){
										var paggecolor = (val.backgroundColor) == '' ? '#ffffff' : val.backgroundColor;
                    add_page(val.id, val.width, val.height, paggecolor);
									}
								}); */
								
								//console.log(datajsonparse);
								//setTimeout(function() {
                datajsonparse.background = "#eaeaea";
									canvas.loadFromJSON(datajsonparse, canvas.renderAll.bind(canvas), function(o, object){
										//create pages
										/*$.each( pageArr, function( key, val ) { 
											if($('#'+val.id).length === 0){
                        var paggecolor = (val.backgroundColor) == '' ? '#ffffff' : val.backgroundColor;
												add_page(val.id, val.width, val.height, paggecolor);
											}
										});*/
                    /*if(object.type == 'page'){
                      if($('#'+object.id).length === 0){
                        add_page(object.id, object.width, object.height);
                      }
                    }*/
                    if(object.type == 'text' || object.type == 'textbox'){
                      //console.log(object.fontFamily)
                      //load kmds fonts
                      if(object.fontFamily){
                        var fontFamily = object.fontFamily;
                        kmdsFontsLoad(object.fontFamily);
                      }
                    }
										
										//hide labels
										if(object.name && object.name == 'pagelabel' && multipageToggle == false){
											object.set('visibility', false);
											object.set('opacity', 0);
										}

										//guides
										if(object.type == 'text' && object.name == 'measurement'){
											object.set('borderColor', 'transparent');
											object.setControlsVisibility({
												 mt: false, 
												 mb: false, 
												 ml: false, 
												 mr: false, 
												 bl: false,
												 br: false, 
												 tl: false, 
												 tr: false,
												 mtr: false, 
											});
                      object.set({
                        opacity: 0
                      });
										}
										if(object.type == 'line' || object.type == 'guideline'){
											if(guideStatus == 1){
												object.set('opacity', 1);
											} else {
												object.set('opacity', 0);
											}
                      object.set('hasBorders', false);
											object.set('borderColor', 'transparent');
											object.setControlsVisibility({
												 mt: false, 
												 mb: false, 
												 ml: false, 
												 mr: false, 
												 bl: false,
												 br: false, 
												 tl: false, 
												 tr: false,
												 mtr: false, 
											});
										}

										//create parent and child layers
										//layersCreationOnTemplateLoad(object);
										$('.layer-row.parent-layer.g-has-selection .layer-title-group .layer-icon').css('color', '#3a3a3a');
										sort_layer();
										var activepage = $('.page-row:first-child').attr('id');
										$('.page-row.g-active').removeClass('g-active');
										$('.page-row #'+activepage).addClass('g-active');
										activate_page_layers(activepage);
										//$.each( pageArr, function( ikey, ival ) {
											//console.log(ival);
											//console.log('visibility - '+object.visibility);
											//console.log('opacity - '+object.opacity);
											if(object.type == 'page'){
                        loadPageArr.push(object);
                        pageArr.push(object);
												//if(object.id == activepage){
													object.set('visibility', true);
													object.set('opacity', 1);
                          cunit = (object.pageMeasurement) ? object.pageMeasurement : 'px';
													if(cunit == 'px'){
                            pageWidth = parseFloat(object.width).toFixed(2);
                            pageHeight = parseFloat(object.height).toFixed(2);
                          }
                          else {
                            pageWidth = parseFloat(object.width).toFixed(2);
                            pageHeight = parseFloat(object.height).toFixed(2);
                          }
                          //console.log("pageWidth 10 ="+pageWidth);
													if(object.backgroundColor == ''){
														var pagecolor = '#ffffff';
													} else {
														var pagecolor = object.backgroundColor;
													}
													$('#page-background').val(pagecolor);
                          jQuery('#page-background').css('background-color', pagecolor);
													var cw = parseInt(object.width);
													var ch = parseInt(object.height);
                          //var cunit = (object.pageMeasurement) ? object.pageMeasurement : 'px';
                          $('#measurements').val(cunit);
                          jQuery('.g-ruler-widget-px span').text(cunit);
													$('#canvas-width').val(pageWidth);
													$('#canvas-height').val(pageHeight);
                          //setPageSizeOption(pageWidth, pageHeight);
                          getPageSizePreset(productId);
              
                          //canvas.absolutePan({x: parseInt(object.left-(cw/2)), y: parseInt(object.top-(ch/2))});
                          leftmargin = parseInt(object.left-(cw/2));
                          topmargin = parseInt(object.top-(ch/2));
                          //leftRuler.relativePan({x: 0, y: parseInt(object.top-(ch/2))});
                          //topRuler.relativePan({x: parseInt(object.left-(cw/2)), y: 0});
												//} else {
												//	object.set('visibility', false);
												//	object.set('opacity', 0);
												//}
											} else {
												if(object.type !== 'text' && object.type !== 'line' && object.type !== 'guideline'){
													//if(object.page == activepage){
                            //if(object.type == 'Lineshape'){console.log(JSON.stringify(object));}
														if(object.type == 'Lineshape' || object.type == 'ConnectorHandleStart' || object.type == 'ConnectorHandleEnd'){
															object.set('visibility', true);
															object.setControlsVisibility({
																mt: false, 
																mb: false, 
																ml: false, 
																mr: false, 
																bl: false,
																br: false, 
																tl: false, 
																tr: false,
																mtr: false, 
															});
														} else {
															object.set('visibility', true);
															object.set('selectable', true);
															object.set('hasControls', true);
															object.set('hasBorders', true);
															object.set('opacity', 1);
														}
													//} else {
													//	object.set('selectable', false);
													//	object.set('hasControls', false);
													//	object.set('hasBorders', false);
													//	object.set('visibility', false);
													//	object.set('opacity', 0);
													//}
												}
											}
                      if(object.dynamic_opacity_range){
                        object.set('opacity', object.dynamic_opacity_range);
                      }
                      if(object.dynamic_image_opacity_range){
                        object.set('opacity', object.dynamic_image_opacity_range);
                      }
                      if(object.type == 'image'){
                        if(object.dynamicImageCorner){
                          object.clipTo = null;
                        }
                      }
                      if(object.dynamic_corner){
                        object.set({
                          rx: object.dynamic_corner,
                          ry: object.dynamic_corner,
                        });
                      }
											if(object.type !== 'page' && object.type !== 'text' && object.type !== 'line' && object.type !== 'guideline'){
												canvas.moveTo(object, parseInt(object.layerIndexing));
											}
                      if(object.hide_container && object.hide_container == 1){
                        object.lockMovementX = true;
                        object.lockMovementY = true;
                        object.lockScalingX = true;
                        object.lockScalingY = true;
                        object.lockRotation = true;
                        object.selectable = false;
                        object.hasControls = false;
                        object.hasBorders = false;
                      }
                      if(object.hide_data && object.hide_data == 1){
                        object.lockMovementX = true;
                        object.lockMovementY = true;
                        object.lockScalingX = true;
                        object.lockScalingY = true;
                        object.lockRotation = true;
                        object.selectable = false;
                        object.hasControls = false;
                        object.hasBorders = false;
                        object.setControlsVisibility({
                           mt: false, 
                           mb: false, 
                           ml: false, 
                           mr: false, 
                           bl: false,
                           br: false, 
                           tl: false, 
                           tr: false,
                           mtr: false, 
                        });
                        object.set({
                          opacity: 0,
                          active: true,
                        });
                      }
                      if(object.id == 'layout-1' || object.id == 'layout-2'){
                        layoutExist = true;
                      }
                      if(object.type == 'ImageContainer'){
                        updateContainerImageCoords(object);
                      }
											/* if(activePage){
												activePageObj = canvas.getItemById(activePage);
											} */
											canvas.renderAll();
                      object_count++;
                      if(parseInt(total_object_counts) == parseInt(object_count)){
                        setTimeout(function() {
                          /*$.each( pageArr, function( key, val ) {
                            if($('#'+val.id).length === 0){
                              var paggecolor = (val.backgroundColor) == '' ? '#ffffff' : val.backgroundColor;
                              if(layoutExist){
                                add_page(val.id, val.width, val.height, paggecolor, 'layoutExist');
                                var aid = jQuery('.page-row[page-no=1]').attr('id');
                                switch_page(aid);
                              }
                              else {
                                add_page(val.id, val.width, val.height, paggecolor);
                              }
                              activePage = $('.page-row[page-no=1]').attr('id');
                              if(val.id == activePage){
                                $('#page-background').val(paggecolor);
                                $('#page-background').css('background-color', paggecolor);
                              }
                            }
                          });*/
                          console.log("All Objects rendered.");
                          $('body').removeClass('loading');
                          $('#mainframe').css('display', 'flex');
                          //load all fonts from kmdsFontsLoad.js
                          kmdsFontsLoad();
                          //layersCreationOnTemplateLoad('after-render');
                          refreshLayersOnTemplateLoad();
                          applyDynamicImageCorner();
                          getFileName();//Update template name
                          console.log("file name run.");
                          $('.layer-row.parent-layer.g-has-selection .layer-title-group .layer-icon').css('color', '#3a3a3a');
                          //sort_layer();
                        },1000);
                      }
                     // addrulernew(0,0); //ds new location
									});
									
								//}, 2700);
                //refresh the canvas
                /*setTimeout(function() {
                  var added_json = canvas.toJSON();
                  canvas.clear();
                  canvas.loadFromJSON(added_json, canvas.renderAll.bind(canvas));
                  console.log('Refreshed');
                }, 5700);*/
                canvas.backgroundColor = "#eaeaea";
                canvas.renderAll();
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
				//console.log(data);
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
				//console.log(data)
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
			//console.log(response);
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
		//console.log(response);
    //console.log('Fetched url and url_t');
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
					//console.log('Canvas JSON file save response');
					//console.log(response);
					//console.log(data_url.url_s);
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
            //console.log('Canvas image save response');
            FnDismisFolderModal(); // remove saving loader
            //console.log(response);
            //console.log(data_url.url_t_s);
            var data_u_u = {'url' : data_url.url_s, 'url_t': data_url.url_t_s};
            update_design_url(f_design_id, data_u_u);
          });
				});
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
		//console.log(response);
    //console.log("Updated url and url_t");
		//alert('save updated');
    $('.toolbarPanel_4 .toolbarPanel_4-overlay').remove();
    //location.reload();
	});
	
}

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

function fllip(fxy = 'flipX') {
  var cx = canvas.getActiveObject();
  if(cx) {
    cx.toggle(fxy);
    canvas.renderAll();
  }
	updateCanvasState();
	savedDesignFlag = false;
}

function rotate(angle = 90) {
  var cx = canvas.getActiveObject();
  if(cx) {
    var an = cx.angle + angle;
    if(an < -360){
      an = -360;
    }
    else if(an > 360){
      an = 360;
    }
    cx.rotate(an);
    cx.setCoords();
    if(cx.type == 'ImageContainer'){
      if(cx.containerImage !== ''){
        var containerImg = canvas.getItemById(cx.containerImage);
        containerImg.rotate(an).setCoords();
      }
      else {
        var containerImg = canvas.getItemById("default"+cx.id);
        containerImg.rotate(an).setCoords();
      }
    }
    canvas.renderAll();
    $("#angle").val(an);
  }
	updateCanvasState();
	savedDesignFlag = false;
}

/**********Bleed and crop start *************/

$(document).on('click','#bleed',function () {
  var bleeds = 0;
  bleeds = jQuery('#page_bleed').val();
  if ((jQuery('#bleed').is(":checked"))) {
      var can_width = canvas.getWidth();
      var can_height = canvas.getHeight();
      jQuery('.canvas-container').addClass('bleed');
      var canvas_id = jQuery(this).attr('data-id');
      //chnaged "31.16" to "30.16"
      var crop_marks1 = new fabric.Line([17.62, 0, 17.62, 17.62], {left: 30, top: 0, stroke: '#000', selectable: false, evented : false });    //TOP
      //var crop_marks1 = new fabric.Line([17.62, 0, 17.62, 17.62], {left: 31.16, top: 0, stroke: '#000', selectable: false, });
      crop_marks1.name = 'crop_marks';
      canvas.add(crop_marks1);

      var crop_marks2 = new fabric.Line([0, 17.62, 17.62, 17.62], {left: 0, top: 30, stroke: '#000', selectable: false, evented : false });    //Left
      //var crop_marks2 = new fabric.Line([0, 17.62, 17.62, 17.62], {left: 0, top: 31.16, stroke: '#000', selectable: false, });
      crop_marks2.name = 'crop_marks';
      canvas.add(crop_marks2);

      var crop_marks3 = new fabric.Line([0, 0, 0, 17.62], {left: (can_width - 34), top: 0, stroke: '#000', selectable: false, evented : false });  //Top Right
      //var crop_marks3 = new fabric.Line([17.62, 0, 17.62, 17.62], {left: (can_width - 31.16), top: 0, stroke: '#000', selectable: false, });
      crop_marks3.name = 'crop_marks';
      canvas.add(crop_marks3);

      var crop_marks4 = new fabric.Line([0, 17.62, 17.62, 17.62], {left: (can_width - 17.62), top: 30, stroke: '#000', selectable: false, evented : false });    //Right
      //var crop_marks4 = new fabric.Line([0, 17.62, 17.62, 17.62], {left: (can_width - 17.62), top: 31.16, stroke: '#000', selectable: false, });
      crop_marks4.name = 'crop_marks';
      canvas.add(crop_marks4);

      var crop_marks5 = new fabric.Line([0, 17.62, 17.62, 17.62], {left: 0, top: (can_height - 34), stroke: '#000', selectable: false, evented : false });   //Bottom Left
      //var crop_marks5 = new fabric.Line([0, 17.62, 17.62, 17.62], {left: 0, top: (can_height - 31.16), stroke: '#000', selectable: false, });
      crop_marks5.name = 'crop_marks';
      canvas.add(crop_marks5);

      var crop_marks6 = new fabric.Line([17.62, 0, 17.62, 17.62], {left: 30, top: (can_height - 17.62), stroke: '#000', selectable: false, evented : false });   //Bottom
      //var crop_marks6 = new fabric.Line([17.62, 0, 17.62, 17.62], {left: 31.16, top: (can_height - 17.62), stroke: '#000', selectable: false, });
      crop_marks6.name = 'crop_marks';
      canvas.add(crop_marks6);

      var crop_marks7 = new fabric.Line([17.62, 0, 17.62, 17.62], {left: (can_width - 34), top: (can_height - 17.62), stroke: '#000', selectable: false, evented : false });   //Bottom Right
      //var crop_marks7 = new fabric.Line([17.62, 0, 17.62, 17.62], {left: (can_width - 31.16), top: (can_height - 17.62), stroke: '#000', selectable: false, });
      crop_marks7.name = 'crop_marks';
      canvas.add(crop_marks7);

      var crop_marks8 = new fabric.Line([0, 17.62, 17.62, 17.62], {left: (can_width - 17.62), top: (can_height - 34), stroke: '#000', selectable: false, evented : false });    //Bottom Right Right
      //var crop_marks8 = new fabric.Line([0, 17.62, 17.62, 17.62], {left: (can_width - 17.62), top: (can_height - 31.16), stroke: '#000', selectable: false, });
      crop_marks8.name = 'crop_marks';
      canvas.add(crop_marks8);
      
      canvas.renderAll();
  } else {
    canvas.getObjects().forEach(function(obj) {
      var lo_name = obj.name;
      if (lo_name == 'crop_marks') {
      canvas.remove(obj);
      }  
    });
  }
});
$(document).on('change','input:not(.edit-layer-title):not([type="range"])',function () {
  var cx = canvas.getActiveObject();
  if (cx) {
    var x = $('#'+this.id).attr("data-act");
    if (x) {
      var v = $('#'+this.id).attr("data-value");
      if (v != 'angle') {
        var num = parseInt($('#'+this.id).val());
        var cxCoords = cx.getBoundingRect(true, true);
        if(v == 'left'){
          num = num + leftmargin;
          if(cx.type == 'image' || cx.type == 'ImageContainer'){
            num = num + cxCoords.width/2;
            if(cx.type == 'ImageContainer'){
              if(cx.containerImage !== ''){
                var containerImg = canvas.getItemById(cx.containerImage);
                containerImg.set(v, num).setCoords();
              }
              else {
                var containerImg = canvas.getItemById("default"+cx.id);
                containerImg.set(v, num).setCoords();
              }
            }
          }
        }
        else if(v == 'top'){
          num = num + topmargin;
          if(cx.type == 'image' || cx.type == 'ImageContainer'){
            num = num + cxCoords.height/2;
            if(cx.type == 'ImageContainer'){
              if(cx.containerImage !== ''){
                var containerImg = canvas.getItemById(cx.containerImage);
                containerImg.set(v, num).setCoords();
              }
              else {
                var containerImg = canvas.getItemById("default"+cx.id);
                containerImg.set(v, num).setCoords();
              }
            }
          }
        }
        var linked = false;
        if(typeof cx.object_link !== 'undefined'){
          if(cx.object_link == 'linked'){
            if(cx.type === 'Lineshape' || cx.type === 'circle' || cx.type === 'Rectshape' || cx.type === 'textbox' || cx.type === 'image' || cx.type === 'ImageContainer'){ // || cx.type === 'activeSelection' || cx.type === 'group'
              linked = true;
            }
          }
        }
        if((v == 'width' || v == 'height')) {
          var cxWdth = cx.getScaledWidth();
          var cxHeight = cx.getScaledHeight();
          //console.log("V = "+v);
          if(linked){
            //var cxWdth = cx.width;
            //var cxHeight = cx.height;
            var diffPer = (v == 'width') ? parseFloat(num/cxWdth).toFixed(2) : parseFloat(num/cxHeight).toFixed(2);
            //$('#size-width').val(cxWdth);
            //$('#size-height').val(cxHeight);
            //var diffNum = (v == 'width') ? parseInt(cxWdth - num) : parseInt(cxHeight - num);
            if(cx.type === 'ImageContainer'){
              if(cx.containerImage !== ''){
                var conImage = canvas.getItemById(cx.containerImage);
                if(conImage.scaleX !== 1 || conImage.scaleY !== 1){
                  var conImageCoords = conImage.getBoundingRect();
                  //var conImageDiffNum = (v == 'width') ? parseInt(conImageCoords.width - num) : parseInt(conImageCoords.height - num);
                  conImage.set({
                    // 'scaleX': parseFloat((conImageCoords.width - conImageDiffNum)/conImage.width),
                    // 'scaleY': parseFloat((conImageCoords.height - conImageDiffNum)/conImage.height),
                    'scaleX': parseFloat(Math.round(conImageCoords.width * diffPer)/conImage.width).toFixed(2),
                    'scaleY': parseFloat(Math.round(conImageCoords.height * diffPer)/conImage.height).toFixed(2),
                  }).setCoords();
                }
                else {
                  conImage.set({
                    // 'width': conImage.width - diffNum,
                    // 'height': conImage.height - diffNum,
                    'width': Math.round(conImage.width * diffPer),
                    'height': Math.round(conImage.height * diffPer),
                    'scaleX': 1,
                    'scaleY': 1,
                  }).setCoords();
                }
              }
              cx.set({
                // 'width': parseInt(cxWdth - diffNum),
                // 'height': parseInt(cxHeight - diffNum),
                'width': Math.round(cxWdth * diffPer),
                'height': Math.round(cxHeight * diffPer),
                'scaleX': 1,
                'scaleY': 1,
              }).setCoords();
              // $('#size-height').val(parseInt(cxHeight - diffNum));
              // $('#size-width').val(parseInt(cxWdth - diffNum));
              $('#size-height').val(Math.round(cxHeight * diffPer));
              $('#size-width').val(Math.round(cxWdth * diffPer));
            }
            else if(cx.type === 'image'){
              var diffPer = (v == 'width') ? parseFloat(num/cxWdth).toFixed(2) : parseFloat(num/cxHeight).toFixed(2);
              if(v == 'width'){
                var imgHeight = cxHeight * diffPer;
                var imgWidth = parseInt($('#size-width').val());
              }
              else {
                var imgHeight = parseInt($('#size-height').val());;
                var imgWidth = cxWdth * diffPer;
              }
              var objectUrl = cx.src;
              var imageUrl = resizeImg(objectUrl, imgWidth, imgHeight, function(resizeDataURL){
                //console.log("imageUrl = Width Done");
                var img = new Image();
                img.src = resizeDataURL;
                img.onload = function(){
                  cx.setElement(img);
                  cx.set({
                    src: resizeDataURL,
                    scaleX: 1,
                    scaleY: 1,
                    width: imgWidth,
                    height: imgHeight,
                    OldscaleX: 1,
                    OldscaleY: 1,
                    OldWidth: cxWdth,
                    OldHeight: cxHeight,
                  });
                  cx.setCoords();
                  canvas.renderAll().setActiveObject(cx);
                }
              });
              $('#size-height').val(Math.round(imgHeight));
              $('#size-width').val(Math.round(imgWidth));
            }
            else if(cx.type === 'circle' || cx.type === 'image'){
              //var cxCoords = cx.getBoundingRect();
              //var cxDiffNum = (v == 'width') ? parseInt(cxCoords.width - num) : parseInt(cxCoords.height - num);
              var updatedX = parseFloat(Math.round(cxWdth * diffPer)/cx.width).toFixed(2);
              var updatedY = parseFloat(Math.round(cxHeight * diffPer)/cx.height).toFixed(2);
              cx.set({
                // 'scaleX': parseFloat((cxCoords.width - cxDiffNum)/cx.width),
                // 'scaleY': parseFloat((cxCoords.height - cxDiffNum)/cx.height),
                'scaleX': updatedX,
                'scaleY': updatedY,
              }).setCoords();
              $('#size-height').val(Math.round(cx.height * updatedY));
              $('#size-width').val(Math.round(cx.width * updatedX));
              //$('#size-height').val(Math.round(cxHeight * diffPer));
              //$('#size-width').val(Math.round(cxWdth * diffPer));
            }
            else {
              cx.set({
                // 'width': parseInt(cxWdth - diffNum),
                // 'height': parseInt(cxHeight - diffNum),
                'width': Math.round(cxWdth * diffPer),
                'height': Math.round(cxHeight * diffPer),
                'scaleX': 1,
                'scaleY': 1,
              }).setCoords();
              // $('#size-height').val(parseInt(cxHeight - diffNum));
              // $('#size-width').val(parseInt(cxWdth - diffNum));
              $('#size-height').val(Math.round(cxHeight * diffPer));
              $('#size-width').val(Math.round(cxWdth * diffPer));
            }
          }
          else {
            if(v == 'width') {
              if(cx.type === 'ImageContainer'){
                if(cx.containerImage !== ''){
                  var conImage = canvas.getItemById(cx.containerImage);
                  if(conImage.scaleX !== 1){
                    conImage.set({
                      'scaleX': parseFloat(num/conImage.width).toFixed(2),
                    }).setCoords();
                  }
                  else {
                    conImage.set({
                      'width': num,
                      'scaleX': 1,
                    }).setCoords();
                  }
                }
                cx.set(v, num).setCoords();
              }
              else if(cx.type === 'image'){
                var imgHeight = parseInt($('#size-height').val());
                var objectUrl = cx.src;
                var imageUrl = resizeImg(objectUrl, num, imgHeight, function(resizeDataURL){
                  //console.log("imageUrl = Width Done");
                  var img = new Image();
                  img.src = resizeDataURL;
                  img.onload = function(){
                    cx.setElement(img);
                    cx.set({
                      src: resizeDataURL,
                      scaleX: 1,
                      scaleY: 1,
                      width: num,
                      height: imgHeight,
                      OldscaleX: 1,
                      OldscaleY: 1,
                      OldWidth: cxWdth,
                      OldHeight: cxHeight,
                    });
                    cx.setCoords();
                    canvas.renderAll().setActiveObject(cx);
                  }
                });
              }
              else if(cx.type === 'circle' || cx.type === 'image'){
                cx.set({
                  'scaleX': parseFloat(num/cx.width).toFixed(2),
                }).setCoords();
              }
              else {
                cx.set(v, num).setCoords();
                cx.set('height', parseInt($('#size-height').val())).setCoords();
              }
            }
            else {
              if(cx.type === 'ImageContainer'){
                if(cx.containerImage !== ''){
                  var conImage = canvas.getItemById(cx.containerImage);
                  if(conImage.scaleY !== 1){
                    conImage.set({
                      'scaleY': parseFloat(num/conImage.height).toFixed(2),
                    }).setCoords();
                  }
                  else {
                    conImage.set({
                      'height': num,
                      'scaleY': 1,
                    }).setCoords();
                  }
                }
                cx.set(v, num).setCoords();
              }
              else if(cx.type === 'image'){
                var imgHeight = parseInt($('#size-height').val());
                var imgWidth = parseInt($('#size-width').val());
                var objectUrl = cx.src;
                //console.log("imageUrl = WIdth 1*"+cx.src);
                var imageUrl = resizeImg(objectUrl, imgWidth, imgHeight, function(resizeDataURL){
                  //console.log("imageUrl = Width 2*"+resizeDataURL);
                  var img = new Image();
                  img.src = resizeDataURL;
                  img.onload = function(){
                    cx.setElement(img);
                    cx.set({
                      src: resizeDataURL,
                      scaleX: 1,
                      scaleY: 1,
                      width: imgWidth,
                      height: imgHeight,
                      OldscaleX: 1,
                      OldscaleY: 1,
                      OldWidth: cxWdth,
                      OldHeight: cxHeight,
                    });
                    cx.setCoords();
                    canvas.renderAll().setActiveObject(cx);
                  }
                });
              }
              else if(cx.type === 'circle' || cx.type === 'image'){
                cx.set({
                  'scaleY': parseFloat(num/cx.height).toFixed(2),
                }).setCoords();
              }
              else {
                cx.set(v, num).setCoords();
              }
            }
          }
        }
        else {
          cx.set(v, num).setCoords();
        }
				savedDesignFlag = false;
      } else {
        var an = parseInt($('#'+this.id).val());
        if(an < -360){
          an = -360;
        }
        else if(an > 360){
          an = 360;
        }
        cx.rotate(an).setCoords();
        if(cx.type == 'ImageContainer'){
          if(cx.containerImage !== ''){
            var containerImg = canvas.getItemById(cx.containerImage);
            containerImg.rotate(an).setCoords();
          }
          else {
            var containerImg = canvas.getItemById("default"+cx.id);
            containerImg.rotate(an).setCoords();
          }
        }
        //cx.rotate(-1 * parseInt($('#'+this.id).val())).setCoords();
        /*cx.set({
          'originX': 'center',
          'originY': 'center',
          'angle': parseInt($('#'+this.id).val()),
        });
        cx.setCoords();*/
				savedDesignFlag = false;
      }
			if(!savedDesignFlag){
				DetectTemplateChanges();
			}
    }
  }
  canvas.renderAll();
});

$(document).on('click','button.talignments',function () {
  var cx = canvas.getActiveObject();
  if (cx) {
    var x = $(this).attr("data-value");
    if (x) {
       setobjectposition(cx, x);
    }
  }   
	savedDesignFlag = false;
	updateCanvasState();
	if(!savedDesignFlag){
		DetectTemplateChanges();
	}
});
/* Escalet >> We’ve decided the Rotate Page functionality is not necessary at this time.  Please hide the Rotate Page button for the time being. >> 17-02-2021
$(document).on('click','.kmds-rotatepage',function () {
  var degrees = 90;
  let canvasCenter = new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2) // center of canvas
  let radians = fabric.util.degreesToRadians(degrees)
  canvas.getObjects().forEach((obj) => {
    let objectOrigin = new fabric.Point(obj.left, obj.top)
    let new_loc = fabric.util.rotatePoint(objectOrigin, canvasCenter, radians)
    obj.top = new_loc.y
    obj.left = new_loc.x
    obj.angle += degrees //rotate each object buy the same angle
    obj.setCoords()
  });
  canvas.renderAll();
  //canvas.discardActiveObject().renderAll();
	savedDesignFlag = false;
	updateCanvasState();
	if(!savedDesignFlag){
		DetectTemplateChanges();
	}
});*/
$(document).on('click','.kmds-pagebackground',function () {
  var bgcolor = canvas.backgroundColor;
  if(bgcolor == '#000000'){
    canvas.backgroundColor = '#eaeaea';
  }
  else {
    canvas.backgroundColor = '#000000';
  }
  canvas.renderAll();
  //canvas.discardActiveObject().renderAll();
	savedDesignFlag = false;
	updateCanvasState();
	if(!savedDesignFlag){
		DetectTemplateChanges();
	}
});

// toolbar view button actions
$(document).on('click','.edit-options .tool-act',function () {
	var x = $(this).attr("data-title");
  switch(x) {
    case 'Delete':
      deleteSelectedObject();
    break;
    case 'Cut':
      FnNewFolderModal();
      $(".g-dialog-header").hide();
      FnDefaultModal("<p>Due security permissions we can not access your system clipboard.<br> Please use the following shortcut instead to Cut:</p><p style=\"text-align: center;font-size:16px;margin-top: 20px\">Ctrl+X</p>");
    break;
    case 'Copy':
      FnNewFolderModal();
      $(".g-dialog-header").hide();
      FnDefaultModal("<p>Due security permissions we can not access your system clipboard.<br> Please use the following shortcut instead to Copy:</p><p style=\"text-align: center;font-size:16px;margin-top: 20px\">Ctrl+C</p>");
    break;
    case 'Paste':
      FnNewFolderModal();
      $(".g-dialog-header").hide();
      FnDefaultModal("<p>Due security permissions we can not access your system clipboard.<br> Please use the following shortcut instead to paste:</p><p style=\"text-align: center;font-size:16px;margin-top: 20px\">Ctrl+V</p>");
    break;
    default:
      // code block
    break;
  }
});

/**
 * Returns the closest number from a sorted array.
 **/
function closest(arr, target, process) {
  if (!(arr) || arr.length == 0)
    return null;
  if (arr.length == 1)
    return arr[0];

  for (var i = 1; i < arr.length; i++) {
    // As soon as a number bigger than target is found, return the previous or current
    // number depending on which has smaller difference to the target.
    if (arr[i] > target) {
      var c = arr[i];
      var d = arr[i - 1];
			if(process == 'zoomin'){
				return Math.abs(c);
			} else if (process == 'zoomout'){
				return Math.abs(d);
			}
    }
  }
	//console.log('last val');
  // No number in array is bigger so return the last.
  return arr[arr.length - 1];
}

$(document).on('click','.toolbar-button .action-button.drawingtool',function () {
	var selected_shape = '';
	if($(this).hasClass('line_tool')){
		selected_shape = 'line_tool';
	} else if($(this).hasClass('rectangle_tool')){
		selected_shape = 'rectangle_tool';
	} else if($(this).hasClass('ellipse_tool')){
		selected_shape = 'ellipse_tool';
	} else if($(this).hasClass('polygon_tool')){
		selected_shape = 'polygon_tool';
	} else if($(this).hasClass('triangle_tool')){
		selected_shape = 'triangle_tool';
	} else if($(this).hasClass('star_tool')){
		selected_shape = 'star_tool';
	}
	if(selected_shape !== ''){
		$('#toolbar .toolbar-button.toolbar-Shape .action-button.drawingtool').addClass('g-active');
		switch(selected_shape) {
			case 'line_tool':
				addLine();
				break;
			
			case 'rectangle_tool':
				addRectshape();
				break;
				
			case 'ellipse_tool':
				addEllipseShape();
				break;
			
			case 'polygon_tool':
				
				break;
			
			case 'triangle_tool':
				addTriangle();
				break;
			
			case 'star_tool':
				
				break;
			
			default:
				// code block
			break;
		}
	}
});

$(document).on('click','.toolbar-button .tool-view, .g-menu-right.zoomview li.g-menu-item, .g-menu-bottom.fixed li',function () {
	var x = $(this).attr("data-view");
	var id = $(this).find('.g-menu-item-caption').attr("id");
  if(x == 'zoommenu'){return;}
	jQuery('#toolbar .toolbar-button .action-button.g-active').removeClass('g-active');
  var activepage = $('.page-row.g-active').attr('id');
  var page_format = jQuery("#kmds-format").val();
  if(page_format == 'pdf'){
    var activepageobj = canvas.getItemById(activepage+'MediaBox');
  }
  else {
    var activepageobj = canvas.getItemById(activepage);
  }
  var cx = canvas.getActiveObject();
  var objWidth = 0;
  var objHeight = 0;
	var pwidth = parseFloat($('#canvas-width').val()).toFixed(2);
	var pheight = parseFloat($('#canvas-height').val()).toFixed(2);

	if(x == 'fitpage'){
    
    objHeight = activepageobj.height * activepageobj.scaleY; 
    objWidth = activepageobj.width * activepageobj.scaleX;
    var bw = jQuery('#canvas-container').width();
    var bh = jQuery('#canvas-container').height();
    var bw = bw - (bw*15/100);
    var bh = bh - (bh*15/100);
    if (objHeight >= objWidth) {
      zoomFL = (bh/objHeight).toFixed(2);
    }
    else {
      zoomFL = (bw/objWidth).toFixed(2);
    }
    kmdsDesignZoomIn(zoomFL);
    //activepage = $('.page-row.g-active').attr('id');
	  //activepageobj = canvas.getItemById(activepage);
    var cs = activepageobj.getCoords();
    x = cs[0].x-10;
    y = cs[0].y-10;

    var ldelta = new fabric.Point(-x, -y);
    canvas.relativePan(ldelta);
    var ldelta = new fabric.Point(0, -y);
    leftRuler.relativePan(ldelta);
    var ldelta = new fabric.Point(-x, 0);
    topRuler.relativePan(ldelta);
    zoomLF = zoomFL * 100;
    jQuery('#zoomb .caption').html(Math.round(zoomLF)+'%');
    jQuery(this).removeClass('g-active');
   /* //set active page poosition
    var zoom = 2;
    //kmdsDesignZoomIn(1); //ds duplicate action
    var vpw = canvas.width / zoom;
    var vph = canvas.height / zoom;
    var xi = (activepageobj.left - vpw / 2);  // x is the location where the top left of the viewport should be
    var yi = (activepageobj.top - vph / 2);  // y idem
    var oldCoordinates = active_page_object.getBoundingRect();
    canvas.absolutePan({x:xi-62, y:yi-80});
    var newCoordinates = active_page_object.getBoundingRect();
    var topRulerYDif = (oldCoordinates.left - newCoordinates.left);
    var leftRulerYDif = (oldCoordinates.top - newCoordinates.top);
    var unitx = topRulerYDif;
    var delta = new fabric.Point(-unitx,0) ;
    topRuler.relativePan(delta);
    var unity = leftRulerYDif;
    var delta = new fabric.Point(0,-unity) ;
    leftRuler.relativePan(delta);
    objHeight = activepageobj.height * activepageobj.scaleY; 
    objWidth = activepageobj.width * activepageobj.scaleX;
    var bw = jQuery('#canvas-container').width();
    var bh = jQuery('#canvas-container').height();
    var bw = bw - (bw*15/100);
    var bh = bh - (bh*15/100);
    if (objHeight >= objWidth) {
      zoomFL = (bh/objHeight).toFixed(2);
    }
    else {
      zoomFL = (bw/objWidth).toFixed(2);
    }
		//canvas.zoomToPoint(new fabric.Point(activepageobj.left, activepageobj.top), zoomFL);
    //kmdsDesignZoomIn(zoomFL);
    addrulernew(ixx, iyy);
    zoomLF = zoomFL * 100;
    jQuery('#zoomb .caption').html(Math.round(zoomLF)+'%');
    jQuery(this).removeClass('g-active');*/
	}
  if(x == 'handPan'){
    //Click on pan icon to move canvas objects
    handSelected = (handSelected) ? false : true;

    var movec = false;
    if (handSelected) {
			$('#handtool').addClass('g-active');
      canvas.on('mouse:down', canvasmoved);
      canvas.on('mouse:move', canvasmovem);
      canvas.on('mouse:up', canvasmovemu);
    } else {
			$('.toolbar-button.toolbar-Select .action-button').addClass('g-active'); //activate select pointer				
			deactivateHandtool();
    }
  }
	switch(x) {
		case 'zoomIn':
			var zoomin = $('#zoomb .caption').text();
			zoomin = zoomin.split('%')[0];
			var i = z.indexOf(parseInt(zoomin));
			if(i === -1){
				zoomin = closest(z, zoomin, 'zoomin');
			} else {
				zoomin = z[i+1];
			}
			if(typeof zoomin == 'undefined') { return; }
			$('#zoomb .caption').html(zoomin+'%');
			zoomin = zoomin/100;
			kmdsDesignZoomIn(zoomin);
			//addrulernew(ixx, iyy);
     // console.log('8--');
			break;
		case 'zoomOut':
			var currentZoom = canvas.getZoom();
			var zoomout = $('#zoomb .caption').text();
			zoomout = zoomout.split('%')[0];
			var i = z.indexOf(parseInt(zoomout));
			if(i === -1){
				zoomout = closest(z, zoomout, 'zoomout');
			} else {
				zoomout = z[i-1];
			}
			if(typeof zoomout == 'undefined') { return; }
			$('#zoomb .caption').html(zoomout+'%');
			zoomout = zoomout/100;
			kmdsDesignZoomOut(zoomout);
			//addrulernew(ixx, iyy);
      //console.log('9');
		case 'snap':
			//canvas.bringForward(activeObject);
			break;
		case 'zoomInList':
			var zoomVal = $('#zoomb .caption').text();
			zoomVal = zoomVal.split('%')[0];
			zoomL = $(this).attr("data-value");
			jQuery('#zoomb .caption').html(zoomL+'%');
      zoomL = zoomL/100;
			if(zoomL > zoomVal){
				kmdsDesignZoomIn(zoomL);
			} else {
				kmdsDesignZoomOut(zoomL);
			}
			kmdsDesignZoomIn(zoomL);
			//addrulernew(ixx, iyy);
      //console.log('10');
		break;
		default:
			// code block
		break;
	}
	
	if(id){
		$('#toolbar .toolbar-button.toolbar-Shape .action-button.drawingtool').addClass('g-active');
		$('#toolbar .toolbar-button.toolbar-Shape .action-button.drawingtool').removeClass('line_tool rectangle_tool ellipse_tool polygon_tool triangle_tool star_tool');
		$('#toolbar .toolbar-button.toolbar-Shape .action-button.drawingtool').addClass(id);
		switch(id) {
			case 'line_tool':
				$('#toolbar .toolbar-button.toolbar-Shape .action-button.drawingtool.g-active i').attr('class', 'km-line fs-15');
				addLine();
				break;
			
			case 'rectangle_tool':
				$('#toolbar .toolbar-button.toolbar-Shape .action-button.drawingtool.g-active i').attr('class', 'far fa-square');
				addRectshape();
				break;
				
			case 'ellipse_tool':
				$('#toolbar .toolbar-button.toolbar-Shape .action-button.drawingtool.g-active i').attr('class', 'far fa-circle fs-18');
				addEllipseShape();
				break;
			
			case 'polygon_tool':
				$('#toolbar .toolbar-button.toolbar-Shape .action-button.drawingtool.g-active i').attr('class', 'fal fa-hexagon');
				
				break;
			
			case 'triangle_tool':
				$('#toolbar .toolbar-button.toolbar-Shape .action-button.drawingtool.g-active i').attr('class', 'fa km-triangle fs-20');
				addTriangle();
				break;
			
			case 'star_tool':
				$('#toolbar .toolbar-button.toolbar-Shape .action-button.drawingtool.g-active i').attr('class', 'km-star fs-22');
				
				break;
			
			default:
				// code block
			break;
		}
	}
});

/**
 * Layer object indexing for 
 * sendBackwards / sendToBack / bringToFront / bringForward
 */
function layerObjectReordering(indexCase){
	var activeObj = canvas.getActiveObject();
	if (activeObj) {
		var firstIndex = $('.layer-row:first-child').index();
		var length = $('.layer-row').length;
		var lastIndex = $('.layer-row').length - 1;
		if(activeObj.type == 'activeSelection' || activeObj.type == 'group'){
			var aObjId = $('.layer-row.parent-layer.g-active').attr('id');
		} else {
			var aObjId = activeObj.id;
		}
		var activeIndex = $('#layers #'+aObjId).index();
		
		switch(indexCase) {
			case 'sendBackwards':
				if(activeIndex !== lastIndex){								
					var nextLayerId = $('.layer-row.g-active').next('.layer-row').attr('id');
					if(!$('#'+nextLayerId).hasClass('parent-layer') && !$('#'+nextLayerId).hasClass('child-layer')) {
						$('#'+aObjId).insertAfter($('#'+nextLayerId));
						layerReordering();
						//$('#'+nextLayerId).insertBefore($('#'+aObjId));
						
						if(activeObj.type == 'activeSelection'){
							activeObj.forEachObject(function(obj) {
								$('#'+obj.id).insertAfter($("#"+aObjId));
							});
							layerReordering();		
						}
					}
					if($('#'+nextLayerId).hasClass('child-layer')){
						var cset = false;
						while(cset !== true) {
							nextLayerId = $('#'+nextLayerId).next('.layer-row').attr('id');
							if($('#'+nextLayerId).hasClass('child-layer') == false){								
								cset = true;
							}
						}
						if(cset){						
							if($('#'+nextLayerId).hasClass('parent-layer')){
								$('#'+aObjId).insertAfter($('#'+nextLayerId));
								if(activeObj.type == 'activeSelection'){
									activeObj.forEachObject(function(obj) {
										jQuery('#'+obj.id).insertAfter($("#"+aObjId));
										//canvas.bringForward(obj);
									});
									layerReordering();
								}
							
								$('.layer-row.child-layer').each(function(){
									if($(this).attr('data-group') == nextLayerId){
										var cid = $(this).attr('id');
										$('#'+cid).insertAfter($('#'+nextLayerId));
										var cobj = canvas.getItemById(cid);
										//canvas.bringForward(cobj);
										layerReordering();
									} 
								});
							} else {
								$('#'+aObjId).insertAfter($('#'+nextLayerId));
								layerReordering();
								if(activeObj.type == 'activeSelection'){
									activeObj.forEachObject(function(obj) {
										$('#'+obj.id).insertAfter($("#"+aObjId));
										canvas.bringForward(obj);
									});
									layerReordering();									
								}
							}
						}
						layerReordering();		
						//layerReordering();//disabled today
						if(typeof nextLayerId == 'undefined'){return;}
					}
					if($('#'+nextLayerId).hasClass('parent-layer')){
						$('#'+aObjId).insertAfter($('#'+nextLayerId));
						//canvas.sendBackwards(activeObj);
						layerReordering();
						$('.layer-row.child-layer').each(function(){
							if($(this).attr('data-group') == nextLayerId){
								var cid = $(this).attr('id');
								var cobj = canvas.getItemById(cid);
								$('#'+cid).insertAfter($('#'+nextLayerId));
								canvas.bringForward(cobj);
							}
						})									
						layerReordering();
					}
				}
				break;
				
			case 'sendToBack':
				var lastLayerId = $('.layer-row:nth-child('+length+')').attr('id');
				$('#'+aObjId).insertAfter($('#'+lastLayerId));
				$('#'+lastLayerId).insertBefore($('#'+aObjId));	
				//canvas.sendToBack(activeObj);
				layerReordering();

				if(activeObj.type == 'activeSelection'){
					activeObj.forEachObject(function(obj) {
						$('#'+obj.id).insertAfter($("#"+aObjId));
						canvas.bringForward(obj);
					});
					//layerReordering();								
				}				
				break;
				
			case 'bringForward':
				if(activeIndex == firstIndex){return;}
				var previousLayerId = $('.layer-row.g-active').prev('.layer-row').attr('id');
				if(!$('#'+previousLayerId).hasClass('parent-layer') && !$('#'+previousLayerId).hasClass('child-layer')) {
					$('#'+previousLayerId).insertAfter($('#'+aObjId));
					layerReordering();
					//if(activeObj.getZIndex == length){return;}
					//canvas.bringForward(activeObj);
					//$('#'+aObjId).insertBefore($('#'+previousLayerId));
					if(activeObj.type == 'activeSelection'){
						activeObj.forEachObject(function(obj) {
							$('#'+obj.id).insertAfter($("#"+aObjId));
							canvas.bringForward(obj);
						});
						layerReordering();									
					}
				}
				if($('#'+previousLayerId).hasClass('child-layer')){
					var cset = false;
					while(cset !== true) {
						previousLayerId = $('#'+previousLayerId).prev('.layer-row').attr('id');
						if($('#'+previousLayerId).hasClass('child-layer') == false){
							cset = true;
						}
					}
					if(cset){
						if($('#'+previousLayerId).hasClass('parent-layer')){
							$('#'+previousLayerId).insertAfter($('#'+aObjId));
							//$('#'+aObjId).insertBefore($('#'+previousLayerId));
							layerReordering();
							
							$('.layer-row.child-layer').each(function(){
								if($(this).attr('data-group') == previousLayerId){
									var cid = $(this).attr('id');
									$('#'+cid).insertAfter($('#'+previousLayerId));
									var cobj = canvas.getItemById(cid);
									//canvas.bringForward(cobj);
									layerReordering();
								} 

								if(activeObj.type == 'activeSelection'){
									activeObj.forEachObject(function(obj) {
										$('#'+obj.id).insertAfter($("#"+aObjId));
										canvas.bringForward(obj);
									});
									//layerReordering();									
								}
							});
						} else {
							$('#'+previousLayerId).insertAfter($('#'+aObjId));
							layerReordering();

							if(activeObj.type == 'activeSelection'){
								activeObj.forEachObject(function(obj) {
									$('#'+obj.id).insertAfter($("#"+aObjId));
									canvas.bringForward(obj);
								});
								layerReordering();									
							}
						}
					}
					if(typeof previousLayerId == 'undefined'){return;}
				}

				break;
				
			case 'bringToFront':
				var firstLayerId = $('.layer-row:first-child').attr('id');
				$('#'+aObjId).insertBefore($('#'+firstLayerId));
				$('#'+firstLayerId).insertAfter($('#'+aObjId));
				layerReordering();

				if(activeObj.type == 'activeSelection'){
					activeObj.forEachObject(function(obj) {
						$('#'+obj.id).insertAfter($("#"+aObjId));
						canvas.bringForward(obj);
					});
					layerReordering();								
				}		
				break;
				
			default:
				// code block
			break;
		} 
		//updateCanvasState();
	} 
	canvas.setActiveObject(activeObj).renderAll();
}

$(document).on('click','button.g-corner',function () {
	$('button.g-corner.g-active').removeClass('g-active');
	$(this).addClass('g-active');
  var cx = canvas.getActiveObject();
  if (cx) {
    var x = $(this).attr("data-corner-type"); //corner style
    var v = $(this).attr("value"); //radius value
    if (x) {
			$('input[type="range"]').val(v).change();
      setobjectcorner(cx, x);
    }
  }    
});

$(document).on('click','button.apri, .g-menu-right .caption.apri',function () {
  var cx = canvas.getActiveObject();
  if (cx && this.id) {
    var x = $('#'+this.id).attr("data-pro");
    if (x != 'bring' && x != 'export') {
      var v = $('#'+this.id).attr("data-value");
      if (v != 'linethrough' && v != 'underline') {
        if ( x == 'textAlign') {
          setActiveProp(x, getActiveProp(x) === v ? '' : v);
          //setobjectposition(cx, v)
        } else {
          setActiveStyle(x,getActiveStyle(x) === v ? '' : v);
        }
				savedDesignFlag = false;
				updateCanvasState();
      } else if(v == 'linethrough' || v == 'underline') {
        var value = isOverline(v)
            ? getActiveStyle('textDecoration').replace(v, '')
            : (getActiveStyle('textDecoration') + ' '+v);

          setActiveStyle('textDecoration', value);
          setActiveStyle(v, !getActiveStyle(v));
					savedDesignFlag = false;
					updateCanvasState();
      }
    } else if (x == 'bring') {
      var activeObj = canvas.getActiveObject();
      if (activeObj) {
        var v = $('#'+this.id).attr("data-value");
				if(activeObj.type == 'activeSelection' || activeObj.type == 'group'){
					var aObj = $('.layer-row.parent-layer.g-active').attr('id');
				} else {
					var aObj = activeObj.id;
				}
        switch(v) {
          case 'sendBackwards':
						if($('#layers #'+aObj+'.g-active').hasClass('child-layer')){
							return;
						}
						layerObjectReordering('sendBackwards');
            break;
						
          case 'sendToBack':
						if($('#layers #'+aObj+'.g-active').hasClass('child-layer')){
							return;
						}
						layerObjectReordering('sendToBack');
            break;
						
          case 'bringForward':
						if($('#layers #'+aObj+'.g-active').hasClass('child-layer')){
							return;
						}
						layerObjectReordering('bringForward');
            break;
						
          case 'bringToFront':
						if($('#layers #'+aObj+'.g-active').hasClass('child-layer')){
							return;
						}
						layerObjectReordering('bringToFront');		
            break;
						
          default:
            // code block
          break;
        } 
      } 
    }  else if (x == 'export') {
			var v = $('#'+this.id).attr("data-value");
			switch(v) {
				case 'advancedExport':
					//console.log('advancedExport');
					break;
					
				case 'ExportPng':
					//console.log('ExportPng');
					break;
					
				case 'ExportJpeg':
					//console.log('ExportJpeg');
					break;
						
				case 'ExportSvg':
					//console.log('ExportSvg');
					break;
					
				case 'ExportPdf':
					//console.log('ExportPdf');
					break;
					
				default:
            // code block
          break;	
			}
		}
    canvas.renderAll();
  } 
	if(!savedDesignFlag){
		DetectTemplateChanges();
	}
});
/**
 * Double click action on layer div
 * to change layer title
 **/
$(document).on('dblclick','.template-group .layer-row',function () {
	if($(this).children('.layer-lock-icon').hasClass('fa-lock')){return;}
  $('.layer-row').removeClass('editable');
  $(this).addClass('editable');
	editingLayer = $(this).attr('id');
  var $layerTitle = $(this).find('span.layer-title');
  var layerTitle = $layerTitle.text();
  $layerTitle.html('<input type="text" value="'+layerTitle+'" class="edit-layer-title">');
});
/**
 * Set new title in layer
 * and in object attribute
 **/
$(document).mouseup(function(e) {
  if($(".edit-layer-title").length){
    var container = $(".edit-layer-title");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      var layerTitle = container.val();
      container.parent().text(layerTitle);
			var obj = '';
			if(editingLayer){
				if(!$('#layers #'+editingLayer).hasClass('parent-layer')){
					var obj = canvas.getItemById(editingLayer);
					obj.set({
						name: layerTitle,
					});
					canvas.renderAll();
					canvas.setActiveObject(obj);
				} else {
					$('.layer-row.child-layer').each(function(){
							if($(this).attr('data-group') == editingLayer){
								var obj = canvas.getItemById($(this).attr('id'));
								obj.set({
									layerGroupTitle: layerTitle,
								});
								canvas.renderAll();
								//canvas.setActiveObject(obj);
							}
					});
				}
			}
			savedDesignFlag = false;
      container.remove();
      $('.layer-row').removeClass('editable');
			if(!savedDesignFlag){
				DetectTemplateChanges();
			}
    }
  }
});

function copy(){
	/* if(canvas.getActiveGroup()){
		for(var i in canvas.getActiveGroup().objects){
			layer_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			var object = fabric.util.object.clone(canvas.getActiveGroup().objects[i]);
			object.set("top", object.top+15);
			object.set("left", object.left+15);
			object.set("id", layer_id);
			object.set("name", object.name);
			copiedObjects[i] = object;
		}                    
	} 
	else  */
	ableToClone = true;
	if(canvas.getActiveObject()){
		layer_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		copiedObject = fabric.util.object.clone(canvas.getActiveObject());
		copiedObject.set("top", copiedObject.top+15);
		copiedObject.set("left", copiedObject.left+15);
		copiedObject.set("id", layer_id);
		copiedObject.set("name", copiedObject.name);
		if(copiedObject.type == 'image'){
			copiedObject.set("showImageBorder", true);
		}else {
			copiedObject.set("showTextBoxBorder", true);
		}
		copiedObject.set({
			//active object corners style
			hasControls: true,
			hasBorder: true,
			minScaleLimit: 0,
			StrokeWidth: 2,
			cornerStrokeColor: '#fff',
			borderColor: '#2880E6',
			cornerColor: '#2880E6',
			cornerStyle: 'circle',
			cornerSize: 10,
			cornerRadius: 50,
			rotatingPointOffset: 35,
			padding: 1,
			transparentCorners: false
		});
	}
}

function paste(){
	//console.log(copiedObject);
	if(copiedObject){
		canvas.add(copiedObject);
		canvas.discardActiveObject();
		canvas.setActiveObject(copiedObject);
		canvas.renderAll();    
		activeLayerObject(copiedObject.id, 'active');
		add_layer(copiedObject.id, copiedObject.name, copiedObject.type, copiedObject.page, copiedObject.layerGroup, '');
		layerReordering();
		updateProperties(copiedObject); 
	} 
	ableToClone = false;	
}

$(document).on('click','#tool-ungroup, .g-menu-item #ungroup_selection_caption',function () {
	var activeObj = canvas.getActiveObject();
	if(!activeObj){return;}
	if(activeObj.type !== 'activeSelection'){return;}
	savedDesignFlag = false;
	if($('.layer-row.g-active').hasClass('parent-layer')){
		var id = $('.layer-row.parent-layer.g-active').attr('id');
		var objsId = [];
    $('.layer-row.child-layer').each(function(){
      var dgroup = $(this).attr('data-group');
      if(dgroup == id){
        objsId.push($(this).attr('id'));
      }  
    });
    
    //get all the child objects into an array
    var objs = canvas._objects.filter(function(obj){
      if ($.inArray(obj.id, objsId) != -1){
        return obj;
      }
    });
		//canvas.discardActiveObject();
		$('#layers #'+id).remove();
		
		objs.forEach(function(o){
			o.set('objectGroup', false);
			o.set('layerGroup', '');
			o.set('layerGroupTitle', '');
			o.set('parentlayerOrder', '');
			$('#layers #'+o.id).attr('data-group', '');
			$('#layers #'+o.id).removeClass('d-none child-layer pl-2rem');
			$('#layers #'+o.id).addClass('d-flex');
			$('.layer-row.g-active').removeClass('g-active');
			$('#layers #'+o.id).addClass('g-active');
			canvas.setActiveObject(o);
			o.set({
				active: true,
				hasControls: true
			});
		});
		canvas.renderAll();
	}

	toolGroup = false;
	$('#tool-ungroup').attr('disabled', 'disabled');
	$('#ungroup_selection_caption').parent('.g-menu-item').addClass('g-disabled');
	layerReordering();
	if(!savedDesignFlag){
		DetectTemplateChanges();
	}
});

$(document).on('click','#tool-group, .g-menu-item #group_selection_caption',function () {
	var activeObj = canvas.getActiveObject();
	if(!activeObj){return;}
	if($('.layer-row.g-active').hasClass('parent-layer')){return;}
	toolGroup = true;
	savedDesignFlag = false;
	var groupId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	var title = 'Group';
	var page_id = $('.page-row.g-active').attr('id');
	parentLayerStructure(groupId, title, page_id, '');
	if(!($('#'+groupId).length)){
		toolGroup = false;
		return;
	} else {
		$('#'+groupId).addClass('layerFolderHighlighted');
		if($('#'+groupId).children('.fa-caret-right').length == 0){
			$('#'+groupId).prepend('<span class="tool-group-ico fa fa-caret-right pr-2" onclick="FnToggleLayers(this)"></span>');
		}

		if($('.layer-row.parent-layer').hasClass('g-active')){
			var activeLayer = $('.layer-row.parent-layer.g-active').attr('id');
			var activeLayerTitle = $('.layer-row.parent-layer.g-active .layer-title').text();
			var parentIndex = $('.layer-row.parent-layer.g-active').attr('order');
		} else if($('.layer-row.parent-layer').hasClass('g-has-selection')){
			var activeLayer = $('.layer-row.parent-layer.g-has-selection').attr('id');
			var activeLayerTitle = $('.layer-row.parent-layer.g-has-selection .layer-title').text();
			var parentIndex = $('.layer-row.parent-layer.g-active').attr('order');
		} else {
			var activeLayer = '';
			var activeLayerTitle = '';
			var parentIndex = '';
		}
		//updating all active row attribute
		$('.layer-row.g-active:not(.parent-layer)').each(function(){
			$(this).addClass('d-none child-layer pl-2rem');
			$(this).attr('data-group', groupId);
			$(this).removeClass('g-active d-flex');
			var ob = canvas.getItemById($(this).attr('id'));
			ob.set({
				objectGroup: true,
				layerGroup: activeLayer,
				layerGroupTitle: activeLayerTitle,
				parentlayerOrder: parentIndex,
			});
		});
		
		groupLayerObjects(groupId, false, true);
	}
	if(CtrlPressed){
		CtrlPressed = false;
	}
	if(ShifPressed){
		ShifPressed = false;
	}
	$('#tool-group').attr('disabled', 'disabled');
	$('#group_selection_caption').parent('.g-menu-item').addClass('g-disabled');
	$('#tool-ungroup').removeAttr('disabled');
	$('#ungroup_selection_caption').parent('.g-menu-item').removeClass('g-disabled');
	if(!savedDesignFlag){
		DetectTemplateChanges();
	}
});

$(document).on('click','#merge-transform',function () {
  var obj = canvas.getActiveObject();
	if (obj) {
		savedDesignFlag = false;
		var movex = $('#move-x').val();
		var movey = $('#move-y').val();
		var scalex = $('#scale-x').val() / 100;
		var scaley = $('#scale-y').val() / 100;
		var rotateUp = $('#rotateUp').val();
		var reflect = $('#reflect').val();
		var skewx = $('#skew-x').val();
		var skewy = $('#skew-y').val();
		var copies = $('#ncopies').val();// alert(copies);
		if(copies == 0){		
			obj.set('angle', obj.angle + parseInt(rotateUp)).setCoords();
			obj.set('scaleX', obj.scaleX + parseInt(scalex)).setCoords();
			obj.set('scaleY', obj.scaleY + parseInt(scaley)).setCoords();
			obj.set('top', obj.top + parseInt(movey)).setCoords();
			obj.set('left', obj.left + parseInt(movex)).setCoords();
			obj.set('skewX', obj.skewX + parseInt(skewx)).setCoords();
			obj.set('skewY', obj.skewY + parseInt(skewy)).setCoords();
			canvas.renderAll();	
			activeLayerObject(obj.id, 'active');
			updateProperties(obj);
		} else {
			//create clone of object
			for(var i = 0; i < copies; i++){ 
				copy();
				copiedObject.set({				
					top: copiedObject.top + parseInt(movey), 
					left: copiedObject.left + parseInt(movex), 			
					angle: copiedObject.angle + parseInt(rotateUp), 
					scaleX: copiedObject.scaleX + parseInt(scalex), 
					scaleY: copiedObject.scaleY + parseInt(scalex), 
					skewX: copiedObject.skewX + parseInt(skewx), 
					skewY: copiedObject.skewY + parseInt(skewy)
				});
				copiedObject.setCoords();
				paste(); 
			}
		}
		if(!savedDesignFlag){
			DetectTemplateChanges();
		}
	}
});

$(document).on('change','input.apri',function () {
  var cx = canvas.getActiveObject();
  var x = $('#'+this.id).attr("data-pro");
  var bv = $('#'+this.id).val();

  if (cx && this.id) {
    if (x && x == 'spacing') {
      var v = $('#'+this.id).attr("data-value");
      if (v == 'lineHeight') {
        setActiveStyle(v, $('#'+this.id).val()/100);
      } else {
        setActiveStyle(v, $('#'+this.id).val());
      }
      //console.log('t3');
    } else if(x == 'textst' ) {
      var v = $('#'+this.id).attr("data-value");
      setActiveStyle(v, $('#'+this.id).val());
    } else if(x == 'textpro' ) {
      var v = $('#'+this.id).attr("data-value");
      setActiveProp(v, $('#'+this.id).val());
    } else if(x == 'kmdstextcolor' ) {
      var v = $('#'+this.id).attr("data-value");
      $(".kmds-color-picker").css("background-color", $('#'+this.id).val());
      setActiveProp(v, $('#'+this.id).val());
    } else if(x == 'kmdsshapefill' ) {
      var v = $('#'+this.id).attr("data-value");
      $(".kmds-shape-picker").css("background-color", $('#'+this.id).val());
      setActiveProp(v, $('#'+this.id).val());
    } else if(x == 'kmdsshapeborder' ) {
      var v = $('#'+this.id).attr("data-value");
      $(".kmds-border-picker").css("background-color", $('#'+this.id).val());
      setActiveProp(v, $('#'+this.id).val());
    }
  } else if (x == 'canvas' ) {
    var v = $('#'+this.id).attr("data-value");
    if (v == 'setBackgroundColor') {
      var selectpage = $('.page-row.g-active').attr('id');
      canvas.getObjects().forEach(function(ob) {
          if(ob.id === selectpage) {
             // console.log(o.id);
             ob.set('fill', '');
             ob.set('backgroundColor', bv);
          }
      })
			updateCanvasState(); //undo/redo stack update
			savedDesignFlag = false;
    } else if(v == 'setopacity') {
      canvas.setBackgroundColor($('#'+this.id).val());       
			savedDesignFlag = false;
			updateCanvasState(); //undo/redo stack update
    }
    canvas.renderAll();
  }
	if(!savedDesignFlag){
		DetectTemplateChanges();
	}
});
/**
 * Callback function applyCanvasObjectColor()
 * to apply the color from new colorPicker
 **/
function applyCanvasObjectColor(data_pro, selected_color, type = null){
  var cx = canvas.getActiveObject();
  var x = data_pro;
  var bv = selected_color;
  var this_id = $('input.jsscolor.active').attr('id');
  if (cx && this_id) {
    if(x == 'textst' ) {
      var v = $('#'+this_id).attr("data-value");
      setActiveStyle(v, bv);
    } else if(x == 'textpro' ) {
      var v = $('#'+this_id).attr("data-value");
      setActiveProp(v, bv);
    } else if(x == 'kmdstextcolor' ) {
      var v = $('#'+this_id).attr("data-value");
      $(".kmds-color-picker").css("background-color", bv);
      setActiveProp(v, bv);
    } else if(x == 'kmdsshapefill' ) {
      var v = $('#'+this_id).attr("data-value");
      $(".kmds-shape-picker").css("background-color", bv);
      setActiveProp(v, bv);
    } else if(x == 'kmdsshapeborder' ) {
      var v = $('#'+this_id).attr("data-value");
      $(".kmds-border-picker").css("background-color", bv);
      setActiveProp(v, bv);
    }
  }
  else if (x == 'canvas' ) {
    var v = $('input.jsscolor.active').attr("data-value");
    if (v == 'setBackgroundColor') {
      var selectpage = $('.page-row.g-active').attr('id');
      canvas.getObjects().forEach(function(ob) {
        if(ob.id === selectpage) {
          // console.log(o.id);
          ob.set('fill', '');
          ob.set('backgroundColor', bv);
        }
      });
			updateCanvasState(); //undo/redo stack update
			savedDesignFlag = false;
    }
    else if(v == 'setopacity') {
      canvas.setBackgroundColor(bv);       
			savedDesignFlag = false;
			updateCanvasState(); //undo/redo stack update
    }
    canvas.renderAll();
  }
	if(!savedDesignFlag){
		DetectTemplateChanges();
	}
}
$(document).on('change','select', function () {
  var cx = canvas.getActiveObject();
  if (cx && this.id) {
    if (this.id != 'fstyle') {
      var x = $('#'+this.id).attr("data-pro");
      if (x) {
        var v = $('#'+this.id).children("option:selected").val();
        if (v) {
          setActiveStyle(x,getActiveStyle(x) === v ? '' : v);
        }
        if(x == 'fontFamily'){
          setActiveStyle('fontFamily', v);
          addFontStyle(v, 'Regular');
        }
      }
    } else if (this.id == 'fstyle') {
        var v = $('#'+this.id).children("option:selected").val();
        setActiveStyle('fontStyle', '');
        if (v) {
          if(v == 'Regular'){
            var font = jQuery('#font-family').children("option:selected").val();
            setActiveStyle('fontFamily', font);
          }
          else{
            var font = jQuery('#font-family').children("option:selected").val();
            font = font+' '+v;
            setActiveStyle('fontFamily', font);
          }
          /*var res = v.split("#");
					if(res[0] >= 600){
						$('#text-cmd-bold').addClass('g-active');
					} else {
						$('#text-cmd-bold').removeClass('g-active');
					}
          setActiveStyle('fontWeight', res[0]);
          if(res[1] == "I") {
						$('#text-cmd-italic').addClass('g-active');
            setActiveStyle('fontStyle', 'italic');
          } else {
						$('#text-cmd-italic').removeClass('g-active');
            setActiveStyle('fontStyle', '');					
          }*/
        }
      
    }
  }  
	if(!savedDesignFlag){
		DetectTemplateChanges();
	}  
});

function isOverline (xv){
    return getActiveStyle('textDecoration').indexOf(xv) > -1 || getActiveStyle(xv);
}
function getActiveStyle(styleName, object) {
  object = object || canvas.getActiveObject();
  if (!object) return '';

  return (object.getSelectionStyles && object.isEditing)
    ? (object.getSelectionStyles()[styleName] || '')
    : (object[styleName] || '');
};

function setActiveStyle(styleName, value, object) {
  object = object || canvas.getActiveObject();
  if (!object) return;

  if (object.setSelectionStyles && object.isEditing) {
    var style = { };
    style[styleName] = value;
    object.setSelectionStyles(style);
    object.setCoords();
  }
  else {
    object.set(styleName, value);
  }

  object.setCoords();
  canvas.requestRenderAll();
	updateCanvasState(); //undo/redo stack update
	savedDesignFlag = false;
};

function getActiveProp(name) {
  var object = canvas.getActiveObject();
  if (!object) return '';

  return object[name] || '';
}

function setActiveProp(name, value) {
  var object = canvas.getActiveObject();
  if (!object) return;
  object.set(name, value).setCoords();
  canvas.renderAll();
	updateCanvasState(); //undo/redo stack update
	savedDesignFlag = false;
}

function setobjectposition(obj, seto) {
  if(obj) {
    var activepage = jQuery('.page-row.g-active').attr('id');
    var activePageObj = canvas.getItemById(activepage);
    var pageCoordinates = activePageObj.getBoundingRect(true, true);
    var objCoordinates = obj.getBoundingRect(true, true);
    switch(seto) {
      case 'hl':
        //obj.set('left', 0).setCoords();
        if(obj.type == 'activeSelection'){
          /*var objs1 = obj._objects.filter(function(o){
            if(o.objectGroup == true){
              return o;
            }
          });
          if(objs1.length == 0){*/
          if(!jQuery(".parent-layer.layer-row").hasClass("g-active")){
            setGroupObjectAlign("hl");
          }
          else {
            obj.set({
              left: pageCoordinates.left,
              originX: 'left',
            }).setCoords();
          }
        }
        else {
          obj.set({
            left: pageCoordinates.left,
            originX: 'left',
          }).setCoords();
        }
      break;
      case 'hc':
        //obj.set('left', (canvas.getWidth()/2)-(obj.width/2)).setCoords();
        if(obj.type == 'activeSelection'){
          /*obj._objects = obj._objects.sort(function(a, b) {
            return a.left - b.left;
          });
          var objs1 = obj._objects.filter(function(o){
            if(o.objectGroup == true){
              return o;
            }
          });
          if(objs1.length == 0){*/
          if(!jQuery(".parent-layer.layer-row").hasClass("g-active")){
            setGroupObjectAlign('hc');
          }
          else {
            obj.set({
              left: pageCoordinates.left + (pageCoordinates.width/2),
              originX: 'center',
            }).setCoords();
          }
        }
        else {
          obj.set({
            left: pageCoordinates.left + (pageCoordinates.width/2),
            originX: 'center',
          }).setCoords();
        }
      break;
      case 'hr':
        //obj.set('left', (canvas.getWidth()-obj.width)).setCoords();
        if(obj.type == 'activeSelection'){
          /*var objs1 = obj._objects.filter(function(o){
            if(o.objectGroup == true){
              return o;
            }
          });
          if(objs1.length == 0){*/
          if(!jQuery(".parent-layer.layer-row").hasClass("g-active")){
            setGroupObjectAlign("hr");
          }
          else {
            obj.set({
              left: (pageCoordinates.left + pageCoordinates.width),
              originX: 'right',
            }).setCoords();
          }
        }
        else {
          obj.set({
            left: (pageCoordinates.left + pageCoordinates.width),
            originX: 'right',
          }).setCoords();
        }
      break;
      case 'vt':
        //obj.set('top', 0).setCoords();
        if(obj.type == 'activeSelection'){
          /*var objs1 = obj._objects.filter(function(o){
            if(o.objectGroup == true){
              return o;
            }
          });
          if(objs1.length == 0){*/
          if(!jQuery(".parent-layer.layer-row").hasClass("g-active")){
            setGroupObjectAlign("vt");
          }
          else {
            obj.set({
              top: pageCoordinates.top,
              originY: 'top',
            }).setCoords();
          }
        }
        else {
          obj.set({
            top: pageCoordinates.top,
            originY: 'top',
          }).setCoords();
        }
      break;
      case 'vm':
        //obj.set('top', (canvas.getHeight()/2)-(obj.height/2)).setCoords();
        if(obj.type == 'activeSelection'){
          /*obj._objects = obj._objects.sort(function(a, b) {
            return a.top - b.top;
          });
          var objs1 = obj._objects.filter(function(o){
            if(o.objectGroup == true){
              return o;
            }
          });
          if(objs1.length == 0){*/
          if(!jQuery(".parent-layer.layer-row").hasClass("g-active")){
            setGroupObjectAlign('vm');
          }
          else {
            obj.set({
              top: pageCoordinates.top + (pageCoordinates.height/2),
              originY: 'center',
            }).setCoords();
          }
        }
        else {
          obj.set({
            top: pageCoordinates.top + (pageCoordinates.height/2),
            originY: 'center',
          }).setCoords();
        }
      break;
      case 'vb':
        //obj.set('top', (canvas.getHeight()-obj.height)).setCoords();
        if(obj.type == 'activeSelection'){
          /*var objs1 = obj._objects.filter(function(o){
            if(o.objectGroup == true){
              return o;
            }
          });
          if(objs1.length == 0){*/
          if(!jQuery(".parent-layer.layer-row").hasClass("g-active")){
            setGroupObjectAlign("vb");
          }
          else {
            obj.set({
              top: pageCoordinates.top + pageCoordinates.height,
              originY: 'bottom',
            }).setCoords();
          }
        }
        else {
          obj.set({
            top: pageCoordinates.top + pageCoordinates.height,
            originY: 'bottom',
          }).setCoords();
        }
      break;
      case 'dv':
        if(obj.type == 'activeSelection' && obj._objects.length > 2){
          obj._objects = obj._objects.sort(function(a, b) {
            return a.top - b.top;
          });
          var objCoordinates = obj.getBoundingRect(true, true);
          var objH = objCoordinates.height;
          var objsL = ((obj._objects.length) - 1);
          var totalH = 0;
          var objs = obj._objects.filter(function(objG){
            var objGC = objG.getBoundingRect(true, true);
            totalH =  totalH + objGC.height;
          });
          var diff = (objH - totalH)/objsL;
          if(diff < 0){
            diff = 0;
          }
          //var fLeft = 0;
          var fTop = 0;
          obj.forEachObject(function(object) {
            var objG = object.getBoundingRect(true, true);
            if(fTop == 0){
              //fLeft = objG.left;
              fTop = parseFloat(objG.top + objG.height);
            }
            else {
              object.set({
                //left: fLeft,
                top: parseFloat(fTop + diff),
                originY: 'top',
              }).setCoords();
              fTop = parseFloat(fTop + objG.height + diff);
            }
          });
        }
      break;
      case 'dh':
        if(obj.type == 'activeSelection' && obj._objects.length > 2){
          obj._objects = obj._objects.sort(function(a, b) {
            return a.left - b.left;
          });
          var objCoordinates = obj.getBoundingRect(true, true);
          var objW = objCoordinates.width;
          var objsL = ((obj._objects.length) - 1);
          var totalW = 0;
          var objs = obj._objects.filter(function(objG){
            var objGC = objG.getBoundingRect(true, true);
            totalW =  totalW + objGC.width;
          });
          var diff = (objW - totalW)/objsL
          if(diff < 0){
            diff = 0;
          }
          var fLeft = 0;
          //var fTop = 0;
          obj.forEachObject(function(object) {
            var objG = object.getBoundingRect(true, true);
            if(fLeft == 0){
              fLeft = parseFloat(objG.left + objG.width);
              //fTop = objG.top;
            }
            else {
              object.set({
                left: parseFloat(fLeft + diff),
                //top: fTop,
                originX: 'left',
              }).setCoords();
              fLeft = parseFloat(fLeft + objG.width + diff);
            }
          });
        }
      break;
    }
    canvas.renderAll();
  }
	updateCanvasState(); //undo/redo stack update
	savedDesignFlag = false;
}
/**
 * Callback function setGroupObjectAlign
 * to align the objects within the group
 **/
function setGroupObjectAlign(direction) {
  var obj = canvas.getActiveObject();
  var objCoordinates = obj.getBoundingRect(true, true);
  var objWidth = objCoordinates.width;
  var objHeight = objCoordinates.height;
  var scaleFactor = obj.scaleX;

  obj.forEachObject(function(object) {
    var oObj = object.getBoundingRect(true, true);
    var itemWidth = oObj.width * scaleFactor;
      var itemHeight = oObj.height * scaleFactor;
    if (direction === 'hl'){
      object.set({
        originX: 'center',
        left: -objWidth / 2 + itemWidth / 2
      }).setCoords();
    }
    else if (direction === 'vt'){
      object.set({
        originY: 'center',
        top: -objHeight / 2 + itemHeight / 2
      }).setCoords();
    }
    else if (direction === 'hr') {
      object.set({
        originX: 'center',
        left: objWidth / 2 - itemWidth / 2
      }).setCoords();
    }
    else if (direction === 'vb') {
      object.set({
        originY: 'center',
        top: objHeight / 2 - itemHeight / 2
      }).setCoords();
    }
    else if (direction === 'hc') {
      object.set({
        originX: 'center',
        left: -objWidth/2 + itemWidth/2 + (objWidth/2-itemWidth/2),
      }).setCoords();
    }
    else if (direction === 'vm') {
      object.set({
        originY: 'center',
        top: -objHeight/2 + itemHeight/2 + (objHeight/2-itemHeight/2),
      }).setCoords();
    }
  });
}

function roundedCorners(obj, radius) {
  var rect = new fabric.Rect({
		radius: radius,
		originX: 'center',
		originY: 'center',
	});
  rect._render(obj, false);
}

function setobjectcorner(obj, seto) {
  if(obj) {
    switch(seto) {
      case 'R':
				//obj.clipPath.set('radius', 56);
        //obj.set({'clipPath': roundedCorners.bind(obj, 56)});
      break;
      
    }
		//obj.set('dirty', true);
		//console.log(obj);
    canvas.renderAll();
  }
}

/**
 * Callback function addImageContainer()
 * to add image container as "type = rect"
 * I used custom type "ImageContainer"
 **/
function addImageContainer(container = null) {
  //imageContainer
  var activepage = $(".page-row.g-active").attr("id");
	if($('.layer-row.parent-layer').hasClass('g-active')){
		var activeLayer = $('.layer-row.parent-layer.g-active').attr('id');
		var activeLayerTitle = $('.layer-row.parent-layer.g-active .layer-title').text();
		var parentlayerOrder = $('.layer-row.parent-layer.g-active').attr('order');
	} else if($('.layer-row.parent-layer').hasClass('g-has-selection')){
		var activeLayer = $('.layer-row.parent-layer.g-has-selection').attr('id');
		var activeLayerTitle = $('.layer-row.parent-layer.g-has-selection .layer-title').text();
		var parentlayerOrder = $('.layer-row.parent-layer.g-has-selection').attr('order');
	} else {
		var activeLayer = '';
		var activeLayerTitle = '';
		var parentlayerOrder = '';
	}
  if(container == null){
    var layer_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    var activePageObj = canvas.getItemById(activepage);
    var containerName = 'Image Container';
    var containerWidth = 200;
    var containerHeight = 200;
  }
  else {
    var activePageObj = container;
    var layer_id = container.id;
    var containerName = container.name;
    var containerWidth = container.getScaledWidth();
    var containerHeight = container.getScaledHeight();
  }
  var pageID = activepage;
  var objLeft = activePageObj.left;
  var objTop = activePageObj.top;
  var layerIndexing = 1;
  var scaleX = 1;
  var scaleY = 1;
  var angle = 0;
  var opacity = 1;
  var originX = "center";
  var originY = "center";
  // create a rectangle object
  if(container == null){
    var rect = new fabric.ImageContainer({
      left: objLeft,
      top: objTop,
      actualLeft: objLeft,
      actualTop: objTop,
      name: containerName,
      id: layer_id,
      page: pageID,
      layerGroup: activeLayer,
      layerGroupTitle: activeLayerTitle,
      parentlayerOrder: parentlayerOrder,
      //fill: '#FFACAC',
      fill: '#bbbbbb',
      width: containerWidth,
      height: containerHeight,
      layerIndexing: layerIndexing,
      stroke: '#ffffff',
      strokeWidth: 0,
      originX: originX,
      originY: originY,
      scaleX: scaleX,
      scaleY: scaleY,
      angle: angle,
      opacity: opacity,
      containerImage: '',
    });
    rect.set({
      clipFor: 'imagecontainertool'
    });
    rect.on({
      'scaling': function(e) {
        var obj = this,
          w = obj.width * obj.scaleX,
          h = obj.height * obj.scaleY,
          s = obj.strokeWidth;
        obj.set({
          'height'     : h,
          'width'      : w,
          'scaleX'     : 1,
          'scaleY'     : 1
        });
      }
    });
    activeLayerID = $("#layers .template-group .layer-row.g-active").attr("id");
    add_layer(layer_id, 'Image Container', 'ImageContainer', pageID, activeLayer, '');
    layerReordering();
    canvas.add(rect);
    canvas.renderAll();
    canvas.setActiveObject(rect);
  }
  //Insert container default
  /*textDefault = new fabric.Textbox('INSERT IMAGE HERE', {
    left: objLeft,
    top: objTop,
		actualLeft: objLeft,
		actualTop: objTop,
    name: 'defaultImage',
    originX: originX,
    originY: originY,
    id: "default"+layer_id,
    page: pageID,
    hide_container: 0,
    containerName: containerName,
    containerID: layer_id,
    containerWidth: containerWidth,
    containerHeight: containerHeight,
    layerIndexing: layerIndexing,
    hasBorders: false,
    fill: '#3b3b3b',
    fontSize: 36,
    fontFamily: "Open Sans",
    fontWeight: "500",
    textAlign: 'center',
    verticalAlign: 'middle',
    fontStyle: "normal",
    hasRotatingPoint: true,
    centerTransform: true,
    selectable: false,
    hasControls: false,
  });
  add_layer("default"+layer_id, 'defaultImage', 'ImageContainer', pageID, activeLayer, '', layer_id);
  layerReordering();
  canvas.add(textDefault);
  textDefault.setCoords();*/
  canvas.renderAll();
  //Enabled image panel for image container
  $('.toolbar.main-toolbar').addClass('d-flex');
  $('.toolbarPanel_1').removeClass('d-none').addClass('d-block');
  $('.properties-panel.main-toolbar').addClass('d-block');
  $('.toolbar.appearance-toolbar').addClass('d-flex');
  $('.properties-panel .appearance-property-panel.text-properties-panel').removeClass('d-block').addClass('d-none');
  $('.properties-panel .appearance-property-panel.image-properties-panel').addClass('d-block');
  $(".appearance-toolbar button").addClass("d-none");
}

/**
 * Callback function addTextToken()
 * add dynamic data token in textbox.
 */
function addTextToken(e){
  var obj = canvas.getActiveObject();
  if(obj){
    //var token = '['+e.options[e.selectedIndex].value+']';
    var token = e.options[e.selectedIndex].value;
    if(token !== 'none'){
      //obj.insertChars(token, 0);
      /*var pre_text = obj.text;
      var final_data = pre_text+' '+token;
      obj.set({
        text: final_data,
        token_data: 1,
      });*/
      var caretPositionStart = obj.selectionStart;
      var caretPositionEnd = obj.selectionEnd;
      obj.enterEditing();
      obj.insertChars(token, null, caretPositionStart, caretPositionEnd);
      obj.exitEditing();
      obj.enterEditing();
      obj.selectionStart = caretPositionStart + token.length;
      obj.selectionEnd = caretPositionStart + token.length;
      obj.setSelectionStyles({fill:'#FF00FF'}, caretPositionStart, obj.selectionEnd);
      obj.setSelectionStyles({textBackgroundColor:'#EEEEEE'}, caretPositionStart, obj.selectionEnd);
      obj.set({
        token_data: 1,
      });
      canvas.renderAll();
      canvas.setActiveObject(obj);
			savedDesignFlag = false;
    }
  }
	if(!savedDesignFlag){
		DetectTemplateChanges();
	}
}
/**
 * Callback function applyLineCap()
 * to add line Cap on line object.
 */
function applyLineCap(e){
  var obj = canvas.getActiveObject();
  if(obj){
    var lineCap = e.options[e.selectedIndex].value;
    var lineHeight = obj.height;
    var lineWidth = obj.width;
    if(lineCap == 'butt'){
      if(lineWidth > lineHeight){
        lineWidth = lineWidth + obj.strokeWidth;
      }
      else {
        lineHeight = lineHeight + obj.strokeWidth;
      }
    }
    else if(obj.strokeLineCap == 'butt') {
      if(lineWidth > lineHeight){
        lineWidth = lineWidth - obj.strokeWidth;
      }
      else {
        lineHeight = lineHeight - obj.strokeWidth;
      }
    }
    obj.set({
      strokeLineCap: lineCap,
      line_cap: lineCap,
      height: lineHeight,
      width: lineWidth,
    });
    canvas.renderAll();
    canvas.setActiveObject(obj);
    savedDesignFlag = false;
  }
	if(!savedDesignFlag){
		DetectTemplateChanges();
	}
}
/**
 * Callback function addImagePreset()
 * add child preset in select list
 * at dynamic data panel..
 */
function addImagePreset(e){
  var product_group_tid = e.options[e.selectedIndex].value;
  var media_preset = [];
  media_preset.push('<option value="none">- None -</option>');
  if(product_group_tid != 'none'){
    getImagePreset(product_group_tid);
    var obj = canvas.getActiveObject();
    obj.set({
      imagePresetGroup: product_group_tid,
      imagePresetPreset: '',
    });
    canvas.renderAll();
  }
  else {
    media_preset = media_preset.join('');
    jQuery("#media-preset-style").empty();
    jQuery("#media-preset-style").append(media_preset);
    jQuery('#media-preset-style').prop("disabled", true);
  }
}
/**
 * Callback function getImagePreset()
 * Get child preset in select list
 * at dynamic data panel..
 */
function getImagePreset(product_group_tid, childVal = null){
  var media_preset = [];
  media_preset.push('<option value="none">- None -</option>');
  var getTokenList = media_base_url+'/tokendata?_format=json';
  var url_data = {vid : "image_preset", product_group_tid : product_group_tid}
  $.getJSON(getTokenList, url_data, function( tokenlist ) {
    $.each(tokenlist, function(key, val) {
      //$dynamicDataPanelBody.push('<option value="'+val.token+'" tid="'+val.tid+'" machine_field="'+val.machine_field+'">'+val.name+'</option>');
      media_preset.push('<option value="'+val.tid+'">'+val.name+'</option>');
    });
    media_preset = media_preset.join('');
    jQuery("#media-preset-style").empty();
    jQuery("#media-preset-style").append(media_preset);
    jQuery('#media-preset-style').removeAttr("disabled");
    if(childVal != null && childVal != ''){
      jQuery('#media-preset-style').val(childVal);
    }
    else {
      jQuery('#media-preset-style').val("none");
    }
  });
}
/**
 * Callback function getPageSizePreset()
 * Get the page size from image_preset taxonomy
 * according to selected Media Presets (product_group)
 */
function getPageSizePreset(product_group_tid){
  var pageSize = [];
  pageSize.push('<option value="none">- None -</option>');
  var getPageSize = media_base_url+'/tokendata?_format=json';
  //var url_data = {vid : "image_preset", product_group_tid : product_group_tid, 'image_preset_selector': 'yes'}
  var url_data = {vid : "image_preset", product_group_tid : product_group_tid, sub_image_preset: producTypeId}
  $.getJSON(getPageSize, url_data, function( pageSizeList ) {
    //console.log(JSON.stringify(pageSizeList));
    $.each(pageSizeList, function(key, val) {
      if(val.unit == 'pixels'){
        var presetPageWidth = parseFloat(val.width).toFixed(2);
        var presetPageHeight = parseFloat(val.height).toFixed(2);
        var PageSizeValue = presetPageWidth+'x'+presetPageHeight;
      }
      else {
        var presetPageWidth = parseFloat(val.width).toFixed(2);
        var presetPageHeight = parseFloat(val.height).toFixed(2);
        var PageSizeValue = presetPageWidth+'x'+presetPageHeight;
      }
      pageSize.push('<option preset-tid='+ val.tid +' value='+ PageSizeValue +' page-width="'+presetPageWidth+'" page-height="'+presetPageHeight+'">'+ val.name +'</option>');
    });
    pageSize = pageSize.join('');
    jQuery("#preset-size").empty();
    jQuery("#preset-size").append(pageSize);
    setPageSettings();
  }).always(function() {
    if(jQuery("#preset-size option").length > 1){
      setPageSizeOption();
    }
  });
}

/**
 * Callback function preset_select_modal()
 * to change the Measurements option.
 */
function preset_select_modal(e){
  var preset = e.options[e.selectedIndex].value;
	presetVal = preset;
	presetName = e.options[e.selectedIndex].text;
  var width = e.options[e.selectedIndex].getAttribute('width');
  var height = e.options[e.selectedIndex].getAttribute('height');
  var unit = e.options[e.selectedIndex].getAttribute('unit');
  width = (width == 'null') ? '' : width;
  height = (height == 'null') ? '' : height;
  unit = (unit == 'null') ? 'pixels' : unit;
  if(width === '' || height === '' || presetName == 'Select a preset...'){
    jQuery('.btn-primary').attr('disabled', 'disabled');
  } else {
    jQuery('.btn-primary').removeAttr('disabled');
  }
  if(unit == 'pixels'){
    width = parseInt(width);
    height = parseInt(height);
  }
  jQuery('#elem-width').val(width);
  jQuery('#elem-height').val(height);
  jQuery('#elem-measurement').val(unit);
	productId = $('.product-item.active').attr('data-group');
	producTypeId = $('.product-item.active').attr('data-tid');
	if(presetName !== 'Select a preset...'){
		jQuery('#header .selectedpreset #preset-name').attr('href', '/kmds/design/'+uid+'/'+productId+'/'+producTypeId);
		jQuery('#header .selectedpreset #preset-name').text(presetName);
	}
  jQuery("#preset-size").attr('preset-tid', preset);
  jQuery("#preset-size").attr('preset-name', presetName);
}
/**
 * Callback function selectMeasurements()
 * to change the Measurements option.
 */
function selectMeasurements(e){
  $('.toolbarPanel_4.d-block').append('<div class="progress-overlay toolbarPanel_4-overlay"><div class="spinner-border"></div></div>');
  var Measurement = e.options[e.selectedIndex].value;
  //var presetValue = jQuery("#measurements").attr("preset-value");
  jQuery('.g-ruler-widget-px span').text(Measurement);
  var page_settings = {'measurement' : Measurement};
  updateTemplatePresetName(page_settings);
  activePageID = $('.page-row.g-active').attr('id');
  active_page_object = canvas.getItemsByPage(activePageID)[0];
  pageWidth = active_page_object.width;
  //console.log("pageWidth 11 ="+pageWidth);
  pageHeight = active_page_object.height;
  if(Measurement == 'in'){
    pageWidth = (active_page_object.width / 72).toFixed(4);
    pageWidth = parseFloat(pageWidth).toFixed(2);
    //console.log("pageWidth 12 ="+pageWidth);
    pageHeight = (active_page_object.height / 72).toFixed(4);
    pageHeight = parseFloat(pageHeight).toFixed(2);
  }
  jQuery('#canvas-width').val(parseFloat(pageWidth).toFixed(2));
  jQuery('#canvas-height').val(parseFloat(pageHeight).toFixed(2));
  active_page_object.set({
    pageMeasurement: Measurement,
  });
  canvas.renderAll();
  //console.log("Measurement = "+Measurement);
  addrulernew(0, 0);
  //console.log('11');
  //var page_settings = {'measurement' : Measurement, 'preset_name' : presetName};
  //update_design_url(design_id, page_settings);
}
/**
 * Callback function selectColorSpace()
 * to select color space.
 */
function selectColorSpace(e){
  var design_id = getUrlDesignID();
  if (design_id == '') {
    var colorSpace = jQuery('#kmds-color-space').attr("preset-value") ? jQuery('#kmds-color-space').attr("preset-value") : 'RGB';
    jQuery('#kmds-color-space').val(colorSpace);
    FnNewFolderModal();
    FnDefaultModal('Please save the template before select color space.');
  }
  else {
    var ColorSpace = e.options[e.selectedIndex].value;
    $('.toolbarPanel_4.d-block').append('<div class="progress-overlay toolbarPanel_4-overlay"><div class="spinner-border"></div></div>');
    var page_settings = {'color_space' : ColorSpace};
    updateTemplatePresetName(page_settings);
  }
}
/**
 * Callback function selectPageFormat()
 * to select color space.
 */
function selectPageFormat(e){
  var design_id = getUrlDesignID();
  if (design_id == '') {
    var format = jQuery('#kmds-format').attr("preset-value") ? jQuery('#kmds-format').attr("preset-value") : 'jpg';
    jQuery('#kmds-format').val(format);
    //addPageMediaBox();
    FnNewFolderModal();
    FnDefaultModal('Please save the template before select format.');
  }
  else {
    var page_format = e.options[e.selectedIndex].value;
    $('.toolbarPanel_4.d-block').append('<div class="progress-overlay toolbarPanel_4-overlay"><div class="spinner-border"></div></div>');
    var page_settings = {'page_format' : page_format};
    updateTemplatePresetName(page_settings);
    addPageMediaBox();
  }
}
/**
 * Callback function updateTemplatePresetName()
 * to save the template preset name
 **/
function updateTemplatePresetName(page_settings){
  var measurements = jQuery('#measurements').val();
  var measurements_presetValue = (jQuery("#measurements").attr("preset-value")) ? jQuery("#measurements").attr("preset-value") : measurements;
  var kmds_dpi = jQuery('#kmds-dpi').val();
  var kmds_dpi_presetValue = (jQuery("#kmds-dpi").attr("preset-value")) ? jQuery("#kmds-dpi").attr("preset-value") : kmds_dpi;
  var kmds_color_space = jQuery('#kmds-color-space').val();
  var kmds_color_space_presetValue = (jQuery("#kmds-color-space").attr("preset-value")) ? jQuery("#kmds-color-space").attr("preset-value") : kmds_color_space;
  var kmds_format = jQuery('#kmds-format').val();
  var kmds_format_presetValue = (jQuery("#kmds-format").attr("preset-value")) ? jQuery("#kmds-format").attr("preset-value") : kmds_format;
  if(measurements == measurements_presetValue && kmds_dpi == kmds_dpi_presetValue && kmds_color_space == kmds_color_space_presetValue && kmds_format == kmds_format_presetValue){
    jQuery("#preset-size option[preset-name='Custom']").remove();
    presetName = jQuery("#preset-size option[preset-tid='"+presetVal+"']").text();
    jQuery("#preset-size").attr('preset-name', presetName);
    jQuery('#header .selectedpreset #preset-name').text(presetName);
    jQuery("#preset-size option[preset-tid='"+presetVal+"']").prop('selected', true);
  }
  else {
    presetName = 'Custom';
    jQuery("#preset-size").attr('preset-name', presetName);
    jQuery('#header .selectedpreset #preset-name').text(presetName);
    jQuery("#preset-size option[preset-name='Custom']").remove();
    var pw = parseFloat(jQuery('#canvas-width').val()).toFixed(2);
    var ph = parseFloat(jQuery('#canvas-height').val()).toFixed(2);
    var preset_tid = jQuery("#preset-size").attr("preset-tid");
    jQuery("#preset-size").append('<option preset-name="Custom" preset-tid="'+preset_tid+'" value="'+pw+'x'+ph+'" page-width="'+pw+'" page-height="'+ph+'">'+presetName+'</option>');
    jQuery("#preset-size option[preset-name='Custom']").prop('selected', true);
  }
  page_settings['preset_name'] = presetName;
  update_design_url(design_id, page_settings);
}
/**
 * Callback function resetPageSettings()
 * to reset all page settings.
 */
function resetPageSettings(e){
  var design_id = getUrlDesignID();
  if (design_id == '') {
    FnNewFolderModal();
    FnDefaultModal('Please save the template before select format.');
  }
  else {
    var getPageSetings = media_base_url+'/tokendata?_format=json';
    var url_data = {vid : "image_preset", 'presetVal' : presetVal, 'image_preset_selector': 'yes'}
    $('.toolbarPanel_4.d-block').append('<div class="progress-overlay toolbarPanel_4-overlay"><div class="spinner-border"></div></div>');
    $.getJSON(getPageSetings, url_data, function( pageSetings ) {
      //[{"tid":"566","name":"Instagram Post","format":"png","color_space":"sRGB","dpi":null}]
      if(pageSetings[0].color_space !== null){
        jQuery("#kmds-color-space").val(pageSetings[0].color_space);
      }
      if(pageSetings[0].format !== null){
        jQuery("#kmds-format").val(pageSetings[0].format);
        if(pageSetings[0].format == 'pdf'){
          addPageMediaBox();
        }
      }
      if(pageSetings[0].dpi !== null){
        jQuery("#kmds-dpi").val(pageSetings[0].dpi);
      }
      if(pageSetings[0].unit !== null){
        var unit_of_measurement = {'pixels':'px', 'inches':'in'};
        jQuery("#measurements").attr("preset-value", unit_of_measurement[pageSetings[0].unit]);
      }
    }).always(function() {
      jQuery("#preset-size option[preset-name='Custom']").remove();
      presetName = jQuery("#preset-size option[preset-tid='"+presetVal+"']").text();
      jQuery("#preset-size").attr('preset-name', presetName);
      jQuery('#header .selectedpreset #preset-name').text(presetName);
      jQuery("#preset-size option[preset-tid='"+presetVal+"']").prop('selected', true);
      var ColorSpace = jQuery("#kmds-color-space").val();
      var page_format = jQuery("#kmds-format").val();
      var page_settings = {'color_space' : ColorSpace, 'page_format' : page_format, 'preset_name' : presetName};
      update_design_url(design_id, page_settings);
      $('.toolbarPanel_4 .toolbarPanel_4-overlay').remove();
    });
  }
}
/**
 * Callback function addDynamicBranding()
 * add apply dynamic branding style in textbox.
 */
function addDynamicBranding(value){
  var obj = canvas.getActiveObject();
  if(obj){
    var oid = obj.id;
    switch (value) {
      case 'font-family':
        var data_value = jQuery("#font-family-type").val();
        obj.set({
          branding_font_family: data_value,
        });
        canvas.renderAll();
      break;
      case 'font-color':
        var data_value = jQuery("#font-color-type").val();
        obj.set({
          branding_font_color: data_value,
        });
        canvas.renderAll();
      break;
      case 'background-color':
        var data_value = jQuery("#background-color-type").val();
        obj.set({
          branding_background_color: data_value,
        });
        canvas.renderAll();
      break;
      case 'border-color':
        var data_value = jQuery("#border-color-type").val();
        obj.set({
          branding_border_color: data_value,
        });
        canvas.renderAll();
      break;
    }
  }
}
/**
 * Callback function setObjectLink()
 * to replace link icon.
 */
function setObjectLink(){
  var val = 'linked';
  var obj = canvas.getActiveObject();
  if(obj){
    if($("#objectLinkAction").hasClass('unlinked')){
      val = 'linked';
      $("#objectLinkAction").removeClass('unlinked').addClass('linked');
    }
    else {
      val = 'unlinked';
      $("#objectLinkAction").removeClass('linked').addClass('unlinked');
    }
    obj.set({
      object_link: val,
    });
    canvas.renderAll();
    canvas.setActiveObject(obj);
		savedDesignFlag = false;
		if(!savedDesignFlag){
			DetectTemplateChanges();
		}
  }
}
/**
 * Callback function dynamicDataClick()
 * add apply dynamic data settings in textbox.
 */
function dynamicDataClick(value){
  var obj = canvas.getActiveObject();
  if(obj){
    var oid = obj.id;
    switch (value) {
      case 'lock':
        var data = ($("#dynamic-lock-data").is( ":checked" )) ? 1 : 0;
        obj.set({
          lock_data: data,
        });
        //$('#layers #'+oid).find('.layer-action.layer-lock-icon').removeClass('fa-unlock-alt').addClass('fa-lock');
      break;
      case 'caps':
        var data = ($("#dynamic-all-caps").is( ":checked" )) ? 1 : 0;
        obj.set({
          caps_data: data,
        });
      break;
      case 'position-relation':
        var data = ($("#dynamic-position-relative").is( ":checked" )) ? 1 : 0;
        if(data == 1){
          activeDynamicSeparateCobinePanel('active');
        }
        else {
          if(obj.parent_relative == 1 || obj.child_relative == 1){
            FnNewFolderModal();
            FnDefaultModal('Unchecking this box will disassociate this layer from its positional relationship. Continue?');
            $('#parent-layer').prop( "checked", false );
            $('#child-layer').prop( "checked", false );
            $('#relationship-no-select').val("none");
            activeDynamicSeparateCobinePanel('inactive');
          }
        }
        obj.set({
          position_relative: data,
        });
      break;
      case 'image_source':
        var data_option = jQuery("input[name='listingimage']:checked").val();
        var data_value = (data_option == 'none') ? '' : jQuery("."+data_option).val();
        obj.set({
          imageSourceOption: data_option,
          imageSourceValue: data_value,
        });
        //Add DynamicImage png with image
        /*var obj_id = obj.id+"-dynamic";
        canvas.remove(canvas.getItemById(obj_id));
        var img_croped = "/modules/custom/media_design_system/css/assets/img/DynamicImage-FF0000.png";
        img_croped = media_base_url+img_croped;
        fabric.util.loadImage(img_croped, function(img2) {
          image2 = new fabric.Image(img2, {
              left: obj.left,
              //left: obj.width-10,
              top: obj.top,
              height: 50,
              width: 50,
              id: obj_id,
              selectable: true,
              hasControls: false,
              hasBorders: false,
            });
          canvas.add(image2);
          //canvas.renderAll();
        });*/
        canvas.renderAll();
      break;
      case 'media-kit':
        if(jQuery('#dynamic-listing-photo-media-kit').is(":checked")){
          var data_value = jQuery(".media_kit").val();
          obj.set({
            imageSourceValue: data_value,
          });
          canvas.renderAll();
        }
      break;
      case 'user-picture':
        if(jQuery('#dynamic-listing-photo-user-picture').is(":checked")){
          var data_value = jQuery(".user_picture").val();
          obj.set({
            imageSourceValue: data_value,
          });
          canvas.renderAll();
        }
      break;
      case 'ar-constraint':
        var data_value = jQuery("#image-ar-constraint").val();
        obj.set({
          imageArConstraint: data_value,
        });
        canvas.renderAll();
      break;
      case 'branding-logo':
        if(jQuery('#dynamic-listing-photo-branding-logo').is(":checked")){
          var data_value = jQuery(".branding_logo").val();
          obj.set({
            imageSourceValue: data_value,
          });
          canvas.renderAll();
        }
      break;
      case 'media-preset':
        var data_value = jQuery("#media-preset-style").val();
        obj.set({
          imagePresetPreset: data_value,
        });
        canvas.renderAll();
      break;
      case 'max-character':
        $('.maximum-characters-content input').on('keypress', function(event){
          return (
            event.keyCode == 8 || 
            event.keyCode == 46 ||
            (event.keyCode >= 37 && event.keyCode <= 40) ||
            (event.charCode >= 48 && event.charCode <= 57)
          );
        }).keyup(function(){
					savedDesignFlag = false;
          var max_character_value = $('#maximum-characters').val();
          obj.set({
            max_character: max_character_value,
          });
          canvas.renderAll();
          canvas.setActiveObject(obj);
        });
      break;
    }
    canvas.renderAll();
    canvas.setActiveObject(obj);
		//updateCanvasState(); //undo/redo stack update
		savedDesignFlag = false;

		if(!savedDesignFlag){
			DetectTemplateChanges();
		}
  }
}
/**
 * Callback function savePageSettings()
 * to save the KMDS page settings
 **/
function savePageSettings(value){
  /*
  static_image_url
  template_active
  no_of_photos
  page_size
  removal_active
  */
  var design_id = getUrlDesignID();
  switch (value) {
    case 'active-page':
      if(jQuery('.static-image .no-static-image').length){
        FnNewFolderModal();
        FnDefaultModal('A thumbnail image is required to make this template active.<br/><br/>Please create or upload a thumbnail image.');
        jQuery('#active-page').prop( "checked", false );
      }
      else {
        var template_active = 0;
        if(jQuery('#active-page').prop("checked")) {
          template_active = 1;
        }
				var page_settings = {'template_active' : template_active};
				update_design_url(design_id, page_settings);
      }
    break;
    case 'removal-page':
      var removal_active = 0;
      if(jQuery('#removal-page').prop("checked")) {
        removal_active = 1;
      }
      var page_settings = {'removal_active' : removal_active};
      update_design_url(design_id, page_settings);
    break;
    case 'create-new':
      if (design_id == '') {
        FnNewFolderModal();
        FnDefaultModal('Please save the template before creating or uploading a thumbnail.');
      }
      else {
        jQuery('.settings-data-panel').append('<div class="progress-overlay page-setting-progress"><div class="spinner-border"></div></div>');
        createCanvasPageImage();
      }
    break;
    case 'remove-thumbnail':
      if(jQuery('.static-image .static-image-thumb').length > 0){
        jQuery(".static-image-thumb").remove();
        jQuery('.static-image').append('<div class="no-static-image margin-auto">&nbsp;</div>');
        jQuery(".image-page-button.remove-thumbnail").removeClass('d-block').addClass('d-none');
        jQuery(".image-page-button.create-thumbnail").removeClass('d-none').addClass('d-block');
        jQuery(".static-image-upload").removeClass('d-none').addClass('d-flex');
        jQuery('#active-page').prop( "checked", false )
				var page_settings = {'static_image_url' : "", 'template_active' : 0};
				update_design_url(design_id, page_settings);
      }
    break;
    case 'upload-new':
      if (design_id == '') {
        FnNewFolderModal();
        FnDefaultModal('Please save the template before creating or uploading a thumbnail.');
      }
      else {
        jQuery('#static-img-upload').trigger('click');
      }
    break;
    case 'bleed':
      if (design_id == '') {
        jQuery('#page-bleed').prop("checked", false);
        FnNewFolderModal();
        FnDefaultModal('Please save the template before creating or uploading a thumbnail.');
      }
      else {
        var page_bleed = 0;
        if(jQuery('#page-bleed').prop("checked")) {
          page_bleed = 1;
        }
				var page_settings = {'page_bleed' : page_bleed};
				update_design_url(design_id, page_settings);
      }
    break;
    case 'trim-marks':
      if (design_id == '') {
        jQuery('#page-bleed').prop("checked", false);
        jQuery('#page-trim-marks').prop("checked", false);
        jQuery('#page-bleed').attr("disabled", false);
        FnNewFolderModal();
        FnDefaultModal('Please save the template before creating or uploading a thumbnail.');
      }
      else {
        var page_bleed = 1;
        var trim_marks = 0;
        jQuery('#page-bleed').attr("disabled", false);
        if(jQuery('#page-trim-marks').prop("checked")) {
          jQuery('#page-bleed').prop("checked", true);
          jQuery('#page-bleed').attr("disabled", true);
          trim_marks = 1;
        }
				var page_settings = {'page_bleed' : page_bleed, 'trim_marks' : trim_marks};
				update_design_url(design_id, page_settings);
      }
    break;
  }
}
/**
 * Callback function createCanvasPageImage()
 * to convert canvas page objects to Image
 **/
function createCanvasPageImage(){
  if($('#page-image-canvas').length == 0){
    var $elem = $('#canvas-container');
    $elem.append(
      $('<canvas/>', {'id': 'page-image-canvas', "width": "500", "height": "500"})
    );
  }
  var pageID = $(".page-row.g-active").attr("id");
  var allObj = canvas.getItemsByPage(pageID);
  var pageObj = canvas.getItemsByPage(pageID)[0];
  var size = pageObj.width >= pageObj.height ? 'width' : 'height';
  var canvasP = new fabric.Canvas('page-image-canvas', {
    backgroundColor : "#ffffff",
    width: pageObj.width,
    height: pageObj.height,
  });
  canvasP.clear();
  var leftDiff = ((pageObj.left - (pageObj.width / 2)) + 1)
  var topDiff = ((pageObj.top - (pageObj.height / 2)) + 1)
  allObj.forEach(function(obj) {
    var o = fabric.util.object.clone(obj);
    o.left = (o.left - leftDiff);
    o.top = (o.top - topDiff);
    o.setCoords();
    canvasP.add(o);
  });
  canvasP.renderAll();
  //var dataURL = canvasP.toDataURL('png');
  var dataURL = canvasP.toDataURL("image/jpeg",0.7);
  var design_id = getUrlDesignID();
  jQuery.ajax({
    url: media_base_url+"/kmds/design-tool/images",
    type: "POST",
    data: {json_data: dataURL, design_id: design_id, json_type: 'static_image', uid: uid},
    dataType: "json",
    beforeSend: function(x) {
      if (x && x.overrideMimeType) {
        x.overrideMimeType("application/json;charset=UTF-8");
      }
    },
    success: function(result) {
      //console.log('static-image '+result.src);
      if(jQuery(".static-image .no-static-image").length){
        jQuery(".static-image .no-static-image").remove();
        jQuery(".static-image").append('<div class="static-image-thumb margin-auto"><img src="'+result.src+'" '+size+'="128" /></div>');
        jQuery(".image-page-button.remove-thumbnail").removeClass('d-none').addClass('d-block');
        jQuery(".image-page-button.create-thumbnail").removeClass('d-block').addClass('d-none');
        jQuery(".static-image-upload").removeClass('d-flex').addClass('d-none');
      }
      else {
        jQuery('.static-image-thumb img').attr('src', result.src);
      }
      var page_settings = {'static_image_url' : result.src};
      update_design_url(design_id, page_settings);
      jQuery('.settings-data-panel .page-setting-progress').remove();
    }
  });
  canvasPageImage(dataURL, size);
}
/**
 * Callback function canvasPageImage()
 * to convert canvas page to Image
 **/
function canvasPageImage(dataURL, size) {
  var blobUrl = new Array();
  sliceSize = 512;
  var contentType = 'image/png';
  var BASE64_MARKER = ';base64,';   
  var base64Index = dataURL.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var b64Data = dataURL.substring(base64Index);

  var byteCharacters = window.atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  blobUrl[0] = URL.createObjectURL(blob);
  var image_url = URL.createObjectURL(blob);
  jQuery(".static-image .no-static-image").remove();
  jQuery(".static-image").append('<div class="static-image-thumb margin-auto"><img src="'+image_url+'" '+size+'="128" /></div>');
  jQuery(".image-page-button.remove-thumbnail").removeClass('d-none').addClass('d-block');
  jQuery(".image-page-button.create-thumbnail").removeClass('d-block').addClass('d-none');
  jQuery(".static-image-upload").removeClass('d-flex').addClass('d-none');
  //jQuery('.settings-data-panel .page-setting-progress').remove();
  /*setTimeout(function() {
    if(blobUrl.length === i) {
      var base_path = "/property-ads-ajax";
      jQuery.post(base_path, {"image_urls": blobUrl}, function(response) {
        if(response){
          console.log('Template image preview deleted!');
        }
      });
    }
  }, 5000);*/
}

/**
 * callback function for canvas object mouse up/down and upon selection creation
**/
function LayerActivation(){
	var obj = canvas.getActiveObject();
  var activepage = jQuery('.page-row.g-active').attr('id');
	if(obj && obj.type != 'activeSelection' && obj.type != 'text' && obj.type != 'line' && obj.type != 'guideline' && !(handSelected) && !(zoomInTool) && obj.lock_position === 0 && obj.page == activepage){
    obj.set({
			hasControls: true,
      borderColor: '#2880E6'
		});
    canvas.renderAll();
		var oid = obj.id;
		if(!CtrlPressed){
			$('.layer-row.g-active').removeClass('g-active');
		}
		$('#layers #'+oid).addClass('g-active');
		if($('#layers #'+oid).hasClass('child-layer')){
			$('.layer-row.parent-layer.g-has-selection').removeClass('g-has-selection');
			var g = $('#layers #'+oid).attr('data-group');
			$('#layers #'+g).addClass('g-has-selection');
			$('.layer-row.parent-layer.g-has-selection .layer-icon').removeClass('fas').addClass('far');
		}
    if(obj.type == 'ImageContainer'){
      if(obj.containerImage !== ''){
        var containerImage = obj.containerImage;
        $('#layers #'+containerImage).addClass('g-active');
      }
    }
	}
}

/**
 * Callback function activeDynamicSeparateCCobinePanel()
 * To activate missing teeth panel from dynamic data.
 */
function activeDynamicSeparateCobinePanel(action){
  if(action == 'active'){
    jQuery('.object-missing-teeth').removeClass('inactive').addClass('active');
    jQuery('#parent-layer').removeAttr('disabled');
    jQuery('#child-layer').removeAttr('disabled');
    jQuery('#relationship-no-select').removeAttr('disabled');
  }
  else{
    jQuery('.object-missing-teeth').removeClass('active').addClass('inactive');
    jQuery('#parent-layer').attr('disabled','disabled');
    jQuery('#child-layer').attr('disabled','disabled');
    jQuery('#relationship-no-select').attr('disabled','disabled');
  }
  //console.log("action = "+action);
}

/**
 * Callback function callResourcesModal()
 * to displayed modal window
 **/
function callResourcesModal(){
  $('body div.k-dialog-container #modal').remove();
  var modalb = new ResourcesModalBox(title_msg = null);
  var modalc = new uploadResourcesModalContent();
  $('.k-dialog-container').append(modalb);
  $('.k-dialog-container .modal-footer').css('padding', '35px');
  $('#modal').modal('show');
}
/**
 * Callback Function uploadResourcesModalContent()
 * to displayed resources upload image functionaliry
 * by the modal window
 */
function uploadResourcesModalContent() {
  var products = [];
  var productitems = [];
  var allelemitems = [];
  products.push('<a id="nav-001-tab" class="nav-item nav-link" data-toggle="tab" href="#nav-001" role="tab" aria-controls="nav-001" aria-selected=false>Upload Images</a>'); 
  products.push('<a id="nav-002-tab" class="nav-item nav-link" data-toggle="tab" href="#nav-002" role="tab" aria-controls="nav-002" aria-selected=false>Upload Shapes</a>'); 
  products.push('<a id="nav-003-tab" class="nav-item nav-link" data-toggle="tab" href="#nav-003" role="tab" aria-controls="nav-003" aria-selected=false>Upload PDFs</a>'); 
  products.push('<a id="nav-004-tab" class="nav-item nav-link" data-toggle="tab" href="#nav-004" role="tab" aria-controls="nav-004" aria-selected=false>Create New Folder</a>'); 
  
  allelemitems.push($('<div/>', {"class": 'tab-pane fade', "id": 'nav-001', "role": "tabpanel", "aria-labelledby": 'nav-001-tab'}).html(
      $('<div/>', {"id" : "item-001", "data-tid" : '001', "data-name" : "Upload Images", "data-group" : "001", "class" : "product-item"}).html(
        $('<div/>', {"class" : "upload-images", text: 'Upload Images Comming Soon!'})
      )
    )
  );
  allelemitems.push($('<div/>', {"class": 'tab-pane fade', "id": 'nav-002', "role": "tabpanel", "aria-labelledby": 'nav-002-tab'}).html(
      $('<div/>', {"id" : "item-002", "data-tid" : '002', "data-name" : "Upload Images", "data-group" : "002", "class" : "product-item"}).html(
        $('<div/>', {"class" : "upload-shapes", text: 'Upload Shapes Comming Soon!'})
      )
    )
  );
  allelemitems.push($('<div/>', {"class": 'tab-pane fade', "id": 'nav-003', "role": "tabpanel", "aria-labelledby": 'nav-003-tab'}).html(
      $('<div/>', {"id" : "item-003", "data-tid" : '003', "data-name" : "Upload PDFs", "data-group" : "003", "class" : "product-item"}).html(
        $('<div/>', {"class" : "upload-shapes", text: 'Upload PDFs Comming Soon!'})
      )
    )
  );
  allelemitems.push($('<div/>', {"class": 'tab-pane fade', "id": 'nav-004', "role": "tabpanel", "aria-labelledby": 'nav-004-tab'}).html(
      $('<div/>', {"id" : "item-004", "data-tid" : '004', "data-name" : "Create New Folder", "data-group" : "004", "class" : "product-item"}).html(
        $('<div/>', {"class" : "create-new-folder", text: 'Create New Folder Comming Soon!'})
      )
    )
  );
  var $output = $('.modal-body').append(
    $('<nav/>', {"class": "custom-nav-layout"}).append(
      $('<div/>', {
        "class": "nav nav-tabs nav-fill",
        "id": "nav-tab",
        "role": "tablist",
        "html": products,
      })
    )
  ).append(
    $('<div/>', {"class": "tab-content tab-group d-flex justify-content-center", "html" : allelemitems})
  );
  //unset modal footer of old tab on switch tab
  //$(".nav > .nav-item").on("shown.bs.tab", function(e) {
    $('.modal-footer').html(
      $('<div/>', {"class": "cancel-design-modal"}).html(
        $('<button/>', {'id': 'cancel-design', 'onclick': 'cancelCanvasDesignModal(this)', 'class': 'btn btn-blue font-Lato fs-15', text: 'CANCEL'})
      )
    );
    $('.modal-footer').css('padding', '35px');
  //});
  return $output;
}
/**
 * Callback funcion ResourcesModalBox()
 * to displayed modal window structure
 */
function ResourcesModalBox(title_msg = null) {
  var $elem = $('body div.k-dialog-container');
  $elem.append(
    $('<div/>', {'class': 'modal fade align-items-center', 'id': 'modal', 'data-backdrop': "static", 'data-keyboard': "false"}).append(
      $('<div/>', {'class': 'modal-dialog'}).append(
        $('<div/>', {'class': 'modal-content'}).append(
          $('<div/>', {'class': 'modal-header'}).append(
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
 * Fabric //active object corners style
**/
fabric.Object.prototype.cornerStyle = 'circle';//default rect
fabric.Object.prototype.borderColor = '#2880E6';
fabric.Object.prototype.cornerColor = '#2880E6';
fabric.Object.prototype.cornerStrokeColor = '#fff';
fabric.Object.prototype.StrokeWidth = 1;
fabric.Object.prototype.minScaleLimit = 0;
fabric.Object.prototype.cornerSize = 10;
fabric.Object.prototype.cornerRadius = 50;
fabric.Object.prototype.rotatingPointOffset = 35;
fabric.Object.prototype.padding = 0;
fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.lock_position = 0;
fabric.Object.prototype.objectGroup = false;
fabric.Object.prototype.layerIndexing = '';
fabric.Object.prototype.parentlayerOrder = '';

fabric.Object.prototype.getZIndex = function() {
  return this.canvas.getObjects().indexOf(this);
}
/**
 * Fabric object hide
 **/
fabric.Object.prototype.hide = function() {
	this.set({ hidden:true, opacity: 0, selectable: false });
};

/**
 * Fabric object show
 **/
fabric.Object.prototype.show = function() {
	this.set({ hidden:false, opacity: 1, selectable: true });
};

/**
 * Callback function to add border
 * after mouse hover on page
 **/
var activePageObject = function (PageID, action) {
  var pageLabels = canvas.getItemsByType('text', true);
  var pages = canvas.getItemsByType('page', true);
  var obj = canvas.getActiveObject();
	
  pageLabels.forEach(function(l) {
		if(l.page == PageID && action == 'active') {
			if(l.activeflag == false){
				l.set('fill', '#e75e00');
			}
		} else if(l.page == PageID && action == 'inactive') {
			if(l.activeflag == false){
				l.set('fill', '#000');
			}
		}
		canvas.renderAll();
	});
	
  pages.forEach(function(p) {
		if(p.id == PageID && action == 'active') {
      if(obj && obj.type == 'activeSelection' && obj.page == p.id){
        //if(){
          obj.set('borderColor', '#e75e00');
          obj.set('active', true);
        //}
        p.set({
          showPageBorder: false,
          //PageBorderColor: '#e75e00',
          borderColor: 'transparent',
          active: false,
        });
      } else {
        p.set({
          showPageBorder: true,
          PageBorderColor: '#e75e00',
          borderColor: '#e75e00',
          active: true,
        });
      }
      canvas.renderAll();
		}
		else if(p.id == PageID && action == 'inactive') {
      if(obj && obj.type == 'activeSelection' && obj.page == p.id){
        //if(obj.page == p.id){
          obj.set('borderColor', '#2880E6');
          obj.set('active', false);
        //}
        p.set({
          showPageBorder: false,
          borderColor: '#e75e00',
          active: false,
        });
      } else {
        p.set({
          showPageBorder: false,
          PageBorderColor: '#e75e00',
          borderColor: '#e75e00',
          active: false,
        });
      }
      canvas.renderAll();
		}
  });
}

/**
 * Callback function to add border
 * after mouse hover by object ID
 **/
var activeLayerObject = function (ObjectID, action) {
	var activeObj = canvas.getActiveObject();
  var activepage = jQuery('.page-row.g-active').attr('id');
  var ObjectIDObj = canvas.getItemById(ObjectID);
  canvas.getObjects().forEach(function(obj) {
    if(obj.id === ObjectID && action == 'active' && obj.type !== 'text' && obj.type !== 'line' && obj.type !== 'guideline' && ObjectIDObj.page == activepage && !obj.hide_container) {
			/*if(obj.type == 'Lineshape'){
				obj.set({
					active: true,
					stroke: '#e75e00',
					fill: '#e75e00',
				});
			} else if(obj.type == 'circle'){
				obj.set({
					active: true,
					borderColor: '#e75e00',
					stroke: '#e75e00',
				});
			} else {*/
				/* obj.set({
					active: true,
					hasControls: false,
					showImageBorder: true,
					showTextBoxBorder: true,
					textboxBorderColor: '#e75e00',
					borderColor: '#e75e00',
				}); */
        if(obj.type == 'circle' || obj.type == 'Lineshape'){
          obj.set({
            borderColor: '#e75e00',
          });
        }
				obj._renderControls(canvas.contextTop, {
					active: true,
					hasControls: false,
					borderColor: '#e75e00',
				});
				if(activeObj && activeObj.id == obj.id){
					obj.set({
						borderColor: '#e75e00',
						hasBorders: true,
					});
				}
			//}
      canvas.renderAll();
    }
    else if(obj.id === ObjectID && action == 'inactive' && obj.type !== 'text' && obj.type !== 'line' && obj.type !== 'guideline' && ObjectIDObj.page == activepage && !obj.hide_container) {
      /*if(obj.type == 'Lineshape'){
				obj.set({
					active: false,
					stroke: '#2880E6',
					fill: '#2880E6',
				});
			} else if(obj.type == 'circle'){
				obj.set({
					active: false,
					borderColor: '#2880E6',
					stroke: '#2880E6',
				});
			} else {*/
        if(obj.type == 'circle' || obj.type == 'Lineshape'){
          obj.set({
            borderColor: '#2880E6',
          });
        }
				canvas.clearContext(canvas.contextTop);
				obj._renderControls(canvas.contextTop, {
					active: false,
					hasControls: false,
					borderColor: '#2880E6',
					hasBorders: false,
				});
				if(activeObj && activeObj.id == obj.id){
					obj.set({
						borderColor: '#2880E6',
						hasBorders: true,
					});
				}
				/* obj.set({
					active: false,
					hasControls: true,
					showImageBorder: false,
					showTextBoxBorder: false,
					textboxBorderColor: '#2880E6',
					borderColor: '#2880E6',
				}); */
			//}
      canvas.renderAll();
    }
  });
}

/**
 * "fabric object extend" to add
 * custom attribute in "Textbox" object
 **/
fabric.Textbox.prototype.toObject = (function (toObject) {
  return function () {
		return fabric.util.object.extend(toObject.call(this), {
			id : this.id,
			name : this.name,
			page : this.page,
			layerGroup : this.layerGroup,
			layerGroupTitle : this.layerGroupTitle,
			objectGroup : this.objectGroup,
			actualTop : this.actualTop,
      pageRuler : this.pageRuler,
			actualLeft : this.actualLeft,
			layerIndexing : this.layerIndexing,
			parentlayerOrder : this.parentlayerOrder,
			token_data : this.token_data,
			lock_position : this.lock_position,
			hide_data : this.hide_data,
			lock_data : this.lock_data,
			caps_data : this.caps_data,
			caps_data_old_value: this.caps_data_old_value,
			cds_font : this.cds_font,
			max_character : this.max_character,
			position_relative : this.position_relative,
			position_relative_parent_id : this.position_relative_parent_id,
			parent_relative : this.parent_relative,
			parent_number : this.parent_number,
			child_relative : this.child_relative,
			child_number : this.child_number,
			//text_separate : this.text_separate,
			//text_combine : this.text_combine,
			zoomLevel : this.zoomLevel,
      //this attribute used to delete token
			old_text : this.old_text,
			branding_font_family : this.branding_font_family,
			branding_font_color : this.branding_font_color,
      tl: this.aCoords.tl,
			containerName : this.containerName,
			containerID : this.containerID,
			containerWidth : this.containerWidth,
			containerHeight : this.containerHeight,
			object_link : this.object_link,
			dynamic_opacity_range : this.dynamic_opacity_range,
    });
  };
})(fabric.Textbox.prototype.toObject);

/**
 * "fabric object extend" to add
 * custom attribute in "image" object
 **/
fabric.Image.prototype.toObject = (function (toObject) {
  return function () {
		return fabric.util.object.extend(toObject.call(this), {
			id : this.id,
			name : this.name,
			page : this.page,
			layerGroup : this.layerGroup,
			layerGroupTitle : this.layerGroupTitle,
			objectGroup : this.objectGroup,
			actualTop : this.actualTop,
      pageRuler : this.pageRuler,
			actualLeft : this.actualLeft,
			layerIndexing : this.layerIndexing,
			parentlayerOrder : this.parentlayerOrder,
			token_data : this.token_data,
			lock_position : this.lock_position,
			hide_data : this.hide_data,
			hide_container : this.hide_container,
			lock_data : this.lock_data,
			caps_data : this.caps_data,
			caps_data_old_value: this.caps_data_old_value,
			cds_font : this.cds_font,
			max_character : this.max_character,
			position_relative : this.position_relative,
			position_relative_parent_id : this.position_relative_parent_id,
			zoomLevel : this.zoomLevel,
			imageSourceOption : this.imageSourceOption,
			imageSourceValue : this.imageSourceValue,
			imageArConstraint : this.imageArConstraint,
			imagePresetGroup : this.imagePresetGroup,
			imagePresetPreset : this.imagePresetPreset,
			imgfid : this.imgfid,
			OldscaleX : this.OldscaleX,
			OldscaleY : this.OldscaleY,
			OldWidth : this.OldWidth,
			OldHeight : this.OldHeight,
			dynamicImageCorner : this.dynamicImageCorner,
			dynamicImageCornerrxw : this.dynamicImageCornerrxw,
			dynamicImageCornerryh : this.dynamicImageCornerryh,
			dynamic_image_opacity_range : this.dynamic_image_opacity_range,
      tl: this.aCoords.tl,
			containerName : this.containerName,
			containerID : this.containerID,
			containerWidth : this.containerWidth,
			containerHeight : this.containerHeight,
      object_link : this.object_link,
    });
  };
})(fabric.Image.prototype.toObject);

/*****adding custom attributes to Text object*****/
fabric.Text.prototype.toObject = (function (toObject) {
  return function () {
		return fabric.util.object.extend(toObject.call(this), {
			id : this.id,
			name : this.name,
			page: this.page,
			activeflag : this.activeflag,
      object_link : this.object_link,
    });
  };
})(fabric.Text.prototype.toObject);

/*****adding custom attributes to Line object*****/
fabric.Line.prototype.toObject = (function (toObject) {
  return function () {
		return fabric.util.object.extend(toObject.call(this), {
			id : this.id,
			name : this.name,
			page: this.page,
			ignoreZoom : this.ignoreZoom,
      object_link : this.object_link,
    });
  };
})(fabric.Line.prototype.toObject);/*****adding custom attributes to Line object*****

/**
 * textbox render for border on layer mouse over
 */
var originalRender = fabric.Textbox.prototype._render;
fabric.Textbox.prototype._render = function(ctx) {
  originalRender.call(this, ctx);
  //Don't draw border if it is active(selected/ editing mode)
  if (this.active) return;
  if(this.showTextBoxBorder){
    var w = this.width,
      h = this.height,
      x = -this.width / 2,
      y = -this.height / 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.closePath();
    var stroke = ctx.strokeStyle;
    ctx.strokeStyle = this.textboxBorderColor;
    ctx.stroke();
    ctx.strokeStyle = stroke;
  }
}
fabric.Textbox.prototype.cacheProperties = fabric.Textbox.prototype.cacheProperties.concat('active');
/**
 * prototype function after press backspace
 * this function will delete token from
 * textbox object.
 **/
//fabric.Textbox.prototype.onBackspacePressed = function(e) {
document.addEventListener("keyup", function(event) {
  if (event.key === "Backspace") {
    var obj = canvas.getActiveObject();
    if(obj){
      if(obj.type === 'textbox'){
        var updated = false;
        var old_text = obj.old_text;
        var data_arr = old_text.split('\n');
        var obj_text = obj.text;
        var text_arr = obj_text.split('\n');
        $.each(data_arr, function(data_key, data_val) {
          var data = data_val.split(" ");
          var actual_text = text_arr[data_key].split(" ");
          var style_start = 0;
          var style_end = 0;
          var total_diff = 0;
          for (var a = 0; a < data.length; a++) {
            if (actual_text[a] != data[a]) {
              style_end = style_start + actual_text[a].length;
              var str_arr = actual_text[a].split('');
              if(str_arr[0] == '#'){
                total_diff = data[a].length;
                actual_text.splice(a, 1);
                updated = true;
                break;
              }
            }
            else {
              style_start = style_start + (actual_text[a].length + 1)
            }
          }
          if(updated){
            var styles = obj.styles;
            for(var x = style_start; x < style_end; x++){
              if(typeof styles[data_key][x]['fill'] !== 'undefined'){
                delete styles[data_key][x]['fill'];
              }
              if(typeof styles[data_key][x]['textBackgroundColor'] !== 'undefined') {
                delete styles[data_key][x]['textBackgroundColor'];
              }
            }
            var new_style = {};
            //console.log(JSON.stringify(styles));
            $.each(styles, function(key1, val1) {
              new_style[key1] = {};
              if(key1 == data_key){
                $.each(val1, function(key2, val2) {
                  //console.log("key2 = "+key2+" - style_start = "+style_start);
                  if(key2 > style_start){
                    var ind_diff = parseInt(key2 - total_diff);
                    //console.log("ind_diff = "+ind_diff);
                    new_style[key1][ind_diff] = {};
                    new_style[key1][ind_diff] = val2;
                  }
                  else {
                    new_style[key1][key2] = {};
                    new_style[key1][key2] = val2;
                  }
                });
              }
              else {
                new_style[key1] = val1;
              }
            });
            //console.log(JSON.stringify(new_style));
            text_arr[data_key] = actual_text.join(" ");
            var updated_text = text_arr.join("\n");
            obj.selectionStart = style_start;
            obj.selectionEnd = style_start;
            obj.set({
              text: updated_text,
              old_text: updated_text,
              styles: new_style,
            });
            canvas.renderAll();
            canvas.discardActiveObject();
            canvas.setActiveObject(obj);
            //console.log(JSON.stringify(obj));
          }
        });
      }
    }
  }
});
//};

/**
 * Image render for border on layer mouse over
 */
var ImageoriginalRender = fabric.Image.prototype._render;
fabric.Image.prototype._render = function(ctx) {
  ImageoriginalRender.call(this, ctx);
  //Don't draw border if it is active(selected mode)
  if (this.active) return;
  if(this.showImageBorder){
    var w = this.width,
      h = this.height,
      x = -this.width / 2,
      y = -this.height / 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.closePath();
    var stroke = ctx.strokeStyle;
    ctx.strokeStyle = this.textboxBorderColor; //make the border color same as textbox object has
    ctx.stroke();
    ctx.strokeStyle = stroke;
  }
}
fabric.Image.prototype.cacheProperties = fabric.Image.prototype.cacheProperties.concat('active');

/**
 * Image render for border on layer mouse over
 */
var activeSelectionRender = fabric.ActiveSelection.prototype._render;
fabric.ActiveSelection.prototype._render = function(ctx) { 
  activeSelectionRender.call(this, ctx);
  //Don't draw border if it is active(selected mode)
  //if (this.active) return;
  if(this.showactiveSelectionBorder == true){
    var w = this.width,
      h = this.height,
      x = -this.width / 2,
      y = -this.height / 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.closePath();
    var stroke = ctx.strokeStyle;
    ctx.strokeStyle = this.borderColor; //make the border color same as textbox object has
    ctx.stroke();
    ctx.strokeStyle = stroke;
  }
}

/*****Start create custom fabric class object "Page"*****/
fabric.Page = fabric.util.createClass(fabric.Rect, {
	type: 'Page',
	selectable: false,
	hasControls: false,
	hasRotatingPoint: false,
	hasRotatingPoint: false,
  lockRotation: true,
	initialize: function(points, options) {
		options || (options = { });
		this.callSuper('initialize', points, options);
	},
	toObject: function() {
		return fabric.util.object.extend(this.callSuper('toObject'), {
			id : this.id,
			name : this.name,
			order : this.order,
			actualLeft : this.actualLeft,
			actualTop : this.actualTop,
			pagegroupLeft : this.pagegroupLeft,
			pagegroupTop : this.pagegroupTop,
			pageMeasurement : this.pageMeasurement,
      pageRuler : this.pageRuler,      
      pageGuideLines : this.pageGuideLines,
      fabricDPI : this.fabricDPI,
      tl: this.aCoords.tl,
      object_link : this.object_link,
		});
	},
	_render: function(ctx) {
		this.callSuper('_render', ctx);
	}
});
fabric.Page.fromObject = function(object, callback) {
	callback && callback(new fabric.Page(object));
};

/*****Start create custom fabric class object "Guideline"*****/
var guidesCnt = 0;
fabric.Guideline = fabric.util.createClass(fabric.Line, {
	type: 'Guideline',
	initialize: function (x1, y1, x2, y2, options) {
    options = options || {};
    this.id = options.id || 'guideline-' + guidesCnt++;
    this.callSuper('initialize', [x1, y1, x2, y2], fabric.util.object.extend({
    	stroke: 'green', //#00f
      originX: "center",
      originY: "center",
      selectable: false,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      hasBorders: false,
      hasControls: false,
      perPixelTargetFind: true,
      borderColor: 'transparent',
      hasRotatingPoint: false,
      ignoreZoom: true,
      object_link : this.object_link,
    }, options));
  }
});
fabric.Guideline.fromObject = function(object) {
	return new fabric.Guideline(object.x1, object.y1, object.x2, object.y2, object);
};

/**
 * Page render for border on page mouse over
 */
var PageoriginalRender = fabric.Page.prototype._render;
fabric.Page.prototype._render = function(ctx) {
  PageoriginalRender.call(this, ctx);
  //Don't draw border if it is active(selected mode)
  //if (this.active) return;
  if(this.showPageBorder){
    var w = this.width,
      h = this.height,
      x = -this.width / 2,
      y = -this.height / 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.closePath();
    var stroke = ctx.strokeStyle;
    ctx.strokeStyle = this.PageBorderColor; //make the border color same as textbox object has
    ctx.stroke();
    ctx.strokeStyle = stroke;
  }
}
fabric.Page.prototype.cacheProperties = fabric.Page.prototype.cacheProperties.concat('active');

/****************End custom fabric class object "Page"************/

/*****Start create custom fabric class object "ImageContainer"*****/
fabric.ImageContainer = fabric.util.createClass(fabric.Rect, {
	type: 'ImageContainer',
	id : this.id,
	name : this.name,
	selectable: true,
	hasControls: true,
	hasRotatingPoint: true,
	initialize: function(points, options) {
		options || (options = { });
		this.callSuper('initialize', points, options);
	},
	toObject: function() {
		return fabric.util.object.extend(this.callSuper('toObject'), {
			id : this.id,
			name : this.name,
			page : this.page,
			layerGroup : this.layerGroup,
			layerGroupTitle: this.layerGroupTitle,
			actualTop: this.actualTop,
      pageRuler: this.pageRuler,
			actualLeft: this.actualLeft,
			objectGroup : this.objectGroup,
			layerIndexing : this.layerIndexing,
			parentlayerOrder : this.parentlayerOrder,
			hide_container : this.hide_container,
			containerImage : this.containerImage,
      object_link : this.object_link,
		});
	},
	_render: function(ctx) {
		this.callSuper('_render', ctx);
	}
});
fabric.ImageContainer.fromObject = function(object, callback) {
	callback && callback(new fabric.ImageContainer(object));
};
/**
 * PageMediaBox for PDF output
 **/
fabric.PageMediaBox = fabric.util.createClass(fabric.Rect, {
	type: 'PageMediaBox',
	selectable: false,
	hasControls: false,
	hasRotatingPoint: false,
  lockRotation: true,
	initialize: function(points, options) {
		options || (options = { });
		this.callSuper('initialize', points, options);
	},
	toObject: function() {
		return fabric.util.object.extend(this.callSuper('toObject'), {
			id : this.id,
			name : this.name,
      page : this.page,
      lock_position : this.lock_position,
      hide_data : this.hide_data,
		});
	},
	_render: function(ctx) {
		this.callSuper('_render', ctx);
	}
});
fabric.PageMediaBox.fromObject = function(object, callback) {
	callback && callback(new fabric.PageMediaBox(object));
};
/**
 * PageTrimBox for page trimbox line
 **/
fabric.PageTrimBox = fabric.util.createClass(fabric.Line, {
	type: 'PageTrimBox',
	initialize: function(element, options) {
    options || (options = {});
    //this.callSuper('initialize', element, options);
		this.callSuper('initialize', element, fabric.util.object.extend({
      stroke: '#ff99ff',
			strokeWidth: 1,
			fill: '#ff99ff',
			originX: 'center',
			originY: 'center',
			lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
			hasBorders: false,
			hasControls: false,
			objectCaching: false,
			perPixelTargetFind: true,
			ControlsVisibility: {
				mt: false, 
				mb: false, 
				ml: false, 
				mr: false, 
				bl: false,
				br: false, 
				tl: false, 
				tr: false,
				mtr: false, 
			}
    }, options));
  },
	toObject: function() {
		return fabric.util.object.extend(this.callSuper('toObject'), {
			id : this.id,
			name : this.name,
			page : this.page,
			lock_position : this.lock_position,
			hide_data : this.hide_data,
		});
	},
	_render: function(ctx) {
		this.callSuper('_render', ctx);
	},
});
fabric.PageTrimBox.fromObject = function(object, callback) {
  callback && callback(new fabric.PageTrimBox([object.x1, object.y1, object.x2, object.y2], object));
};
fabric.PageTrimBox.async = true;

/**
 * ImageContainer render for border on ImageContainer mouse over
 */
var ImageContaineroriginalRender = fabric.ImageContainer.prototype._render;
fabric.ImageContainer.prototype._render = function(ctx) {
  ImageContaineroriginalRender.call(this, ctx);
  //Don't draw border if it is active(selected mode)
  //if (this.active) return;
  if(this.showImageBorder){
    var w = this.width,
      h = this.height,
      x = -this.width / 2,
      y = -this.height / 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.closePath();
    var stroke = ctx.strokeStyle;
    ctx.strokeStyle = this.textboxBorderColor; //make the border color same as textbox object has
    ctx.stroke();
    ctx.strokeStyle = stroke;
  }
}
fabric.ImageContainer.prototype.cacheProperties = fabric.ImageContainer.prototype.cacheProperties.concat('active');

/****************End custom fabric class object "ImageContainer"************/

/****************Start add Rectangle for pages in left side bar************/
function add_rectangle(page_id, page_name, pwidth, pheight, order, layout = null) {
  //console.log("pwidth = "+pwidth+", pheight = "+pheight);
  /*if(cunit == 'in'){
    pageUnit = 'px';
    pwidth =  parseInt(pwidth*72);
    pageWidth = pwidth;
    pheight = parseInt(pheight*72);
    pageHeight = pheight;
  }*/
  leftmargin = parseInt(((visiblewidth - 560 )/2)-(pwidth/2)); // using in ruler guides
  topmargin = parseInt(visibleheight-(pheight/2)); // using in ruler guides
	pageGroup = new fabric.Page({
		left: parseInt((visiblewidth - 560 )/2),
		top: parseInt(visibleheight),
    width: parseInt(pwidth),
    height: parseInt(pheight),
		id: page_id,
		name: page_name,
		actualWidth: parseInt(pwidth),
		actualHeight: parseInt(pheight),
		actualLeft: parseInt((visiblewidth - 560 )/2),
		actualTop: parseInt(visibleheight),
		pagegroupTop: parseInt(visibleheight),
		pagegroupLeft: parseInt((visiblewidth - 560 )/2),
		type: 'page',
    fill: '#fff',
		visibility: true,
		opacity: 1,
		hoverCursor: "default",
		originX: 'center',
		originY: 'center',
		active: true,
		order: order,
		pageMeasurement: cunit,
		/*shadow: {
			color: '#595e61',  //'#dcdcdc', //E1E1E1
			blur: 1,
			offsetX: 0,
			offsetY: 1
		}*/
  });
	//canvas.centerObject(pageGroup);
	canvas.add(pageGroup);
	//pageGroup.setShadow("1px 2px 1px rgba(94, 128, 191, 0.5)");
	//pageGroup.setShadow("1px 1px 2px rgba(155,160,163,0.7)");
  var layoutOpacity = 1;
  if(layout != null){
    if(parseInt(order) != 1){
      layoutOpacity = 0;
    }
    var img = new Image();
    img.onload = function () {
      var img_ = new fabric.Image(img, {
        left: parseInt((visiblewidth - 560 )/2 - 2),
        top: parseInt(visibleheight - 2.5),
        width: parseInt(parseInt(pwidth) + 18),
        height: parseInt(parseInt(pheight) + 18),
        selectable: false,
        hasControls: false,
        hasBorders: false,
        visibility: true,
        opacity: layoutOpacity,
        id: "layout-"+order,
        name: "Layout "+order,
        originX: 'center',
        originY: 'center',
        active: true,
        lock_position: 1,
        hide_data: 0,
        objectGroup: false,
        page: page_id,
      });
      canvas.add(img_);
      img_.bringToFront();
    };
    img.src = layout;
  //console.log("22 >> pwidth = "+parseInt(parseInt(pwidth) + 18)+", pheight = "+parseInt(parseInt(pheight) + 18));
  }
	canvas.renderAll();
	/* pageGroup.setShadow({
    color: '#dcdcdc',
    blur: 1,
    offsetX: 1,
    offsetY: 1
	}); */
  //console.log(JSON.stringify(pageGroup));
  //call ruler function to adjust the ruler
  if(visibleheight && visiblewidth && pwidth && pheight && !rulerApplied){
    leftRuler.relativePan({x: 0, y: parseInt(visibleheight-(pheight/2))});
    topRuler.relativePan({x: parseInt(((visiblewidth - 560 )/2)-(pwidth/2)), y: 0});
    rulerApplied = true;
  }
	canvas.renderAll();
  if(typeof(activePage) == "undefined" || activePage == null) {
    activePage = page_id;
    newpage = 1;
  }
  //Add crop area
  //addPageMediaBox(page_id);
  addrulernew(ixx, iyy);
  //console.log('12');
	updateCanvasState();
}
/**
 * Callback function addPageMediaBox()
 * to add bleed area with page.
 **/
function addPageMediaBox(){
  var pages = canvas.getItemsByType('page', true);
  pages.forEach(function(pageObj) {
    var pageID = pageObj.id;
    var pageMediaBoxObj = canvas.getItemById(pageID+'MediaBox');
    if(!pageMediaBoxObj){
      var pageMediaBox = new fabric.PageMediaBox({
        left: (pageObj.left),
        top: (pageObj.top),
        width: (pageObj.width+56),
        height: (pageObj.height+56),
        id: pageID+'MediaBox',
        page: pageID,
        name: 'Page MediaBox',
        fill: '#fff',
        selectable: false,
        hasControls: false,
        hasBorders: false,
        visibility: true,
        opacity: 1,
        originX: 'center',
        originY: 'center',
        active: true,
        lock_position: 1,
        hide_data: 0,
      });
      canvas.add(pageMediaBox);
      canvas.renderAll();
      canvas.sendToBack(pageMediaBox);
      _drawPageTrimBox(pageID);
    }
    else {
      var trimBoxes = canvas.getItemById(pageID+'-trimboxtop');
      if(!trimBoxes){
        _drawPageTrimBox(pageID);
      }
      else {
        var cropMarks = canvas.getItemById(pageID+'-cropMarksTT');;
        if(!cropMarks){
          _drawCropMarks(pageID);
        }
      }
      var activePageID = $('.page-row.g-active').attr('id');
      var page_format = jQuery("#kmds-format").val();
      var pageMedia = canvas.getItemsByType('PageMediaBox', true);
      pageMedia.forEach(function(pm) {
        if(page_format == 'pdf' && pm.page == activePageID){
          pm.set('opacity', 1);
          pm.set('visibility', true);
          canvas.renderAll();
          canvas.sendToBack(pm);
        }
        else {
          pm.set('opacity', 0);
          pm.set('visibility', false);
          canvas.sendToBack(pm);
          canvas.renderAll();
        }
      });
      var pageTrim = canvas.getItemsByType('PageTrimBox', true);
      pageTrim.forEach(function(pt) {
        if(page_format == 'pdf' && pt.page == activePageID){
          pt.set('opacity', 1);
          pt.set('visibility', true);
          canvas.renderAll();
        }
        else {
          pt.set('opacity', 0);
          pt.set('visibility', false);
          canvas.renderAll();
        }
      });
    }
  });
}
/****************End add Page in left side bar************/
function addrulernew(ix = 0, iy = 0){
  var xwidth = 0;
  var yheight = 0;
  if (newpage == 0 && typeof(activePage) != "undefined" && activePage !== null) {
    var active_page_object = canvas.getItemsByPage(activePage)[0];
    try {
      xwidth = active_page_object.left - (active_page_object.width/2);
      yheight = active_page_object.top - (active_page_object.height/2);
    } catch(err) {
      //todo recoursive function
      //addrulernew(0, 0);
    }
  }
  var zoomLevel = canvas.getZoom();
  //topRuler = new fabric.Canvas('kmds-top-ruler');
  //leftRuler = new fabric.Canvas('kmds-left-ruler');
  //var type = 'px'; //disable for MVP jQuery('#measurements').val();
  var type = jQuery('#measurements').val(); //Enabled at 17-02-2021 task #6137
  var rulerIncrement = 10;
  var maxWidth = 1300;
  var maxHeight = 1700;
  var RuleLine = 50;
  if(type == 'in'){
    var rulerIncrement = 8/zoomLevel;
    var maxWidth = 1440;
    var maxHeight = 720;
  }
  var xz = zoomLevel;
 var div = 1;
  switch(true) {
    case (zoomLevel < 1):
      div = 1;
      xz = 1;
      RuleLine = 50/zoomLevel;
      if(type == 'in'){
        RuleLine = 72/zoomLevel;
      }
    break;
    case (zoomLevel == 1):
      div = 2;
      RuleLine = 50/zoomLevel;
      if(type == 'in'){
        RuleLine = 72/zoomLevel;
      }
    break;
    case (zoomLevel <= 1.5):
      div = 2;
      RuleLine = 30;
      xz = 1;
      if(type == 'in'){
        RuleLine = 52;
      }
    break;
    case (zoomLevel <= 2):
      div = 4;
      RuleLine = 30;
      if(type == 'in'){
        RuleLine = 52;
      }
    break;
    case (zoomLevel <= 2.5):
      div = 4;
      RuleLine = 20;
      xz = 3;
      if(type == 'in'){
        RuleLine = 42;
      }
    break;
    case (zoomLevel <= 3):
      div = 5;
      RuleLine = 20;
      if(type == 'in'){
        RuleLine = 42;
      }
    break;
    case (zoomLevel <= 4):
      div = 5;
      RuleLine = 10;
      if(type == 'in'){
        RuleLine = 32;
      }
    break;
    case (zoomLevel <= 8):
      div = 10;
      RuleLine = 5;
      if(type == 'in'){
        RuleLine = 22;
      }
    break;
    case (zoomLevel <= 16):
      div = 20;
      RuleLine = 2.5;
      if(type == 'in'){
        RuleLine = 12;
      }
    break;
    default:
       div = 4;
       RuleLine = 50;
       xz = 1;
    break;
  }
  //pageZoomHeight = (zoomLevel < 1) ? (1/(zoomLevel*2)) : zoomLevel;
  var pageZoomHeight = (zoomLevel < 1) ? 1.5 : zoomLevel;
  zoomm = zoomLevel;
  ix = ((ix > 0 ) ? Math.ceil(ix/100) * 100 :  Math.ceil(ix/100)  * 100 ) - (maxWidth * zoomm); 
  iy = ((iy > 0 ) ? Math.ceil(iy/100) * 100 :  Math.ceil(iy/100)  * 100 ) - (maxHeight  * zoomm);
  topRuler.clear();
  leftRuler.clear();
  topRuler.setBackgroundColor('#fff');
  leftRuler.setBackgroundColor('#fff');
  // var ix = -100;
  // var iy = -100;
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  xc = canvasWidth + ix + (maxWidth * pageZoomHeight);
  //xc = canvasWidth + ix + (maxWidth * zoomLevel);
  //console.log('XC = '+xc);
  ix = Math.round(ix);
  iy = Math.round(iy);
  //console.log('ixiiii======='+ix);
  var rzo = Math.round(100*zoomLevel);
  //Math.round((RuleLine * zoomm));
  var rz = (rzo/10);
  // ix = ix + (ix % (rz));
   //console.log('ix====+move+========'+ix);
  //ix = Math.round(ix);
  //  ix = -1550;
  for (ix; ix < 6000 ; ix += rz/xz) {
   ds = ix.toFixed(1);
   //console.log('ix============'+ix);
    var x = (ds%rzo == 0) ? 10 : 15;
    var topLine = new fabric.Line([ix+xwidth, x, ix+xwidth, 20], {
      stroke: 'black',
      strokeWidth: 1,
      selectable: false
    });
    topRuler.add(topLine);
    var xy = (ds%(rzo/div) == 0) ? 10 : 15;
    // console.log('ix============'+ds+'---x============'+x+'---rz============'+rz+'---rzo====='+rzo);
    //  console.log('--------'+xwidth+'--------');
    var topLine = new fabric.Line([ix+xwidth, xy, ix+xwidth, 15], {
      stroke: 'black',
      strokeWidth: 1,
      selectable: false
    });
    topRuler.add(topLine);
    if(ds%rzo == 0){
      //  console.log('dssssss============'+ds);
      if(type == 'in'){
        text_num = (ds / (RuleLine * zoomLevel)).toFixed(2);
        text_num = parseFloat(text_num);
      }
      else {
        text_num = Math.round(ds/zoomLevel);
      }
      // console.log('text_num============'+text_num);
      var text = new fabric.Text(text_num.toString(),       {
        left: ix+xwidth,
        top: 0,
        fontSize: 10,
        selectable: false
      });
      topRuler.add(text);
    }
    if(ds%(rzo/div) == 0){
      if(type == 'in'){
        text_num = (ds / (RuleLine * zoomLevel)).toFixed(2);
        text_num = parseFloat(text_num);
      }
      else {
        text_num = Math.round(ds/zoomLevel);
      }
      var text = new fabric.Text(text_num.toString(),       {
        left: ix+xwidth,
        top: 0,
        fontSize: 10,
        selectable: false
      });
      topRuler.add(text);
    }
  }
  //100 added to increased thea left ruler to 500
  //yc = canvasHeight + iy + (1300 * zoomm) + 100;
  var pageID = $(".page-row.g-active").attr("id");
  var obj = canvas.getItemsByPage(pageID);
  var pageHeight = (obj.length !== 0) ? canvasHeight : 0;
  //yc = (pageHeight > 505) ? parseInt((pageHeight + 10)*zoomLevel) : (505*zoomLevel);
  yc = (pageHeight > 505) ? parseInt((pageHeight + 10)*pageZoomHeight) : (505*pageZoomHeight);
  for (iy; iy < 6000; iy += rz/xz) {
    ds = iy.toFixed(1);
    var y = (ds%rzo == 0)?10:5;
    var leftLine = new fabric.Line([xy, iy+yheight, 0, iy+yheight], {
      stroke: 'black',
      strokeWidth: 1,
      selectable: false
    });
    var xy = (ds%(rzo/div) == 0) ? 10 : 15;
    var leftLine = new fabric.Line([y, iy+yheight, 0, iy+yheight], {
      stroke: 'black',
      strokeWidth: 1,
      selectable: false
    });
    leftRuler.add(leftLine);
    if((ds%rzo) == 0){
      //var text_num = (type == 'in') ? (iy / (RuleLine * zoomm)) : iy;
      //var text_num = (type == 'in') ? Math.round(iy / (RuleLine * zoomLevel)) : Math.round(iy / zoomLevel);
      if(type == 'in'){
        text_num = (ds / (RuleLine * zoomLevel)).toFixed(2);
        text_num = parseFloat(text_num);
      }
      else {
        text_num = Math.round(iy / zoomLevel)
      }
      var text2 = new fabric.Text(text_num.toString(), {
        left: 20,
        top: iy+yheight,
        fontSize: 10,
        angle: 90,
        selectable: false
      });
      leftRuler.add(text2);
    }
    if((ds%(rzo/div)) == 0){
      //var text_num = (type == 'in') ? (iy / (RuleLine * zoomm)) : iy;
      //var text_num = (type == 'in') ? Math.round(iy / (RuleLine * zoomLevel)) : Math.round(iy / zoomLevel);
      if(type == 'in'){
        text_num = (ds / (RuleLine * zoomLevel)).toFixed(2);
        text_num = parseFloat(text_num);
      }
      else {
        text_num = Math.round(iy / zoomLevel)
      }
      var text2 = new fabric.Text(text_num.toString(), {
        left: 20,
        top: iy+yheight,
        fontSize: 10,
        angle: 90,
        selectable: false
      });
      leftRuler.add(text2);
    }
  }
}  



/*function addrulernew(ix = 0, iy = 0){
  console.log('addcall');
  var xwidth = 0;
  var yheight = 0;
  if (newpage == 0 && typeof(activePage) != "undefined" && activePage !== null) {
    console.log(activePage);
    console.log("test");
    var active_page_object = canvas.getItemsByPage(activePage)[0];
    xwidth = active_page_object.left - (active_page_object.width/2);
    yheight = active_page_object.top - (active_page_object.height/2);
  }
  var zoomLevel = canvas.getZoom();
  //topRuler = new fabric.Canvas('kmds-top-ruler');
  //leftRuler = new fabric.Canvas('kmds-left-ruler');
  var type = 'px'; //disable for MVP jQuery('#measurements').val();
  var rulerIncrement = 5/zoomLevel;
  var maxWidth = 1300;
  var maxHeight = 1700;
  var RuleLine = 50;
  if(type == 'in'){
    var rulerIncrement = 8/zoomLevel;
    var maxWidth = 1440;
    var maxHeight = 720;
  }
  switch(zoomLevel) {
    case .25:
      RuleLine = 50/zoomLevel;
      if(type == 'in'){
        RuleLine = 72/zoomLevel;
      }
    break;
    case .50:
      var RuleLine = 50/zoomLevel;
      if(type == 'in'){
        RuleLine = 72/zoomLevel;
      }
    break;
    case .66:
      var RuleLine = 50/zoomLevel;
      if(type == 'in'){
        RuleLine = 72/zoomLevel;
      }
    break;
    case .75:
      var RuleLine = 50/zoomLevel;
      if(type == 'in'){
        RuleLine = 72/zoomLevel;
      }
    break;
    case 1:
      var RuleLine = 50/zoomLevel;
      if(type == 'in'){
        RuleLine = 72/zoomLevel;
      }
    break;
    case 1.5:
      var RuleLine = 30;
      if(type == 'in'){
        RuleLine = 52;
      }
    break;
    case 2:
      var RuleLine = 30;
      if(type == 'in'){
        RuleLine = 52;
      }
    break;
    case 2.5:
      var RuleLine = 20;
      if(type == 'in'){
        RuleLine = 42;
      }
    break;
    case 3:
      var RuleLine = 20;
      if(type == 'in'){
        RuleLine = 42;
      }
    break;
    case 4:
      var RuleLine = 10;
      if(type == 'in'){
        RuleLine = 32;
      }
    break;
    case 8:
      var RuleLine = 5;
      if(type == 'in'){
        RuleLine = 22;
      }
    break;
    case 16:
      var RuleLine = 2.5;
      if(type == 'in'){
        RuleLine = 12;
      }
    break;
  }
  //pageZoomHeight = (zoomLevel < 1) ? (1/(zoomLevel*2)) : zoomLevel;
  var pageZoomHeight = (zoomLevel < 1) ? 1.5 : zoomLevel;
  zoomm = zoomLevel;
  ix = ((ix > 0 ) ? Math.ceil(ix/100) * 100 :  Math.ceil(ix/100)  * 100 ) - (maxWidth * zoomm); 
  iy = ((iy > 0 ) ? Math.ceil(iy/100) * 100 :  Math.ceil(iy/100)  * 100 ) - (maxHeight  * zoomm);
  //console.log(ix +'========'+ iy);
  topRuler.clear();
  leftRuler.clear();
  topRuler.setBackgroundColor('#fff');
  leftRuler.setBackgroundColor('#fff');
 //  var ix = -100;
  // var iy = -100;
  
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  xc = canvasWidth + ix + (maxWidth * pageZoomHeight);
  //xc = canvasWidth + ix + (maxWidth * zoomLevel);
  //console.log('ix== '+ ix + ' zoomLevel= '+ zoomLevel + ' xc == ' + xc);
  //console.log('XC = '+xc);
  for (ix; ix < 6000 ; ix += (rulerIncrement * zoomm)) {
   //console.log('ix============'+ix);
    var x = (ix%(RuleLine * zoomm) == 0) ? 10 : 15;
  //  console.log(x);
    var topLine = new fabric.Line([ix+xwidth, x, ix+xwidth, 20], {
      stroke: 'black',
      strokeWidth: 1,
      selectable: false
    });
    topRuler.add(topLine);
    if(ix%(RuleLine * zoomm) == 0){
      if(type == 'in'){
        text_num = (ix / (RuleLine * zoomLevel)).toFixed(2);
        text_num = parseFloat(text_num);
      }
      else {
        text_num = Math.round(ix / zoomLevel)
      }
      //console.log('ix============'+ix);
      var text = new fabric.Text(text_num.toString(), {
        left: ix+xwidth,
        top: 0,
        fontSize: 10,
        selectable: false
      });
      topRuler.add(text);
    }
  }
  //100 added to increased the left ruler to 500
  //yc = canvasHeight + iy + (1300 * zoomm) + 100;
  var pageID = $(".page-row.g-active").attr("id");
  var obj = canvas.getItemsByPage(pageID);
  var pageHeight = (obj.length !== 0) ? canvasHeight : 0;
  //yc = (pageHeight > 505) ? parseInt((pageHeight + 10)*zoomLevel) : (505*zoomLevel);
  yc = (pageHeight > 505) ? parseInt((pageHeight + 10)*pageZoomHeight) : (505*pageZoomHeight);
  for (iy; iy < 6000; iy += (rulerIncrement * zoomm)) {
    var y = (iy%(RuleLine * zoomm) == 0)?10:5;
    var leftLine = new fabric.Line([y, iy+yheight, 0, iy+yheight], {
      stroke: 'black',
      strokeWidth: 1,
      selectable: false
    });
    leftRuler.add(leftLine);
    if(iy%(RuleLine * zoomm) == 0){
      //var text_num = (type == 'in') ? (iy / (RuleLine * zoomm)) : iy;
      //var text_num = (type == 'in') ? Math.round(iy / (RuleLine * zoomLevel)) : Math.round(iy / zoomLevel);
      if(type == 'in'){
        text_num = (iy / (RuleLine * zoomLevel)).toFixed(2);
        text_num = parseFloat(text_num);
      }
      else {
        text_num = Math.round(iy / zoomLevel)
      }
      var text2 = new fabric.Text(text_num.toString(), {
        left: 20,
        top: iy+yheight,
        fontSize: 10,
        angle: 90,
        selectable: false
      });
      leftRuler.add(text2);
    }
  }
}*/

// new ruler logic -- Masoom
/*function addrulernew(ix = 0, iy = 0){
  topRuler.clear();
  leftRuler.clear();
  topRuler.setBackgroundColor('#fff');
  leftRuler.setBackgroundColor('#fff');
  
  var zoomLevel = canvas.getZoom();
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  var type = $('#measurements').val();
  var maxWidth = 2*1300;
  var maxHeight = 2*700;
  if(type == 'in'){
    var maxWidth = 2*1440;
    var maxHeight = 2*720;
  }
  var rulerdata = getZoomIncrement(zoomLevel, type);
  var tick = rulerdata.tick;
  var increment = rulerdata.increment;
  
  var pageZoomHeight = (zoomLevel < 1) ? 1.5 : zoomLevel;
  ix = ((ix > 0 ) ? Math.ceil(ix/tick) * tick :  Math.ceil((ix - maxWidth)/tick* tick)); 
  iy = ((iy > 0 ) ? Math.ceil(iy/tick) * tick :  Math.ceil((iy - maxHeight)/tick*tick));
  
  // top ruler
  var xc = canvasWidth + ix + (maxWidth * pageZoomHeight);
  for (ix; ix < xc ; ix += tick) {
    var x = (ix%(10*tick) == 0) ? 10 : 15;
    var topLine = new fabric.Line([ix, x, ix, 20], {
      stroke: 'black',
      strokeWidth: 1,
      selectable: false
    });
    topRuler.add(topLine);
    if(ix%(10*tick) == 0){
      if(type == 'in') {
        var text_num = ((ix/(10*tick))*increment).toFixed(3);
        text_num = parseFloat(text_num);
      } else {
        var text_num = (ix/(10*tick))*increment;
      }
      var text = new fabric.Text(text_num.toString(), {
        left: ix,
        top: 0,
        fontSize: 10,
        selectable: false
      });
      topRuler.add(text);
    }
  }
  
  // left ruler
  var pageID = $(".page-row.g-active").attr("id");
  var obj = canvas.getItemsByPage(pageID);
  var pageHeight = (obj.length !== 0) ? canvasHeight : 0;
  var yc = (pageHeight > 505) ? parseInt((pageHeight + 10)*pageZoomHeight) : (505*pageZoomHeight);
  
  for (iy; iy < yc; iy += tick) {
    var y = (iy%(10*tick) == 0) ? 10 : 5;
    var leftLine = new fabric.Line([y, iy, 0, iy], {
      stroke: 'black',
      strokeWidth: 1,
      selectable: false
    });
    leftRuler.add(leftLine);
    if(iy%(10*tick) == 0){
      if(type == 'in') {
        var text_num = ((iy/(10*tick))*increment).toFixed(3);
        text_num = parseFloat(text_num);
      } else {
        var text_num = (iy/(10*tick))*increment;
      }
      var text2 = new fabric.Text(text_num.toString(), {
        left: 20,
        top: iy,
        fontSize: 10,
        angle: 90,
        selectable: false
      });
      leftRuler.add(text2);
    }
  }
}*/

function getZoomIncrement(zoomLevel, unit) {
  var tick, increment;
  // var activePageID = $('.page-row.g-active').attr('id');
  // active_page_object = canvas.getItemsByPage(activePageID)[0];
  // var oldCoordinates = active_page_object.getBoundingRect();
  switch (zoomLevel) {
    case 0.06:
      if(unit == 'in'){
        tick = 8;
        increment = 10;
      }else{
        tick = 5;
        increment = 830; 
      }
    break;
    
    case 0.12:
      if(unit == 'in'){
        tick = 8;
        increment = 10;
      }else{
        tick = 5;
        increment = 420; 
      }
    break;
    
    case 0.25:
      if(unit == 'in'){
        tick = 8;
        increment = 5;
      }else{
        tick = 5;
        increment = 200; 
      }
    break;
    
    case 0.50:
      if(unit == 'in'){
        tick = 8;
        increment = 1;
      }else{
        tick = 5;
        increment = 100; 
      }
    break;
    
    case 0.66:
      if(unit == 'in'){
        tick = 8;
        increment = 1;
      }else{
        tick = 5;
        increment = 80; 
        // canvas.zoomToPoint(new fabric.Point(active_page_object.left, active_page_object.top), .61);
      }
    break;
    
    case 1:
      if(unit == 'in'){
        tick = 8;
        increment = 1;
      }else{
        tick = 5;
        increment = 50; 
      }
    break;
    
    case 1.5:
      if(unit == 'in'){
        tick = 8;
        increment = 0.5;
      }else{
        tick = 5;
        increment = 30; 
        // canvas.zoomToPoint(new fabric.Point(oldCoordinates.left, active_page_object.top), 1.65);
      }
    break;
    
    case 2:
      if(unit == 'in'){
        tick = 8;
        increment = 0.5;
      }else{
        tick = 4;
        increment = 30; 
        // canvas.zoomToPoint(new fabric.Point(oldCoordinates.left, active_page_object.top), 1.35);
      }
    break;
    
    case 3:
      if(unit == 'in'){
        tick = 8;
        increment = 0.2;
      }else{
        tick = 5;
        increment = 20; 
      }
    break;
    
    case 4:
      if(unit == 'in'){
        tick = 8;
        increment = 0.2;
      }else{
        tick = 5;
        increment = 10; 
      }
    break;
    
    case 8:
      if(unit == 'in'){
        tick = 8;
        increment = 0.1;
      }else{
        tick = 5;
        increment = 10; 
      }
    break;
    
    case 16:
      if(unit == 'in'){
        tick = 8;
        increment = 0.05;
      }else{
        tick = 5;
        increment = 5; 
      }
    break;
    
    case 32:
      if(unit == 'in'){
        tick = 8;
        increment = 0.02;
      }else{
        tick = 5;
        increment = 2; 
      }
    break;
    
    case 64:
      if(unit == 'in'){
        tick = 8;
        increment = 0.01;
      }else{
        tick = 5;
        increment = 1; 
      }
    break;
    
    case 128:
      if(unit == 'in'){
        tick = 8;
        increment = 0.01;
      }else{
        tick = 5;
        increment = 1; 
      }
    break;
    
    case 256:
      if(unit == 'in'){
        tick = 8;
        increment = 0.005;
      }else{
        tick = 5;
        increment = 1; 
      }
    break;
    
    default:
      if(unit == 'in'){
        tick = 8;
        increment = 1;
      }else{
        tick = 5;
        increment = 50; 
      }
  }
  
  var data = {};
  data.tick = tick;
  data.increment = increment;
  
  return data; 
}

function mousewellscroll(opt) {
  var delta = opt.e.deltaY;
   cs++;
   cs = cs + 3;
  if (delta > 0) {
    var ldelta = new fabric.Point(0, -3);
    canvas.relativePan(ldelta);
    leftRuler.relativePan(ldelta);
   
  } else {
    var ldelta = new fabric.Point(0, 3);
    canvas.relativePan(ldelta);
    leftRuler.relativePan(ldelta);
  }
   //console.log(cs);
  if (cs > 200) {
    var e = opt.e;
    var dss = canvas.getPointer(e);    
    addrulernew(dss.x, dss.y);
    //console.log('13');
   // console.log(dss.x);
    cs =- 200;
  }
}

/****canvas move on moude down***********/
function canvasmoved(opt) {
  var evt = opt.e;
	if(handSelected == true){
		movec = true;
	}
  this.lastPosX = evt.clientX;
  this.lastPosY = evt.clientY;
	if(handSelected == true){
		movec = true;
	}
}

function deactivateHandtool() {
	$('#handtool').removeClass('g-active');
	$( ".canvas-container" ).attr('class', 'canvas-container');
	$( ".canvas-container" ).addClass( "g-cursor-select" );
	canvas.off('mouse:down', canvasmoved);
	canvas.off('mouse:move', canvasmovem);
	canvas.off('mouse:up', canvasmovemu);
}

function canvasmovem(opt) {
   if(movec){
     var e = opt.e;
     var unitx = e.clientX - this.lastPosX;
     var unity = e.clientY - this.lastPosY;
     var delta = new fabric.Point(unitx,unity);
     canvas.relativePan(delta);
     var tdelta = new fabric.Point(unitx, 0);
     topRuler.relativePan(tdelta);
     var ldelta = new fabric.Point(0, unity);
     leftRuler.relativePan(ldelta);
     var z = canvas.getZoom();
     var diff = unitx%z;
     unitx = unitx + (z - diff);
     //console.log('ix======'+ixx+'---unitx========='+unitx+'--z==='+z);
     //console.log('ix======'+iyy+'---unitx========='+unity);
     ixx += -unitx;
     iyy += -unity;
     //topmargin = (topmargin+(unitx));
     //leftmargin = (leftmargin+(unity));
     //addrulernew(ixx,iyy);
     this.lastPosX = e.clientX;
     this.lastPosY = e.clientY;
   }
}

function canvasmovemu(opt) {
  var e = opt.e;
  this.isDragging = false;
  this.selection = true;
  movec = false;
  addrulernew(0, 0);
  //console.log('14');
  //console.log(e);
}
/****End**/

/**
 * Get canvas object by object ID
 */
fabric.Canvas.prototype.getItemById = function(id) {
  var object = null,
      objects = this.getObjects();

  for (var i = 0, len = this.size(); i < len; i++) {
    if (objects[i].id && objects[i].id === id) {
      object = objects[i];
      break;
    }
  }

  return object;
};

/**
 * Get canvas object by Type
 */
fabric.Canvas.prototype.getItemsByType = function(type, flag) {
  var objectList = [],
      objects = this.getObjects();

  for (var i = 0, len = this.size(); i < len; i++) {
		if(flag == true){
			if (objects[i].type && objects[i].type === type && objects[i].name !== 'measurement') {
				objectList.push(objects[i]);
			}
		} else {
			if (objects[i].type && objects[i].type !== type && objects[i].name !== 'measurement') {
				objectList.push(objects[i]);
			}
		}
  }

  return objectList;
};

/**
 * Get all objects of page including page object
 */
fabric.Canvas.prototype.getItemsByPage = function(pageId) {
  var objectList = [],
      objects = this.getObjects();

  for (var i = 0, len = this.size(); i < len; i++) {

		if ((objects[i].page && objects[i].page === pageId && objects[i].type !== 'text' && objects[i].type !== 'line' && objects[i].type !== 'guideline' && objects[i].type !== 'PageMediaBox' && objects[i].type !== 'PageTrimBox') || (objects[i].id === pageId)) {
			objectList.push(objects[i]);
		}
  }

  return objectList;
};
/**
 * Get canvas object by Type
 */
fabric.Canvas.prototype.getItemsByName = function(name) {
  var objectList = [],
      objects = this.getObjects();

  for (var i = 0, len = this.size(); i < len; i++) {
    if (objects[i].type && objects[i].name === name) {
      objectList.push(objects[i]);
    }
  }
  return objectList;
};

/**
 * Callback function kmdsDesignZoomIn()
 * to set the canvas zoomIn
 **/
function kmdsDesignZoomIn(zoomin){
  var rulerdata = getZoomIncrement(zoomin, 'px');
  var tick = rulerdata.tick;
  var increment = rulerdata.increment;
  var ratio = 50/increment;
  
  //console.log('NIncrement: '+increment);
  //console.log('NZoomin: '+zoomin);
  //console.log('NRatio: '+ratio);
  
  activePageID = $('.page-row.g-active').attr('id');
  active_page_object = canvas.getItemsByPage(activePageID)[0];
  //get current left/top of page.
  var oldCoordinates = active_page_object.getBoundingRect();
  canvas.zoomToPoint(new fabric.Point(active_page_object.left, active_page_object.top), zoomin);
  //canvas.zoomToPoint(new fabric.Point(active_page_object.left, active_page_object.top), ratio);
  //get current left/top of page.
  var newCoordinates = active_page_object.getBoundingRect();
  var topRulerYDif = (oldCoordinates.left - newCoordinates.left);
  var leftRulerYDif = (oldCoordinates.top - newCoordinates.top);
  var unitx = topRulerYDif;
  var delta = new fabric.Point(-unitx,0);
  topRuler.relativePan(delta);
  var unity = leftRulerYDif;
  var delta = new fabric.Point(0,-unity);
  leftRuler.relativePan(delta);
  addrulernew(ixx, iyy);
  //console.log('15');
  updateRulerGuideOnZoom();
  //topmargin += -unitx;
  //leftmargin += -unity;
}
/**
 * Callback function kmdsDesignZoomOut()
 * to set the canvas zoomOut
 **/
function kmdsDesignZoomOut(zoomout){
  var rulerdata = getZoomIncrement(zoomout, 'px');
  var tick = rulerdata.tick;
  var increment = rulerdata.increment;
  var ratio = 50/increment;
  
  //console.log('NIncrement: '+increment);
  //console.log('NZoomout: '+zoomout);
  //console.log('NRatio: '+ratio);
  
  activePageID = $('.page-row.g-active').attr('id');
  active_page_object = canvas.getItemsByPage(activePageID)[0];
  //get current left/top of page.
  var oldCoordinates = active_page_object.getBoundingRect();
  canvas.zoomToPoint(new fabric.Point(active_page_object.left, active_page_object.top), zoomout);
  //canvas.zoomToPoint(new fabric.Point(active_page_object.left, active_page_object.top), ratio);
  //get current left/top of page.
  var newCoordinates = active_page_object.getBoundingRect();
  var topRulerYDif = (newCoordinates.left - oldCoordinates.left);
  var leftRulerYDif = (newCoordinates.top - oldCoordinates.top);
  var unitx = topRulerYDif;
  var delta = new fabric.Point(unitx,0);
  topRuler.relativePan(delta);
  var unity = leftRulerYDif;
  var delta = new fabric.Point(0,unity);
  leftRuler.relativePan(delta);
  addrulernew(ixx, iyy);
  //console.log('16');
  updateRulerGuideOnZoom();
  //topmargin += unitx;
  //leftmargin += unity;
}

/**
 * Object modified callback function for undo/redo stack update
 */
function modifyCanvasState(){
	if(!isDown){
		updateCanvasState();
	}
}

/**
 * Right sidebar font style option selection
 */
function FnFontStyle(){
	if($('#text-cmd-bold').hasClass('g-active') && $('#text-cmd-italic').hasClass('g-active')){ //bold+itallic
		document.getElementById('fstyle').selectedIndex = 7;									
	} else if(!$('#text-cmd-bold').hasClass('g-active') && $('#text-cmd-italic').hasClass('g-active')){ //regular+itallic
		document.getElementById('fstyle').selectedIndex = 3;
	} else if($('#text-cmd-bold').hasClass('g-active') && !$('#text-cmd-italic').hasClass('g-active')){  //bold
		document.getElementById('fstyle').selectedIndex = 6;
	} else if(!$('#text-cmd-bold').hasClass('g-active') && !$('#text-cmd-italic').hasClass('g-active')){ //regular
		document.getElementById('fstyle').selectedIndex = 2;
	}
}

/**
 * Update active object right properties
 */
function updateTextAppearance(){
	var obj = canvas.getActiveObject();
	if(!obj){return;}
	
	if(obj){
		if(obj.type == 'page' || obj.type == 'line' || obj.type == 'guideline' || obj.type == 'text'){return;}
		obj.stateProperties.forEach(function(prop) {
			switch (prop) {
				case 'fill':	
					if(obj.type == 'page'){
						$('#page-background').val(obj.fill);
            jQuery('#page-background').css('background-color', obj.fill);
					} else {
						$('#textst-fill').val(obj.fill);
            jQuery('#textst-fill').css('background-color', obj.fill);
						$('#kmds-color-fill').val(obj.fill);
						$('#kmds-color-fill').css("background-color", obj.fill);
						$('.kmds-color-picker').css("background-color", obj.fill);
						//stroke
						if(obj.stroke == ''){
							var str = '#ffffff'; //transparent
						} else {
							var str = obj.stroke;
						}
						
						//object background
						if(obj.backgroundColor == ''){
							var bg = '#ffffff'; //transparent
						} else {
							var bg = obj.backgroundColor;
						}
						
						//text background
						if(obj.textBackgroundColor == ''){
							var tbg = '#ffffff'; //transparent
						} else {
							var tbg = obj.textBackgroundColor;
						}
						$('#textst-stock').val(str);
            jQuery('#textst-stock').css('background-color', str);
						$('#textpro-bg').val(bg);
            jQuery('#textpro-bg').css('background-color', bg);
						$('#textpro-tbg').val(tbg);
            jQuery('#textpro-tbg').css('background-color', tbg);
            if(obj.type === 'Lineshape' || obj.type === 'circle' || obj.type === 'Rectshape' || obj.type === 'triangle'){
              $('#kmds-shape-fill').val(obj.fill);
              $('#kmds-shape-fill').css("background-color", obj.fill);
              $('.kmds-shape-picker').css("background-color", obj.fill);
            }
          }
        break;
				case 'stroke':	
					if(obj.stroke == ''){
						var str = 'rgba(0,0,0,0)'; //transparent
					} else {
						var str = obj.stroke;
					}
					$('#textst-stock').val(str);
          jQuery('#textst-stock').css('background-color', str);
          if(obj.type === 'Lineshape' || obj.type === 'circle' || obj.type === 'Rectshape' || obj.type === 'triangle'){
            $('#kmds-shape-border').val(str);
            $('#kmds-shape-border').css("background-color", str);
            $('.kmds-border-picker').css("background-color", str);
            $('#border-stroke-num').val(obj.strokeWidth);
          }
					
					break;
				
				/* case 'backgroundColor':	
					if(obj.backgroundColor == ''){
						var bg = 'transparent';
					} else {
						var bg = obj.backgroundColor;
					}
					$('#textpro-bg').val(bg);
					
					break;
				
				case 'textBackgroundColor':	
					if(obj.textBackgroundColor == ''){
						var tbg = 'transparent';
					} else {
						var tbg = obj.textBackgroundColor;
					}
					$('#textpro-tbg').val(tbg);
					
					break;
				
				 */
				case 'fontWeight':	
					if(obj.fontWeight == 'bold'){
						$('#text-cmd-bold').addClass('g-active');											
					} else if(obj.fontWeight == '400') {
						$('#text-cmd-bold').removeClass('g-active');	
					}
					//FnFontStyle();
					
					break;
				
				case 'fontStyle':	
					if(obj.fontStyle == 'italic'){
						$('#text-cmd-italic').addClass('g-active');											
					} else if(obj.fontStyle == 'normal') {
						$('#text-cmd-italic').removeClass('g-active');	
					}
					//FnFontStyle();
					
					break;
					
				case 'fontSize':	
					document.getElementById('text-font-size').value = obj.fontSize;
					break;	
					
				case 'fontFamily':	
					//document.getElementById('font-family').value = obj.fontFamily;
					var fontFamilyStyle = kmdsFontsStyleList(obj.fontFamily);
          if(fontFamilyStyle){
            addFontStyle(fontFamilyStyle[0], fontFamilyStyle[1]);
            document.getElementById('font-family').value = fontFamilyStyle[0];
          }
					break;	
					
				case 'underline':	
					if(obj.underline == true){
						$('#text-cmd-underline').addClass('g-active');
					} else {
						$('#text-cmd-underline').removeClass('g-active');
					}
					
					break;
				
				case 'linethrough':	
					if(obj.linethrough == true){
						$('#text-cmd-linethrough').addClass('g-active');
					} else {
						$('#text-cmd-linethrough').removeClass('g-active');
					}
					
					break;
						
				case 'textAlign':	
					$('.align.apri').removeClass('g-active');
					$('#align-'+obj.textAlign).addClass('g-active');
					
					break;
						
				case 'charSpacing':	
					$('#char-spacing').val(parseInt(obj.charSpacing));
					
					break;
					
				case 'lineHeight':	
					$('#line-spacing').val(parseInt(obj.lineHeight));

					break;										
			}
		})
	}
}
 
/**
 * Object added/modified callback function for undo/redo canvasState update
 */
function updateCanvasState(){
	if((_config.undoStatus == false && _config.redoStatus == false)){
		var jsonData = canvas.toJSON();
		var canvasAsJson = JSON.stringify(jsonData);
		if(_config.currentStateIndex < _config.canvasState.length-1){
			var indexToBeInserted = _config.currentStateIndex+1;
			_config.canvasState[indexToBeInserted] = canvasAsJson;
			var numberOfElementsToRetain = indexToBeInserted+1;
			_config.canvasState = _config.canvasState.splice(0,numberOfElementsToRetain);
		} else {
			_config.canvasState.push(canvasAsJson);
			_config.canvasState = _config.canvasState.filter(function(item, pos){
				return _config.canvasState.indexOf(item)== pos; 
			});
		}
		_config.currentStateIndex = _config.canvasState.length-1;
		if((_config.currentStateIndex == _config.canvasState.length-1) && _config.currentStateIndex != -1){
			undoBtn.prop('disabled', false);
			undo_caption.parent('.g-menu-item').removeClass('g-disabled');
			
			redoBtn.prop('disabled', true);
			redo_caption.parent('.g-menu-item').addClass('g-disabled');
		}
	}
}
 
/**
 * Undo callback function
 */
function undo(){
	if(_config.undoFinishedStatus){
		if(_config.currentStateIndex == -1){
			_config.undoStatus = false;
		}
		else{
			if (_config.canvasState.length >= 1) {
				_config.undoFinishedStatus = 0;
				if(_config.currentStateIndex != 0){
					_config.undoStatus = true;
					canvas.loadFromJSON(_config.canvasState[_config.currentStateIndex-1],function(){
						var jsonData = JSON.parse(_config.canvasState[_config.currentStateIndex-1]);
						var prevjsonData = JSON.parse(_config.canvasState[_config.currentStateIndex]);
						var currentState = jsonData.objects[jsonData.objects.length - 1];
						var previousState = prevjsonData.objects[prevjsonData.objects.length - 1];
						//console.log(previousState.id+ ' =undo= ' +currentState.id);
						if(previousState == 'undefined' || currentState == 'undefined'){return;}
						if(previousState.id !== currentState.id){
							$('#layers #'+previousState.id).remove();
						}
						canvas.renderAll();

						_config.undoStatus = false;
						_config.currentStateIndex -= 1;
						undoBtn.prop('disabled', false);
						undo_caption.parent('.g-menu-item').removeClass('g-disabled');
						redoBtn.prop('disabled', false);
						redo_caption.parent('.g-menu-item').removeClass('g-disabled');
						_config.undoFinishedStatus = 1;
					});
					activePageObj = canvas.getItemById(activePage);
				}
				else if(_config.currentStateIndex == 0){
					//remove last layer of undo object
					if(canvas._objects.length == 1){
						$('#layers .layer-row').remove();
					}
					
					_config.undoFinishedStatus = 1;
					undoBtn.prop('disabled', true);
					undo_caption.parent('.g-menu-item').addClass('g-disabled');
					redoBtn.prop('disabled', false);
					redo_caption.parent('.g-menu-item').removeClass('g-disabled');
					_config.currentStateIndex -= 1;
				}
				//canvas.setActiveObject(currentState).renderAll();
				//update text right properties
				//if(currentState.type == 'textbox'){
				//	updateTextAppearance();
				//}
			}
		}
	}
}
 
/**
 * Redo callback function
 */  
function redo(){
	if(_config.redoFinishedStatus){
		if((_config.currentStateIndex == _config.canvasState.length-1) && _config.currentStateIndex != -1){
			//_config.redoButton.disabled= "disabled";
			redoBtn.prop('disabled', true);
			redo_caption.parent('.g-menu-item').addClass('g-disabled');
		} else {
			if (_config.canvasState.length > _config.currentStateIndex && _config.canvasState.length != 0){
				_config.redoFinishedStatus = 0;
				_config.redoStatus = true;
				canvas.loadFromJSON(_config.canvasState[_config.currentStateIndex+1],function(){
					canvas.renderAll();
					_config.redoStatus = false;
					_config.currentStateIndex += 1;
					if(_config.currentStateIndex != -1){
						undoBtn.prop('disabled', false);
						undo_caption.parent('.g-menu-item').removeClass('g-disabled');
					}
					_config.redoFinishedStatus = 1;
					if((_config.currentStateIndex == _config.canvasState.length-1) && _config.currentStateIndex != -1){
						redoBtn.prop('disabled', true);
						redo_caption.parent('.g-menu-item').addClass('g-disabled');
					}
					
					if(_config.currentStateIndex == (_config.canvasState.length - 1)){return;}
					var jsonData = JSON.parse(_config.canvasState[_config.currentStateIndex]);
					var prevjsonData = JSON.parse(_config.canvasState[_config.currentStateIndex]);
					var currentState = jsonData.objects[jsonData.objects.length-1];
					var previousState = prevjsonData.objects[prevjsonData.objects.length-1];
					if(previousState.id == currentState.id){
						if($('#layers #'+currentState.id).length == 0){
							redoing = true;
							add_layer(currentState.id, currentState.name, currentState.type, activePage, currentState.layerGroup, currentState.layerIndexing);
							redoing = false;
						}
					}
				});
			}
		}
	}
}

/**
 * callback function dynamicOpacityRGB();
 * to convert object fill color to linear-gradient
 * Like: linear-gradient(336deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0) 100%)
 **/
/*function dynamicOpacityRGB( colour ) {
  var r,g,b;
  if ( colour.charAt(0) == '#' ) {
    colour = colour.substr(1);
  }
  if ( colour.length == 3 ) {
    colour = colour.substr(0,1) + colour.substr(0,1) + colour.substr(1,2) + colour.substr(1,2) + colour.substr(2,3) + colour.substr(2,3);
  }
  r = colour.charAt(0) + '' + colour.charAt(1);
  g = colour.charAt(2) + '' + colour.charAt(3);
  b = colour.charAt(4) + '' + colour.charAt(5);
  r = parseInt( r,16 );
  g = parseInt( g,16 );
  b = parseInt( b,16);
  return "linear-gradient(.75turn, rgba(" + r + ',' + g + ',' + b + ", 1), rgba(" + r + ',' + g + ',' + b + ", 0) 150%)";
}*/

/**
* Leaving template without saving alert modal container
**/
if($('.savechanges-dialog-container').length == 0){
  $('body').append($('<div />', {'class': 'savechanges-dialog-container'}));    
  // callProductModal();
  // var modalc = new modalContent();
  var modalb = new savechangesModalBox('You have changes that have not been saved. If you continue you will lose any changes since your last save.','Update Template');
  $('.savechanges-dialog-container').append(modalb);
  $('.savechanges-dialog-container .modal-footer').css('padding', '35px');
}

/**
 * Save changes dialog Modal Box
 */
function savechangesModalBox (modalcontent, title_msg = null) {
  var $elem = $('body div.savechanges-dialog-container');
  $elem.append(
    $('<div/>', {'class': 'modal fade align-items-center', 'id': 'savechangesmodal', 'data-backdrop': "static", 'data-keyboard': "false"}).append(
      $('<div/>', {'class': 'modal-dialog'}).append(
        $('<div/>', {'class': 'savechangesmodal-content'}).append(
          $('<div/>', {'class': 'savechangesmodal-header'}).append(
            $('<h4/>', {'class': 'modal-title', text: 'Template Update'})
          )
        ).append(
          $('<div/>', {'class': 'savechangesmodal-body'}).append(
              $('<div/>', {'class':'p-27 text-center', text: modalcontent})
            )
        ).append(
        $('<div/>', {'class': 'savechangesmodal-footer'})
          .append(
            $('<div/>', {'class': '1cancel-design-modal'}).append(
              $('<button/>', {'id': 'cancel-design', 'onclick': 'dialogClose("savechangesmodal")', 'class': 'btn btn-blue font-Lato fs-15', text: 'CANCEL'})
            )
          )
          .append(
            $('<div/>', {'class': 'continue-design-modal'}).append(
              $('<button/>', {'id': 'continue-design', 'onclick': 'cancelCanvasDesignModal(this)',  'class': 'btn btn-primary font-Lato fs-15', text: 'Continue'})
            )
          )
        )
      )
    )
  );  
}

/**
* Dialog box close
**/
function dialogClose (modelid){
  //console.log(modelid);
  $('#'+modelid).modal('hide');
}

/*
$(window).bind("beforeunload",function(event) {
  //return "Are you sure you want to leave this page? Any unsaved changes may be lost.";
  return "Changes you made may not be saved.";
});
*/
 
//manual font size
$(document).on('change','#text-font-size',function () {
  var val = $(this).val();
  if (!val){
  	val = 6;
  }
  if (isNaN(val)) {
    val = 21;
  }
  var activeObject = canvas.getActiveObject();
  activeObject.fontSize = val;
  canvas.renderAll();
});

// font size dropdown callback function
function textSizeList() {
  document.getElementById("myDropdown").classList.toggle("textsizeshow");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !event.target.matches('.fa-chevron-down')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('textsizeshow')) {
        openDropdown.classList.remove('textsizeshow');
      }
    }
  }
}

//set font size in text box if click on font size dropdown
$(document).on('click', '.option-item', function() {
  var fsize = $(this).attr('datavalue');
  $('#text-font-size').val(fsize);
 	$('#text-font-size').trigger("change");
});
/**
 * Callback function sortMediaKitImagesList()
 * to sort the media kit image list in assets tab
 * at toolx page
 **/
function sortMediaKitImagesList(kit_class){
  var list, i, switching, b, shouldSwitch;
  list = document.getElementById("left-sidebar");
  switching = true;
  while (switching) {
    switching = false;
    b = list.getElementsByClassName(kit_class);
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
      if (b[i].getAttribute("image-title").toLowerCase() > b[i + 1].getAttribute("image-title").toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;       
    }
  }
}
/**
 * Callback function imageSRCtoBase64()
 * to convert image URL to base64
 * @return base64 src
 **/
function imageSRCtoBase64(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
      reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}
/**
 * Callback function sortPageList()
 * to arrange the page layers
 **/
function sortPageList(){
  var list, i, switching, b, shouldSwitch;
  list = document.getElementById("pages");
  switching = true;
  while (switching) {
    switching = false;
    b = list.getElementsByClassName('page-row');
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
      if (parseInt(b[i].getAttribute("page-no")) > parseInt(b[i + 1].getAttribute("page-no"))) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;       
    }
  }
}