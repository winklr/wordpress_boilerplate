<?php
/* =========================================================================
   Admin-specific configuration, scripts and handlers
   ========================================================================= */

namespace Fabrica\Devkit;

use Symbiotic\Acf\Field\PostTypeSelector\Loader;

require_once('singleton.php');

class Admin extends Singleton {

	public function init() {
		// Exit now for non-admin requests
		if (!is_admin()) { return; }

		// Hooks that need to run for both AJAX + admin requests
		// add_action('action_name', array($this, 'memberFunction'));
		// add_filter('filter_name', array($this, 'memberFunction'));

		// Exit now if AJAX request, to register pure admin-only requests after
		if (wp_doing_ajax()) { return; }

    // register ACF-PostTypeSelector plugin
    add_action( 'acf/include_fields', [ $this, 'registerAcfPostTypeSelector'] );

		// Hooks that only need to run in pure admin mode
		// add_action('action_name', array($this, 'memberFunction'));
		// add_filter('filter_name', array($this, 'memberFunction'));
	}

  function registerAcfPostTypeSelector() {
    new Loader();
  }
}

// Create a singleton instance of Admin
Admin::instance()->init();
