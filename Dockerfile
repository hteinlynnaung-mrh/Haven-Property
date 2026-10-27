# Build the Vite frontend first.
FROM node:22-bookworm-slim AS client-build
WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Install only production API dependencies in a separate layer.
FROM node:22-bookworm-slim AS server-deps
WORKDIR /app/server

# better-sqlite3 may compile from source when a matching prebuilt binary is
# unavailable for the host architecture.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY server/package*.json ./
RUN npm ci --omit=dev

# Runtime image: Express serves both the API and the built SPA.
FROM node:22-bookworm-slim
WORKDIR /app

ENV NODE_ENV=production \
    PORT=4001 \
    CLIENT_ORIGIN=http://localhost:4001 \
    DATABASE_PATH=/data/property.db \
    COOKIE_SECURE=false

COPY --from=server-deps /app/server/node_modules ./server/node_modules
COPY server/package*.json ./server/
COPY server/src ./server/src
COPY --from=client-build /app/client/dist ./client/dist
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh && mkdir -p /data

VOLUME ["/data"]
EXPOSE 4001

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server/src/index.js"]
