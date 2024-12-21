FROM node:23-alpine3.20

WORKDIR /usr/src/app

RUN apk --no-cache add curl

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./


WORKDIR /usr/src/app/packages

COPY ./packages/ ./


WORKDIR /usr/src/app/apps/backend

COPY ./apps/backend/package.json ./apps/backend/pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY ./apps/backend ./

RUN pnpm build

COPY ./docker/backend/healthcheck.sh ./healthcheck.sh

RUN chmod +x ./healthcheck.sh

HEALTHCHECK --interval=30s --timeout=30s --retries=5 --start-period=3s CMD [ "sh", "./healthcheck.sh" ]

EXPOSE 3000

CMD ["pnpm", "start:prod"]
