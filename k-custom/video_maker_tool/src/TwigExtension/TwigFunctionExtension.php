<?php
namespace Drupal\video_maker_tool\TwigExtension;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

/**
 * Custom twig functions.
 */
class TwigFunctionExtension extends AbstractExtension {
  
	public function getFunctions() {
	  return [
	    new TwigFunction('uc_first', [$this, 'uc_first']),
	  ];
	}
  
  /**
   * function to upper case 
   * @param $string
   *
   * @return string
   */
  public static function uc_first($string) {
    return ucfirst($string);
  }
  
}