FROM node:15.5.1-buster

WORKDIR /app
COPY . /app

RUN apt-get update && apt-get install -y yarn
RUN yarn install