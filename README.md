# Battleship API

## Description

An API for the game of Battleship. Users can create games, join games, delete games, make moves, and view game state. To start, make a user and create a game!

## Technology used:

- [Nest](https://github.com/nestjs/nest) framework TypeScript
- [PostgreSQL](https://www.postgresql.org/)
- [AWS](https://aws.amazon.com/)
  - [RDS](https://aws.amazon.com/rds/)
  - [ECS](https://aws.amazon.com/ecs/) and [Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html)
  - [ECR](https://aws.amazon.com/ecr/)

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

The GitHub Actions CI/CD pipeline will deploy the app to AWS ECS (Fargate) when a new commit is pushed to the `main` branch.
