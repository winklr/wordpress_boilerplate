module.exports = (settings) => `
# ${settings.slug}
${settings.title}

## Requirements + dependencies
Fabrica Dev Kit is compatible with recent versions of Mac OS X. It has a few dependencies:

1. **Docker** – download and run the installer by following the link for Mac OS X from the [Docker downloads page](https://docs.docker.com/docker-for-mac/) (Stable channel is fine).
1. **Node.js** – download and run the installer by following the link to the Recommended Version from the [Node.js homepage](https://nodejs.org/en/).
1. **Gulp command line tools** – once Node.js is installed, run 'npm install gulpjs/gulp-cli -g' from the command line. (Version 1.2.2 or higher required.)
1. **Composer** – follow the Global installation instructions in the [Composer installation guide](https://getcomposer.org/doc/00-intro.md#globally).


## Installation

1. clone into local folder
1. run __npm install__
1. run __npm install__ in *src* folder
1. run __composer install__ in *src/includes* folder
1. run __gulp build__
1. run __docker-compose up -d__
1. run __gulp__
1. launch Website

## Development
Wordpress theme / plugin development is done in *src* folder. \\
Run __npm install --save__ in *src* folder to add additional libraries. \\
Include them in *assets/js/main.js* or via webpack by editing __webpack.config.js__ \\

Wordpress theme development is done using the following tools:

1. [Twig](https://twig.symfony.com/) for templating (in *templates/views*)
1. [Timber](https://www.upstatement.com/timber/) providing wordpress context to twig templates (like  \`\`\` {{ post.title }} \`\`\` )
1. [Advanced Custom Fields](https://www.advancedcustomfields.com/) for adding fields to posts and pages
1. [Simple routing for Wordpress](https://github.com/Upstatement/routes)

## Help and Tutorials
* [WP Hierarchy](https://wphierarchy.com/)
* [Timber: Getting started and guides](https://timber.github.io/docs/getting-started/)
* [Tutorial: Wordpress development with Twig](https://code.tutsplus.com/series/kick-start-wordpress-development-with-twig--cms-974)
* [Wordpress MVC with ACF and Timber](https://www.xfive.co/blog/mvc-like-wordpress-development-acf-timber/)
* [GenerateWP - Generate custom post types](https://generatewp.com/)
* [Tutorial: Custom Post Types and ACF](https://www.sunlime.at/custom-post-types-cpt-und-advanced-custom-fields-acf/)
* [Youtube series: Building Wordpress Websites with ACF and Timber](https://www.youtube.com/watch?v=Cicak-QYow0)




## Syncing with staging / production server
1. launch docker container with __docker-compose up -d__
1. run __gulp build__ to compile local changes into wordpress folder
1. run __npm wordmove__ to connect to wordmove docker container
1. run __wordmove help__ or __wordmove help push__
1. to push theme to staging server run __wordmove push -t -e staging__ 
1. run __exit__ to exit container
`;