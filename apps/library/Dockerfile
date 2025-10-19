ARG NODE_VERSION=20.18-slim

FROM node:${NODE_VERSION} AS development

WORKDIR /app

COPY package.json .
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY nest-cli.json .

RUN npm install

ARG PORT=8001
EXPOSE ${PORT}

CMD ["npm", "run", "start:dev", "library"]

FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY package.json .
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY nest-cli.json .

RUN npm install

COPY apps/library ./apps/library
COPY libs/common-core ./libs/common-core

RUN npm run build library

FROM node:${NODE_VERSION} AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ARG PORT=8001
EXPOSE ${PORT}

CMD ["node", "dist/apps/library/main"]