FROM node:16 as dependencies
WORKDIR /app
COPY package.json .env ./
RUN yarn install

FROM node:16 as builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/.env ./.env
RUN yarn build

FROM node:16 as runner
WORKDIR /app
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env ./.env

EXPOSE 4000
CMD ["yarn", "start"]
