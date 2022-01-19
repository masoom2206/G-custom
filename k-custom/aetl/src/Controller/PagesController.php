<?php
/** 
* Controller file for Aetl Drupal 8 module. 
* Place this file in src/Controller folder inside the Aetl module folder
**/
namespace Drupal\aetl\Controller;
use Drupal\Core\Controller\ControllerBase;
use Aws\Exception\AwsException;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\Component\Render\FormattableMarkup;
use Drupal\Component\Serialization\Json;

class PagesController extends ControllerBase {
  public function pipelineslist() {
    $config = \Drupal::config('aetl.settings')->get();
    $messenger = \Drupal::messenger();
    if ($errors = \Drupal::service('aetl')->validate($config)) {
      foreach ($errors as $error) {
        $messenger->addMessage((string)$error, $messenger::TYPE_ERROR);
      }
      $messenger->addMessage('Unable to validate your aetl configuration settings. Please configure aetl File System from the admin/config/media/aetl page and try again.', $messenger::TYPE_ERROR);
      return;
    } 
    $transcoder_client = \Drupal::service('aetl')->getAmazonETClient($config);
    $rows = [];
    try {
      $result = $transcoder_client->listPipelines([])->toArray();
      foreach ($result['Pipelines'] as $pipeline) {
        $url_link_edit = Url::fromRoute('aetl.pipelinesedit', ['pid' => $pipeline['Id']]);
        $url_edit = $url_link_edit->toString();
        $url_edit = new FormattableMarkup('<a href=":link">@name</a>', [':link' =>  $url_edit, '@name' => 'Edit']);
        $url_link_delete = Url::fromRoute('aetl.pipelinesedelete', ['pid' => $pipeline['Id']]);
        $url_delete = $url_link_delete->toString();
        $url_delete = new FormattableMarkup('<a href=":link">@name</a>', [':link' =>  $url_delete, '@name' => 'Delete']);
        $mainLink = t('@edit | @delete', array('@edit' => $url_edit, '@delete' => $url_delete));
        $output['data'] = [
          'id' => $pipeline['Id'],
          'name' => $pipeline['Name'],
          'status' => $pipeline['Status'],
          'inputbucket' => $pipeline['InputBucket'],
          'outputbucket' => $pipeline['OutputBucket'],
          'action' =>  $mainLink
        ];
        $rows[] = $output;
      }
    }
    catch (AwsException $e) {
      // output error message if fails
      echo $e->getMessage() . "\n";
    }
    $header = [
      'id' => t('Id'),
      'name' => t('Name'),
      'status' => t('Status'),
      'inputbucket' => t('Input Bucket'),
      'outputbucket' => t('Output Bucket'),
      'action' => t('Action'),
    ];
    $url_link_add = Url::fromRoute('aetl.pipelinesadd', ['pid' => $pipeline['Id']])->toString();
    $build = [
      'table' => [
        '#prefix' => '<h1>Pipeline List</h1><br/><a href="'.$url_link_add.'" class="button button--primary" role="button">Add New Pipeline</a><br/>',
        '#theme' => 'table',
        '#header' => $header,
        '#rows' => $rows,
      ],
    ];
    return $build;
  }

  public function jobslist($pipeline) {
    $config = \Drupal::config('aetl.settings')->get();
    $messenger = \Drupal::messenger();
    if ($errors = \Drupal::service('aetl')->validate($config)) {
      foreach ($errors as $error) {
        $messenger->addMessage((string)$error, $messenger::TYPE_ERROR);
      }
      $messenger->addMessage('Unable to validate your aetl configuration settings. Please configure aetl File System from the admin/config/media/aetl page and try again.', $messenger::TYPE_ERROR);
      return;
    } 
    $transcoder_client = \Drupal::service('aetl')->getAmazonETClient($config);
    $rows = [];
    try {
      $result = $transcoder_client->listPipelines([])->toArray();
      foreach ($result['Pipelines'] as $pipeline) {
        try {
          $pipelinejobs = $transcoder_client -> listJobsByPipeline([
              'PipelineId' =>$pipeline['Id'], 
          ])->toArray();
          foreach ($pipelinejobs['Jobs'] as $job) {
            $output['data'] = [
              'id' => $job['Id'],
              'pipelineid' => $job['PipelineId'],
              'status' => $job['Status'],
              'inputs' => $job['Inputs'],
              'outputs' => $job['Outputs'],
              'outputkeyprefix' => $job['OutputKeyPrefix'],
            ];
            $rows[] = $output;
          }
        } catch (AwsException $e) {
            // output error message if fails
            echo $e->getMessage() . "\n";
        }
        
      }
    }
    catch (AwsException $e) {
      // output error message if fails
      echo $e->getMessage() . "\n";
    }
    $header = [
      'id' => t('Job Id'),
      'pipelineid' => t('PipelineId'),
      'status' => t('Status'),
      'inputs' => t('Inputs'),
      'outputs' => t('Outputs'),
      'outputkeyprefix' => t('OutputKeyPrefix'),
    ];
    $build = [
      'table' => [
        '#prefix' => '<h1>Jobs List</h1>',
        '#theme' => 'table',
        '#attributes' => [
          'data-striping' => 0
        ],
        '#header' => $header,
        '#rows' => $rows,
      ],
    ];
    return $build;
  }

  public function presetslist() {
    $config = \Drupal::config('aetl.settings')->get();
    $messenger = \Drupal::messenger();
    if ($errors = \Drupal::service('aetl')->validate($config)) {
      foreach ($errors as $error) {
        $messenger->addMessage((string)$error, $messenger::TYPE_ERROR);
      }
      $messenger->addMessage('Unable to validate your aetl configuration settings. Please configure aetl File System from the admin/config/media/aetl page and try again.', $messenger::TYPE_ERROR);
      return;
    } 
    $transcoder_client = \Drupal::service('aetl')->getAmazonETClient($config);
    $rows = [];
    try {
      $result = $transcoder_client->listPresets([])->toArray();
      foreach ($result['Presets'] as $presets) {
        $output['data'] = [
          'id' => $presets['Id'],
          'name' => $presets['Name'],
          'container' => $presets['Container'],
          'description' => $presets['Description'],
        ];
        $rows[] = $output;
      }
    }
    catch (AwsException $e) {
      // output error message if fails
      echo $e->getMessage() . "\n";
    }
    $header = [
      'id' => t('Preset Id'),
      'name' => t('Name'),
      'container' => t('Container'),
      'description' => t('Description'),
    ];
    $build = [
      'table' => [
        '#prefix' => '<h1>Preset List</h1>',
        '#theme' => 'table',
        '#attributes' => [
          'data-striping' => 0
        ],
        '#header' => $header,
        '#rows' => $rows,
      ],
    ];
    return $build;
  }
  
  public function updatejobstatus() {
	$database = \Drupal::database();
	$query = $database->select('transcoding_jobs_data','c');
    $query->fields('c');
	$query->condition('status', 'Submitted', 'LIKE');
	$result = $query->execute();
	foreach($result as $row) {
      $config = \Drupal::config('aetl.settings')->get();
      $messenger = \Drupal::messenger();
      if ($errors = \Drupal::service('aetl')->validate($config)) {
        foreach ($errors as $error) {
          $messenger->addMessage((string)$error, $messenger::TYPE_ERROR);
        }
        $messenger->addMessage('Unable to validate your aetl configuration settings. Please configure aetl File System from the admin/config/media/aetl page and try again.', $messenger::TYPE_ERROR);
        return;
      } 
      $transcoder_client = \Drupal::service('aetl')->getAmazonETClient($config);
      try {
        $jobdetails = $transcoder_client->readJob(array(
          'Id' => $row->jobs_id,
        ))->toArray();
		 db_merge('transcoding_jobs_data')
		   ->key(array('mid' => $row->mid, 'jobs_id' => $row->jobs_id))
		   ->fields(array('mid' => $row->mid, 'jobs_id' => $row->jobs_id, 'status' => $jobdetails['Job']['Output']['Status'], 'starttimemillis' => $jobdetails['Job']['Timing']['StartTimeMillis'], 'finishtimemillis' => $jobdetails['Job']['Timing']['FinishTimeMillis'], 'processtime' => ($jobdetails['Job']['Timing']['FinishTimeMillis'] - $jobdetails['Job']['Timing']['StartTimeMillis']), 'details' => $jobdetails['Job']['Output']['StatusDetail']))
		   ->execute();
      }
      catch (AwsException $e) {
        // output error message if fails
        //echo $e->getMessage() . "\n";
      }  
	}
	\Drupal::logger('cron debug video 1')->error('<pre><code>' . print_r($result, TRUE) . '</code></pre>');
	return ['#markup' => 'completed'];
  }

  public function detailsjobs(){
	  
	$header = [
      // We make it sortable by name.
      ['data' => $this->t('ID'), 'field' => 'id', 'sort' => 'desc'],
      ['data' => $this->t('UID'), 'field' => 'uid'],
      ['data' => $this->t('KM File ID'), 'field' => 'mid'],
	  ['data' => $this->t('preset id'), 'field' => 'preset_id'],
      ['data' => $this->t('start time')],
      ['data' => $this->t('completion time')],
	  ['data' => $this->t('status'), 'field' => 'status'],
	  ['data' => $this->t('cost')],
	 // ['data' => $this->t('Details')],	  
    ];
    $db = \Drupal::database();
    $query = $db->select('transcoding_jobs_data','c');
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
	    'media_id' => $row->mid,
	    'preset_id' => $row->preset_id,
	    'starttimemillis' => $row->starttimemillis,
	    'time' => $row->finishtimemillis,
		'status' => $row->status,
	    'cost' => $row->cost,
		//'details' => $row->details,
      ]];
    }
 
    // The table description.
    $build = array(
      '#markup' => t('List of All Configurations')
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
	$rows = [];
    $build = [
      'table' => [
        '#prefix' => '<h1>Jobs List</h1>',
        '#theme' => 'table',
        '#attributes' => [
          'data-striping' => 0
        ],
        '#header' => $header,
        '#rows' => $rows,
      ],
    ];
	\Drupal::logger('cron debug video 2')->error('<pre><code>' . print_r($build, TRUE) . '</code></pre>');
    return $build;
  }
  
  public function detailsjobsuser($uid){
	$rows = [];
	$header = [
      'id' => t('ID'),
      'uid' => t('UID'),
      'media_id' => t('KM File ID'),
	  'preset_id' => t('preset id'),
      'status' => t('start time'),
      'time' => t('completion time'),
	  'cost' => t('cost'),
    ];
    $build = [
      'table' => [
        '#prefix' => '<h1>Jobs List</h1>',
        '#theme' => 'table',
        '#attributes' => [
          'data-striping' => 0
        ],
        '#header' => $header,
        '#rows' => $rows,
      ],
    ];
    return $build;
  }
  function jobdetailsbyid($job_id) {
    $config = \Drupal::config('aetl.settings')->get();
    $messenger = \Drupal::messenger();
    if ($errors = \Drupal::service('aetl')->validate($config)) {
      foreach ($errors as $error) {
        $messenger->addMessage((string)$error, $messenger::TYPE_ERROR);
      }
      $messenger->addMessage('Unable to validate your aetl configuration settings. Please configure aetl File System from the admin/config/media/aetl page and try again.', $messenger::TYPE_ERROR);
      return;
    } 
    $transcoder_client = \Drupal::service('aetl')->getAmazonETClient($config);
    try {
      $jobbyid = $transcoder_client->readJob(array(
          // Id is required
          'Id' => $job_id,
      ))->toArray();
      $dataoutput = '';
      if ($jobbyid) { 
        foreach ($jobbyid['Job']['Outputs'] as $key => $value) {
          $dataoutput .= '<li><b>Outputs ' . $key . ': </b>' . $value['Key'] .' (Status : ' . $value['Status']  . ')</li>';
        }
        $jobsdetails = '<ul>
                      <li><b>Id: </b>' . $jobbyid['Job']['Id'] . '</li>
                      <li><b>Input: </b>' . $jobbyid['Job']['Input']['Key'] . '</li>
                       ' . $dataoutput . '
                      </ul>';
      }
    } 
    catch (AwsException $e) {
      // output error message if fails
      echo $e->getMessage() . "\n";
    }
    return array(
      '#type' => 'markup',
      '#markup' => $this->t($jobsdetails),
	);
  }

  function jobsiddetails($pipeline_id) {
    $config = \Drupal::config('aetl.settings')->get();
    $messenger = \Drupal::messenger();
    if ($errors = \Drupal::service('aetl')->validate($config)) {
      foreach ($errors as $error) {
        $messenger->addMessage((string)$error, $messenger::TYPE_ERROR);
      }
      $messenger->addMessage('Unable to validate your aetl configuration settings. Please configure aetl File System from the admin/config/media/aetl page and try again.', $messenger::TYPE_ERROR);
      return;
    } 
    $transcoder_client = \Drupal::service('aetl')->getAmazonETClient($config);
    $rows = [];
    if ($pipeline_id == 'all' || $pipeline_id == '') {
      try {
        $result = $transcoder_client->listPipelines([])->toArray();
        foreach ($result['Pipelines'] as $pipeline) {
          try {
            $pipelinejobs = $transcoder_client -> listJobsByPipeline([
              'PipelineId' =>$pipeline['Id'], 
            ])->toArray();
            foreach ($pipelinejobs['Jobs'] as $job) {
              $url_link_view = Url::fromRoute('aetl.jobbyid', ['job_id' => $job['Id']]);
              $url_view = $url_link_view->toString();
              $url_view = new FormattableMarkup('<a href=":link">@name</a>', [':link' =>  $url_view, '@name' => 'View']);
              $menu = t('@view', array('@view' => $url_view));
              $output['data'] = [
                'id' => $job['Id'],
                'pipelineid' => $job['PipelineId'],
                'status' => $job['Status'],
                'outputkeyprefix' => $job['OutputKeyPrefix'],
                'oprations' => $menu
              ];
              $rows[] = $output;
            }
          } 
          catch (AwsException $e) {
            // output error message if fails
            echo $e->getMessage() . "\n";
          }
          
        }
      } 
      catch (AwsException $e) {
        // output error message if fails
        echo $e->getMessage() . "\n";
      }
    }
    else {
      try {
        $pipelinejobs = $transcoder_client -> listJobsByPipeline([
          'PipelineId' => $pipeline_id, 
        ])->toArray();
        foreach ($pipelinejobs['Jobs'] as $job) {
          $url_link_view = Url::fromRoute('aetl.jobbyid', ['job_id' => $job['Id']]);
          $url_view = $url_link_view->toString();
          $url_view = new FormattableMarkup('<a href=":link">@name</a>', [':link' =>  $url_view, '@name' => 'View']);
          $menu = t('@view', array('@view' => $url_view));
          $output['data'] = [
            'id' => $job['Id'],
            'pipelineid' => $job['PipelineId'],
            'status' => $job['Status'],
            'outputkeyprefix' => $job['OutputKeyPrefix'],
            'oprations' => $menu
          ];
          $rows[] = $output;
        }
      }
      catch (AwsException $e) {
        // output error message if fails
        echo $e->getMessage() . "\n";
      }
    }
    $url_link_add = Url::fromRoute('aetl.jobadd')->toString();
    $header = [
      'id' => t('Job Id'),
      'pipelineid' => t('PipelineId'),
      'status' => t('Status'),
      'outputkeyprefix' => t('OutputKeyPrefix'),
      'oprations' => ('Operations')
    ];
    $build = [
      'table' => [
        '#prefix' => '<h1>Jobs List</h1><br/><a href="'.$url_link_add.'" class="button button--primary" role="button">Create a New Transcoding Job</a><br/>',
        '#theme' => 'table',
        '#attributes' => [
          'data-striping' => 0
        ],
        '#header' => $header,
        '#rows' => $rows,
      ],
    ];
    return $build;
  }
  
}