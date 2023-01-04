FROM node:18-alpine3.15
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn run build
EXPOSE 3000
LABEL name=nest-api
CMD [ "node", "dist/src/main" ]