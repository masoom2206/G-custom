<style>

.zoomer--presentation .zoomer__popover {
    left: calc(88% + 22px);
}
.zoomer__item--selected {
    animation: 0.1s ease 0s normal forwards 1 running zoomer__item--selectedAnimation;
    background: rgba(0, 0, 0, 0) url("https://static.canva.com/static/images/tick_white.svg") no-repeat scroll right 10px top 50% / 13px 13px;
}
.zoomer__popover {
    border-radius: 10px;
    max-width: 140px;
    min-width: 88px;
    position: absolute;
}

.zoomer__item:hover {
    background-color: rgba(0, 0, 0, 0.3);
}
.zoomer__pane {
    -moz-user-select: none;
    background: #3f4652 none repeat scroll 0 0;
    box-sizing: border-box;
}

.zoomer__popoverList {
    overflow: hidden;
}

.zoomer__popoverItem {
    border-radius: 0;
    height: auto;
    line-height: 1.6em;
    padding: 5px 32px 5px 14px;
    text-align: left;
    width: 100%;
}
.zoomer__item, .zoomer__item:visited {
    background-color: transparent;
    border: 1px solid transparent;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    list-style: outside none none;
    outline: medium none;
    text-decoration: none;
    transition: background-color 0.1s ease 0s, opacity 0.1s ease-in 0s, border 0.1s ease-out 0s;
}

.zoomer.zoomer__pane.zoomer--presentation > div {
    float: left;
}

.zoomer {
    float: right;
    width: 148px;
}
.zoomer.zoomer__pane.zoomer--presentation > button {
    float: left;
}
.zoomer.zoomer__pane.zoomer--presentation > div {
    float: left;
}
.zoomer.zoomer__pane.zoomer--presentation > button {
    float: left;
}
</style>
<script type="text/javascript">jQuery(document).ready(function(){sh_highlightDocument();});</script>
<div id="pdf-main-container" >
    <div id="bd-wrapper" ng-controller="CanvasControls">
		<div class="main_design">
			<div class="design-header"><h2>Collateral Design System > Template Designer</h2></div>
			<div class="design-content">
				<div class="design-content-left">
					<div class="page-setting">
						<h3>PAGE SETTINGS</h3>
						<div class="page-setting-contents">
							<table>
								<tr>
									<td>
										Dimensions:
									</td>
									<td>
										<select name="dimension" width="10" id="dimension">
											<option value="in">in</option>
											<option value="px">px</option>
											<option value="cm">cm</option>
										</select>
									</td>
								</tr>
								<tr>
									<td>
										Width:
									</td>
									<td>
										<input type="number" value="" name="width" width="15" id="page_width" step=".01">
									</td>
								</tr>
								<tr>
									<td>
										Height:
									</td>
									<td>
										<input type="number" value="" name="height" width="15" id="page_height" step=".01">
									</td>
								</tr>
								<tr>
									<td>
										Bleed:
									</td>
									<td>
										<input id="bleed" type="checkbox" value="" name="height" width="15">
									</td>
								</tr>
								<tr>
									<td>
										Crop Marks:
									</td>
									<td>
										<input id="crop_marks" type="checkbox" value="" name="height" width="15">
									</td>
								</tr>
								<tr>
									<td>
										No. of Sides:
									</td>
									<td>
										<input type="text" value="" name="height" width="15" id="sides">
									</td>
								</tr>
							</table>
						</div>
					</div>
					<div class="page-elements">
						<h3>Elements</h3>
						<div class="page-elements-contents">
							<div class="left-tabs"> <!-- required for floating -->
							  <!-- Nav tabs -->
							  <div class="tabs">
								<ul class="nav-tabs tabs-left sideways">
									<li class="active"><a class="object" href="#home-v" data-toggle="tab">Objects</a></li>
									<li><a href="#profile-v" data-toggle="tab">T <br>TEXT</a></li>
									<li><a class="images" href="#images" data-toggle="tab">Images</a></li>
									<li><a class="background" href="#background-v" data-toggle="tab">Background</a></li>
									<li><a class="upload" href="#up-v" data-toggle="tab">Upload</a></li>
								  </ul>
							  </div>
							</div>
							<div class="right-tabs tab-content">
							  <!-- Tab panes -->
								<div class="tab-pane active" id="home-v">
									<p>
										<button type="button" class="btn image1" ng-click="">Graphics</button>
										<button type="button" class="btn image1" ng-click="addlogo1()">Image 1 (logo)</button>
										<button type="button" class="btn image2" ng-click="addlogo2()">Image 2 (logo1)</button>
										<button type="button" class="btn image2" ng-click="">Lines</button>
										<button type="button" class="btn image2" ng-click="">Shapes</button>
									</p>
								</div>
								<div class="tab-pane" id="profile-v">
									<p><button class="btn text" ng-click="addText()">Headline</button></p>
									<p><button class="btn text" ng-click="addText()">Sub Headline</button></p>
									<p><button class="btn text" ng-click="addText()">Long Text</button></p>
									<p><button class="btn text" ng-click="addText()">Static Text</button></p>

								</div>
								<div class="tab-pane" id="images">
									<div id="all-images">
									<img onclick='select_img(this.src)' src="sites/default/files/AgentDirectoryHeader_2.jpg" width="58" height="100"></img>
										<img onclick='select_img(this.src)' src="sites/default/files/174590-8329.jpg" width="58" height="100"></img>
										<?php
											 // $uploaded_images = db_select('custom_images', 'ci')
												// ->fields('ci')
												// ->execute();
											// $dir_uri = file_stream_wrapper_get_instance_by_uri('modules://');
											// $real_path = $dir_uri->realpath();
											// $real_path_explode = explode('public_html', $real_path);
											// $output = '';
											// foreach($uploaded_images as $uploaded_images){
												// $explode = explode('://', $uploaded_images->path);
												// $canvas_img_path = $real_path_explode[1]."/".$explode[1];
												// $output .= "<img src='".$canvas_img_path."' width = '64' height = '64' onclick='select_img(this.src)' />";
											// }
											// echo $output;

										// ?>
									</div>
								</div>
								<div class="tab-pane" id="background-v">
									<div class="background-images">
										<img class="demo" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" src="//cdn.wallpapersafari.com/8/90/ptGaXk.jpg" width="58" height="100"></img>
										<img class="demo" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" src="//cbslocal-uploads.s3.amazonaws.com/captures/8D0/E8F/8D0E8FA6437749588E1561AE3CC11484" width="58" height="100"></img>
										<img class="demo" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" src="//cdn.wallpapersafari.com/42/92/CZJiwn.jpg" width="58" height="100"></img>
						
										<img class="demo" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" src="https://joshhansen.net/wp-content/uploads/2013/12/Barley_field-2007-02-22large.jpg" width="58" height="100"></img>
										<img class="demo" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" src="//i.imgur.com/0mvileSb.jpg" width="58" height="100"></img>
										<img class="demo" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" src="//i.imgur.com/V4OuBYzb.jpg" width="58" height="100"></img>
										<img class="demo" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" src="//i.imgur.com/47sZMh0b.jpg" width="58" height="100"></img>
										<img class="demo" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" src="//i.imgur.com/q9aLMza.png" width="58" height="100"></img>
										<img class="demo" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" src="//i.imgur.com/wMU4SFn.jpg" width="58" height="100"></img>
										<img class="demo" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" src="//i.imgur.com/mRx7pFfb.jpg" width="58" height="100"></img>
										<img class="demo" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" src="//i.imgur.com/jbFZDl8b.jpg" width="58" height="100"></img>
										<img class="demo" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" src="//i.imgur.com/GoG79rJb.jpg" width="58" height="100"></img>
										<img class="demo" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" src="//i.imgur.com/0mvileSb.jpg" width="58" height="100"></img>
										<img class="demo" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" src="//i.imgur.com/V4OuBYzb.jpg" width="58" height="100"></img>
										<img class="demo" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" src="//i.imgur.com/47sZMh0b.jpg" width="58" height="100"></img>
									</div>
								</div>
								<div class="tab-pane" id="up-v">					
								<button>PDF</button>
								<button id = "cds-upload-images" style="background-color: #238C00;">IMAGES</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="design-content-right">
					<div class="design-content-right-top">
						<div class="temp-name">
							<input type="text" value="" name="temp_name" id="temp_name" placeholder="Enter your template Name">
						</div>
						<section class="zoomer zoomer__pane zoomer--presentation">
							<button id="zoomIn">+</button>
							<div id="zoom-level">
							<button id="canvaslevel">50%</button>
							<div class="zoomer__popover zoomer__pane" style="display:none;">
							<ul class="zoomer__popoverList">
							<li class="zoomer__item zoomer__popoverItem" id="300">300%</li>
							<li class="zoomer__item zoomer__popoverItem" id="200">200%</li>
							<li class="zoomer__item zoomer__popoverItem" id="175">175%</li>
							<li class="zoomer__item zoomer__popoverItem" id="150">150%</li>
							<li class="zoomer__item zoomer__popoverItem" id="125">125%</li>
							<li class="zoomer__item zoomer__popoverItem" id="100">100%</li>
							<li class="zoomer__item zoomer__popoverItem" id="75">75%</li>
							<li class="zoomer__item zoomer__popoverItem" id="50">50%</li>
							<li class="zoomer__item zoomer__popoverItem" id="25">25%</li>
							<li class="zoomer__item zoomer__popoverItem" id="10">10%</li>
							</ul>
							</div>
							</div>
							<button id="zoomOut">-</button>
							</section>
						<div class="temp-button">
							<button onclick="">Save Template</button>
						</div>
					</div>
					<div id="canvas-wrapper-left" ondrop="drop(event)" ondragover="allowDrop(event)" class="designs">
						<div id="canvas-wrapper" class="designs">
							</div>
						
					</div>
					<div class="container1" style=" display:none;   border: 1px dashed;    bottom: 0;    height: 427px !important;    left: 0;    position: relative;    right: 0;    top: 0;    width: 603px !important;
					margin-top: 4px;    margin-left: 64px; float:left;">
					
					</div>
					
					<!-- END FLIP Tools -->
					<div id="canvas-wrapper-right" class="designs">
					<!-- Start FLIP Tools -->
					<div id="image-wrapper" style="margin-top: 10px; display:none; color:#ffffff; padding: 18px;">
						<div class="crop-setting">
							<h3 style="color:#ffffff;">IMAGE SETTINGS</h3>
							<div class="crop-setting-contents">
								<table class="crop-container">
									<tr>
										<td>Position:</td>
										<td class="position-x">X</td>
										<td><input type="number" value="" name="width" width="15" id="crop_x" step="1"></td>
										<td class="position-x">Y</td>
										<td><input type="number" value="" name="height" width="15" id="crop_y" step="1"></td>
									</tr>
									<tr>
										<td>Size:</td>
										<td class="size-x">W</td>
										<td><input type="number" value="" name="height" width="15" id="crop_width" step="1"></td>
										<td class="size-x">H</td>
										<td><input type="number" value="" name="height" width="15" id="crop_height" step="1"></td>
									</tr>
								</table>
							</div>
						</div>
						<div>
							<button style="color:black;" onclick="cropimage()" id=cropimage>Crop</button>
							<div id="flip">
								<input type="checkbox" id="horizontalCheckbox" /> <label for="horizontalCheckbox">Flip horizontal</label>
								<input type="checkbox" id="verticalCheckbox" /> <label for="verticalCheckbox">Flip vertical</label>
							</div>
							<div id="rotate">
								<button id="rotate-left"></button>
								<button id="rotate-right"></button>
							</div>
							<div class="action">
								<input type="button" id="btnCrop" value="" style="float: right; ">
								<input type="button" id="btnZoomIn" value="" style="float: right;  margin-right: 10px;">
								<input type="button" id="btnZoomOut" value="" style="float: right;  margin-right: 10px;">
							</div>
						</div>
					</div>
						  <?php
								$form = drupal_get_form('property_ads_form');
							?>
							 <div id="custom-canvas-confirm-popup">
								<div class="custom-confirm-area">
									<div id="all-images">
										<?php
											print drupal_render($form);
										?>
									</div>
								</div>
								<br/>
								<a class="custom-canvas-confirm-popup-ok" href="#">Ok</a>
							</div>
						<!-- Start Text Tools -->
								<div id="text-wrapper" style="margin-top: 10px; display:none;">
									<div id="text-controls-additional">
										<button type="button" class="btn btn-object-action"
										ng-click="toggleBold()"
										ng-class="{'btn-inverse': isBold()}">
										B
										</button>
										<button type="button" class="btn btn-object-action" id="text-cmd-italic"
										ng-click="toggleItalic()"
										ng-class="{'btn-inverse': isItalic()}">
										I
										</button>
										<button type="button" class="btn btn-object-action" id="text-cmd-underline"
										ng-click="toggleUnderline()"
										ng-class="{'btn-inverse': isUnderline()}">
										U
										</button>
										<button type="button" class="btn btn-object-action" id="text-cmd-linethrough"
										ng-click="toggleLinethrough()"
										ng-class="{'btn-inverse': isLinethrough()}">
										Linethrough
										</button>
										<button type="button" class="btn btn-object-action" id="text-cmd-overline"
										ng-click="toggleOverline()"
										ng-class="{'btn-inverse': isOverline()}">
										Overline
										</button>
									</div>
									<br>
									<div id="text-controls">
										<label for="font-family" style="display:inline-block">Font family:</label>
											<select id="font-family" class="btn-object-action" bind-value-to="fontFamily">
												<option value="arial">Arial</option>
												<option value="helvetica" selected>Helvetica</option>
												<option value="myriad pro">Myriad Pro</option>
												<option value="delicious">Delicious</option>
												<option value="verdana">Verdana</option>
												<option value="georgia">Georgia</option>
												<option value="courier">Courier</option>
												<option value="comic sans ms">Comic Sans MS</option>
												<option value="impact">Impact</option>
												<option value="monaco">Monaco</option>
												<option value="optima">Optima</option>
												<option value="hoefler text">Hoefler Text</option>
												<option value="plaster">Plaster</option>
												<option value="engagement">Engagement</option>
											</select>
										<br>
										<label for="text-align" style="display:inline-block">Text align:</label>
											<select id="text-align" class="btn-object-action" bind-value-to="textAlign">
												<option>Left</option>
												<option>Center</option>
												<option>Right</option>
												<option>Justify</option>
											</select>
										<div>
											<label for="text-bg-color">Background color:</label>
											<input type="color" value="" id="text-bg-color" size="10" class="btn-object-action"
											  bind-value-to="bgColor">
										</div>
										<div>
											<label for="text-lines-bg-color">Background text color:</label>
											<input type="color" value="" id="text-lines-bg-color" size="10" class="btn-object-action"
											  bind-value-to="textBgColor">
										</div>
										<div>
											<label for="text-font-size">Font size (px):</label>
											  <input type="number" value="" id="text-font-size" class="text-controls-text" bind-value-to="fontSize">
										</div>
										<div>
											<label for="text-line-height">Line height:</label>
											<input type="range" value="" min="0" max="10" step="0.1" id="text-line-height" class="btn-object-action"
											  bind-value-to="lineHeight">
										</div>
									</div>
								</div>
							<!-- End Text Tools -->
					</div>
				</div>
			</div>
		</div>
    </div>
	
 </div>