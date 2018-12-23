<?php
/**
 * The Template for displaying all single posts
 */

$data = \Timber\Timber::get_context();
$post = new \Timber\Post();
$data['post'] = $post;

if ( post_password_required( $post->ID ) ) {
  \Timber\Timber::render( 'single-password.twig', $data );
} else {
  \Timber\Timber::render( array( 'single-' . $post->ID . '.twig', 'single-' . $post->post_type . '.twig', 'single.twig' ), $data );
}