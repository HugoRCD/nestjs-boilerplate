#!/bin/bash
FROM --platform=linux/amd64 node:18
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn run build
EXPOSE 3000
LABEL name=nest-api
CMD [ "node", "dist/src/main" ]