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
kitchensink.controller('CanvasControls', function($scope) {

  $scope.canvas = canvas;
  $scope.getActiveStyle = getActiveStyle;

  addAccessors($scope);
  watchCanvas($scope);
});		
(function ($, Drupal, window, document, undefined) {
	// To understand behaviors, see https://drupal.org/node/756722#behaviors
	Drupal.behaviors.collateral_design_system2 = {
		attach: function(context, settings) {
			jQuery(document).ready(function() {
			grid = jQuery('#up_snap_grid').val();
			if ($(".canvas-container").length > 0) {
				// no action required
			}		
			else{
				$('.toggle_div').hide();
				$(".toolbar-menu li").click(function () {
					if( $(this).children().hasClass('toggle') ){
						$('.menutoggle').hide();
						var toggle_id = $(this).children().attr('id');
						$('div#'+toggle_id).toggle();
					}
					else{
						$('.toggle_div').hide();
						$('.toolbar-menu li > .menutoggle').not($(this).children(".menutoggle").toggle()).hide();
					}
				});
				$('#canvas-wrapper').on('mouseenter','.container-div',function() {
					divid = $(this).attr('data-id');
					changeView(divid);
				});
				windowHeight = $(window).innerHeight();
				$('.design-content-left').css('height', (windowHeight-50));
				var header_height = $('.design-header').outerHeight();
				$('.design-content-left').css('margin-top', (header_height-2));
				$('.design-content-right').css('margin-top', (header_height-2));
				$(".sideways li a:not(.upload)").click(function () {
					$('#custom-canvas-confirm-popup').css('display', 'none');
					$('.page-setting-contents :input').attr('disabled', false);
					$('#canvas-wrapper-main').css('display', 'block');
				});
				$(".sideways li a").click(function(){
					var divid = $(this).attr('href');
					url = "/cds/design-template/create";
				});
				$("#customtext").click(function(){
					$check = $(this);
					 if ($check.prop('checked')) {
							$('.custom_data').show();
							$('.dynamic-data').addClass("disabled");
							
						} else {
							$('.custom_data').hide();
							//$('.dynamic-data').show();
							$('.dynamic-data').removeClass("disabled");
						}					
				});
				$('#customtext1').change(function(){ 
					var chkdaynamicdataval = $( "select#database_text option:selected").val();
					$('.custom_data').hide();
					$('.dynamic-data').removeClass("disabled");
					if(chkdaynamicdataval == "none"){
						$('.custom-data').removeClass("disabled");
					}
					else{
						$('.custom-data').addClass("disabled");
					}
				});
				$("input:checkbox").on('click', function() {
				  var $box = $(this);
				  if ($box.is(":checked")) {
					var group = "input:checkbox[name='" + $box.attr("name") + "']";
					$(group).prop("checked", false);
					$box.prop("checked", true);
				  } else {
					$box.prop("checked", false);
				  }
				});
				
				/*this function used to apply link on active object*/
				jQuery(".toolbar__submit--link").click(function(){
					var url_link = document.getElementById('cds-apply-link-url').value;
					if(url_link){
						
						var added_url = canvas.getActiveObject().associatedUrl = url_link;
						var active_object = canvas.getActiveObject();
						var canvasStringify = JSON.stringify(active_object);
						var cavas_data = canvas.toObject(active_object);
						
			
						active_object.toObject = (function (toObject) {
							return function () {
								return fabric.util.object.extend(toObject.call(this), {
									associatedUrl: added_url
								});
							};
						})(active_object.toObject);
					}
				});
				
				$('ul.toolbar__list .fontFamily ul li').click(function(){
					$('.fontFamily ul li').removeClass('active');
					$(this).addClass('active');
					$('.fontFamily ul li').children().removeClass('toolbar__button--selected');
					$(this).children().addClass('toolbar__button--selected');
					var textfont = $(this).children().attr('data-name');
					$(".toolbar__label--fontFamily").text(textfont);
					 var tObj = canvas.getActiveObject();
					 tObj.set({
						fontFamily: textfont
					});
					canvas.renderAll();
					$('.menutoggle').toggle();
				});
				$('ul.toolbar__list .fontSize ul li').click(function(){
					$('.fontSize ul li').removeClass('active');
					$(this).addClass('active');
					$('.fontSize ul li').children().removeClass('toolbar__button--selected');
					$(this).children().addClass('toolbar__button--selected');
					var textsize = $(this).children().attr('data-text');
					$('.toolbar__inputButton--fontSize').val(textsize);
					 var tObj = canvas.getActiveObject();
					 tObj.set({
						fontSize: textsize
					});
					canvas.renderAll();
					$('.menutoggle').toggle();
				});
				
				var currentRequest = null;
				jQuery('.categories li a').click(function(e) {
					e.preventDefault();
					var ul_id = jQuery(this).parent().parent().attr('id');
					if( jQuery('.categories li').hasClass("active") ){
						jQuery('.categories li').removeClass("active");
						jQuery('div.'+ul_id).html('');
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
								jQuery('div.'+ul_id).html(jQuery(data).find('.result').html());
								jQuery('div.ajax-progress-throbber').remove();
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
								jQuery('div.'+ul_id).html(jQuery(data).find('.result').html());
								jQuery('div.ajax-progress-throbber').remove();
							}
						});
					}
				});
				    $('.objects').click(function(){
						$('#text_ddata').css("display","none");
					});
					$('.images').click(function(){
						$('#text_ddata').css("display","block");
					});
					$('.background').click(function(){
						$('#text_ddata').css("display","block");
					});
					$('.upload').click(function(){
						$('#text_ddata').css("display","block");
					});
					
					$('#text_ddata').click(function(){

						$('#customphototext1').prop("checked", true);
						$('#customtext1').prop("checked", true);
					});
				jQuery('#cds-upload-images').on('click', function(){
					jQuery('#custom-canvas-confirm-popup').css('display', 'block');
					jQuery('.page-setting-contents :input').attr('disabled', true);
					jQuery('#canvas-wrapper-main').css('display', 'none');
					//jQuery('.design-content-right-top').css('display', 'none');
				});
				jQuery('#cds-upload-pdf').on('click', function(){
					jQuery('#canvas-wrapper').css('display', 'block');
					jQuery('#image-wrapper').css('display', 'block');
					jQuery('#custom-canvas-confirm-popup2').css('display', 'block');
					jQuery('#custom-canvas-confirm-popup').css('display', 'none');
					jQuery('#text-wrapper').css('display', 'none');		
					jQuery('.imageBox').css('display', 'none');		
					jQuery('.container1').css('display', 'none');	
					jQuery('.pane').css('display', 'none');	
					jQuery('.action').css('display', 'none');	
					jQuery('#rotate').css('display', 'none');	
					jQuery('#flip').css('display', 'none');	
					jQuery('#canvas-wrapper-main').css('display', 'none');					
					
				});
				jQuery('ul.sideways li').on('click', function(){					
					jQuery('#canvas-wrapper').css('display', 'block !important');		
					jQuery('#custom-canvas-confirm-popup2').css('display', 'none');		
					jQuery('#custom-canvas-confirm-popup').css('display', 'none');		
				});

				
				jQuery('#cds-upload-images').on('click', function(){
					jQuery('#canvas-wrapper').css('display', 'block');
					jQuery('#image-wrapper').css('display', 'block');
					jQuery('#custom-canvas-confirm-popup').css('display', 'block');
					jQuery('#custom-canvas-confirm-popup2').css('display', 'none');
					jQuery('#text-wrapper').css('display', 'none');		
					jQuery('.imageBox').css('display', 'none');		
					jQuery('.container1').css('display', 'none');	
					jQuery('.pane').css('display', 'none');	
					jQuery('.action').css('display', 'none');	
					jQuery('#rotate').css('display', 'none');	
					jQuery('#flip').css('display', 'none');				
					
				});
				
				document.getElementById('flipY').addEventListener('click', function () {
					var object = canvas.getActiveObject();
					object.toggle('flipY');
					canvas.renderAll();
				});
				
				document.getElementById('flipX').addEventListener('click', function () {
					var object = canvas.getActiveObject();
					object.toggle('flipX');
					canvas.renderAll();
				});
				
				jQuery('#cds-upload-json').on('click', function(){
					var category = 'Json Image';
					jQuery('.result').parent().after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Processing...</div></div>');
					jQuery.ajax({
						url: "/cds-save-template-data",
						data:{ "category":category},
						type: "POST",
						success:function(data){
							jQuery('div.ajax-progress-throbber').remove();
							jQuery('.result').html(jQuery(data).find('.result').html());
						}
					});
				});
				
				jQuery(".zoomer__popoverList li").click(function() {
					 
					var idf = this.getAttribute('id');					
					$(this).addClass('zoomer__item--selected').siblings().removeClass('zoomer__item--selected');
					
					zoompercentage(idf);
					
					jQuery(".zoomer__popover.zoomer__pane").hide();
					
				});
				jQuery('#page_width').change(function(e) {
					numItems = jQuery('div.container-div').length;
					if(numItems != 0){
						var dimension = jQuery('#dimension').val();
						var width = jQuery('#page_width').val();
						if(dimension == 'in'){
							px_width = (width)*96;
						}
						else if(dimension == 'cm'){
							px_width = (width)*37.8;
						}
						else if(dimension == 'px'){
							px_width = width;
						}
						jQuery('#up_page_width').val(px_width);
						canvaswidth( numItems, px_width );
						bleedlines();
					}
				});
				jQuery('#page_height').change(function(e) {
					numItems = jQuery('div.container-div').length;
					if(numItems != 0){
						var dimension = jQuery('#dimension').val();
						var height = jQuery('#page_height').val();
						if(dimension == 'in'){
							up_height = (height)*96;
						}
						else if(dimension == 'cm'){
							up_height = (height)*37.8;
						}
						else if(dimension == 'px'){
							up_height = height;
						}
						jQuery('#up_page_height').val(up_height);
						canvasheight( numItems, up_height );
						bleedlines();
					}
				});
				jQuery('#grid_lines').on('click', function() {
					numItems = jQuery('div.container-div').length;
					if(numItems != 0){
						var $box = $(this);
						  if ($box.is(":checked")) {
							creategrids();
						  } else {
							removegrids();
						  }
					}
				  
				});
				jQuery('#zoomIn').on('click', function(event) {
					zoomIn();
					var zoomval = canvas.getZoom();	
					jQuery( ".zoomer__popover" ).hide();					
				});
				
				jQuery('#zoomOut').on('click', function(event) {
					zoomOut();
					var zoomval = canvas.getZoom();
					 jQuery( ".zoomer__popover" ).hide();
				});			
				jQuery('#canvaslevel h2').on('click', function(event) {
					jQuery( ".zoomer__popover" ).show();
				});
				jQuery("div.zoomer__popover").mouseleave(function(){
					jQuery(".zoomer__popover").hide();
				});
				jQuery("section.zoomer__pane").mouseleave(function(){
					jQuery(".zoomer__popover").hide();
				});	

//Show Image scaled height and width 
			// ROTATE LEFT AND RIGHT
			jQuery('#rotate-left').click(function() {
				rotateObject(-90);
			});
			jQuery('#rotate-right').click(function() {
				rotateObject(90);
			});
			
			jQuery('#btnCrop').click(function() {
			var t1 = canvas.getActiveObject();
			
					var src = t1.getSrc();	
					var canvass = document.getElementById('canvas1');
					var context = canvass.getContext('2d');
					var imageObj = new Image();
					imageObj.onload = function() {
						// draw cropped image
						var sourceX = jQuery("#cropX").val();;
						var sourceY = jQuery("#cropY").val();
						var sourceWidth = jQuery("#cropW").val();
						var sourceHeight = jQuery("#cropH").val();
						var destWidth = sourceWidth;
						var destHeight = sourceHeight;
						var destX = canvass.width / 2 - destWidth / 2;
						var destY = canvass.height / 2 - destHeight / 2;

						context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
					};
					imageObj.src = src;				
					jQuery('#canvas-wrapper').css('display', 'block');
					jQuery('.pane').css('display', 'none');
					var activeobject = canvas.getActiveObject();
					canvas.remove(activeobject);					
					// canvas.setActiveObject(src);
					activeobject.selectable = true;
					canvas.renderAll();
			});
			
				numItems = document.getElementsByClassName("container-div").length;
				canvascount(numItems);
				changeView(1);
				angular.element(document).ready(function() { 
					angular.bootstrap(document, ['kitchensink']); 
				}); 
				
				jQuery('.cds-saved-template-json-data li').each(function() {
					var canvasid = jQuery(this).attr('class');
					var saved_template_json = jQuery(this).text();
					if(saved_template_json != 'no data'){
						
					articles[canvasid].loadFromJSON(saved_template_json, articles[canvasid].renderAll.bind(articles[canvasid]), function(o, object) {});
				}
				});
				
			}
			});
		}
	};
})
(jQuery, Drupal, this, this.document);
		var articles = new Array();
		var canvas;
		var kitchensink = { };
		function textalign(value) {
			 var tObj = canvas.getActiveObject();
				tObj.set({
				  textAlign: value
				});
				canvas.renderAll();
		}
		function canvascount(value) {
			for(i=1; i <= value; i++){
				articles[i] = 'canvas'+i;
				articles[i] = new fabric.Canvas(articles[i], { preserveObjectStacking: true } );
			}
			pagedata();
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
			var height = canvas.getHeight();
			var width = canvas.getWidth();
			articles[i] = document.createElement('canvas');
			var grad_box = document.getElementById('canvas-wrapper'); 
			articles[i].id     = 'canvas'+i;
			articles[i].className  = 'canvas';
			articles[i].width  = width;
			articles[i].height = height;
			articles[i].style.border = "1px solid";
			grad_box.appendChild(articles[i]);
			articles[i] = new fabric.Canvas(articles[i]); 
			pagedata();
			bleedlines();
			changeView(i);
		}
		
		function pagedata() {
			canvasItems = jQuery('div.container-div').length;
			jQuery("#sides").val(canvasItems);
			jQuery('div.container-div').each(function(index){
				page_num = (index+1);
				var data_id = jQuery(this).attr('data-id');
				jQuery('div#side'+data_id).remove();
				//jQuery(this).children('div.sides').remove();
				pre_page = jQuery(this).prev().attr('data-id');
				next_page = jQuery(this).next().attr('data-id');
				if(page_num==1){
						var page_up = '';
				}
				else{
					var page_up = '<li class="pageup" onclick="changepage('+pre_page+');" title="Move page up"><a href="#" title="Move page up"></a></li>';
				}
				if(page_num==canvasItems){
					var page_down = '';
				}
				else{
					var page_down = '<li class="pagedown" onclick="changepage('+next_page+');" title="Move page down"><a title="Move page down"></a></li>';
				}
				var page_data = '<div class="sides" data-id="'+data_id+'" id="side'+data_id+'" ><div class="pagetool">'+page_up+'<li class="pageNumber">'+page_num+'</li>'+page_down+'<li class="pagecopy" onclick="clonepage('+data_id+');" title="Copy this page"><a title="Copy this page"></a></li><li class="pagedelete" onclick="removepage('+data_id+');" title="Delete this page"><a title="Delete this page"></a></li></div></div>';
				jQuery('#canvas-container'+data_id).append(page_data);
				var cont_width = jQuery(".canvas-container").width();
				jQuery('div.pagetool').width(cont_width);
				});
		}
		
		function clonepage(value) {
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
			var height = canvas.getHeight();
			var width = canvas.getWidth();
			jQuery('#canvas-wrapper').append('<div class="container-div" id="canvas-container'+i+'" data-id="'+i+'"></div>');
			var canvascontainer = document.getElementById('canvas-container'+i); 
			articles[i] = document.createElement('canvas');
			articles[i].id     = 'canvas'+i;
			articles[i].className  = 'canvas';
			articles[i].width  = width;
			articles[i].height = height;
			articles[i].style.border = "1px solid";
			canvascontainer.appendChild(articles[i]);
			articles[i] = new fabric.Canvas(articles[i]); 
			articles[i].loadFromJSON(JSON.stringify(articles[value]), function(){articles[i].renderAll()}); 
			pagedata();
			changeView(i);
			bleedlines();
		}
		
		function changepage(value) {
			jQuery('html, body').animate({
				scrollTop: jQuery("#canvas-container"+value).offset().top
			}, 2000);
			changeView(value);
		}
		function removepage(value) {
			jQuery('#canvas-container'+value).remove();
			pagedata();
			
		}
		function canvaswidth(items, value) {
			jQuery('div.container-div').each(function(index){
				var canvas_id = jQuery(this).attr('data-id');
				articles[canvas_id].setWidth( value );
			});
			bleedlines();
		}
		function canvasheight(items, value) {
			jQuery('div.container-div').each(function(index){
				var canvas_id = jQuery(this).attr('data-id');
				articles[canvas_id].setHeight( value );
			});
			bleedlines();
		}
		function creategrids() {
			jQuery('div.container-div').each(function(index){
				var canvas_id = jQuery(this).attr('data-id');
				  CanvasWidth = articles[canvas_id].getWidth();
				  CanvasHeight = articles[canvas_id].getHeight();
					var i=0;
					while((i*grid)<=CanvasHeight){
					articles[canvas_id].add(new fabric.Line([ 0,i * grid,CanvasWidth,i * grid ], { stroke:  '#ccc', strokeDashArray: [5, 5], selectable: false }));
					i++;
					}
					var j=0;
					while((j*grid)<=CanvasWidth){
					articles[canvas_id].add(new fabric.Line([ j * grid,0, j * grid, CanvasHeight], { stroke: '#ccc', strokeDashArray: [5, 5], selectable: false }));
					j++;
					}
			});
		}
		function removegrids() {
			jQuery('div.container-div').each(function(index){
				var canvas_id = jQuery(this).attr('data-id');
				var canObject = new Array();
				canObject = articles[canvas_id].getObjects();
				while(1){
					for(var tempObjNumber = 0;tempObjNumber<canObject.length;tempObjNumber++){
					   if(articles[canvas_id].item(tempObjNumber).type == 'line'){
							articles[canvas_id].item(tempObjNumber).remove();
						 articles[canvas_id].renderAll();
						}
					}
					articles[canvas_id].renderAll();
					canObject = articles[canvas_id].getObjects();
					var lineStatus = false;
					for(var tempObjNumber = 0;tempObjNumber<canObject.length;tempObjNumber++){
						if(articles[canvas_id].item(tempObjNumber).type == 'line'){
						lineStatus = true;
						}
					}
					if(lineStatus){
						canObject = articles[canvas_id].getObjects();
						continue;
					}else{
						break;
					}       
				}
			});
		}
		function changeView(value) {
			canvas = articles[value];
			jQuery('.container-div').removeClass('pageselected');
			jQuery('div#canvas-container'+value).addClass('pageselected');
			canvas.on('object:moving', function (e) {
				//alert(grid);
				if (grid == 0){
					
				}
				else{
					{ e.target.set
					({
					   left: Math.round(e.target.left / grid) * grid,
					   top: Math.round(e.target.top / grid) * grid
					});
					}
				}

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
			
			canvas.on('object:selected', function (e) {
				e.target.hasBorder = true;
				e.target.transparentCorners = false;
				e.target.borderColor = '#3f4652';
				e.target.cornerColor = '#3f4652';				
				e.target.minScaleLimit = 4;
				e.target.cornerStrokeColor = '#fff';
				e.target.cornerStyle = 'circle';
				e.target.minScaleLimit = 0;
				e.target.lockScalingFlip = true;
				e.target.padding =0;
				e.target.selectionDashArray = [10, 10];
				e.target.borderDashArray = [2 , 2];
				e.target.cornerDashArray = [10,10];        
				e.target.cornerSize = 10;
				e.target.cornerRadius =  100;
				e.target.id = 'activeobject';
			});
			
			canvas.on("object:scaling", function(e) {
				e.target.hasBorder = true;
				e.target.transparentCorners = false;
				e.target.borderColor = '#3f4652';
				e.target.cornerColor = '#00C4CC';				
				e.target.minScaleLimit = 4;
				e.target.cornerStrokeColor = '#fff';
				e.target.cornerStyle = 'circle';
				e.target.minScaleLimit = 0;
				e.target.lockScalingFlip = true;
				e.target.padding =0;
				e.target.selectionDashArray = [10, 10];
				e.target.borderDashArray = [2 , 2];
				e.target.cornerDashArray = [10,10];        
				e.target.cornerSize = 10;
				e.target.cornerRadius =  100;
				e.target.id = 'activeobject';
			});
			
			canvas.on('mouse:up', function(){
				var obj = canvas.getActiveObject();
				if (!obj){}
				else{
					obj.hasBorder = true;
					obj.transparentCorners = false;
					obj.borderColor = '#3f4652';
					obj.cornerColor = '#3f4652';				
					obj.minScaleLimit = 4;
					obj.cornerStrokeColor = '#fff';
					obj.cornerStyle = 'circle';
					obj.minScaleLimit = 0;
					obj.lockScalingFlip = true;
					obj.padding =0;
					obj.selectionDashArray = [10, 10];
					obj.borderDashArray = [2 , 2];
					obj.cornerDashArray = [10,10];        
					obj.cornerSize = 10;
					obj.cornerRadius =  100;
					obj.id = 'activeobject';
				}
				
			});
			//global variables 
		   canvasScale = 12; //global
		   SCALE_FACTOR = 1.2;//global 18/05/2015

		   var HideControls = {
			  'tl':true,
			  'tr':false,
			  'bl':false,
			  'br':false,
			  'ml':false,
			  'mt':false,
			  'mr':false,
			  'mb':false,
			  'mtr':false
			 };
			
		}
		function dropText() {
			var text = new fabric.Text('test');
			canvas.add(text);
		}
		function zoomIn() {
			
			jQuery('div.container-div').each(function(index){
				var canvas_id = jQuery(this).attr('data-id');
				//articles[canvas_id].setHeight( value );
				jQuery('.zoomer__popoverList li').siblings().removeClass('zoomer__item--selected');

				  canvasScale = canvasScale * SCALE_FACTOR;
				  articles[canvas_id].setHeight(articles[canvas_id].getHeight() * SCALE_FACTOR);
				  articles[canvas_id].setWidth(articles[canvas_id].getWidth() * SCALE_FACTOR);
					
				  var objects = articles[canvas_id].getObjects();
				  for (var i in objects) {
					  var scaleX = objects[i].scaleX;
					  var scaleY = objects[i].scaleY;
					  var left = objects[i].left;
					  var top = objects[i].top;

					  var tempScaleX = scaleX * SCALE_FACTOR;
					  var tempScaleY = scaleY * SCALE_FACTOR;
					  var tempLeft = left * SCALE_FACTOR;
					  var tempTop = top * SCALE_FACTOR;

					  objects[i].scaleX = tempScaleX;
					  objects[i].scaleY = tempScaleY;
					  objects[i].left = tempLeft;
					  objects[i].top = tempTop;

					  objects[i].setCoords();
				  }
					
				 var orginalheight = jQuery('#up_page_height').val();
				  var orginalwidth = jQuery('#up_page_height').val();

				  var newheight = articles[canvas_id].getHeight();
				  var newwidth = articles[canvas_id].getWidth();
				  
				  var percentageheight = (newheight/orginalheight)*100;
				  var percentagewidth = (newwidth/orginalwidth)*100;
				  if(articles[canvas_id].backgroundImage) {
					 articles[canvas_id].backgroundImage.scaleToWidth(newwidth);
					articles[canvas_id].backgroundImage.scaleToHeight(newheight);
				  }
				  articles[canvas_id].renderAll();
				 jQuery("#canvaslevel h2").first().html(parseInt(percentageheight)+'%');
			});
		  }

		function zoomOut (){
			jQuery('div.container-div').each(function(index){
			var canvas_id = jQuery(this).attr('data-id');
			jQuery('.zoomer__popoverList li').siblings().removeClass('zoomer__item--selected');
		  
			  canvasScale = canvasScale / SCALE_FACTOR;
			
			  articles[canvas_id].setHeight(articles[canvas_id].getHeight() * (1 / SCALE_FACTOR));
			  articles[canvas_id].setWidth(articles[canvas_id].getWidth() * (1 / SCALE_FACTOR));
			  
			  var objects = articles[canvas_id].getObjects();
			  for (var i in objects) {
				  var scaleX = objects[i].scaleX;
				  var scaleY = objects[i].scaleY;
				  var left = objects[i].left;
				  var top = objects[i].top;

				  var tempScaleX = scaleX * (1 / SCALE_FACTOR);
				  var tempScaleY = scaleY * (1 / SCALE_FACTOR);
				  var tempLeft = left * (1 / SCALE_FACTOR);
				  var tempTop = top * (1 / SCALE_FACTOR);

				  objects[i].scaleX = tempScaleX;
				  objects[i].scaleY = tempScaleY;
				  objects[i].left = tempLeft;
				  objects[i].top = tempTop;

				  objects[i].setCoords();
			  }
			  var orginalheight = jQuery('#up_page_height').val();
			  var orginalwidth = jQuery('#up_page_height').val();
			  var newheight = articles[canvas_id].getHeight();
			  var newwidth = articles[canvas_id].getWidth();
			  
			  var percentageheight = (newheight/orginalheight)*100;
			  var percentagewidth = (newwidth/orginalwidth)*100;
			  if(articles[canvas_id].backgroundImage) {
					articles[canvas_id].backgroundImage.scaleToWidth(newwidth);
					articles[canvas_id].backgroundImage.scaleToHeight(newheight);
			}
			  articles[canvas_id].renderAll();
			   jQuery("#canvaslevel h2").first().html(parseInt(percentageheight)+'%');
			});
		}
		function zoompercentage(percent){
			jQuery('div.container-div').each(function(index){
				var canvas_id = jQuery(this).attr('data-id');
				canvasheight =  articles[canvas_id].getHeight();
				canvaswidth =  articles[canvas_id].getWidth();
				if(percent == 100){
					canvasoriheight = jQuery('#up_page_height').val();
					canvasoriwidth = jQuery('#up_page_width').val();
					canvasscaleheight = canvasoriheight;
					canvasscalewidth = canvasoriwidth;
				}
				else{
					canvasoriheight = jQuery('#up_page_height').val();
					canvasoriwidth = jQuery('#up_page_width').val();
					canvasscaleheight = (canvasoriheight*percent)/100;
					canvasscalewidth = (canvasoriwidth*percent)/100;
				}

				 articles[canvas_id].setHeight(canvasscaleheight);
				 articles[canvas_id].setWidth(canvasscalewidth);						
				
				if(canvasscaleheight < canvasheight){
					SCALE_FACTOR = (canvasheight/canvasscaleheight);
					var objects =  articles[canvas_id].getObjects();
					for (var i in objects) {
					  var scaleX = objects[i].scaleX;
					  var scaleY = objects[i].scaleY;
					  var left = objects[i].left;
					  var top = objects[i].top;

					  var tempScaleX = scaleX * (1 / SCALE_FACTOR);
					  var tempScaleY = scaleY * (1 / SCALE_FACTOR);
					  var tempLeft = left * (1 / SCALE_FACTOR);
					  var tempTop = top * (1 / SCALE_FACTOR);

					  objects[i].scaleX = tempScaleX;
					  objects[i].scaleY = tempScaleY;
					  objects[i].left = tempLeft;
					  objects[i].top = tempTop;
					  objects[i].setCoords();
					}
				}
				if(canvasscaleheight > canvasheight){
					SCALE_FACTOR = (canvasscaleheight/canvasheight);
					var objects =  articles[canvas_id].getObjects();
				  for (var i in objects) {
					  var scaleX = objects[i].scaleX;
					  var scaleY = objects[i].scaleY;
					  var left = objects[i].left;
					  var top = objects[i].top;

					  var tempScaleX = scaleX * SCALE_FACTOR;
					  var tempScaleY = scaleY * SCALE_FACTOR;
					  var tempLeft = left * SCALE_FACTOR;
					  var tempTop = top * SCALE_FACTOR;

					  objects[i].scaleX = tempScaleX;
					  objects[i].scaleY = tempScaleY;
					  objects[i].left = tempLeft;
					  objects[i].top = tempTop;

					  objects[i].setCoords();
				  }
					 //articles[canvas_id].renderAll();
				}
				if(articles[canvas_id].backgroundImage) {
					articles[canvas_id].backgroundImage.scaleToWidth(canvasscalewidth);
					articles[canvas_id].backgroundImage.scaleToHeight(canvasscaleheight);
				}
				articles[canvas_id].renderAll();
				jQuery("#canvaslevel h2").first().html(percent+'%');
				jQuery(".zoomer__popover").hide();
			});	
		}
		function canvas_delete_image(name , folder , category){ 
		   var msg = "Delete this element from the database?";
		   doDeleteConfirm(msg, function yes(){
			jQuery.ajax({
				url: "/delete-elements",
				data:{"name":name, "folder":folder, "category":category},
				type: "POST",
				success:function(data){
					jQuery('.categories').parent().after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Processing...</div></div>');
					jQuery.ajax({
						url: "/pdf-elements",
						data:{ "category":category, "folder":folder},
						type: "POST",
						success:function(data){
							jQuery('div.ajax-progress-throbber').remove();
							jQuery('div.'+category+'-result').html(jQuery(data).find('.result').html());
						}
					});
				}
			});
	    }, function no(){
			jQuery('div.ajax-progress-throbber').remove();
			return false;
	    });
	   
	  }	
		  function doDeleteConfirm(msg, yesFn, noFn) {
		   var confirmBox = jQuery("#confirmBox");
		   var confirmBoxCover = jQuery(".confirmBox-group .cover");
		   confirmBox.find(".message").text(msg);
		   confirmBox.find(".yes,.no").unbind().click(function()
		   {
			confirmBox.hide();
			confirmBoxCover.hide();
		   });
		   confirmBox.find(".yes").click(yesFn);
		   confirmBox.find(".no").click(noFn);
		   confirmBox.show();
		   confirmBoxCover.show();
		}
		
		function select_img(src) {
			var image;
			fabric.util.loadImage(src, function(img) {
				image = new fabric.Image(img);
				
				canvas.add(image);
				canvas.centerObject(image);
				canvas.setActiveObject(image);
				image.selectable = true;
				canvas.renderAll();
			});
		}
		
		function cropimage(){
			var t1 = canvas.getActiveObject(); 
			if(t1 == null){
				alert("There are no active image. Please select a image over Canvas for cropping.");
			}
			else{
				var src = t1.getSrc();			
				jQuery('.imageBox').css('display', 'block');
				jQuery('.container1').css('display', 'block');
				jQuery('.pane').css('display', 'block');
				jQuery('.action').css('display', 'block');
				jQuery('#rotate').css('display', 'none');
				jQuery('#canvas-wrapper').css('display', 'none');
				jQuery('#flip').css('display', 'none');				
				
				jQuery( ".container1" ).replaceWith("<div class='pane clearfix' style='height: 456px; width: 603px; float: left; padding: 5px 0 0 58px;'> <img src='"+src+"' alt='Loulou form Sos Chats Geneva' /><div class='coords'><input id='cropX' type='text' value='' style='display: none;' /><input id='cropY' type='text' value='' style='display: none;' /><input id='cropW' type='text' value='' style='display: none;' /><input id='cropH' type='text' value='' style='display: none;' /><input type='checkbox' checked='checked' style='display: none;' /></div>");
				jQuery('.pane img').jrac({
						'crop_width': 250,
						'crop_height': 170,
						'crop_x': 100,
						'crop_y': 100,
						'viewport_onload': function () {
							$viewport = this;
							var inputs = jQuery("div.coords").find("input[type=text]");
							var events = ['jrac_crop_x', 'jrac_crop_y', 'jrac_crop_width', 'jrac_crop_height', 'jrac_image_width', 'jrac_image_height'];

							for (var i = 0; i < events.length; i++) {
								var event_name = events[i];
								// Register an event with an element.
								$viewport.observator.register(event_name, inputs.eq(i));
								// Attach a handler to that event for the element.
								inputs.eq(i).bind(event_name, function (event, $viewport, value) {
									jQuery(this).val(value);
								})
								// Attach a handler for the built-in jQuery change event, handler
								// which read user input and apply it to relevent viewport object.
								.change(event_name, function (event) {
									var event_name = event.data;
									$viewport.$image.scale_proportion_locked = jQuery("div.coords").find("input[type=checkbox]").is(':checked');
									$viewport.observator.set_property(event_name, $(this).val());
								})
							}
						}
					})
					// React on all viewport events.
					.bind('jrac_events', function (event, $viewport) {
						//Check Image Crop Box Valid
						if (parseInt(jQuery("#cropX").val()) > -1 && parseInt(jQuery("#cropY").val()) > -1) {
							//Set Background
							jQuery("#cropW").css('background-color', 'chartreuse');
							jQuery("#cropH").css('background-color', 'chartreuse');
						} else {
							//Set Background
							jQuery("#cropW").css('background-color', 'salmon');
							jQuery("#cropH").css('background-color', 'salmon');
						}
					});
					//ctx.drawImage(img,10,10,150,180);
					var sx = jQuery("#cropX").val();
					var sy = jQuery("#cropY").val();
					var sWidth = jQuery("#cropW").val();
					var sHeight = jQuery("#cropH").val();
					var image = new Image(),
					c = document.getElementById('canvas1'),
					ctx = c.getContext('2d');				
					image.src = src;
					var mouseDown;
					// only allow one crop. turn it off after that
					var disabled = false;
					var rectangle = new fabric.Rect({
						fill: 'transparent',
						stroke: '#ccc',
						strokeDashArray: [2, 2],
						visible: false
					});
					image.onload = function(){
						ctx.drawImage( image, sx , sy , sWidth , sHeight);
						fabric.util.loadImage(src, function(img) {
							image = new fabric.Image(img);
							image.selectable = true;						
							canvas.add(image);
							canvas.setActiveObject(image);
							canvas.remove(t1);
							canvas.renderAll();
						});	
					}
					
					// var container = document.getElementById('canvas1').getBoundingClientRect();
					// canvas.add(rectangle);
					// canvas.centerObject(rectangle);
			}
		}
		
		function set_background(src) {
			var width = canvas.width;
			var height = canvas.height;
			var img = new fabric.Image(src);
			canvas.setBackgroundImage(src, canvas.renderAll.bind(canvas), {
				height: canvas.height,
				width: canvas.width,
				backgroundImageOpacity: 0.5,
				backgroundImageStretch: true,
				selectable: true
			});
			canvas.renderAll();
		}
		
		function load_cdsjson(src){
			canvas.loadFromJSON(src, canvas.renderAll.bind(canvas), function(o, object) {});
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
		function save_pdf() {
			var canvasStringify = new Array();
			var width = jQuery("#up_page_width").val();
			var height = jQuery("#up_page_height").val();
			var numCanvas = jQuery('.container-div').length;
			jQuery('.container-div').each(function() {
				var canvas_id = jQuery(this).attr('data-id');
				canvasStringify[canvas_id] = JSON.stringify(articles[canvas_id]);
			});
			var base_path =  "/property-ads-ajax";
			var pdf_file_path = "/property-preview-ads/";
			jQuery('.template-setting-contents-result').after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Processing...</div></div>');
			jQuery.ajax({
				type: "POST",
				dataType: "json",
				url: base_path,
				data: {mydata: canvasStringify, width : width, height : height},
				success:function(data){
					window.open(pdf_file_path + data);
				},
				complete: function(){
					jQuery('.ajax-progress-throbber').remove();
				}
			});
		}
		function save_template() {
			var canvasStringify = new Array();
			var imgagedata = new Array();
			var width = jQuery("#up_page_width").val();
			var height = jQuery("#up_page_height").val();
			var numCanvas = jQuery('.container-div').length;
			jQuery('.container-div').each(function() {
				var canvas_id = jQuery(this).attr('data-id');
				imgagedata[canvas_id] = articles[canvas_id].toDataURL("png");
				canvasStringify[canvas_id] = JSON.stringify(articles[canvas_id]);
			});
			var base_path =  "/cds-save-template";
			var page_data = jQuery("#page-setting-data-value").text();
			var sides = jQuery("#sides").val();
			currentRequest = jQuery.ajax({
				type: "POST",
				dataType: "json",
				url: base_path,
				data: {mydata: canvasStringify, imgdata : imgagedata, page_data : page_data, sides: sides},
				beforeSend : function(){
					jQuery('.template-setting-contents-result').after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Processing...</div></div>');
				},
				success:function(data){
					jQuery('.template-setting-contents-result').html(jQuery(data).find('.result').html());
				},
				complete: function(){
					jQuery('.ajax-progress-throbber').remove();
				}
			});
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
	  $scope.getText = function() {
		  jQuery('.toggle_div').hide();
		jQuery('#bg-wrapper').addClass('ng-hide');
		jQuery('#bg-wrapper').removeClass('ng-show');
		return getActiveProp('text');
		
	  };
	  $scope.getImage = function() {
		  jQuery('.toggle_div').hide();
		jQuery('#bg-wrapper').addClass('ng-hide');
		jQuery('#bg-wrapper').removeClass('ng-show');
		var object = canvas.getActiveObject();
		 if (!object) return;
		 var objtype = canvas.getActiveObject().get('type');
			if(canvas.getActiveObject().get('type')==="image"){
				return object;
			}
	  };
	  $scope.getBg = function() {
		  canvas.on('mouse:up', function (e) {
			  if (e.target) {
				jQuery('#bg-wrapper').addClass('ng-hide');
				jQuery('#bg-wrapper').removeClass('ng-show');
			  }else{
				  if(canvas.backgroundImage) {
					 jQuery('#bg-wrapper').removeClass('ng-hide');
					 jQuery('#bg-wrapper').addClass('ng-show');
				  }
				  else {
					 jQuery('#bg-wrapper').addClass('ng-hide');
					 jQuery('#bg-wrapper').removeClass('ng-show');
				  }
			  }
			});
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
	   $scope.getlock = function() {
		return getActiveProp('lockMovementX');
	  };
	  $scope.setlock = function(value) {
		 var obj = canvas.getActiveObject();
		if(value === true){
		  obj.editable = false;
		}
		else{
			obj.editable = true;
		}
		obj.lockMovementX = value;
		obj.lockMovementY = value;
		obj.lockScalingX = value;
		obj.lockScalingY = value;
		obj.lockRotation = value;
		
		// add lock movement and scaling
		obj.toObject = (function (toObject) {
			return function () {
				return fabric.util.object.extend(toObject.call(this), {
					lockMovementX: value,
					lockMovementY: value,
					lockScalingX: value,
					lockScalingY: value,
					lockRotation: value,
				});
			};
		})(obj.toObject);		
	  };
	  $scope.link = function() {
		var obj = canvas.getActiveObject();
		//canvas.discardActiveObject();
	  };
	  $scope.addLine = function() {
		var coord = getRandomLeftTop();

		canvas.add(new fabric.Line([10, 20, 50, 50], { 
		  left: coord.left,
		  top: coord.top,
		  stroke: '#' + getRandomColor()
		}));
	  };
	  $scope.addHeading = function() {
		var curWidth = canvas.getWidth();
		var longText = 'Enter Headline';
		var breakingTextbox = new fabric.Textbox(longText,
			{
				top: curWidth / 2,
				left: curWidth / 2,
				width: 500,
				fontFamily: "helvetica",
				fill: '#000',
				originX: 'center',
				originY: 'top',
				fontSize: 42,
				fontWeight: 'bold',
				textAlign: 'center'
		});
		
		breakingTextbox.lockMovementX = false;
		breakingTextbox.lockMovementY = false;
		breakingTextbox.lockScalingX = false;
		breakingTextbox.lockScalingY = false;
		breakingTextbox.lockRotation = false;
		
		
		breakingTextbox.toObject = (function (toObject) {
			return function () {
				return fabric.util.object.extend(toObject.call(this), {
					lockMovementX: false,
					lockMovementY: false,
					lockScalingX: false,
					lockScalingY: false,
					lockRotation: false,
				});
			};
		})(breakingTextbox.toObject);

		
		canvas.add(breakingTextbox);
		canvas.setActiveObject(breakingTextbox);
		//console.log(JSON.stringify(breakingTextbox));
	  };
	  
	  $scope.addSubheading = function() {
		var curWidth = canvas.getWidth();
		var longText = 'Enter Sub-Headline';
		var breakingTextbox = new fabric.Textbox(longText,
			{
				top: curWidth / 2,
				width: curWidth / 2,
				left: curWidth / 2,
				fontFamily: "helvetica",
				fill: '#000',
				originX: 'center',
				originY: 'center',
				fontSize: 24,
				fontWeight: 'bold',
				textAlign: 'center'
		});
		canvas.add(breakingTextbox);
		canvas.setActiveObject(breakingTextbox);
	  };

	  $scope.addText = function() {
		var curWidth = canvas.getWidth();
		var longText = 'Enter multi-line text';
		var breakingTextbox = new fabric.Textbox(longText,
			{
				top: curWidth / 2,
				width: curWidth / 2,
				left: curWidth / 2,
				fontFamily: "helvetica",
				fill: '#000',
				cursorWidth: 0.5,
				originX: 'center',
				originY: 'center',
				fontSize: 20,
				textAlign: 'center'
		});
		canvas.add(breakingTextbox);
		canvas.setActiveObject(breakingTextbox);
	  };
	  
	  $scope.addStatictext = function() {
		var curWidth = canvas.getWidth();
		var longText = 'Enter single-line text';
		var breakingTextbox = new fabric.Textbox(longText,
			{
				top: curWidth / 2,
				width: curWidth / 2,
				left: curWidth / 2,
				fontFamily: "helvetica",
				fill: '#000',
				cursorWidth: 0.5,
				originX: 'center',
				originY: 'center',
				fontSize: 20,
				textAlign: 'center'
		});
		canvas.add(breakingTextbox);
		canvas.setActiveObject(breakingTextbox);
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
	  $scope.saveImage = function() {
			window.open(canvas.toDataURL('png'));
	  };
	  $scope.deletebackgroundimage = function() {
	    canvas.backgroundImage = 0;
		canvas.backgroundColor = '#FFFFFF';
		canvas.renderAll();	
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
	}
	// ROTATE LEFT AND RIGHT
	function rotateObject(angleOffset) {
		var t1 = canvas.getActiveObject()
		if(t1 == null){
			alert("There are no active image. Please select a image over Canvas for rotate.");
		}
		else{
			var obj = canvas.getActiveObject(),
				resetOrigin = false;

			if (!obj) return;

			var angle = obj.getAngle() + angleOffset;

			if ((obj.originX !== 'center' || obj.originY !== 'center') && obj.centeredRotation) {
				obj.setOriginToCenter && obj.setOriginToCenter();
				resetOrigin = true;
			}

			angle = angle > 360 ? 90 : angle < 0 ? 270 : angle;

			obj.setAngle(angle).setCoords();

			if (resetOrigin) {
				obj.setCenterToOrigin && obj.setCenterToOrigin();
			}

			canvas.renderAll();
		}
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

function watchCanvas($scope) {

  function updateScope() {
    $scope.$$phase || $scope.$digest();
    canvas.renderAll();
  }
	jQuery('div.container-div').each(function(index){
		var canvas_id = jQuery(this).attr('data-id');
		articles[canvas_id]
		.on('mouse:down', updateScope)
		.on('object:selected', updateScope)
		.on('group:selected', updateScope)
		.on('path:created', updateScope)
		.on('selection:cleared', updateScope);
	});
}