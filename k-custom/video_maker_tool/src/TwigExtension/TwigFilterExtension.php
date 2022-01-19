<?php
namespace Drupal\video_maker_tool\TwigExtension;
use Twig_Extension;
use Twig_SimpleFilter;

class TwigFilterExtension extends \Twig_Extension  {
  /**
   * This is the same name we used on the services.yml file
   */
  public function getName() {
    return 'video.twig.filter.extension';
  }

  // Basic definition of the filter. You can have multiple filters of course.
  public function getFilters() {
    return [
      new Twig_SimpleFilter('uc', [$this, 'uc']),
    ];
  }
  
  /**
   * function to upper case 
   * @param $string
   *
   * @return string
   */
  public static function uc($string) {
    return strtoupper($string);
  }
}