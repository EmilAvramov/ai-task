# syntax=docker/dockerfile:1

FROM node:22.2.0-alpine AS base
WORKDIR /usr/src/client
EXPOSE 3000
COPY package*.json ./

FROM base AS dev
RUN npm install
COPY . .
CMD npm run start

FROM base AS prod
RUN npm ci --omit=dev
USER node
COPY . .
CMD npm run build