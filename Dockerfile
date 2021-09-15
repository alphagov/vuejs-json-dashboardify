FROM node:14.7
RUN apt-get update -qq
RUN apt-get install -y wget curl tar gzip firefox-esr
RUN npm install -g gulp http-server
WORKDIR /usr/src
COPY . /usr/src
RUN npm install --include=dev
RUN npm rebuild node-sass --sass-binary-name=linux-x64-83
RUN gulp
