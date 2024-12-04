FROM node:23-alpine3.20

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN apk --no-cache add curl

RUN npm install -g pnpm && pnpm install

COPY ./ ./

RUN pnpm build

COPY ./docker/app/healthcheck.sh ./healthcheck.sh

RUN chmod +x ./healthcheck.sh

HEALTHCHECK --interval=30s --timeout=30s --retries=5 --start-period=3s CMD [ "sh", "./healthcheck.sh" ]

EXPOSE 3000

CMD ["pnpm", "start:prod"]
