
FROM node:22.2.0-alpine AS base
WORKDIR /usr/src/server
EXPOSE 8080
COPY package*.json ./

FROM base AS dev
RUN npm install
COPY . .
CMD npm run dev

FROM base AS prod
RUN npm ci --omit=dev
USER node
COPY . .
CMD npm run build