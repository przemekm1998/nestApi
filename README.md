# NestJS workshops

## Prerequisites

- Node v18.x
  - this project has _.nvmrc_, if you have _nvm_ installed on your computer you can type `nvm use`
- Yarn 1 (you can install it using [homebrew](https://formulae.brew.sh/formula/yarn) or [npm](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable))
- Docker & docker-compose (Docker for Mac already have docker-compose)

## Setup

- copy `.env.example` file to `.env`
- run `node --version` to check if node is installed correctly
- run `yarn --version` to check if node is installed correctly
- run `yarn` to install project dependencies
- run `docker-compose up` - this command should download Postgres docker image and run it
  - after a while you should see Postgres logs; when you see:
    ```
    nestjs-workshops-postgres-1  | 2022-05-25 21:18:46.429 UTC [1] LOG:  database system is ready to accept connections
    ```
    you can turn off Postgres using `ctrl+c`

If you have any problems with configuration, you can write on Slack channel or in private message.

## Workshops 1

Please checkout tag `start` and follow the recording [https://drive.google.com/file/d/1aKkcwJJxP4nfwn0AWVDoJV4A6h9smVob/view?usp=sharing](https://drive.google.com/file/d/1aKkcwJJxP4nfwn0AWVDoJV4A6h9smVob/view?usp=sharing)
