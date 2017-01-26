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
var textSample;		
(function ($, Drupal, window, document, undefined) {
	// To understand behaviors, see https://drupal.org/node/756722#behaviors
	Drupal.behaviors.collateral_design_system = {
		attach: function(context, settings) {
			jQuery(document).ready(function() {
				$('#text-wrapper select').selectBox();
				$('.toggle_div').hide();
				$('.toggle').click(function () {
					var toggle_id = $(this).attr('id');
					$('div#'+toggle_id).toggle();
				});
				var currentRequest = null;
				jQuery('.categories li a').click(function(e) {
					e.preventDefault();
					if( jQuery('.categories li').hasClass("active") ){
						jQuery('.categories li').removeClass("active");
						jQuery('div.object-result').html('');
						var folder = jQuery(this).attr("data-query");
						var category = jQuery(this).parent().attr("id");
						jQuery(this).parent().addClass("active");
						currentRequest = jQuery.ajax({
							url: "/pdf-elements",
							data:{ "category":category, "folder":folder},
							type: "POST",
							beforeSend : function()    {           
								if(currentRequest != null) {
									jQuery('div.ajax-progress-throbber').remove();
									currentRequest.abort();
									jQuery('.categories').parent().after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Processing...</div></div>');
								}
							},
							success:function(data){
								jQuery('div.ajax-progress-throbber').remove();
								jQuery('.object-result').html(jQuery(data).find('.result').html());
							}
						});
					}
					else{
						var folder = jQuery(this).attr("data-query");
						var category = jQuery(this).parent().attr("id");
						jQuery(this).parent().addClass("active");
						jQuery('.categories').parent().after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Processing...</div></div>');
						jQuery.ajax({
							url: "/pdf-elements",
							data:{ "category":category, "folder":folder},
							type: "POST",
							success:function(data){
								jQuery('div.ajax-progress-throbber').remove();
								jQuery('.object-result').html(jQuery(data).find('.result').html());
							}
						});
					}
				});
				
				jQuery('.background li a').click(function(e) {
					e.preventDefault();
					if( jQuery('.background li').hasClass("active") ){
						jQuery('.background li').removeClass("active");
						jQuery('div.object-result').html('');
						var folder = jQuery(this).attr("data-query");
						var category = jQuery(this).parent().attr("id");
						jQuery(this).parent().addClass("active");
						jQuery('.background').parent().after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Processing...</div></div>');
						jQuery.ajax({
							url: "/pdf-elements",
							data:{ "category":category, "folder":folder},
							type: "POST",
							success:function(data){
								jQuery('div.ajax-progress-throbber').remove();
								jQuery('.background-result').html(jQuery(data).find('.result').html());
							}
						});
					}
					else{
						var folder = jQuery(this).attr("data-query");
						var category = jQuery(this).parent().attr("id");
						jQuery(this).parent().addClass("active");
						jQuery('.background').parent().after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Processing...</div></div>');
						jQuery.ajax({
							url: "/pdf-elements",
							data:{"category":category, "folder":folder},
							type: "POST",
							success:function(data){
								jQuery('div.ajax-progress-throbber').remove();
								jQuery('.background-result').html(jQuery(data).find('.result').html());
							}
						});
					}
				});
				jQuery('#cds-upload-images').on('click', function(){
					jQuery('#custom-canvas-confirm-popup').css('display', 'block');
					jQuery('.page-setting-contents :input').attr('disabled', true);
					jQuery('#canvas-wrapper-main').css('display', 'none');
				});
				jQuery('.nav-tabs li a').on('click', function(){
					jQuery('#canvas-wrapper-main').css('display', 'block');
					jQuery('#custom-canvas-confirm-popup').css('display', 'none');
					jQuery('.page-setting-contents :input').attr('disabled', false);
				});
				
				jQuery("#text-lock").on( "click", function() {
					jQuery("#cds-custom-locking-btn-1").trigger( "click" );
					jQuery("#cds-custom-locking-btn-2").trigger( "click" );
					jQuery("#cds-custom-locking-btn-3").trigger( "click" );
					jQuery("#cds-custom-locking-btn-4").trigger( "click" );
					jQuery("#cds-custom-locking-btn-5").trigger( "click" );
				});
				
				numItems = document.getElementsByClassName("canvas").length;
				canvascount(numItems);
				changeView(1);
				angular.element(document).ready(function() {
				angular.bootstrap(document, ['kitchensink']);
				});
			});
		}
	};
})
(jQuery, Drupal, this, this.document);
		
		var articles = new Array();
		var canvas;
		var kitchensink = { };
		
		function canvascount(value) {
			sides_length = jQuery('div.sides').length;
			if(sides_length > 0 ){
				fsides = jQuery('div.sides').last().attr('data-id');
				fisides = jQuery('div.sides').last().attr('data-id');
				first_value = +fsides + 1;
				final_value = +fisides + value;
			}
			else{
				first_value = 1;
				final_value = value;
			}
			for(i=first_value; i <= final_value; i++){
				articles[i] = 'canvas'+i;
				articles[i] = new fabric.Canvas(articles[i]);
			}
			bleedlines();
		}
		function addside() {
			numItems = jQuery('div.sides').length;
			if(numItems > 0){
				i = jQuery('div.sides').last().attr('data-id');
				i = +i + 1;
			}
			else{
				i = 1;
			}
			articles.push('canvas'+i);
			articles[i] = 'canvas'+i;
			var dimension = jQuery('#dimension').val();
			if( !jQuery('#page_width').val() ) {
					  var width = 8.5+'in';
			}
			else{
				var width = jQuery('#page_width').val()+dimension;
			}
			if( !jQuery('#page_height').val() ) {
				  var height = 11+'in';
			}
			else{
				var height = jQuery('#page_height').val()+dimension;
			}
			articles[i] = document.createElement('canvas');
			var grad_box = document.getElementById('canvas-wrapper'); 
			articles[i].id     = 'canvas'+i;
			articles[i].className  = 'canvas';
			articles[i].width  = fabric.util.parseUnit(width);
			articles[i].height = fabric.util.parseUnit(height);
			articles[i].style.border = "1px solid";
			grad_box.appendChild(articles[i]);
			articles[i] = new fabric.Canvas(articles[i]); 
			jQuery('#canvas-wrapper-right .add-sides').before('<div class="sides" data-id="'+i+'" id="side'+i+'"><span class="sides-inner"  onclick="changeView('+i+');"></span></div>');
			bleedlines();
			changeView(i);
		}
		function removeside(value) {
			changeView(1);
			jQuery('#canvas'+value).parent().remove();
			jQuery('div#side'+value).remove();
			i = jQuery('div.sides').first().attr('data-id');
			changeView(i);
		}
		function canvaswidth(items, value) {
			for(i=1; i <= items; i++){
				articles[i].setWidth( value );
			}
			bleedlines();
		}
		function canvasheight(items, value) {
			for(i=1; i <= items; i++){
				articles[i].setHeight( value );
			}
			bleedlines();
		}
		function changeView(value) {
			canvas = articles[value];
			canvas.on('object:moving', function (e) {
				var obj = e.target;
				 // if object is too big ignore
				if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
					return;
				}        
				obj.setCoords();        
				// top-left  corner
				if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
					obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
					obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
				}
				// bot-right corner
				if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
					obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
					obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
				}
			});
			
			jQuery('.sides-inner').css('background-color', '#ccc');
			jQuery('span.remove-sides').remove();
			jQuery('div#side'+value+' .sides-inner').css('background-color', '#fff');
			jQuery('.canvas').parent().css('display', 'none');
			jQuery('#canvas'+value).parent().css('display', 'block');
			jQuery('div#side'+value).append('<span class="remove-sides" id="remove-side'+value+'"><button onclick="removeside('+value+');">-</button></span>');
			
			canvas.on('CanvasControls', function($scope) {
			  $scope.canvas = canvas;
			  $scope.getActiveStyle = getActiveStyle;
			  addAccessors($scope);
			  watchCanvas($scope);
			});
	  
		}
		function dropText() {
			var text = new fabric.Text('test');
			canvas.add(text);
		}
		function select_img(src) {
			var rotateThisImage;
			var image = new fabric.Image(src);
			fabric.Image.fromURL(src, function(image) {
				image.set({
					left: 125,
					top: 125,
					originX:  'center',
					originY: 'center',
					centeredScaling: true,
					hasControls: true
				});
				canvas.add(image);
				canvas.renderAll();
			});
			/* FLIP ACTIVE OBJECT IMAGE AMIT*/
		}
		
		function set_background(src) {
			var width = canvas.width;
			var height = canvas.height;
			var img = new fabric.Image(src);
			canvas.setBackgroundImage(src, canvas.renderAll.bind(canvas), {
				height: canvas.height,
				width: canvas.width,
				backgroundImageOpacity: 0.5,
				backgroundImageStretch: true
			});
			canvas.renderAll();
		}
		
		function bleedlines(){
		  var canvas_bleed = document.getElementsByClassName("canvas");
		   if(jQuery(canvas_bleed).hasClass('bleed')){
				//jQuery('#bleed').attr ( "checked" ,"checked" );
				cancon_width = jQuery('.canvas').width();
				cancon_height = jQuery('.canvas').height();
				cancon_width_up = +cancon_width +28;
				cancon_height_up = +cancon_height +28;
				//jQuery('.canvas-container').css('width', cancon_width_up);
				//jQuery('.canvas-container').css('height', cancon_height_up);
				jQuery('.canvas-container').css('border', ' 1px dotted red');
				jQuery('.canvas').css('border', ' 1px dotted red');
				//jQuery('.canvas').css('margin', 12);
			}
			else
			{
				//jQuery('#bleed').removeAttr('checked');
				cancon_width = jQuery('.canvas').width();
				cancon_height = jQuery('.canvas').height();
				cancon_width_up = +cancon_width +2;
				cancon_height_up = +cancon_height +2;
				//jQuery('.canvas-container').css('width', cancon_width_up);
				//jQuery('.canvas-container').css('height', cancon_height_up);
				jQuery('.canvas-container').css('border', ' 1px dotted #666');
				jQuery('.canvas').css('border', ' 1px dotted #666');
				//jQuery('.canvas').css('margin', 0);
			}
		}
		function addShirtImage() {
		fabric.Image.fromURL('//dev.cbone.me/sites/default/files/cbone-banner-small.png', function(image) {
		  image.set({
			left: 90,
			top: 100,
			angle: (0, 0)
		  })
		  .scale(1.5, 1.5)
		  .setCoords();
		  canvas.add(image);
		  canvas.sendToBack(image);
		});
	  };
	  
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
		object[styleName] = value;
	  }

	  object.setCoords();
	  canvas.renderAll();
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
	}

	function addAccessors($scope) {
	  $scope.getOpacity = function() {
		return getActiveStyle('opacity') * 100;
	  };
	  $scope.setOpacity = function(value) {
		setActiveStyle('opacity', parseInt(value, 10) / 100);
	  };

	  $scope.getFill = function() {
		return getActiveStyle('fill');
	  };
	  $scope.setFill = function(value) {
		setActiveStyle('fill', value);
	  };

	  $scope.isBold = function() {
		return getActiveStyle('fontWeight') === 'bold';
	  };
	  $scope.toggleBold = function() {
		setActiveStyle('fontWeight',
		  getActiveStyle('fontWeight') === 'bold' ? '' : 'bold');
	  };
	  $scope.isItalic = function() {
		return getActiveStyle('fontStyle') === 'italic';
	  };
	  $scope.toggleItalic = function() {
		setActiveStyle('fontStyle',
		  getActiveStyle('fontStyle') === 'italic' ? '' : 'italic');
	  };

	  $scope.isUnderline = function() {
		return getActiveStyle('textDecoration').indexOf('underline') > -1;
	  };
	  $scope.toggleUnderline = function() {
		var value = $scope.isUnderline()
		  ? getActiveStyle('textDecoration').replace('underline', '')
		  : (getActiveStyle('textDecoration') + ' underline');

		setActiveStyle('textDecoration', value);
	  };

	  $scope.isLinethrough = function() {
		return getActiveStyle('textDecoration').indexOf('line-through') > -1;
	  };
	  $scope.toggleLinethrough = function() {
		var value = $scope.isLinethrough()
		  ? getActiveStyle('textDecoration').replace('line-through', '')
		  : (getActiveStyle('textDecoration') + ' line-through');

		setActiveStyle('textDecoration', value);
	  };
	  $scope.isOverline = function() {
		return getActiveStyle('textDecoration').indexOf('overline') > -1;
	  };
	  $scope.toggleOverline = function() {
		var value = $scope.isOverline()
		  ? getActiveStyle('textDecoration').replace('overline', '')
		  : (getActiveStyle('textDecoration') + ' overline');

		setActiveStyle('textDecoration', value);
	  };

	  $scope.getText = function() {
		return getActiveProp('text');
	  };
	  $scope.setText = function(value) {
		setActiveProp('text', value);
	  };

	  $scope.getTextAlign = function() {
		return capitalize(getActiveProp('textAlign'));
	  };
	  $scope.setTextAlign = function(value) {
		setActiveProp('textAlign', value.toLowerCase());
	  };

	  $scope.getFontFamily = function() {
		return getActiveProp('fontFamily').toLowerCase();
	  };
	  $scope.setFontFamily = function(value) {
		setActiveProp('fontFamily', value.toLowerCase());
	  };

	  $scope.getBgColor = function() {
		return getActiveProp('backgroundColor');
	  };
	  $scope.setBgColor = function(value) {
		setActiveProp('backgroundColor', value);
	  };

	  $scope.getTextBgColor = function() {
		return getActiveProp('textBackgroundColor');
	  };
	  $scope.setTextBgColor = function(value) {
		setActiveProp('textBackgroundColor', value);
	  };

	  $scope.getStrokeColor = function() {
		return getActiveStyle('stroke');
	  };
	  $scope.setStrokeColor = function(value) {
		setActiveStyle('stroke', value);
	  };

	  $scope.getStrokeWidth = function() {
		return getActiveStyle('strokeWidth');
	  };
	  $scope.setStrokeWidth = function(value) {
		setActiveStyle('strokeWidth', parseInt(value, 10));
	  };

	  $scope.getFontSize = function() {
		return getActiveStyle('fontSize');
	  };
	  $scope.setFontSize = function(value) {
		setActiveStyle('fontSize', value);
	  };

	  $scope.getLineHeight = function() {
		return getActiveStyle('lineHeight');
	  };
	  $scope.setLineHeight = function(value) {
		setActiveStyle('lineHeight', parseFloat(value, 10));
	  };
	  $scope.getCharSpacing = function() {
		return getActiveStyle('charSpacing');
	  };
	  $scope.setCharSpacing = function(value) {
		setActiveStyle('charSpacing', value);
	  };
	  $scope.getBold = function() {
		return getActiveStyle('fontWeight');
	  };
	  $scope.setBold = function(value) {
		setActiveStyle('fontWeight', value ? 'bold' : '');
	  };

	  $scope.getCanvasBgColor = function() {
		return canvas.backgroundColor;
	  };
	  $scope.setCanvasBgColor = function(value) {
		canvas.backgroundColor = value;
		canvas.renderAll();
	  };
	  $scope.copy = function() {
		var obj = canvas.getActiveObject();
		obj.clone(function(c) {
		   canvas.add(c.set({ left: 100, top: 100, angle: 0 }));
		});
		canvas.renderAll();
	  };
	  $scope.lock = function() {
		var obj = canvas.getActiveObject();
		obj.editable = false;
		jQuery('#text-lock').hide();
		jQuery('#text-unlock').show();
	  };
	  $scope.unlock = function() {
		var obj = canvas.getActiveObject();
		obj.editable = true;
		jQuery('#text-lock').show();
		jQuery('#text-unlock').hide();
	  };  
	  $scope.link = function() {
		var obj = canvas.getActiveObject();
		canvas.discardActiveObject();
	  };
	  $scope.addRect = function() {
		var coord = getRandomLeftTop();

		canvas.add(new fabric.Rect({
		  left: coord.left,
		  top: coord.top,
		  fill: '#' + getRandomColor(),
		  width: 50,
		  height: 50,
		  opacity: 0.8
		}));
	  };

	  $scope.addCircle = function() {
		var coord = getRandomLeftTop();

		canvas.add(new fabric.Circle({
		  left: coord.left,
		  top: coord.top,
		  fill: '#' + getRandomColor(),
		  radius: 50,
		  opacity: 0.8
		}));
	  };

	  $scope.addTriangle = function() {
		var coord = getRandomLeftTop();

		canvas.add(new fabric.Triangle({
		  left: coord.left,
		  top: coord.top,
		  fill: '#' + getRandomColor(),
		  width: 50,
		  height: 50,
		  opacity: 0.8
		}));
	  };

	  $scope.addLine = function() {
		var coord = getRandomLeftTop();

		canvas.add(new fabric.Line([10, 20, 50, 50], { 
		  left: coord.left,
		  top: coord.top,
		  stroke: '#' + getRandomColor()
		}));
	  };
	
	  $scope.addPolygon = function() {
		var coord = getRandomLeftTop();

		this.canvas.add(new fabric.Polygon([
		  {x: 185, y: 0},
		  {x: 250, y: 100},
		  {x: 385, y: 170},
		  {x: 0, y: 245} ], {
			left: coord.left,
			top: coord.top,
			fill: '#' + getRandomColor()
		  }));
	  };

	  $scope.addHeading = function() {
		var longText = 'Collateral Design System';
		var breakingTextbox = new fabric.Textbox(longText,
			{
				width: 500,
				fontFamily: "helvetica",
				top: 50,
				left: 350,
				fill: '#333',
				cursorWidth: 0.5,
				originX: 'center',
				originY: 'top',
				fontSize: 36,
				textAlign: 'center'
		});
		canvas.add(breakingTextbox).setActiveObject(breakingTextbox);
		breakingTextbox.enterEditing();
	  };
	  
	  $scope.addSubheading = function() {
		var longText = 'Template Designer';
		var breakingTextbox = new fabric.Textbox(longText,
			{
				width: 300,
				fontFamily: "helvetica",
				top: 100,
				left: 380,
				fill: '#333',
				cursorWidth: 0.5,
				originX: 'center',
				originY: 'top',
				fontSize: 24,
				textAlign: 'center'
		});
		canvas.add(breakingTextbox).setActiveObject(breakingTextbox);
		breakingTextbox.enterEditing();
	  };

	  $scope.addText = function() {
		var curWidth = document.getElementById('canvas1').width;
		var curHeight = document.getElementById('canvas1').height;

		var longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum';
		var breakingTextbox = new fabric.Textbox(longText,
			{
				width: 600,
				fontFamily: "helvetica",
				top: 170,
				left: 370,
				fill: '#333',
				cursorWidth: 0.5,
				originX: 'center',
				originY: 'top',
				fontSize: 24,
				textAlign: 'center'
		});
		canvas.add(breakingTextbox).setActiveObject(breakingTextbox);
		breakingTextbox.enterEditing();
	  };
	  
	  $scope.addStatictext = function() {
		var curWidth = document.getElementById('canvas1').width;
		var curHeight = document.getElementById('canvas1').height;

		var longText = 'Copyright 2016 Escalet, Inc. All Rights Reserved';
		var breakingTextbox = new fabric.Textbox(longText,
			{
				width: 500,
				fontFamily: "helvetica",
				top: 650,
				left: 370,
				fill: '#333',
				cursorWidth: 0.5,
				originX: 'center',
				originY: 'top',
				fontSize: 16,
				textAlign: 'center'
		});
		canvas.add(breakingTextbox).setActiveObject(breakingTextbox);
		breakingTextbox.enterEditing();
	  };

	  var addShape = function(shapeName) {

		console.log('adding shape', shapeName);

		var coord = getRandomLeftTop();

		fabric.loadSVGFromURL('../assets/' + shapeName + '.svg', function(objects, options) {

		  var loadedObject = fabric.util.groupSVGElements(objects, options);

		  loadedObject.set({
			left: coord.left,
			top: coord.top,
			angle: getRandomInt(-10, 10)
		  })
		  .setCoords();

		  canvas.add(loadedObject);
		});
	  };

	  $scope.maybeLoadShape = function(e) {
		var $el = $(e.target).closest('button.shape');
		if (!$el[0]) return;

		var id = $el.prop('id'), match;
		if (match = /\d+$/.exec(id)) {
		  addShape(match[0]);
		}
	  };

	  function addImage(imageName, minScale, maxScale) {
		var coord = getRandomLeftTop();

		fabric.Image.fromURL('//dev.cbone.me/sites/all/modules/custom/collateral_design_system/modules/property_ads/images/' + imageName, function(image) {

		  image.set({
			left: 200,
			top: 200,
			//angle: getRandomInt(-10, 10)
		  })
		  //.scale(getRandomNum(minScale, maxScale))
		  .setCoords();

		  canvas.add(image);
		});
	  };

	 $scope.addImage1 = function() {
		addImage('1.jpg', 0.1, 0.25);
	};
	$scope.addImage2 = function() {
		addImage('2.jpg', 0.1, 1);
	};
	$scope.addImage3 = function() {
		addImage('3.jpg', 0.1, 0.25);
	};
	$scope.addImage4 = function() {
		addImage('4.jpg', 0.1, 1);
	};
	$scope.addImage5 = function() {
		addImage('5.jpg', 0.1, 0.25);
	};
	$scope.addImage6 = function() {
		addImage('6.jpg', 0.1, 1);
	};
	$scope.addImage7 = function() {
		addImage('7.jpg', 0.1, 0.25);
	};
	$scope.addImage8 = function() {
		addImage('8.jpg', 0.1, 1);
	};
	$scope.addImage9 = function() {
		addImage('9.jpg', 0.1, 0.25);
	};
	$scope.addImage10 = function() {
		addImage('10.jpg', 0.1, 1);
	};
	$scope.addImage11 = function() {
		addImage('11.jpg', 0.1, 0.25);
	};
	$scope.addImage12 = function() {
		addImage('12.jpg', 0.1, 1);
	};
	
	 $scope.addlogo1 = function() {
		addImage('logo1.png', 0.1, 0.25);
	  };

	  $scope.addlogo2 = function() {
		addImage('logo.png', 0.1, 1);
	  };

	  $scope.addlogo3 = function() {
		addImage('logo2.png', 0.5, 0.75);
	  };
	  
	  $scope.saveImage = function() {
			window.open(canvas.toDataURL('png'));
	  };
	  $scope.savePdf = function() {
		//var context = canvas.getContext('2d');
		//var fullQuality = canvas.toDataURL("image/jpeg", 1.0);
		var imgData = canvas.toDataURL("png");
		var canvasStringify = JSON.stringify(canvas);
		var base_path =  "/property-ads-ajax";
		var pdf_file_path = "/property-preview-ads/";
		
		jQuery.ajax({
			type: "POST",
			dataType: "json",
			url: base_path,
			data: {mydata: canvasStringify},
			//success: ,
			success:function(data){                    
                    window.open(pdf_file_path + data);
            }
		});
	  };

	  $scope.confirmClear = function() {
		if (confirm('Are you sure?')) {
		  canvas.clear();
		}
	  };

	  $scope.rasterize = function() {
		if (!fabric.Canvas.supports('toDataURL')) {
		  alert('This browser doesn\'t provide means to serialize canvas to an image');
		}
		else {
		  window.open(canvas.toDataURL('png'));
		}
	  };

	  $scope.rasterizeSVG = function() {
		window.open(
		  'data:image/svg+xml;utf8,' +
		  encodeURIComponent(canvas.toSVG()));
	  };

	  $scope.rasterizeJSON = function() {
		$scope.setConsoleJSON(JSON.stringify(canvas));
	  };

	  $scope.getSelected = function() {
		return canvas.getActiveObject();
	  };

	  $scope.removeSelected = function() {
		var activeObject = canvas.getActiveObject(),
			activeGroup = canvas.getActiveGroup();

		if (activeGroup) {
		  var objectsInGroup = activeGroup.getObjects();
		  canvas.discardActiveGroup();
		  objectsInGroup.forEach(function(object) {
			canvas.remove(object);
		  });
		}
		else if (activeObject) {
		  canvas.remove(activeObject);
		}
	  };

	  $scope.getHorizontalLock = function() {
		return getActiveProp('lockMovementX');
	  };
	  $scope.setHorizontalLock = function(value) {
		setActiveProp('lockMovementX', value);
	  };

	  $scope.getVerticalLock = function() {
		return getActiveProp('lockMovementY');
	  };
	  $scope.setVerticalLock = function(value) {
		setActiveProp('lockMovementY', value);
	  };

	  $scope.getScaleLockX = function() {
		return getActiveProp('lockScalingX');
	  },
	  $scope.setScaleLockX = function(value) {
		setActiveProp('lockScalingX', value);
	  };

	  $scope.getScaleLockY = function() {
		return getActiveProp('lockScalingY');
	  };
	  $scope.setScaleLockY = function(value) {
		setActiveProp('lockScalingY', value);
	  };

	  $scope.getRotationLock = function() {
		return getActiveProp('lockRotation');
	  };
	  $scope.setRotationLock = function(value) {
		setActiveProp('lockRotation', value);
	  };

	  $scope.getOriginX = function() {
		return getActiveProp('originX');
	  };
	  $scope.setOriginX = function(value) {
		setActiveProp('originX', value);
	  };

	  $scope.getOriginY = function() {
		return getActiveProp('originY');
	  };
	  $scope.setOriginY = function(value) {
		setActiveProp('originY', value);
	  };

	  $scope.sendBackwards = function() {
		var activeObject = canvas.getActiveObject();
		if (activeObject) {
		  canvas.sendBackwards(activeObject);
		}
	  };

	  $scope.sendToBack = function() {
		var activeObject = canvas.getActiveObject();
		if (activeObject) {
		  canvas.sendToBack(activeObject);
		}
	  };

	  $scope.bringForward = function() {
		var activeObject = canvas.getActiveObject();
		if (activeObject) {
		  canvas.bringForward(activeObject);
		}
	  };

	  $scope.bringToFront = function() {
		var activeObject = canvas.getActiveObject();
		if (activeObject) {
		  canvas.bringToFront(activeObject);
		}
	  };

	  var pattern = new fabric.Pattern({
		source: '/sites/all/modules/custom/collateral_design_system/modules/property_ads/images/logo.png',
		repeat: 'repeat'
	  });

	  $scope.patternify = function() {
		var obj = canvas.getActiveObject();

		if (!obj) return;

		if (obj.fill instanceof fabric.Pattern) {
		  obj.fill = null;
		}
		else {
		  if (obj instanceof fabric.PathGroup) {
			obj.getObjects().forEach(function(o) { o.fill = pattern; });
		  }
		  else {
			obj.fill = pattern;
		  }
		}
		canvas.renderAll();
	  };

	  $scope.clip = function() {
		var obj = canvas.getActiveObject();
		if (!obj) return;

		if (obj.clipTo) {
		  obj.clipTo = null;
		}
		else {
		  var radius = obj.width < obj.height ? (obj.width / 2) : (obj.height / 2);
		  obj.clipTo = function (ctx) {
			ctx.arc(0, 0, radius, 0, Math.PI * 2, true);
		  };
		}
		canvas.renderAll();
	  };

	  $scope.shadowify = function() {
		var obj = canvas.getActiveObject();
		if (!obj) return;

		if (obj.shadow) {
		  obj.shadow = null;
		}
		else {
		  obj.setShadow({
			color: 'rgba(0,0,0,0.3)',
			blur: 10,
			offsetX: 10,
			offsetY: 10
		  });
		}
		canvas.renderAll();
	  };
	  
	  $scope.gradientify = function() {
		var obj = canvas.getActiveObject();
		if (!obj) return;

		obj.setGradient('fill', {
		  x1: 0,
		  y1: 0,
		  x2: (getRandomInt(0, 1) ? 0 : obj.width),
		  y2: (getRandomInt(0, 1) ? 0 : obj.height),
		  colorStops: {
			0: '#' + getRandomColor(),
			1: '#' + getRandomColor()
		  }
		});
		canvas.renderAll();
	  }; 

	  $scope.execute = function() {
		if (!(/^\s+$/).test(consoleValue)) {
		  eval(consoleValue);
		}
	  };

	  $scope.getConsoleJSON = function() {
		return consoleJSONValue;
	  };
	  $scope.setConsoleJSON = function(value) {
		consoleJSONValue = value;
	  };
	  var _loadSVG = function(svg) {
		fabric.loadSVGFromString(svg, function(objects, options) {
		  var obj = fabric.util.groupSVGElements(objects, options);
		  canvas.add(obj).centerObject(obj).renderAll();
		  obj.setCoords();
		});
	  };

	  var _loadSVGWithoutGrouping = function(svg) {
		fabric.loadSVGFromString(svg, function(objects) {
		  canvas.add.apply(canvas, objects);
		  canvas.renderAll();
		});
	  };

	  $scope.saveJSON = function() {
		_saveJSON(JSON.stringify(canvas));
	  };

	  var _saveJSON = function(json) {
		$scope.setConsoleJSON(json);
	  };

	  $scope.loadJSON = function() {
		_loadJSON(consoleJSONValue);
	  };

	  var _loadJSON = function(json) {
		canvas.loadFromJSON(json, function(){
		  canvas.renderAll();
		});
	  };
	  function addTexts() {
		var iText = new fabric.IText('CB|ONE', {
		  left: 180,
		  top: 400,
		  fontFamily: 'Engagement',
		  fill: '#333',
		  scaleX: 2.2,
		  scaleY: 2.2,
		});
		canvas.add(iText);
	  }

	  $scope.getFreeDrawingMode = function() {
		return canvas.isDrawingMode;
	  };
	  $scope.setFreeDrawingMode = function(value) {
		canvas.isDrawingMode = !!value;
		$scope.$$phase || $scope.$digest();
	  };

	  $scope.freeDrawingMode = 'Pencil';

	  $scope.getDrawingMode = function() {
		return $scope.freeDrawingMode;
	  };
	  $scope.setDrawingMode = function(type) {
		$scope.freeDrawingMode = type;

		if (type === 'hline') {
		  canvas.freeDrawingBrush = $scope.vLinePatternBrush;
		}
		else if (type === 'vline') {
		  canvas.freeDrawingBrush = $scope.hLinePatternBrush;
		}
		else if (type === 'square') {
		  canvas.freeDrawingBrush = $scope.squarePatternBrush;
		}
		else if (type === 'diamond') {
		  canvas.freeDrawingBrush = $scope.diamondPatternBrush;
		}
		else if (type === 'texture') {
		  canvas.freeDrawingBrush = $scope.texturePatternBrush;
		}
		else {
		  canvas.freeDrawingBrush = new fabric[type + 'Brush'](canvas);
		}

		$scope.$$phase || $scope.$digest();
	  };

	  $scope.getDrawingLineWidth = function() {
		if (canvas.freeDrawingBrush) {
		  return canvas.freeDrawingBrush.width;
		}
	  };
	  $scope.setDrawingLineWidth = function(value) {
		if (canvas.freeDrawingBrush) {
		  canvas.freeDrawingBrush.width = parseInt(value, 10) || 1;
		}
	  };

	  $scope.getDrawingLineColor = function() {
		if (canvas.freeDrawingBrush) {
		  return canvas.freeDrawingBrush.color;
		}
	  };
	  $scope.setDrawingLineColor = function(value) {
		if (canvas.freeDrawingBrush) {
		  canvas.freeDrawingBrush.color = value;
		}
	  };

	  $scope.getDrawingLineShadowWidth = function() {
		if (canvas.freeDrawingBrush && canvas.freeDrawingBrush.shadow) {
		  return canvas.freeDrawingBrush.shadow.blur || 1;
		}
		else {
		  return 0
		}
	  };
	  $scope.setDrawingLineShadowWidth = function(value) {
		if (canvas.freeDrawingBrush) {
		  var blur = parseInt(value, 10) || 1;
		  if (blur > 0) {
			canvas.freeDrawingBrush.shadow = new fabric.Shadow({blur: blur, offsetX: 10, offsetY: 10}) ;
		  }
		  else {
			canvas.freeDrawingBrush.shadow = null;
		  }
		}
	  };

	  function initBrushes() {
		if (!fabric.PatternBrush) return;

		initVLinePatternBrush();
		initHLinePatternBrush();
		initSquarePatternBrush();
		initDiamondPatternBrush();
		initImagePatternBrush();
	  }

	  function initImagePatternBrush() {
		var img = new Image();
		img.src = '../assets/honey_im_subtle.png';

		$scope.texturePatternBrush = new fabric.PatternBrush(canvas);
		$scope.texturePatternBrush.source = img;
	  }

	  function initDiamondPatternBrush() {
		$scope.diamondPatternBrush = new fabric.PatternBrush(canvas);
		$scope.diamondPatternBrush.getPatternSrc = function() {

		  var squareWidth = 10, squareDistance = 5;
		  var patternCanvas = fabric.document.createElement('canvas');
		  var rect = new fabric.Rect({
			width: squareWidth,
			height: squareWidth,
			angle: 45,
			fill: this.color
		  });

		  var canvasWidth = rect.getBoundingRectWidth();

		  patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
		  rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

		  var ctx = patternCanvas.getContext('2d');
		  rect.render(ctx);

		  return patternCanvas;
		};
	  }

	  function initSquarePatternBrush() {
		$scope.squarePatternBrush = new fabric.PatternBrush(canvas);
		$scope.squarePatternBrush.getPatternSrc = function() {

		  var squareWidth = 10, squareDistance = 2;

		  var patternCanvas = fabric.document.createElement('canvas');
		  patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
		  var ctx = patternCanvas.getContext('2d');

		  ctx.fillStyle = this.color;
		  ctx.fillRect(0, 0, squareWidth, squareWidth);

		  return patternCanvas;
		};
	  }

	  function initVLinePatternBrush() {
		$scope.vLinePatternBrush = new fabric.PatternBrush(canvas);
		$scope.vLinePatternBrush.getPatternSrc = function() {

		  var patternCanvas = fabric.document.createElement('canvas');
		  patternCanvas.width = patternCanvas.height = 10;
		  var ctx = patternCanvas.getContext('2d');

		  ctx.strokeStyle = this.color;
		  ctx.lineWidth = 5;
		  ctx.beginPath();
		  ctx.moveTo(0, 5);
		  ctx.lineTo(10, 5);
		  ctx.closePath();
		  ctx.stroke();

		  return patternCanvas;
		};
	  }

	  function initHLinePatternBrush() {
		$scope.hLinePatternBrush = new fabric.PatternBrush(canvas);
		$scope.hLinePatternBrush.getPatternSrc = function() {

		  var patternCanvas = fabric.document.createElement('canvas');
		  patternCanvas.width = patternCanvas.height = 10;
		  var ctx = patternCanvas.getContext('2d');

		  ctx.strokeStyle = this.color;
		  ctx.lineWidth = 5;
		  ctx.beginPath();
		  ctx.moveTo(5, 0);
		  ctx.lineTo(5, 10);
		  ctx.closePath();
		  ctx.stroke();

		  return patternCanvas;
		};
	  }
	}

	(function(){
		var mainScriptEl = document.getElementById('main');
		if (!mainScriptEl) return;
		var preEl = document.createElement('pre');
		var codeEl = document.createElement('code');
		codeEl.innerHTML = mainScriptEl.innerHTML;
		codeEl.className = 'language-javascript';
		preEl.appendChild(codeEl);
		document.getElementById('bd-wrapper').appendChild(preEl);
	})();
		   
	(function() {
	  fabric.util.addListener(fabric.window, 'load', function() {
		var canvas = this.__canvas || this.canvas,
			canvases = this.__canvases || this.canvases;

		canvas && canvas.calcOffset && canvas.calcOffset();

		if (canvases && canvases.length) {
		  for (var i = 0, len = canvases.length; i < len; i++) {
			canvases[i].calcOffset();
		  }
		}
	  });
	})();

	function allowDrop(event) {
		event.preventDefault();
    }
	
	function wrapCanvasText(t, canvas, maxW, maxH, justify) {
		if (typeof maxH === "undefined") {
			maxH = 0;
		}
		var words = t.text.split(" ");
		var formatted = '';

		// This works only with monospace fonts
		justify = justify || 'left';

		// clear newlines
		var sansBreaks = t.text.replace(/(\r\n|\n|\r)/gm, "");
		// calc line height
		var lineHeight = new fabric.Text(sansBreaks, {
			fontFamily: t.fontFamily,
			fontSize: t.fontSize
		}).height;

		// adjust for vertical offset
		var maxHAdjusted = maxH > 0 ? maxH - lineHeight : 0;
		var context = canvas.getContext("2d");


		context.font = t.fontSize + "px " + t.fontFamily;
		var currentLine = '';
		var breakLineCount = 0;

		n = 0;
		while (n < words.length) {
			var isNewLine = currentLine == "";
			var testOverlap = currentLine + ' ' + words[n];

			// are we over width?
			var w = context.measureText(testOverlap).width;

			if (w < maxW) { // if not, keep adding words
				if (currentLine != '') currentLine += ' ';
				currentLine += words[n];
				// formatted += words[n] + ' ';
			} else {

				// if this hits, we got a word that need to be hypenated
				if (isNewLine) {
					var wordOverlap = "";

					// test word length until its over maxW
					for (var i = 0; i < words[n].length; ++i) {

						wordOverlap += words[n].charAt(i);
						var withHypeh = wordOverlap + "-";

						if (context.measureText(withHypeh).width >= maxW) {
							// add hyphen when splitting a word
							withHypeh = wordOverlap.substr(0, wordOverlap.length - 2) + "-";
							// update current word with remainder
							words[n] = words[n].substr(wordOverlap.length - 1, words[n].length);
							formatted += withHypeh; // add hypenated word
							break;
						}
					}
				}
				while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
				currentLine = ' ' + currentLine;

				while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
				currentLine = ' ' + currentLine + ' ';

				formatted += currentLine + '\n';
				breakLineCount++;
				currentLine = "";

				continue; // restart cycle
			}
			if (maxHAdjusted > 0 && (breakLineCount * lineHeight) > maxHAdjusted) {
				// add ... at the end indicating text was cutoff
				formatted = formatted.substr(0, formatted.length - 3) + "...\n";
				currentLine = "";
				break;
			}
			n++;
		}

		if (currentLine != '') {
			while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
			currentLine = ' ' + currentLine;

			while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
			currentLine = ' ' + currentLine + ' ';

			formatted += currentLine + '\n';
			breakLineCount++;
			currentLine = "";
		}

		// get rid of empy newline at the end
		formatted = formatted.substr(0, formatted.length - 1);

		var ret = new fabric.IText(formatted, { // return new text-wrapped text obj
			left: t.left,
			top: t.top,
			fill: t.fill,
			fontFamily: t.fontFamily,
			fontSize: t.fontSize,
			originX: t.originX,
			originY: t.originY,
			angle: t.angle,
		});
		return ret;
	}
	fabric.Textbox.prototype._wrapLine = function(ctx, text, lineIndex) {
	var lineWidth        = 0,
		lines            = [],
		line             = '',
		words            = text.split(' '),
		word             = '',
		letter           = '',
		offset           = 0,
		infix            = ' ',
		wordWidth        = 0,
		infixWidth       = 0,
		letterWidth      = 0,
		largestWordWidth = 0;

	for (var i = 0; i < words.length; i++) {
		word = words[i];
		wordWidth = this._measureText(ctx, word, lineIndex, offset);
		lineWidth += infixWidth;

		// Break Words if wordWidth is greater than textbox width
		if (this.breakWords && wordWidth > this.width) {
			line += infix;
			var wordLetters = word.split('');
			while (wordLetters.length) {
				letterWidth = this._getWidthOfChar(ctx, wordLetters[0], lineIndex, offset);
				if (lineWidth + letterWidth > this.width) {
					lines.push(line);
					line = '';
					lineWidth = 0;
				}
				line += wordLetters.shift();
				offset++;
				lineWidth += letterWidth;
			}
			word = '';
		} else {
			lineWidth += wordWidth;
		}

		if (lineWidth >= this.width && line !== '') {
			lines.push(line);
			line = '';
			lineWidth = wordWidth;
		}

		if (line !== '' || i === 1) {
			line += infix;
		}
		line += word;
		offset += word.length;
		infixWidth = this._measureText(ctx, infix, lineIndex, offset);
		offset++;

		// keep track of largest word
		if (wordWidth > largestWordWidth && !this.breakWords) {
			largestWordWidth = wordWidth;
		}
	}

	i && lines.push(line);

	if (largestWordWidth > this.dynamicMinWidth) {
		this.dynamicMinWidth = largestWordWidth;
	}

	return lines;
};
	