FROM node:20-alpine as builder

USER node
WORKDIR /app/server

COPY package*.json ./
COPY *.lock ./
RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

RUN npx prisma generate \
    && npx prisma migrate deploy \
    && yarn build
# ---

FROM node:20-alpine

ENV NODE_ENV production

USER node
WORKDIR /app/server

COPY --from=builder --chown=node:node /app/server/package*.json ./
COPY --from=builder --chown=node:node /app/server/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /app/server/dist/ ./dist/
COPY --from=builder --chown=node:node /app/server/.env ./.env

CMD ["node", "dist/src/main.js"]