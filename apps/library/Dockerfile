ARG NODE_VERSION=20.18-slim

FROM node:${NODE_VERSION} AS development

WORKDIR /app

RUN apt-get update && apt-get install -y sqlite3 && apt-get clean

COPY package.json .
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY nest-cli.json .

RUN npm install
RUN npm install -g nodemon
RUN npm install -g @nestjs/cli

# Crear directorios para SQLite
RUN mkdir -p /app/data /app/backups && \
    chmod 777 /app/data /app/backups

ARG PORT=8001
EXPOSE ${PORT}

CMD ["nodemon", "--delay", "2", "--watch", "apps/library", "--watch", "libs/common-core", "--watch", "libs/logging_provider", "--ext", "ts,js,json", "--exec", "nest", "start", "library"]
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY package.json .
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY nest-cli.json .

RUN npm install

COPY apps/library ./apps/library
COPY libs/common-core ./libs/common-core
COPY libs/logging_provider ./libs/logging_provider

RUN npm run build library

FROM node:${NODE_VERSION} AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Crear directorios para SQLite en producción
RUN mkdir -p /app/data /app/backups && \
    chmod 777 /app/data /app/backups

ARG PORT=8001
EXPOSE ${PORT}

CMD ["node", "dist/apps/library/main"]