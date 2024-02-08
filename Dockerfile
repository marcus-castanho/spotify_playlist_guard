FROM node:18 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18 AS development
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/public ./public
CMD [ "npm", "run", "dev" ]


FROM node:18 AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/public ./public
RUN npm ci --only=production
EXPOSE 8080
CMD [ "npm", "run", "start" ]