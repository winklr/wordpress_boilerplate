FROM welaika/wordmove

USER root

RUN apt-get update && apt-get install -y lftp

USER wordmove

COPY provision/wordmove/lftprc /home/wordmove/.lftprc
WORKDIR /var/www/html
CMD ["/bin/bash"]
