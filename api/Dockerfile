FROM node:20-alpine as builder

USER node
WORKDIR /app/server

COPY package*.json ./
COPY prisma ./prisma/
COPY *.lock ./
RUN npm ci

COPY --chown=node:node . .

RUN npx prisma generate

RUN npm run build

# ---

FROM node:20-alpine

ENV NODE_ENV production

USER node
WORKDIR /app/server

COPY --from=builder --chown=node:node /app/server/package*.json ./
COPY --from=builder --chown=node:node /app/server/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /app/server/dist/ ./dist/
COPY --from=builder --chown=node:node /app/server/.env ./.env
COPY --from=builder --chown=node:node /app/server/prisma/ ./prisma/

CMD ["npm", "run", "start:migrate:prod"]