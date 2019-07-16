<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * To generate specific templates for your pages you can use:
 * /src/templates/views/page-mypage.twig
 * (which will still route through this PHP file)
 * OR
 * /src/templates/controller/page-mypage.php
 * (in which case you'll want to duplicate this file and save to the above path)
 *
 */

$data = \Timber\Timber::get_context();
$post = new \Timber\Post();


// --- Latest Posts (START) ---
$content = $post->meta('content');

if ($content) {
// load layouts for acf latest_posts
  $acf_latest_posts_layouts = array_filter($content, function ($content) {
    return $content['acf_fc_layout'] === 'latest_posts';
  });

  $latest_posts = array_reduce($acf_latest_posts_layouts, function ($result, $layout) {
    $post_type = $layout['post_type'];
    $numberposts = $layout['count'];
    $page_size = $layout['page_size'];
    $posts = Timber::get_posts(array(
      'post_type' => $post_type,
      'numberposts' => $numberposts,
      'orderby' => 'post_date',
      'order' => 'DESC',
      'post_status' => 'publish'
    ));
    $result[$post_type] = array_chunk($posts, $page_size);
    return $result;
  });

  $contentsWithId = array_filter($content, function ($content) {
    return $content['id'];
  });

  $anchorLinks = array_reduce($contentsWithId, function ($result, $content) {
    $result[] = array(
      'id' => $content['id'],
      'title' => $content['title'] ?? $content['headline']
    );

    return $result;
  }, []);

  $data['anchorLinks'] = $anchorLinks;
  $data['latest_posts'] = $latest_posts;

}
// --- Latest Posts (END) ---

$data['post'] = $post;
$templates = array(
  'page-' . $post->post_name . '.twig',
  'page.twig'
);

if (is_front_page()) {
  array_unshift($templates, 'page-home.twig');
}

\Timber\Timber::render($templates, $data);