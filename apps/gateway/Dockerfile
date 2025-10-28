ARG NODE_VERSION=20.18-slim

FROM node:${NODE_VERSION} AS development

WORKDIR /app

COPY package.json .
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY nest-cli.json .

RUN npm install
RUN npm install -g nodemon
RUN npm install -g @nestjs/cli

ARG PORT=8000
EXPOSE ${PORT}

CMD ["nodemon", "--delay", "2", "--watch", "apps/gateway", "--watch", "libs/common-core", "--ext", "ts,js,json", "--exec", "nest", "start", "gateway"]

FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY package.json .
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY nest-cli.json .

RUN npm install

COPY apps/gateway ./apps/gateway
COPY libs/common-core ./libs/common-core

RUN npm run build gateway

FROM node:${NODE_VERSION} AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ARG PORT=8000
EXPOSE ${PORT}

CMD ["node", "dist/apps/gateway/main"]