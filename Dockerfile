# syntax=docker/dockerfile:1

FROM node:24.16.0-alpine3.23 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.29.8-alpine3.23-slim AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/fcs-solidarity-web/browser /usr/share/nginx/html

EXPOSE 80
