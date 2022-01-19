<?php

namespace Drupal\km_subscription_system\Tests;

use Drupal\simpletest\WebTestBase;

/**
 * Provides automated tests for the km_subscription_system module.
 */
class VerifycodeControllerTest extends WebTestBase {


  /**
   * {@inheritdoc}
   */
  public static function getInfo() {
    return [
      'name' => "km_subscription_system VerifycodeController's controller functionality",
      'description' => 'Test Unit for module km_subscription_system and controller VerifycodeController.',
      'group' => 'Other',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function setUp() {
    parent::setUp();
  }

  /**
   * Tests km_subscription_system functionality.
   */
  public function testVerifycodeController() {
    // Check that the basic functions of module km_subscription_system.
    $this->assertEquals(TRUE, TRUE, 'Test Unit Generated via Drupal Console.');
  }

}
