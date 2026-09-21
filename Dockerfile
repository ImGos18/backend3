FROM node:22 AS dependencies

WORKDIR /App

COPY package*.json ./

RUN npm ci --omit=dev


FROM node:22 AS production

WORKDIR /App

COPY --from=dependencies /App/node_modules ./node_modules

COPY . .

EXPOSE 8080

CMD ["npm", "start"]