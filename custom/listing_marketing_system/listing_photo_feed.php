<?php

/**
 * @file
 * The PHP page that serves all page requests on a Drupal installation.
 *
 * The routines here dispatch control to the appropriate handler, which then
 * prints the appropriate page.
 *
 * All Drupal code is released under the GNU General Public License.
 * See COPYRIGHT.txt and LICENSE.txt.
 */

/**
 * Root directory of Drupal installation.
 */
chdir('/var/www/html/');
define('DRUPAL_ROOT', getcwd());

require_once DRUPAL_ROOT . '/includes/bootstrap.inc';
drupal_override_server_variables();
drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);

global $base_url;

/*
$url = $base_url.'/feeds/photo-feed';
$response  = drupal_http_request($url);
*/

if(module_exists('listing_marketing_system')) { 
	cbone_photo_feeds_import();
}




