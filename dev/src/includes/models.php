<?php
/* =========================================================================
   Run-time extensions of Timber classes to provide custom data to templates
   ========================================================================= */

namespace Timber;

class YoutubeVideo {
  private $id;

  const PREVIEW_TEMPLATE_STRING = "https://img.youtube.com/vi/%s/hqdefault.jpg";

  public function __construct($url) {
    try {
      if (!preg_match('/.*www\.youtube\.com\/watch\?v=(.*)$/', $url, $match)) {
        preg_match('/.*youtu\.be\/(.*)$/', $url, $match);
      }

      if (!isset($match[1])) throw new \Exception("Konnte YouTube video id nicht erkennen. Falsche Url angegeben? url: $url");

      $this->id = $match[1];

    } catch (\Exception $e) {
      echo $e->getMessage();
    }
  }

  /**
   * @return string
   */
  public function url() {
    return "https://www.youtube.com/embed/$this->id";
  }

  /**
   * @return string
   */
  public function id() {
    return "video$this->id";
  }


  /**
   * @return string
   */
  public function previewUrl() {
    return sprintf(self::PREVIEW_TEMPLATE_STRING, $this->id);
  }
}