<?php
namespace Drupal\media_web_system\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Render\Markup;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\taxonomy\Entity\Term;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;

class WebTemplateController extends ControllerBase {  
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function testWebProductTemplate(){
    $con = \Drupal\Core\Database\Database::getConnection('default');
    //echo '<pre>'; print_r($con); echo '</pre>';
    
    /*
    $sql = "INSERT INTO `web_product_templates` (`parent_id`, `product_id`, `node_id`, `user_id`, `media_id`, `name`, `template_file_name`, `description`, `template_group`, `preview_image`, `template_base_html`, `template_variables`, `tags`, `template_type`, `template_status`, `created`, `modified`) VALUES
      (0, 125, 0, 1, 0, 'Email Flyer - Olivia 1', 'email-flyer-olivia-group-01.html', '', 'olivia', 'olivia-design1.jpg', '', '', '', 1, 1, 1617083438, 1624856466),
      (0, 125, 0, 1, 0, 'Email Flyer - Olivia 2', 'email-flyer-olivia-group-02.html', '', 'olivia', 'olivia-design2.jpg', '', '', '', 1, 1, 1617083438, 1624856476),
      (0, 125, 0, 1, 0, 'Email Flyer - Olivia 3', 'email-flyer-olivia-group-03.html', '', 'olivia', 'olivia-design3.jpg', '', '', '', 1, 1, 1617083438, 1624856484),
      (0, 125, 0, 1, 0, 'Email Flyer - Olivia 4', 'email-flyer-olivia-group-04.html', '', 'olivia', 'olivia-design4.jpg', '', '', '', 1, 1, 1617083438, 1624856493),
      (0, 125, 0, 1, 0, 'Email Flyer - Olivia 5', 'email-flyer-olivia-group-05.html', '', 'olivia', 'olivia-design5.jpg', '', '', '', 1, 1, 1617083438, 1624856501),
      (0, 125, 0, 1, 0, 'Email Flyer - Olivia 6', 'email-flyer-olivia-group-06.html', '', 'olivia', 'olivia-design6.jpg', '', '', '', 1, 1, 1617083438, 1624856508),
      (0, 125, 0, 1, 0, 'Email Flyer - Olivia 7', 'email-flyer-olivia-group-07.html', '', 'olivia', 'olivia-design7.jpg', '', '', '', 1, 1, 1617083438, 1624856516),
      (0, 125, 0, 1, 0, 'Email Flyer - Olivia 8', 'email-flyer-olivia-group-08.html', '', 'olivia', 'olivia-design8.jpg', '', '', '', 1, 1, 1617083438, 1624856525),
      (0, 125, 0, 1, 0, 'Email Flyer - Olivia 9', 'email-flyer-olivia-group-09.html', '', 'olivia', 'olivia-design9.jpg', '', '', '', 1, 1, 1617083438, 1624856532),
      (0, 125, 0, 1, 0, 'Email Flyer - Nocturne 1', 'email-flyer-nocturne-group-08.html', '', 'nocturne', 'email-flyer-nocturne-8.jpg', '', '', '', 1, 1, 1617083438, 1624856540);";
      
    \Drupal::database()->query($sql);
    */
    
    die('here');
	}
  
  /**
   * send email to check templates.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function sendMail() {
    global $base_url;  
    
    $query = \Drupal::database()->select('web_product_templates', 'wpt');
    $query->fields('wpt'); 
    $query->condition('wpt.id', 1, '=');
    $template = $query->execute()->fetchObject();
    
    $message = '<head><link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Philosopher"><link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Poppins"></head>';
    $message .= $template->template_html;

    $mailManager = \Drupal::service('plugin.manager.mail');
    $module = 'media_web_system';
    $key = 'email_flyer';
    
    $to = 'synapseteamu2@gmail.com';
    
    $params = [];
    $params['message'] = $message;
    $params['subject'] = 'Test Subject';
    
    $langcode = \Drupal::currentUser()->getPreferredLangcode();
    $send = true;

    $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
    
    echo $message.'<br><br>';
    
    if($result['result'] !== true) {
      die('There was a problem sending your message and it was not sent.');
    }
    else {
      die('Your message has been sent.');
    }
	}
}