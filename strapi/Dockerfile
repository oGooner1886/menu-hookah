FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "start"]
