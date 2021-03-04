FROM ubuntu:20.10

RUN apt-get update
RUN apt-get install -y build-essential libpcre3 libpcre3-dev libssl-dev zlib1g-dev

COPY nginx-1.18.0 /nginx-1.18.0
COPY nginx-rtmp-module-1.2.1 /nginx-rtmp-module-1.2.1

WORKDIR /nginx-1.18.0
 
RUN ./configure --add-module=/nginx-rtmp-module-1.2.1 --with-http_ssl_module --with-cc-opt="-Wimplicit-fallthrough=0"
RUN make
RUN make install

COPY nginx.conf /usr/local/nginx/conf/nginx.conf

ENTRYPOINT [ "/usr/local/nginx/sbin/nginx", "-g", "daemon off;" ]