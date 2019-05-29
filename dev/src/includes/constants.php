<?php
namespace Constants;

class PostTypeConstants {

  static $postTypePlaceholderTitles = [
    'myPostType' => 'Specify placeholder text here',
    'myOtherPostType' => 'Specify placeholder text here'
  ];

  public static function getPostTypePlaceholderText($postType) {
    return array_key_exists($postType, self::$postTypePlaceholderTitles) ? self::$postTypePlaceholderTitles[$postType] : false;
  }
}