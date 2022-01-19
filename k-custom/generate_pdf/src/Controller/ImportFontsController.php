<?php

namespace Drupal\generate_pdf\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Class ImportFontsController.
 */
class ImportFontsController extends ControllerBase {

  /**
   * Showlist.
   *
   * @return string
   *   Return Hello string.
   */
  public function showlist() {
         $header = [
      // We make it sortable by id	.
      ['data' => $this->t('ID'), 'field' => 'id', 'sort' => 'desc'],
      ['data' => $this->t('UID'), 'field' => 'uid'],
      ['data' => $this->t('Name'), 'field' => 'name'],
	  ['data' => $this->t('S3 path'), 'field' => 'full_s3'],
      ['data' => $this->t('Font Name in TCPDF'), 'field' => 'tcpdf_name'],
      ['data' => $this->t('status'), 'field' => 'status'],
    ];
    $db = \Drupal::database();
    $query = $db->select('import_fonts','c');
    $query->fields('c');
    // The actual action of sorting the rows is here.
    $table_sort = $query->extend('Drupal\Core\Database\Query\TableSortExtender')
                        ->orderByHeader($header);
    // Limit the rows to 20 for each page.
    $pager = $table_sort->extend('Drupal\Core\Database\Query\PagerSelectExtender')
                        ->limit(20);
    $result = $pager->execute();
 
    // Populate the rows.
    $rows = [];
    foreach($result as $row) {
      $rows[] = ['data' => [
        'id' => $row->id,
        'uid' => $row->uid,
	    'name' => $row->name,
	    'full_s3' => $row->full_s3,
	    'tcpdf_name' => $row->tcpdf_name,
		'status' => $row->status,
      ]];
    }
 
    // The table description.
    $build = array(
      '#markup' => t('List of All Fonts')
    );
 
    // Generate the table.
    $build['config_table'] = array(
      '#theme' => 'table',
      '#header' => $header,
      '#rows' => $rows,
    );
 
    // Finally add the pager.
    $build['pager'] = array(
      '#type' => 'pager'
    );
 
    return $build;
  }

}
