<?php

namespace Drupal\stripe_subscription_and_customer\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\Core\Render\Markup;

/**
 * Class CustommerinvoicesController.
 */
class CustommerinvoicesController extends ControllerBase {

  /**
   * Customerinvoices.
   *
   * @return string
   *   Return Hello string.
   */
  public function customerinvoices($user) {
    //$uid
    //$user = \Drupal::entityTypeManager()->getStorage('user')->load();
    $customer_id = $user->get('stripe_customer_id')->value;
    if(isset($customer_id) && !empty($customer_id)) {
      $invoices = \Drupal::service('stripe_subscription_and_customer.stripe_api')->retrieveInvoice($customer_id);
      $header = [
       // 'id' => t('<a>ID</a>'),
        ['data' => t('Date'), 'field' => 'created'],
        ['data' => t('Amount'), 'field' => 'amount_paid'],
        ['data' => t('Invoice'), 'field' => 'number'],
        ['data' => t('Status'), 'field' => 'status'],
        ['data' => t('Download')],
      ];
      $objs = $invoices->data;
      $rows = [];
      $edit_img = '<img src="'. base_path() . drupal_get_path('module', 'stripe_subscription_and_customer') . '/images/download-bottom.png" width="20"/>';
      $edit_icon = Markup::create(render($edit_img));
      foreach($objs as $key => $obj) {
        $d1 = Link::fromTextAndUrl($edit_icon, Url::fromUri($obj->hosted_invoice_url))->toString();
        $d2 = Link::fromTextAndUrl($edit_icon, Url::fromUri($obj->invoice_pdf))->toString();
        $c = \Drupal::service('date.formatter')->format($obj->created, 'custom', 'm/d/Y');
        $rows[] = [
        // 'id' => ['data' => $obj->id],
          'created' => ['data' => $c],
          'amount_paid' => ['data' => '$'.number_format(($obj->amount_paid/100),2,".",",")],
          'number' => ['data' => $obj->number, 'align' => 'center'],
          'status' => ['data' => ucfirst($obj->status), 'align' => 'center'],
          'download' => ['data' => $d1, 'align' => 'center'],
        ];
      }
      return [
        '#type' => 'table',
        '#header' => $header,
        '#rows' => $rows,
        '#attributes' => [
          'id' => 'search',
          'class' => ['cmttblcls'],
        ],
      ];
    } else {
      return [
        '#markup' => 'No Plan found'
      ];
    }
  }
}
