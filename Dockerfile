FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_WEBSITE_URL=https://fearnot221.github.io/evergreenbloom/
ENV VITE_WEBSITE_URL=$VITE_WEBSITE_URL
RUN npm run check && npm run build

FROM nginx:stable-alpine
COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1
