<?php 
	drupal_add_css(drupal_get_path('module', 'collateral_design_system') . '/css/cds_text_menu.css');
	
	
	$custom_fields = array(
				'agent_name' => 'Agent Name',
				'agent_direct_phone' => 'Agent Direct Phone',
				'agent_mobile_phone' => 'Agent Mobile Phone',
				'agent_email' => 'Agent Email',
				'agent_website' => 'Agent Web Site',
				'agent_license' => 'Agent License Number',
				'listing_address' => 'Listing Address',
				'office_name' => 'Office Name',
				'office_address' => 'Office Address',
				'office_city' => 'Office City',
				'office_state' => 'Office State',
				'office_zip' => 'Office Zip',
				'lms_listing_sub_headline' => 'Listing Marketing Sub-Headline',
				'open_house_dates' => 'Open House Date',
				'co_agent_name' => 'Co-Listing Agent Name',
				'co_agent_direct_phone' => 'Co-Listing Agent Direct Phone',
				'co_agent_mobile_phone' => 'Co-Listing Agent Mobile Phone',
				'co_agent_email' => 'Co-Listing Agent Email',
				'co_agent_website' => 'Co-Listing Agent Web Site',
				'co_agent_license' => 'Co-Listing Agent License Number',
				'sales_team_name' => 'Sales Team Name',
				'sales_team_email' => 'Sales Team Email',
				'listing_address_city' => 'Listing Address , Listing City',
			);
			$remove_fields = array(
				'Office',
				'Office ID',
				'Open House Tour Dates',
				'GPS Coordinates',
				'Hide Listing Address',
				'Co-Listing Agent',
				'Sales Team',
				'Published',
				'Agent ID',
				'Agent Name',
				'Agent UID',
				'Allow Agent Edit',
				'Listing Data',
				'Listing Expiration',
				'NRT Property ID',
				'Listing Status',
				'Marketing Coordinator',
				'Metro ID',
				'MLS Description',
				'Previews',
				'Primary Agent',
				'Product',
				'Primary Agent',
				'Purchase Marketing',
				'Sales Team',
				'Marketing Concierge Status',
				'Property Web Page Design',
				'Sub Headline',
				'Bullets',
				'Client First Name',
				'Client Last Name',
				'Client Email',
				'Share Listing With',
				'Listing Date Title',
				'Published',
				'Square Feet',
			);
			 $fields = field_info_instances('node', 'lms_listing');
			 $node_fields = array();
			 if(!empty($fields)){
				 foreach($fields as $key=>$value){
					 if (!in_array($value['label'], $remove_fields)) {
						$node_fields[$key] = $value['label'];
					}
				 }
			 }
			 $result = array_merge($custom_fields, $node_fields);
			 asort($result);
?>	
	<div class="toolbar-menu">       
		 <menu class="toolbar font-toolbar">
            <ul class="toolbar__list">
                <li class="toolbar__item toolbar__item--fontFamily enabled   toolbar__item--submenu fontFamily" data-width="144">
                    <button class="toolbar__button toolbar__button--fontFamily " data-item="fontFamily"><span class="toolbar__label toolbar__label--fontFamily" style="font-family: courier;">Courier</span></button>
                    <div class="toolbar__tooltip toolbar__tooltip--fontFamily">Font</div>
                    <div class="menuList menutoggle">
                        <ul class="menuList__inner">
							<li class="selectable"><button class=" toolbar__button toolbar__button--font" title="Helvetica" data-name="courier" href="#">Courier</button></li>
							<li class="selectable"><button class=" toolbar__button toolbar__button--font" title="Helvetica" data-name="helvetica" href="#">Helvetica</button></li>
							<li class="selectable"><button class=" toolbar__button toolbar__button--font" title="Helvetica" data-name="symbol" href="#">Symbol</button></li>
							<li class="selectable"><button class=" toolbar__button toolbar__button--font" title="Helvetica" data-name="times" href="#">Times New Roman</button></li>
							<li class="selectable"><button class=" toolbar__button toolbar__button--font" title="Helvetica" data-name="zapfdingbats" href="#">Zapf Dingbats</button></li>
                        </ul>
                    </div>
                </li>
                <li class="toolbar__item toolbar__item--fontSize enabled   toolbar__item--submenu fontSize" data-width="85">
                    <button class="toolbar__button toolbar__button--fontSize " data-item="fontSize">
                        <input type="number" value="16.5" class="toolbar__inputButton toolbar__inputButton--fontSize" id="fontSize">
                    </button>
                    <div class="toolbar__tooltip toolbar__tooltip--fontSize">Font size</div>
                    <div class="menuList menutoggle">
                        <ul class="menuList__inner">
                            <li class="selectable">
                                <button class="toolbar__button " data-text="6">6</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="8">8</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="10">10</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="12">12</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="14">14</button>
                            </li>
                            <li class="selectable active">
                                <button class="toolbar__button toolbar__button--selected" data-text="16">16</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="18">18</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="21">21</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="24">24</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="28">28</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="32">32</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="36">36</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="42">42</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="48">48</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="56">56</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="64">64</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="72">72</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="80">80</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="88">88</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="96">96</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="104">104</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="120">120</button>
                            </li>
                            <li class="selectable">
                                <button class="toolbar__button " data-text="144">144</button>
                            </li>
                        </ul>
                    </div>
                </li>
                <li class="toolbar__item toolbar__separator" data-width="11"></li>
                <li class="toolbar__item toolbar__item--color" data-width="34">
                    <input type="color" style="width:40px" bind-value-to="fill">
                    <div class="toolbar__tooltip">Pick a color</div>
                </li>
                <li class="toolbar__item toolbar__separator" data-width="11"></li>
                <li class="toolbar__item toolbar__item--bold" data-width="38">
                    <button class="toolbar__button toolbar__button--bold toolbar__button--icon" data-item="bold" ng-click="toggleBold()" ng-class="{'btn-inverse': isBold()}"><span class="toolbar__label toolbar__label--bold">Bold</span></button>
                    <div class="toolbar__tooltip toolbar__tooltip--bold">Bold</div>
                </li>
                <li class="toolbar__item toolbar__item--italic" data-width="38">
                    <button class="toolbar__button toolbar__button--italic toolbar__button--icon" data-item="italic" ng-click="toggleItalic()" ng-class="{'btn-inverse': isItalic()}"><span class="toolbar__label toolbar__label--italic">Italic</span></button>
                    <div class="toolbar__tooltip toolbar__tooltip--italic">Italic</div>
                </li>
                <li class="toolbar__item toolbar__item--textAlign enabled  toolbar__item--submenu" data-width="38">
                    <button class="toolbar__button toolbar__button--textAlign toolbar__button--icon toolbar__activeItem--left" data-item="textAlign"><span class="toolbar__label toolbar__label--textAlign">Text Align</span></button>
                    <div class="toolbar__tooltip toolbar__tooltip--textAlign">Text Align</div>
                    <menu class="toolbar menutoggle toolbar--textAlign ">
                        <ul class="toolbar__list">
                            <li class="toolbar__item toolbar__item--left enabled toolbar__item--active" data-width="34">
                                <button class="toolbar__button toolbar__button--left toolbar__button--icon" data-item="left" onclick="textalign('left');"><span class="toolbar__label toolbar__label--left">Left</span></button>
                                <div class="toolbar__tooltip toolbar__tooltip--left">Left</div>
                            </li>
                            <li class="toolbar__item toolbar__item--center enabled" data-width="38">
                                <button class="toolbar__button toolbar__button--center toolbar__button--icon" data-item="center" onclick="textalign('center');"><span class="toolbar__label toolbar__label--center">Center</span></button>
                                <div class="toolbar__tooltip toolbar__tooltip--center">Center</div>
                            </li>
                            <li class="toolbar__item toolbar__item--right enabled" data-width="34">
                                <button class="toolbar__button toolbar__button--right toolbar__button--icon" data-item="right"onclick="textalign('right');"><span class="toolbar__label toolbar__label--right">Right</span></button>
                                <div class="toolbar__tooltip toolbar__tooltip--right">Right</div>
                            </li>
                        </ul>
                    </menu>
                </li>
                <!--<li class="toolbar__item toolbar__item--uppercase enabled toolbar__item--active" data-width="44">
                    <button class="uppercase toolbar__button toolbar__button--uppercase toolbar__button--icon" data-item="uppercase"><span class="toolbar__label toolbar__label--uppercase">Uppercase</span></button>
                    <div class="toolbar__tooltip toolbar__tooltip--uppercase">Uppercase<span class="toolbar__shortcut toolbar__shortcut--uppercase">Ctrl  Shift K</span></div>
                </li>-->
                <li class="toolbar__item toolbar__item--list enabled" data-width="38">
                    <button class="toolbar__button toolbar__button--list toolbar__button--icon" data-item="list"><span class="toolbar__label toolbar__label--list">List</span></button>
                    <div class="toolbar__tooltip toolbar__tooltip--list">List</div>
                </li>
				
                <li class="toolbar__item toolbar__separator" data-width="11"></li>
                 <li class="toolbar__item toolbar__item--textSpacing enabled  toolbar__item--submenu" data-width="44">
                    <button class="toolbar__button toolbar__button--textSpacing toolbar__button--icon" data-item="textSpacing"><span class="toolbar__label toolbar__label--textSpacing">Text Spacing</span></button>
                    <div class="toolbar__tooltip toolbar__tooltip--textSpacing">Text Spacing</div>
                    <menu class="toolbar menutoggle toolbar--textSpacing ">
                        <ul class="toolbar__list">
                            <li class="toolbar__item toolbar__item--slider" data-width="317">
                                <label class="toolbar__label toolbar__label--letterSpacing">Letter spacing</label>
                                <div class="toolbar__sliderWrapper">
                                    <div class="toolbar__sliderBackground"></div>
                                    <input type="range" step="10" max="800" min="-200" bind-value-to="charSpacing" class="toolbar__slider toolbar__slider--letterSpacing letterSpacingSliderInput">
                                </div>
                            </li>
                            <li class="toolbar__item toolbar__item--slider" data-width="317">
                                <label class="toolbar__label toolbar__label--lineHeight">Line height</label>
                                <div class="toolbar__sliderWrapper">
                                    <div class="toolbar__sliderBackground"></div>
                                    <input type="range" step="0.01" max="2.5" min="0.5" bind-value-to="lineHeight" class="toolbar__slider toolbar__slider--lineHeight lineHeightSliderInput">
                                </div>
                            </li>
                        </ul>
                    </menu>
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
								<input id="cds-apply-link-url" class="toolbar__input toolbar__input--link" type="text" placeholder="Start typing or paste a URL">
								<button class="button buttonSmall toolbar__submit toolbar__submit--link">Apply</button>
								<div class="toolbar__inputLabel toolbar__inputLabel--link">You can link to external websites</div>
							</li>
						</ul>
					</menu>
				</li>
				<li class="toolbar__item toolbar__item--delete enabled" data-width="34">
					<button data-item="delete" class="toolbar__button toolbar__button--delete toolbar__button--icon" ng-click="removeSelected()">
						<span class="toolbar__label toolbar__label--delete">Delete</span>
					</button>
					<div class="toolbar__tooltip toolbar__tooltip--delete">Delete</div>
				</li>
			</ul>
		</menu>
	</div>
	<div id="text_ddata" class="toggle_div">
		<div class="dayanamic-data-option">
		 <ul class="toolbar__list">
			<input id="customtext1" type="checkbox" style="width: 20px ! important; height: 39px ! important; margin-left: 11px;" class="imagechkdata1" name="imagechkdata" checked>
			<li class="toolbar__item toolbar__button toolbar__item--left enabled dynamic-data">
				<span class="dd-text cds-dd-text">Dynamic Data: </span>
				<select id="database_text">
			<option value="none">None</option>
			<?php
				foreach($result as $key=>$value){
					 print '<option value="'.$key.'">'.$value.'</option>';
				}
			 ?>
			</select>
			</li>
			<li data-width="11" class="toolbar__item toolbar__separator cds-dd-text-separator"></li>
			<li class="toolbar__item toolbar__button toolbar__item--center enabled custom-data cds-dd-text-custom-data">
			<span class="dd-text cds-dd-text-cdt">Custom Dynamic Text: </span>
			<input id="customtext" type="checkbox" class="imagechkdata2" name="imagechkdata">
			<div class="custom_data cds-dd-text-custom_data-div" style="display:none;">
				<span class="dd-text">Name: </span><input type="text" name="data_name">
				<span class="dd-text cds-dd-text-type">Type: </span>
				<select id="custom_texttype">
					<option value="single_line">Single-line Text</option>
					<option value="single_line">Multiple-Line Text</option>
				</select>
				<span class="dd-text">Max Characters: </span><input type="number" name="data_max_chars">
			</div>
			</li>
		</ul>
		</div>
	</div>