module.exports = (data) => `
# wp_boilerplate setup configuration
# Modify for your project, then run \`wp_boilerplate setup\` from this folder

# Project settings
slug: ${data.slug || 'wp_boilerplate-project'} # lowercase letters only (also used for theme slug and PHP namespacing)
title: ${data.title || 'Wordpress Boilerplate Project'}
author:
  name: ${data.author_name || 'werk85'}
  email: ${data.author_email || 'moin@werk85.de'}
  url: ${data.author_url || 'http://www.werk85.de/'}

# WordPress settings
wp:
  admin: # development site admin user credentials
    user: ${data.wp_admin_user || 'demo'}
    pass: ${data.wp_admin_pass || 'password'}
    email: ${data.wp_admin_email || 'moin@werk85.de'}
  lang: de_DE # dev site WP locale/language
  rewrite_structure: /%postname%/ # dev site permalink structure (can be changed later)
  # acf_pro_key: # optional (if set will preinstall Advanced Custom Fields Pro)
  plugins: # optional (installs plugins at setup - use URL slugs from WP plugins directory)
    - advanced-custom-fields
    - force-regenerate-thumbnails
    - debug-bar

# Google Analytics - optional (will preset tracking code in theme, can be added manually later)
# google_analytics_id:
`;
