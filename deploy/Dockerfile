# Backtick: build the static site with Vite, then serve dist/ with nginx.
# Build from the repo root: docker build -f deploy/Dockerfile .
FROM node:22-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Runs the tests too, so a level that doesn't solve itself never ships.
RUN npm test && npm run build

FROM nginx:1.28-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist /usr/share/nginx/html
EXPOSE 80
