FROM node:23-alpine3.20 AS build

WORKDIR /usr/src/app

RUN apk --no-cache add curl

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./


WORKDIR /usr/src/app/packages

COPY ./packages/ ./


WORKDIR /usr/src/app/apps/frontend

COPY ./apps/frontend/package.json ./apps/frontend/pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY ./apps/frontend/ ./

RUN pnpm build

EXPOSE 8080

# CMD ["pnpm", "preview"]
CMD ["pnpm", "dev"]


# TODO: Create a spearate prod Dockerfile?
# Use nginx or busybox to build and serve dist/ files
# TODO: add a healthcheck

# FROM busybox:1.35

# RUN adduser -D static

# USER static

# WORKDIR /home/static

# # TODO: figure out why the dist files are empty...
# COPY --from=build /usr/src/app/apps/frontend/dist .

# CMD ["busybox", "httpd", "-f", "-v", "-p", "8080"]