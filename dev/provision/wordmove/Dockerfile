FROM welaika/wordmove:php7

ENV WORDMOVE_WORKDIR /var/www/html

RUN apt-get update && apt-get install -y lftp

COPY provision/wordmove/lftprc /root/.lftprc

WORKDIR ${WORDMOVE_WORKDIR}

ENTRYPOINT ["wordmove"]

