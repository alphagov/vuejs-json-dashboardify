FROM node
RUN apt-get update -qq
RUN apt-get install -y wget curl tar gzip firefox-esr
RUN npm install -g gulp http-server
WORKDIR /usr/src
