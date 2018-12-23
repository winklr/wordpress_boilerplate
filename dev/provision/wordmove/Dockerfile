FROM welaika/wordmove

USER root

RUN apt-get update && apt-get install -y lftp

COPY provision/wordmove/docker-entrypoint.sh /

RUN chmod +x /docker-entrypoint.sh

USER wordmove

COPY provision/wordmove/lftprc /home/wordmove/.lftprc
WORKDIR /var/www/html
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD [""]
