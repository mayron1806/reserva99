FROM node:20-alpine as builder

USER node
WORKDIR /app/web

COPY package*.json ./
COPY *.lock ./
RUN npm ci

COPY --chown=node:node . .

RUN npm run build
# ---

FROM node:20-alpine

ENV NODE_ENV production

USER node
WORKDIR /app/web

COPY --from=builder --chown=node:node /app/web/package*.json ./
COPY --from=builder --chown=node:node /app/web/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /app/web/build/ ./build/
COPY --from=builder --chown=node:node /app/web/.env ./.env

CMD ["yarn", "start"]