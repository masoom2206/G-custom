<?php

namespace Drupal\media_vault_tool\Form;
  
use Drupal\Core\Form\FormStateInterface;
use Drupal\system\Form\SiteInformationForm;  

/**
 *  Defines a form that configure Media Vault Settings.
 */
class ExtendedSiteInformationForm extends SiteInformationForm {
   
	/**
   * {@inheritdoc}
   */
	public function buildForm(array $form, FormStateInterface $form_state) {
		$site_config = $this->config('system.site');
		$form =  parent::buildForm($form, $form_state);
		$form['site_information']['site_server_name'] = [
			'#type' => 'textfield',
			'#title' => t('Site Server Name'),
      '#required' => TRUE,
			'#default_value' => $site_config->get('site_server_name') ?: '',
			'#description' => t("Custom field to set the server name"),
		];
		
		return $form;
	}
	
	public function submitForm(array &$form, FormStateInterface $form_state) {
		$this->config('system.site')
		  ->set('site_server_name', $form_state->getValue('site_server_name'))
		  ->save();
		parent::submitForm($form, $form_state);
	}
}