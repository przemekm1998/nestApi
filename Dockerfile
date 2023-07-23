FROM node:18 as builder

RUN apt-get update && \
  npm i -g npm@^8 && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn run build

EXPOSE 3000
CMD [ "yarn", "run", "start:dev" ]