FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_WEBSITE_URL=https://fearnot221.github.io/evergreenbloom/
ENV VITE_WEBSITE_URL=$VITE_WEBSITE_URL
RUN npm run check && npm run build

FROM node:24-alpine
WORKDIR /app
RUN mkdir /data && chown node:node /data
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node server ./server
COPY --chown=node:node src/data/stamps.ts ./src/data/stamps.ts
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
CMD ["node", "server/index.mjs"]
