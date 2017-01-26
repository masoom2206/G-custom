<?php 
	drupal_add_css(drupal_get_path('module', 'collateral_design_system') . '/css/cds_text_menu.css');
?>	
	<div class="toolbar-menu">       
		 <menu class="toolbar font-toolbar">
            <ul class="toolbar__list">
				<li class="toolbar__item toolbar__item--rotate-left enabled" data-width="38">
                    <button id="rotate-left" class="toolbar__button toolbar__button--rotate-left toolbar__button--icon" data-item="copy"><span class="toolbar__label toolbar__label--copy">Rotate Counterclockwise</span></button>
                    <div class="toolbar__tooltip toolbar__tooltip--copy">Rotate Counterclockwise</div>
                </li>
				<li class="toolbar__item toolbar__item--rotate-right enabled" data-width="38">
					<button id = "rotate-right" class="toolbar__button toolbar__button--rotate-right toolbar__button--icon" data-item="copy"><span class="toolbar__label toolbar__label--copy">Rotate Clockwise</span></button>
                    <div class="toolbar__tooltip toolbar__tooltip--copy">Rotate Clockwise</div>
                </li>
				<li class="toolbar__item toolbar__item--flip-vertical enabled" data-width="38">
					<button id = "flipY" class="toolbar__button toolbar__button--flip-vertical-icon toolbar__button--icon" data-item="copy"><span class="toolbar__label toolbar__label--copy">Flip Vertical</span></button>
                    <div class="toolbar__tooltip toolbar__tooltip--copy">Flip Vertical </div>
                </li>
				<li class="toolbar__item toolbar__item--flip-horizontal enabled" data-width="38">
					<button id = "flipX" class="toolbar__button toolbar__button--flip-horizontal toolbar__button--icon" data-item="copy"><span class="toolbar__label toolbar__label--copy">Flip Horizontal</span></button>
                    <div class="toolbar__tooltip toolbar__tooltip--copy">Flip Horizontal</div>
                </li>
				<li class="toolbar__item toolbar__item--copy enabled" data-width="38">
                    <button class="toolbar__button toolbar__button--copy toolbar__button--icon" data-item="copy" ng-click="copy()"><span class="toolbar__label toolbar__label--copy">Copy</span></button>
                    <div class="toolbar__tooltip toolbar__tooltip--copy">Copy</div>
                </li>
				<li class="toolbar__item toolbar__item--arrange enabled" data-width="38">
                    <button class="toolbar__button toolbar__button--arrange toolbar__button--icon" data-item="arrange"  id="text_arrange"> <span class="toolbar__label toolbar__label--arrange">Arrange</span></button>
                    <div class="toolbar__tooltip toolbar__tooltip--arrange">Arrange</div>
					 <menu class="toolbar menutoggle toolbar--textSpacing toolbar__label--cds-arrange-child">
                        <ul class="toolbar__list">
                            <li class="toolbar__item toolbar__item--arrange" data-width="317">
                                <!--<button id="cds-sendBackwards-button" type="button" class="btn btn-object-action" id="text-lock" ng-click="sendBackwards()">Send Backwards</button>-->
								<button id="cds-sendBackwards-button" data-item="send-backwards" class="toolbar__button toolbar__button--send-backwards toolbar__button--icon" ng-click="sendBackwards()">
									<button class="toolbar__label toolbar__label--arrange-child-btns" ng-click="sendBackwards()">Back</button>
								</button>
							</li>
							<li class="toolbar__item toolbar__item--arrange" data-width="317">
								 <!--<button id="cds-bringForward-button" type="button" class="btn btn-object-action" id="text-lock" ng-click="bringForward()">Bring Forward</button>-->
								<button id="cds-bringForward-button" data-item="send-forward" class="toolbar__button toolbar__button--send-forward toolbar__button--icon" ng-click="bringForward()">
									<button class="toolbar__label toolbar__label--arrange-child-btns" ng-click="bringForward()">Forward</button>
								</button>
							</li>
                        </ul>
                    </menu>
                </li>
			 </ul>
        </menu>
		<menu class="toolbar main_right toolbar--element toolbar--right">
			<ul>
				<li class="toolbar__item toolbar__item--transparency enabled  toolbar__item--submenu" data-width="38">
					<button data-item="transparency" class="toolbar__button toolbar__button--transparency toolbar__button--icon">
						<span class="toolbar__label toolbar__label--transparency">Transparency</span>
					</button>
					<div class="toolbar__tooltip toolbar__tooltip--transparency">Transparency</div>
					<menu class="toolbar menutoggle toolbar--transparency ">
						<ul class="toolbar__list">
							<li class="toolbar__item toolbar__item--slider" data-width="309">
								<label class="toolbar__label toolbar__label--transparency">Transparency</label>
								<div class="toolbar__sliderWrapper">
									<div class="toolbar__sliderBackground"></div>
									<input bind-value-to="opacity" class="toolbar__slider toolbar__slider--transparency transparencySliderInput" type="range" min="0" max="100" step="1">
								</div>
							</li>
						</ul>
					</menu>
				</li>
				<li class="toolbar__item toolbar__item--lock enabled" id="text-lock"data-width="44">
                    <button class="toolbar__button toolbar__button--lock toolbar__button--icon" id="text-lock" ng-click="setlock(!getlock())" ng-class="{'btn-lock': getlock()}"><span class="toolbar__label toolbar__label--lock">{[ getlock() ? 'Unlock' : 'Lock' ]}</span></button>
                    <div class="toolbar__tooltip toolbar__tooltip--lock">{[ getlock() ? 'Unlock' : 'Lock' ]}</div>
                </li>
				<li class="toolbar__item toolbar__item--ddata enabled toolbar__item--submenu" data-width="44">
                    <button class="toggle toolbar__button toolbar__button--ddata toolbar__button--icon" data-item="ddata" id="text_ddata"><span class="toolbar__label toolbar__label--ddata">Dynamic Data</span></button>
                    <div class="toolbar__tooltip toolbar__tooltip--ddata">Dynamic Data</div>
                </li>
				<li class="toolbar__item toolbar__item--link enabled toolbar__item--submenu" data-width="38">
					<button data-item="link" class="toolbar__button toolbar__button--link toolbar__button--icon">
						<span class="toolbar__label toolbar__label--link">Link</span>
					</button>
					<div class="toolbar__tooltip toolbar__tooltip--link">Link</div>
					<menu class="toolbar menutoggle toolbar--link valid">
						<ul class="toolbar__list">
							<li class="toolbar__item toolbar__item--input" data-width="331">
								<input class="toolbar__input toolbar__input--link" type="text" placeholder="Start typing or paste a URL">
								<button class="button buttonSmall toolbar__submit toolbar__submit--link">Apply</button>
								<div class="toolbar__inputLabel toolbar__inputLabel--link">You can link to external websites</div>
							</li>
						</ul>
					</menu>
				</li>
				<li class="toolbar__item toolbar__item--delete enabled" data-width="34">
					<button data-item="delete" onclick="undo()" class="toolbar__button toolbar__button--delete toolbar__button--icon" ng-click="removeSelected()">
						<span class="toolbar__label toolbar__label--delete">Delete</span>
					</button>
					<div class="toolbar__tooltip toolbar__tooltip--delete">Delete</div>
				</li>
				<!-- <li class="toolbar__item toolbar__item--undo enabled" data-width="38">
                    <button id = "rotate-left" onclick="undo()" class="toolbar__button toolbar__button--undo toolbar__button--icon" data-item="copy"><span class="toolbar__label toolbar__label--copy">Undo</span></button>
                    <div class="toolbar__tooltip toolbar__tooltip--copy">Undo</div>
				</li>
				<li class="toolbar__item toolbar__item--redo enabled" data-width="38" >
					<button id = "redo" onclick="redo()" class="toolbar__button toolbar__button--redo toolbar__button--icon" data-item="copy"><span class="toolbar__label toolbar__label--copy">Redo</span></button>
                    <div class="toolbar__tooltip toolbar__tooltip--copy">Redo</div>
                </li>-->
			</ul>
		</menu>
	</div>
	  <div id="text_ddata" class="toggle_div">
		<div class="dayanamic-data-option">
			<ul class="toolbar__list">
				<li class="toolbar__item toolbar__button toolbar__item--left image_format enabled">
					<span class="dd-text">Dynamic Photo Settings </span>
				</li>	
				<li data-width="11" class="toolbar__item toolbar__separator"></li>
				<li class="toolbar__item toolbar__button toolbar__item--left image_format enabled"> 
					<input style="width: 20px ! important;" id="customphototext1" type="checkbox" name="customphototext">
					<span class="dd-text">Listing Photo # </span>
					<input type="text" style="width:62px;">
				</li> 
			 <li data-width="11" class="toolbar__item toolbar__separator"></li>		
				<li class="toolbar__item toolbar__button toolbar__item--left image_format enabled"> 
					<input id="customphototext2" type="checkbox" style="width: 20px ! important;" name="customphototext">
					<span class="dd-text">Agent / Team Photo # </span>
					<select id="custom_texttype">
						<option value="none">None</option>
						<option value="single_line">Primary Agent Photo</option>
						<option value="single_line">Co-Listing Agent Photo</option>
						<option value="single_line">Team Photo</option>
					</select>
				</li> 
			</ul>
		</div>
	</div>