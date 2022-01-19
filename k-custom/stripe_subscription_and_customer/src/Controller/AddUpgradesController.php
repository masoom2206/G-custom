<?php

namespace Drupal\stripe_subscription_and_customer\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\Component\Render\FormattableMarkup;
use Drupal\Component\Serialization\Json;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\CloseModalDialogCommand;
use Drupal\Core\Ajax\RedirectCommand;

/**
 * Class AddUpgradesController.
 */
class AddUpgradesController extends ControllerBase {

  /**
   * Upgrades.
   *
   * @return string
   *   Return Hello string.
   */
  public function upgrades() {
      $header = [
        ['data' => t('Subsubscription ID'), 'field' => 'sub_id'],
        ['data' => t('Uid'), 'field' => 'uid'],
        ['data' => t('customer id'), 'field' => 'customer_id'],
        ['data' => t('Date'), 'field' => 'created', 'sort' => 'asc'],
        ['data' => t('Action')],
      ];
      $conn = \Drupal::database();
      $record = array();
      $query = $conn->select('upgrades_products', 'up')
        ->fields('up')
        ->condition('up.status', '1', '=');
      $table_sort = $query->extend('Drupal\Core\Database\Query\TableSortExtender')
                        ->orderByHeader($header);
      // Limit the rows to 20 for each page.
      $pager = $table_sort->extend('Drupal\Core\Database\Query\PagerSelectExtender')
                        ->limit(20);
      $record = $pager->execute()->fetchAll();
      foreach($record as $key => $obj) {
        $url_link_delete = Url::fromRoute('stripe_subscription_and_customer.remove_addupgrades_form', ['uid' => $obj->uid, 'sub_id' => $obj->sub_id]);
        $url_delete = $url_link_delete->toString();
        $url_delete = new FormattableMarkup('<a href=":link" class="mr-3 btn-primary btn use-ajax use-ajax" data-dialog-type="modal"  data-dialog-options="{&quot;width&quot;:500}" data-backdrop="true">@name</a>', [':link' =>  $url_delete, '@name' => 'Delete']);
        $rows[] = [
        // 'id' => ['data' => $obj->id],
          'sub_id' => ['data' => $obj->sub_id],
          'uid' => ['data' => $obj->uid],
          'customer_id' => ['data' => $obj->customer_id , 'align' => 'center'],
          'created' => ['data' => \Drupal::service('date.formatter')->format($obj->created, 'custom', 'm/d/Y'), 'align' => 'center'],
          'action' => ['data' => $url_delete, 'align' => 'center'],
        ];
      }
      
       
    // Generate the table.
    $build['config_table'] = array(
      '#theme' => 'table',
      '#header' => $header,
      '#rows' => $rows,
      '#attributes' => [
        'id' => 'search',
        'class' => ['cmttblcls'],
      ],
    );
 
    // Finally add the pager.
    $build['pager'] = array(
      '#type' => 'pager'
    );
    return $build;
  }
}