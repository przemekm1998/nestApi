FROM node:18 as builder

RUN apt-get update && \
  npm i -g npm@^8 pnpm@^7.25.0 && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json pnpm*.yaml ./
RUN yarn

COPY . .
RUN yarn run build

EXPOSE 3000
CMD [ "yarn", "run", "start:dev" ]