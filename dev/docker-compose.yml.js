module.exports = (settings) => `
version: '3'

services:
  web:
    image: nginx:latest
    container_name: ${settings.slug}_web
    restart: on-failure:5
    volumes:
      - ./www:/var/www/html
      - ./provision/web/wordpress-fpm.conf:/etc/nginx/conf.d/default.conf
      - ./provision/web/global:/etc/nginx/global
    ports:
      - "80"
    depends_on:
      - wp
  db:
    image: mysql:5.7
    container_name: ${settings.slug}_db
    volumes:
      - database:/var/lib/mysql
    restart: on-failure:5
    environment:
      MYSQL_ROOT_PASSWORD: wordpress
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
    ports:
      - "3306"
    networks:
      default:
        aliases:
          - mysql
  wp:
    build:
      context: .
      dockerfile: provision/wp/Dockerfile
      args:
        UID: ${settings.user.uid}
        GID: ${settings.user.gid}
    container_name: ${settings.slug}_wp
    restart: on-failure:5
    volumes:
      - ./www:/var/www/html
      - ./src:/var/www/src
      - ./provision/wp/zz-php.ini:/usr/local/etc/php/conf.d/zz-php.ini
      - './dbDump:/dbDump'
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_PREFIX: ${settings.db.prefix}
      WORDPRESS_DEBUG: "true"
    depends_on:
      - db
  phpmyadmin:
    depends_on:
      - db
    image: phpmyadmin/phpmyadmin
    container_name: ${settings.slug}_pma
    ports:
      - 8081:80
    restart: on-failure:5
    environment:
      PMA_HOST: db
  composer:
    image: composer
    container_name: ${settings.slug}_composer
    user: '${settings.user.uid}:${settings.user.gid}'
    command: install --ignore-platform-reqs
    volumes:
    - ./src/includes:/app/
  wordmove:
    build: 
      context: .
      dockerfile: provision/wordmove/Dockerfile
    container_name: ${settings.slug}_wordmove
    tty: true
    depends_on:
      - wp
      - db
    restart: on-failure:5
    volumes:
      - ./www:/var/www/html
      - ./src:/var/www/src
      - ~/.ssh:/root/.ssh
volumes:
  database:
`;
