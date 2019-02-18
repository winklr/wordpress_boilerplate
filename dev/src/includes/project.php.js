module.exports = (settings) => `<?php
/* =========================================================================
   Project-specific configuration, scripts and handlers
   ========================================================================= */

namespace Fabrica\\Devkit;

require_once('singleton.php');

// Set content width value based on the theme's design
if (!isset($content_width)) {
	$content_width = 1440;
}

class Project extends Singleton {

	// Namespace for this project
	public static $projectNamespace = '${settings.slug}';

	// Project scripts main handle
	public static $mainHandle = '${settings.slug}-main';

	// Tag for sending variables to front-end's script
	public static $varsTag = '${settings.slug}_script_vars';

	// Menus required
	public static $menus = array('main' => 'Main menu');

	// Google Analytics ID (injected by Base class)
	public static $googleAnalyticsId = '${settings.google_analytics_id || ''}';

	public function init() {
		add_action('init', array($this, 'registerStructure'));
		add_filter('acf/fields/flexible_content/layout_title', array($this, 'my_layout_title'), 10, 4);
		add_filter('enter_title_here', array($this, 'customTitlePlaceholderText'), 10, 2);
		
		// remove comments
        add_action('admin_init',array($this, 'disable_comments'));
        add_action('admin_menu',array($this, 'remove_comment_menu'));

		// Project-specific tags, hooks and initialisations
		// add_action('action_name', array($this, 'actionHandler'));
		// add_filter('filter_name', array($this, 'filterHandler'));
	}

	// Register Custom Post Types and Taxonomies
	public function registerStructure() {

		// http://generatewp.com/ has a useful generator
	}
	
	public function customTitlePlaceholderText($title, $post) {
        return \\Constants\\PostTypeConstants::getPostTypePlaceholderText($post->post_type) ?: $title;
    }
  
	function my_layout_title($title, $field, $layout, $i) {
        if($value = get_sub_field('headline')) {
          return $value;
        } else {
          foreach($layout['sub_fields'] as $sub) {
            if($sub['name'] == 'layout_title') {
              $key = $sub['key'];
              if(array_key_exists($i, $field['value']) && $value = $field['value'][$i][$key])
                return $value;
            }
          }
        }
        return $title;
    }
  
    public function disable_comments() {
        $post_types = get_post_types();
        foreach ($post_types as $post_type) {
          if(post_type_supports($post_type,'comments')) {
            remove_post_type_support($post_type,'comments');
            remove_post_type_support($post_type,'trackbacks');
          }
        }
    }

  public function remove_comment_menu() {
      remove_menu_page('edit-comments.php');
  }

}

// Create a singleton instance of Project
Project::instance()->init();
`;
