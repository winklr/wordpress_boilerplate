<?php
/**
 * Search results page
 *
 */
$templates = array( 'search.twig', 'archive.twig', 'index.twig' );
$data          = \Timber\Timber::get_context();
$data['title'] = 'Suchergebnisse für ' . get_search_query();
$data['posts'] = new \Timber\PostQuery();
\Timber\Timber::render( $templates, $data );