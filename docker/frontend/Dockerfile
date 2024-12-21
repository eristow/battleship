FROM node:23-alpine3.20

WORKDIR /usr/src/ui

COPY package.json pnpm-lock.yaml ./

RUN apk --no-cache add curl

RUN npm install -g pnpm && pnpm install

COPY ./ ./

RUN pnpm build

HEALTHCHECK --interval=30s --timeout=30s --retries=5 --start-period=3s CMD [ "curl", "-f", "http://localhost:3000" ] || exit 1

EXPOSE 3000

CMD ["pnpm", "package"]
