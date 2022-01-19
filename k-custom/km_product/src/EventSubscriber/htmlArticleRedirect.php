<?php
/**
* @file
* Contains \Drupal\km_product\Controller\htmlArticleRedirect.php
*
*/
namespace Drupal\km_product\EventSubscriber;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Drupal\Core\Session\AccountInterface;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Url;
use Drupal\node\NodeInterface;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;



class htmlArticleRedirect implements EventSubscriberInterface {

  public function checkForRedirection(GetResponseEvent $event) {
    $uid = (int)\Drupal::currentUser()->id();
    if($uid > 1){
      $path = \Drupal::request()->getpathInfo();
      $arg  = explode('/',$path);
      if ($arg[1] == 'node' && is_numeric($arg[2]) && $arg[3] == 'edit') {
        $node = Node::load($arg[2]);
        if ($node->isPublished() && $node->getType() == 'html_article'){
          $response = new RedirectResponse('/tools/html-article/'.$arg[2].'/edit');
          $response->send();
          exit(0);
        }
      }
      else if($arg[1] == 'node' && is_numeric($arg[2]) && !isset($arg[3])){
        $node = Node::load($arg[2]);
        if ($node->isPublished() && $node->getType() == 'html_article'){
          $response = new RedirectResponse('/tools/html-article/'.$uid);
          $response->send();
          exit(0);
        }
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events[KernelEvents::REQUEST][] = array('checkForRedirection');
    return $events;
  }
}
