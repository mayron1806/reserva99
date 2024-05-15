# base node image
FROM node:20-alpine as builder

USER node
WORKDIR /app/client

COPY package*.json ./
COPY *.lock ./
RUN npm ci

COPY --chown=node:node . .

RUN npm run build


FROM node:20-alpine

ENV NODE_ENV production

USER node
WORKDIR /app/client

COPY --from=builder --chown=node:node /app/client/package*.json ./
COPY --from=builder --chown=node:node /app/client/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /app/client/build/ ./build/
COPY --from=builder --chown=node:node /app/client/.env ./.env

CMD ["npm", "start"]