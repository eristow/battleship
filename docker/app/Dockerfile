FROM node:23-alpine3.20

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY ./ ./

RUN pnpm build

EXPOSE 3000

HEALTHCHECK --interval=60s --timeout=30s --retries=5 --start-period=5s CMD [ "curl -f http://localhost:3000/health" ]

CMD ["pnpm", "start:prod"]
